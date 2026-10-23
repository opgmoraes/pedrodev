import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-pedrodev",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
  await env.withSecurityRulesDisabled(async (c) => {
    const db = c.firestore();
    await Promise.all([
      setDoc(doc(db, "admins", "owner"), { name: "Administrador de teste" }),
      setDoc(doc(db, "clients", "private"), {
        name: "Cliente de teste",
        document: "privado",
      }),
      setDoc(doc(db, "publicClients", "client-token"), {
        name: "Cliente",
        projects: [],
      }),
      setDoc(doc(db, "publicQuotes", "quote-token"), {
        service: "Site",
        value: 797,
        status: "pendente",
      }),
      setDoc(doc(db, "publicContracts", "contract-token"), {
        service: "Site",
        value: 797,
        status: "pendente",
      }),
    ]);
  });
});
after(async () => {
  await env?.cleanup();
});
test("visitante não acessa clientes privados nem lista links", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, "clients", "private")));
  await assertFails(getDocs(collection(db, "publicClients")));
  await assertFails(getDocs(collection(db, "publicQuotes")));
  await assertFails(getDocs(collection(db, "publicContracts")));
  await assertSucceeds(getDoc(doc(db, "publicClients", "client-token")));
});
test("conta autenticada comum não é administrador", async () => {
  const db = env.authenticatedContext("visitor").firestore();
  await assertFails(getDoc(doc(db, "clients", "private")));
  await assertFails(setDoc(doc(db, "admins", "visitor"), { role: "admin" }));
  await assertFails(setDoc(doc(db, "payments", "fake"), { value: 100 }));
});
test("administrador cadastrado acessa cadastros e financeiro", async () => {
  const db = env.authenticatedContext("owner").firestore();
  await assertSucceeds(getDoc(doc(db, "clients", "private")));
  await assertSucceeds(setDoc(doc(db, "payments", "valid"), { value: 100 }));
});
test("decisão pública não altera valor e só ocorre uma vez", async () => {
  const db = env.unauthenticatedContext().firestore();
  const ref = doc(db, "publicQuotes", "quote-token");
  await assertFails(
    updateDoc(ref, {
      value: 1,
      status: "aprovado",
      statusUpdatedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    updateDoc(ref, { status: "aprovado", statusUpdatedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, { status: "recusado", statusUpdatedAt: serverTimestamp() }),
  );
});
test("aceite de contrato preserva o documento e não permite reverter", async () => {
  const db = env.unauthenticatedContext().firestore();
  const ref = doc(db, "publicContracts", "contract-token");
  await assertFails(
    updateDoc(ref, {
      service: "Outro",
      status: "aceito",
      acceptedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    updateDoc(ref, { status: "aceito", acceptedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, { status: "pendente", acceptedAt: serverTimestamp() }),
  );
});
test("briefing válido é aceito sem revelar respostas e rejeita links inexistentes", async () => {
  const db = env.unauthenticatedContext().firestore();
  const data = {
    clientSlug: "client-token",
    answers: {
      negocio: "Empresa",
      publico: "Público",
      objetivo: "Site",
      cores: "",
      referencias: "",
    },
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(
    setDoc(doc(db, "formSubmissions", "briefing-valid"), data),
  );
  await assertFails(getDoc(doc(db, "formSubmissions", "briefing-valid")));
  await assertFails(
    setDoc(doc(db, "formSubmissions", "briefing-invalid"), {
      ...data,
      clientSlug: "missing",
    }),
  );
  await assertFails(
    setDoc(doc(db, "formSubmissions", "briefing-extra"), {
      ...data,
      injected: true,
    }),
  );
});

test("fluxo de cliente, proposta, contrato e central de documentos preserva os dados privados", async () => {
  const { build } = await import('esbuild');
  const { mkdir } = await import('node:fs/promises');
  const { pathToFileURL } = await import('node:url');
  const assert = await import('node:assert/strict');
  await mkdir('node_modules/.cache/pedrodev', { recursive: true });
  const source = (await readFile('src/lib/sharing.ts', 'utf8')).replace('import { db } from "./firebaseClient";', 'const db = globalThis.__sharingTestDb;');
  await build({ stdin: { contents: source, loader: 'ts', resolveDir: process.cwd() }, bundle: true, platform: 'node', packages: 'external', format: 'esm', outfile: 'node_modules/.cache/pedrodev/sharing-test.mjs' });
  const adminDb = env.authenticatedContext('owner').firestore();
  globalThis.__sharingTestDb = adminDb;
  const sharing = await import(pathToFileURL(`${process.cwd()}/node_modules/.cache/pedrodev/sharing-test.mjs`));
  const publicDb = env.unauthenticatedContext().firestore();
  const client = await sharing.createClient({ name: 'Cliente do fluxo', company: 'Studio', slug: 'studio-token-unico', phone: 'privado', document: 'privado', email: 'privado' });
  await sharing.createShared('quotes', { clientId: client.id, clientName: 'Cliente do fluxo', service: 'Site', items: ['Design'], value: 1497, deadlineDays: 15, paymentTerms: '50% no início', notes: 'Duas revisões', slug: 'proposta-token-unico', status: 'pendente' });
  const publicQuote = doc(publicDb, 'publicQuotes', 'proposta-token-unico');
  assert.equal((await getDoc(publicQuote)).data().paymentTerms, '50% no início');
  await assertFails(updateDoc(publicQuote, { paymentTerms: 'Gratuito' }));
  await updateDoc(publicQuote, { status: 'aprovado', statusUpdatedAt: serverTimestamp() });
  assert.equal(await sharing.publicStatus('quotes', { slug: 'proposta-token-unico' }), 'aprovado');
  await sharing.createShared('contracts', { clientId: client.id, clientName: 'Cliente do fluxo', service: 'Site', value: 1497, deadlineDays: 15, slug: 'contrato-token-unico', paymentTerms: '50% no início', status: 'pendente' });
  const contract = doc(publicDb, 'publicContracts', 'contrato-token-unico');
  await updateDoc(contract, { status: 'aceito', acceptedAt: serverTimestamp() });
  assert.equal(await sharing.publicStatus('contracts', { slug: 'contrato-token-unico' }), 'aceito');
  let hub = (await getDoc(doc(publicDb, 'publicClients', 'studio-token-unico'))).data();
  assert.equal(hub.documents.length, 2);
  assert.equal(hub.documents[0].slug, 'proposta-token-unico');
  assert.ok(!JSON.stringify(hub).includes('privado'));
  await assertFails(updateDoc(doc(publicDb, 'publicClients', 'studio-token-unico'), { name: 'Invasor' }));
  await sharing.publishAllLinks();
  hub = (await getDoc(doc(publicDb, 'publicClients', 'studio-token-unico'))).data();
  assert.equal(hub.documents.length, 2);
  assert.equal((await getDoc(publicQuote)).data().status, 'aprovado');
  assert.equal((await getDoc(contract)).data().status, 'aceito');
  delete globalThis.__sharingTestDb;
});
