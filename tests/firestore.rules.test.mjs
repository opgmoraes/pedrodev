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
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-pedrodev-rules",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
  // Namespace exclusivo da suíte: permite repetir testes sem apagar leads do teste manual.
  await env.clearFirestore();
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
test("prospects privados: somente administrador pode cadastrar, listar, ler, editar e excluir", async () => {
  const adminDb = env.authenticatedContext("owner").firestore();
  const ref = doc(adminDb, "prospects", "lead-privado");
  await assertSucceeds(setDoc(ref, { company: "Lead fictício", briefing: "Pesquisa privada" }));
  await assertSucceeds(getDoc(ref));
  await assertSucceeds(getDocs(collection(adminDb, "prospects")));
  for (const db of [env.unauthenticatedContext().firestore(), env.authenticatedContext("visitor").firestore()]) {
    const privateRef = doc(db, "prospects", "lead-privado");
    await assertFails(getDoc(privateRef));
    await assertFails(getDocs(collection(db, "prospects")));
    await assertFails(setDoc(doc(db, "prospects", "invasor"), { company: "Invasor" }));
    await assertFails(updateDoc(privateRef, { company: "Alterada" }));
    await assertFails(deleteDoc(privateRef));
  }
  await assertSucceeds(updateDoc(ref, { demoUrl: "https://example.com/demo" }));
  await assertSucceeds(deleteDoc(ref));
});
test("fluxo manual de prospecção salva demo e confirma contato sem criar clientes ou documentos públicos", async () => {
  const { build } = await import('esbuild');
  const { mkdir } = await import('node:fs/promises');
  const { pathToFileURL } = await import('node:url');
  const assert = await import('node:assert/strict');
  await mkdir('node_modules/.cache/pedrodev', { recursive: true });
  const source = (await readFile('src/lib/prospectStore.ts', 'utf8')).replace('import { db } from "./firebaseClient";', 'const db = globalThis.__prospectTestDb;');
  await build({ stdin: { contents: source, loader: 'ts', resolveDir: `${process.cwd()}/src/lib` }, bundle: true, platform: 'node', packages: 'external', format: 'esm', outfile: 'node_modules/.cache/pedrodev/prospect-test.mjs' });
  const db = env.authenticatedContext('owner').firestore();
  globalThis.__prospectTestDb = db;
  try {
    const store = await import(pathToFileURL(`${process.cwd()}/node_modules/.cache/pedrodev/prospect-test.mjs`));
    const model = await import('typescript');
    const js = model.default.transpileModule(await readFile('src/lib/prospects.ts', 'utf8'), { compilerOptions: { module: model.default.ModuleKind.ESNext } }).outputText;
    const { EMPTY_PROSPECT, prospectToForm, buildProspectBriefing } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
    const collections = ['clients', 'quotes', 'contracts', 'publicClients', 'publicQuotes', 'publicContracts'];
    const before = await Promise.all(collections.map(async name => (await getDocs(collection(db, name))).size));
    const id = await store.saveProspect({ ...EMPTY_PROSPECT, company: 'Lead do fluxo', phone: '62999991234', sources: 'https://example.com', diagnosis: 'Só redes sociais', briefing: 'Demo com serviços' });
    let lead = (await store.listProspects()).find(item => item.id === id);
    assert.equal(lead.origin, 'manual');
    assert.ok(buildProspectBriefing(lead).includes('Demo com serviços'));
    await store.saveProspect({ ...prospectToForm(lead), demoUrl: 'https://example.com/demo', message: 'Olá, segue a demo: https://example.com/demo', status: 'Demo pronta', nextFollowUp: '2026-11-15' }, lead);
    await store.markProspectContacted(id, false);
    lead = (await store.listProspects()).find(item => item.id === id);
    assert.equal(lead.status, 'Demo pronta');
    assert.equal(lead.contactedAt, null);
    assert.equal(lead.nextFollowUp, '2026-11-15');
    await store.markProspectContacted(id, true);
    lead = (await store.listProspects()).find(item => item.id === id);
    assert.equal(lead.status, 'Contatado');
    assert.ok(lead.contactedAt.toMillis() > 0);
    await store.saveProspect({ ...prospectToForm(lead), diagnosis: 'Atualizado depois do contato' }, lead);
    assert.equal((await getDoc(doc(db, 'prospects', id))).data().status, 'Contatado');
    assert.deepEqual(await Promise.all(collections.map(async name => (await getDocs(collection(db, name))).size)), before);
  } finally { delete globalThis.__prospectTestDb; }
});
test("visitante não acessa clientes privados nem lista links", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, "clients", "private")));
  await assertFails(getDocs(collection(db, "publicClients")));
  await assertFails(getDocs(collection(db, "publicQuotes")));
  await assertFails(getDocs(collection(db, "publicContracts")));
  await assertSucceeds(getDoc(doc(db, "publicClients", "client-token")));
});
test("busca e importação repetida preservam existentes e não duplicam prospects", async () => {
  const { build } = await import('esbuild');
  const { mkdir } = await import('node:fs/promises');
  const { pathToFileURL } = await import('node:url');
  const assert = await import('node:assert/strict');
  await mkdir('node_modules/.cache/pedrodev', { recursive: true });
  const source = (await readFile('src/lib/prospectStore.ts', 'utf8')).replace('import { db } from "./firebaseClient";', 'const db = globalThis.__prospectImportTestDb;');
  await build({ stdin: { contents: source, loader: 'ts', resolveDir: `${process.cwd()}/src/lib` }, bundle: true, platform: 'node', packages: 'external', format: 'esm', outfile: 'node_modules/.cache/pedrodev/prospect-import-test.mjs' });
  await build({ entryPoints: ['server/prospectSearch.ts'], bundle: true, platform: 'node', packages: 'external', format: 'esm', outfile: 'node_modules/.cache/pedrodev/search-fixture-test.mjs' });
  const db = env.authenticatedContext('owner').firestore();
  globalThis.__prospectImportTestDb = db;
  try {
    const store = await import(pathToFileURL(`${process.cwd()}/node_modules/.cache/pedrodev/prospect-import-test.mjs`));
    const provider = await import(pathToFileURL(`${process.cwd()}/node_modules/.cache/pedrodev/search-fixture-test.mjs`));
    assert.equal(typeof store.importSearchProspects, 'function');
    const { results, isTestData } = await provider.searchProspects({ niche: 'Clínicas', city: 'Cidade Teste', limit: 3 }, { PROSPECT_SEARCH_PROVIDER: 'fixture' });
    assert.equal(isTestData, true);
    const legacy = doc(db, 'prospects', 'lead-manual-preservado');
    const legacyData = { company: results[0].company, phone: '62999990001', sources: [], briefing: 'Briefing já revisado', message: 'Minha abordagem', demoUrl: 'https://example.com/demo-pronta', status: 'Contatado' };
    await setDoc(legacy, legacyData);
    const before = (await getDocs(collection(db, 'prospects'))).size;
    const first = await store.importSearchProspects(results);
    assert.deepEqual(first, { imported: 2, skipped: 1 });
    assert.equal((await getDocs(collection(db, 'prospects'))).size, before + 2);
    const again = await store.importSearchProspects(results);
    assert.deepEqual(again, { imported: 0, skipped: 3 });
    assert.equal((await getDocs(collection(db, 'prospects'))).size, before + 2);
    const preserved = (await getDoc(legacy)).data();
    for (const field of ['briefing', 'message', 'demoUrl', 'status']) assert.equal(preserved[field], legacyData[field]);
    const imported = (await store.listProspects()).filter(item => item.origin === 'search:fixture');
    assert.equal(imported.length, 2);
    assert.ok(imported.some(item => item.siteSituation === 'Site não localizado'));
    assert.ok(imported.some(item => item.siteSituation === 'Não verificado'));
    const concurrentCandidate = { ...results[2], externalId: 'concorrente', company: 'Empresa Concorrente TESTE', phone: '', sources: ['https://example.com/concorrente'], siteSituation: 'Site existente' };
    const concurrent = await Promise.all([store.importSearchProspects([concurrentCandidate]), store.importSearchProspects([concurrentCandidate])]);
    assert.equal(concurrent.reduce((sum, item) => sum + item.imported, 0), 1);
    const reviewed = (await store.listProspects()).find(item => item.company === 'Empresa Concorrente TESTE');
    assert.equal(reviewed.siteSituation, 'Site existente');
    assert.match(reviewed.diagnosis, /Situação na revisão: Site existente/);
    assert.equal(reviewed.searchEvidenceNote, results[2].evidenceNote);
    const osmFixture = JSON.parse(await readFile('tests/fixtures/openstreetmap-barbers.json', 'utf8'));
    const osmResponse = await provider.searchProspects({ niche: 'barbearias', city: 'Luziânia, GO', limit: 5 }, { PROSPECT_SEARCH_PROVIDER: 'openstreetmap' }, async () => Response.json(osmFixture));
    const osmLegacy = doc(db, 'prospects', 'osm-existing');
    await setDoc(osmLegacy, { company: osmResponse.results[0].company, phone: '61999990001', sources: [], briefing: 'Não sobrescrever briefing OSM', demoUrl: 'https://example.com/existente', status: 'Contatado', createdAt: serverTimestamp() });
    const osmBefore = (await getDocs(collection(db, 'prospects'))).size;
    assert.deepEqual(await store.importSearchProspects(osmResponse.results), { imported: 1, skipped: 1 });
    assert.deepEqual(await store.importSearchProspects(osmResponse.results), { imported: 0, skipped: 2 });
    assert.equal((await getDocs(collection(db, 'prospects'))).size, osmBefore + 1);
    const osmImported = (await store.listProspects()).find(item => item.provider === 'openstreetmap');
    assert.equal(osmImported.siteSituation, 'Não verificado');
    assert.equal(osmImported.sourceAttribution.text, '© OpenStreetMap contributors');
    assert.ok(osmImported.sources.includes('https://www.openstreetmap.org/way/9990003'));
    assert.equal((await getDoc(osmLegacy)).data().briefing, 'Não sobrescrever briefing OSM');
    for (const context of [env.unauthenticatedContext(), env.authenticatedContext('visitor')]) {
      const publicDb = context.firestore();
      await assertFails(getDocs(collection(publicDb, 'prospectImportKeys')));
      await assertFails(setDoc(doc(publicDb, 'prospectImportKeys', 'invalid'), { prospectId: 'x' }));
    }
  } finally { delete globalThis.__prospectImportTestDb; }
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
