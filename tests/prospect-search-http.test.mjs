import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';

// Somente endpoints locais e fonte fixture. Não utiliza chaves ou dados de produção.
const base = process.env.PROSPECT_TEST_BASE_URL || 'http://127.0.0.1:5174';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('O teste HTTP exige servidor local.');
const authBase = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:';
async function account(action, body) {
  const response = await fetch(`${authBase}${action}?key=demo-pedrodev-key`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Auth Emulator: ${data.error?.message}`);
  return data;
}
let adminToken;
let visitorToken;
before(async () => {
  adminToken = (await account('signInWithPassword', { email: 'admin@pedrodev.test', password: 'Pedrodev-local-123!', returnSecureToken: true })).idToken;
  visitorToken = (await account('signUp', { email: `search-http-${Date.now()}@pedrodev.test`, password: 'Test-local-only-123!', returnSecureToken: true })).idToken;
});
after(async () => { if (visitorToken) await account('delete', { idToken: visitorToken }); });
function search(token, body = { niche: 'Clínicas', city: 'Cidade Teste', limit: 3 }, extraHeaders = {}) {
  return fetch(`${base}/api/prospect-search`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Prospect-Fixture-Only': 'true', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extraHeaders },
    body: JSON.stringify(body),
  });
}
test('endpoint não permite visitante, token inválido ou usuário comum', async () => {
  assert.equal((await search()).status, 401);
  assert.equal((await search('invalid-token')).status, 401);
  assert.equal((await search(visitorToken)).status, 403);
});
test('endpoint local autenticado retorna fixtures revisáveis sem chave no payload', async () => {
  const response = await search(adminToken);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const data = await response.json();
  assert.equal(data.isTestData, true);
  assert.equal(data.results.length, 3);
  assert.deepEqual(data.results.map(item => item.siteSituation), ['Site existente', 'Site não localizado', 'Não verificado']);
  for (const item of data.results) {
    assert.ok(item.company.includes('TESTE'));
    assert.ok(item.sources.every(url => new URL(url).protocol === 'https:'));
  }
  assert.ok(!JSON.stringify(data).includes('GOOGLE_PLACES_API_KEY'));
});
test('endpoint rejeita limites inválidos, origem diferente e método não permitido', async () => {
  assert.equal((await search(adminToken, { niche: 'Clínicas', city: 'Cidade Teste', limit: 21 })).status, 400);
  assert.equal((await search(adminToken, undefined, { Origin: 'https://outside.example' })).status, 403);
  assert.equal((await fetch(`${base}/api/prospect-search`)).status, 405);
});
