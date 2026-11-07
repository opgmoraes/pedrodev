import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = [
  "api/prospect-search.ts",
  "server/prospectSearchApi.ts",
  "server/prospectSearch.ts",
  "server/openstreetmap.ts",
  "server/searchError.ts",
  "src/lib/prospectSearch.ts",
  "src/lib/prospects.ts",
];

test("emitted Node ESM API artifact returns the handler's JSON 401 without a token", async () => {
  const out = await mkdtemp(path.join(os.tmpdir(), "pedrodev-prospect-api-"));
  let server;
  try {
    for (const sourcePath of modules) {
      const source = await readFile(path.join(root, sourcePath), "utf8");
      const emitted = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
        fileName: sourcePath,
        reportDiagnostics: true,
      });
      const errors = (emitted.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
      assert.deepEqual(errors, [], `TypeScript emission failed for ${sourcePath}`);
      const outputPath = path.join(out, sourcePath.replace(/\.ts$/, ".js"));
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, emitted.outputText);
    }
    await writeFile(path.join(out, "package.json"), JSON.stringify({ type: "module" }));

    const entry = await import(pathToFileURL(path.join(out, "api/prospect-search.js")).href);
    server = createServer((request, response) => entry.default(request, response, () => {
      response.statusCode = 404;
      response.end();
    }));
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/prospect-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    assert.equal(response.status, 401);
    assert.match(response.headers.get("content-type") || "", /application\/json/i);
    const payload = await response.json();
    assert.match(payload.error, /administrador/i);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(out, { recursive: true, force: true });
  }
});
