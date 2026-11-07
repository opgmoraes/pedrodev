// Consulta explícita do piloto real; não importa leads nem envia mensagens.
import fs from 'node:fs';

const base = process.env.PROSPECT_PILOT_BASE_URL || 'http://127.0.0.1:5175';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('O piloto exige servidor local com Firebase Emulator.');
const startedAt = new Date().toISOString();
const auth = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-pedrodev-key', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@pedrodev.test', password: 'Pedrodev-local-123!', returnSecureToken: true }),
});
const identity = await auth.json();
if (!auth.ok) throw new Error('Execute seed:local e confira o Auth Emulator antes do piloto.');
const query = { niche: 'barbearias', city: 'Luziânia, GO', limit: 5 };
const response = await fetch(`${base}/api/prospect-search`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${identity.idToken}` },
  body: JSON.stringify(query), signal: AbortSignal.timeout(80000),
});
const data = await response.json();
if (response.ok && data.provider !== 'openstreetmap') throw new Error('O piloto real exige PROSPECT_SEARCH_PROVIDER=openstreetmap.');
const report = { startedAt, finishedAt: new Date().toISOString(), query, status: response.status, data, imported: false };
fs.writeFileSync('docs/prospeccao/osm-consulta-real-2026-11-06.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
