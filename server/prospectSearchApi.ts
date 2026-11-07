import type { IncomingMessage, ServerResponse } from "node:http";
import { SearchError, searchProspects, type SearchEnvironment } from "./prospectSearch";
import { validateSearchQuery } from "../src/lib/prospectSearch";

async function authorize(request: IncomingMessage, env: SearchEnvironment) {
  const token = request.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) throw new SearchError(401, "Entre como administrador para buscar leads.");
  const emulators = env.VITE_USE_FIREBASE_EMULATORS === "true";
  const project = emulators ? "demo-pedrodev" : env.VITE_FIREBASE_PROJECT_ID;
  const key = emulators ? "demo-pedrodev-key" : env.VITE_FIREBASE_API_KEY;
  if (!project || !key) throw new SearchError(503, "Configure o Firebase do servidor local.");
  const authUrl = emulators ? "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:lookup" : "https://identitytoolkit.googleapis.com/v1/accounts:lookup";
  const identity = await fetch(`${authUrl}?key=${encodeURIComponent(key)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(5000),
  });
  if (!identity.ok) throw new SearchError(401, "Sessão inválida ou expirada. Entre novamente.");
  const data = await identity.json() as { users?: { localId?: string }[] };
  const uid = data.users?.[0]?.localId;
  if (!uid) throw new SearchError(401, "Sessão inválida.");
  const firestore = emulators ? "http://127.0.0.1:8080" : "https://firestore.googleapis.com";
  const admin = await fetch(`${firestore}/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`, {
    headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000),
  });
  if (!admin.ok) throw new SearchError(403, "A busca exige acesso de administrador.");
}

export function createProspectSearchMiddleware(env: SearchEnvironment) {
  return async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (request.url?.split("?")[0] !== "/api/prospect-search") { next(); return; }
    const send = (status: number, data: unknown) => {
      response.statusCode = status;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.setHeader("Cache-Control", "no-store");
      response.end(JSON.stringify(data));
    };
    if (request.method !== "POST") { response.setHeader("Allow", "POST"); send(405, { error: "Use POST para buscar leads." }); return; }
    const started = performance.now();
    let authorizationMs = 0;
    try {
      if (request.headers.origin && new URL(request.headers.origin).host !== request.headers.host) throw new SearchError(403, "Origem não autorizada.");
      if (!request.headers["content-type"]?.startsWith("application/json")) throw new SearchError(415, "Envie JSON.");
      await authorize(request, env);
      authorizationMs = Math.round(performance.now() - started);
      if (request.headers["x-prospect-fixture-only"] === "true" && env.PROSPECT_SEARCH_PROVIDER !== "fixture") throw new SearchError(409, "Este teste exige a fonte fixture. Nenhuma consulta real foi executada.");
      let body = "";
      for await (const chunk of request) {
        body += chunk.toString();
        if (Buffer.byteLength(body) > 8192) throw new SearchError(413, "Consulta muito grande.");
      }
      let query;
      try { query = validateSearchQuery(JSON.parse(body)); }
      catch (error) { throw new SearchError(400, error instanceof SyntaxError ? "JSON inválido." : (error as Error).message); }
      const result = await searchProspects(query, env);
      send(200, result.diagnostics ? { ...result, diagnostics: { ...result.diagnostics, authorizationMs, requestMs: Math.round(performance.now() - started) } } : result);
    } catch (error) {
      send(error instanceof SearchError ? error.status : 502, {
        error: error instanceof SearchError ? error.message : "Falha ao consultar os serviços locais. Confira os emuladores ou a conexão e tente novamente.",
        ...(error instanceof SearchError && error.details ? { diagnostics: { ...error.details, authorizationMs, requestMs: Math.round(performance.now() - started) } } : {}),
      });
    }
  };
}
