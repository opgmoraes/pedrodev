// Diagnóstico explícito, sem gravações no Firestore. Executar etapas individualmente.
import fs from 'node:fs';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
await build({ entryPoints: ['server/openstreetmap.ts'], bundle: true, platform: 'node', packages: 'external', format: 'esm', outfile: 'node_modules/.cache/pedrodev/osm-diagnostic.mjs' });
const { buildOverpassQuery } = await import(pathToFileURL(`${process.cwd()}/node_modules/.cache/pedrodev/osm-diagnostic.mjs`));
const mode = process.argv[2] || 'local-separate';
const label = process.argv[3] || mode;
if (!/^[a-z-]+$/.test(label)) throw new Error('Nome de relatório inválido.');
const report = { mode, startedAt: new Date().toISOString() };
const started = performance.now();
try {
  let response;
  if (mode.startsWith('local-')) {
    const auth = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-pedrodev-key', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@pedrodev.test', password: 'Pedrodev-local-123!', returnSecureToken: true }) });
    const identity = await auth.json();
    if (!auth.ok) throw new Error('Auth Emulator indisponível.');
    report.authMs = Math.round(performance.now() - started);
    const query = mode === 'local-separate' ? { niche: 'barbearias', city: 'Luziânia', uf: 'GO', limit: 5 } : { niche: 'barbearias', city: 'Luziânia, GO', limit: 5 };
    report.query = query;
    response = await fetch('http://127.0.0.1:5175/api/prospect-search', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + identity.idToken }, body: JSON.stringify(query), signal: AbortSignal.timeout(80000) });
  } else {
    let query = buildOverpassQuery({ niche: 'barbearias', city: 'Luziânia', uf: 'GO', limit: 5 });
    if (mode === 'municipality') query = query.split('.municipality map_to_area')[0];
    if (mode === 'municipality-narrow') {
      query = '[out:json][timeout:10][maxsize:16777216];\nrel["boundary"="administrative"]["admin_level"="8"]["name"~"^Luziânia$",i]->.named;\narea["ISO3166-2"="BR-GO"]["admin_level"="4"]->.state;\nrel.named(area.state);out tags;';
    }
    if (mode === 'leads') {
      const report = JSON.parse(fs.readFileSync('docs/prospeccao/diagnostico-timeout/municipality.json', 'utf8'));
      const id = report.data.elements.find(item => item.tags?.admin_level === '8').id;
      query = '[out:json][timeout:15][maxsize:16777216];\narea(' + (3600000000 + id) + ')->.city;\n' + query.split('.municipality map_to_area->.city;')[1];
    }
    if (mode === 'health') query = '[out:json][timeout:5];node(1);out ids;';
    report.overpassQuery = query;
    response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'PedroDEV-local-diagnostics/1.0' }, body: new URLSearchParams({ data: query }), signal: AbortSignal.timeout(30000) });
  }
  report.headersMs = Math.round(performance.now() - started);
  report.status = response.status;
  const text = await response.text();
  try { report.data = JSON.parse(text); } catch { report.bodyPreview = text.slice(0, 300); }
} catch (error) { report.error = { name: error.name, message: error.message, causeCode: error.cause?.code }; }
report.totalMs = Math.round(performance.now() - started);
fs.mkdirSync('docs/prospeccao/diagnostico-timeout', { recursive: true });
fs.writeFileSync(`docs/prospeccao/diagnostico-timeout/${label}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
