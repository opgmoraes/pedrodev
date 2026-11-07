import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

async function load(path, name) {
  if (!existsSync(path)) return {};
  await mkdir('node_modules/.cache/pedrodev', { recursive: true });
  const outfile = `node_modules/.cache/pedrodev/${name}.mjs`;
  await build({ entryPoints: [path], bundle: true, packages: 'external', platform: 'node', format: 'esm', outfile });
  return import(pathToFileURL(`${process.cwd()}/${outfile}`));
}
const model = await load('src/lib/prospectSearch.ts', 'search-model-test');
const server = await load('server/prospectSearch.ts', 'search-server-test');
const osmFixture = JSON.parse(await readFile('tests/fixtures/openstreetmap-barbers.json', 'utf8'));
const osmQuery = { niche: 'barbearias', city: 'Luziânia, GO', limit: 5 };
const osmEnv = { PROSPECT_SEARCH_PROVIDER: 'openstreetmap' };

test('OSM consulta município por UF, limita resultados e preserva origem e atribuição sem chave', async () => {
  const queries = [];
  const response = await server.searchProspects(osmQuery, osmEnv, async (url, options) => {
    assert.equal(url, 'https://overpass-api.de/api/interpreter');
    const query = new URLSearchParams(options.body).get('data');
    queries.push(query);
    assert.ok(!JSON.stringify(options.headers).includes('Api-Key'));
    return Response.json(osmFixture);
  });
  assert.match(queries[0], /BR-GO/);
  assert.match(queries[0], /Luziânia/i);
  assert.match(queries[0], /admin_level/);
  assert.match(queries.at(-1), /out tags 5/);
  assert.equal(response.provider, 'openstreetmap');
  assert.equal(response.isTestData, false);
  assert.equal(response.results.length, 2);
  assert.equal(response.results[0].externalId, 'node/9990002');
  assert.equal(response.results[1].externalId, 'way/9990003');
  assert.equal(response.results[0].phone, '5561999990001');
  assert.equal(response.results[0].website, 'https://example.com/barbearia-a');
  assert.equal(response.results[1].siteSituation, 'Não verificado');
  assert.ok(response.results[0].sources.includes('https://www.openstreetmap.org/node/9990002'));
  assert.equal(response.attribution.text, '© OpenStreetMap contributors');
  assert.equal(response.results[0].attribution.url, 'https://www.openstreetmap.org/copyright');
});

test('OSM separa município de leads, reutiliza município e aceita ambos os formatos', async () => {
  const queries = [];
  const fetcher = async (url, options) => {
    queries.push(new URLSearchParams(options.body).get('data'));
    return Response.json(osmFixture);
  };
  const first = await server.searchProspects({ niche: 'barbearias', city: 'Luziânia', uf: 'GO', limit: 5 }, osmEnv, fetcher);
  const second = await server.searchProspects(osmQuery, osmEnv, fetcher);
  assert.equal(queries.length, 3);
  assert.ok(queries[0].indexOf('->.named') < queries[0].indexOf('BR-GO'));
  assert.ok(!queries[0].includes('shop'));
  assert.match(queries[1], /area\(3609990001\)/);
  assert.ok(!queries[1].includes('ISO3166-2'));
  assert.deepEqual(first.results, second.results);
  assert.equal(first.diagnostics.municipalityCached, false);
  assert.equal(second.diagnostics.municipalityCached, true);
  assert.equal(second.outcome, 'completed');
});

test('OSM diagnóstico distingue fonte ocupada, timeout remoto e prazo local por etapa', async () => {
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => new Response('', { status: 429 })), error => {
    assert.equal(error.status, 503);
    assert.equal(error.details.stage, 'municipality');
    assert.equal(error.details.cause, 'source-unavailable');
    assert.match(error.message, /não concluída/i);
    return true;
  });
  let calls = 0;
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => ++calls === 1 ? Response.json(osmFixture) : new Response('', { status: 504 })), error => {
    assert.equal(error.details.stage, 'leads');
    assert.equal(error.details.cause, 'source-timeout');
    return true;
  });
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => { throw new DOMException('deadline', 'TimeoutError'); }), error => {
    assert.equal(error.details.cause, 'local-timeout');
    assert.equal(error.details.stage, 'municipality');
    return true;
  });
});

test('OSM aceita UF separada e rejeita nicho fora do piloto ou cidade sem UF antes da rede', async () => {
  const response = await server.searchProspects({ niche: 'Barbearias', city: 'Luziânia', uf: 'GO', limit: 1 }, osmEnv, async () => Response.json(osmFixture));
  assert.equal(response.results.length, 1);
  assert.equal(response.results[0].city, 'Luziânia, GO');
  for (const query of [{ ...osmQuery, niche: 'dentistas' }, { ...osmQuery, city: 'Luziânia' }, { ...osmQuery, city: 'Luziânia, XX' }]) {
    await assert.rejects(() => server.searchProspects(query, osmEnv, async () => { assert.fail('não deve consultar a rede'); }), /barbearias|UF/);
  }
});

test('OSM resultado vazio e município ausente são mensagens claras, sem inventar leads', async () => {
  const empty = await server.searchProspects(osmQuery, osmEnv, async () => Response.json({ elements: [osmFixture.elements[0]] }));
  assert.deepEqual(empty.results, []);
  assert.match(empty.message, /Nenhuma barbearia/);
  assert.equal(empty.outcome, 'completed');
  const missingCity = await server.searchProspects(osmQuery, osmEnv, async () => Response.json({ elements: [] }));
  assert.match(missingCity.message, /município/i);
  assert.equal(missingCity.outcome, 'municipality-not-found');
});

test('OSM preserva telefone incompleto da fonte sem inventar DDD ou habilitar WhatsApp', async () => {
  const data = structuredClone(osmFixture);
  data.elements[1].tags['contact:phone'] = '3621-0001';
  const response = await server.searchProspects(osmQuery, osmEnv, async () => Response.json(data));
  assert.equal(response.results[0].phone, '');
  assert.equal(response.results[0].sourcePhone, '3621-0001');
});

test('OSM diferencia indisponibilidade, timeout e respostas parciais ou inválidas', async () => {
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => new Response('', { status: 429 })), /indisponível|ocupado/i);
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => { throw new DOMException('timeout', 'TimeoutError'); }), /tempo|demorou/i);
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => Response.json({ ...osmFixture, remark: 'runtime error: Query timed out' })), /tempo|demorou/i);
  await assert.rejects(() => server.searchProspects(osmQuery, osmEnv, async () => Response.json({ error: 'bad' })), /inválid|inesperado/i);
});

test('busca valida nicho, cidade e limite inteiro entre 1 e 20', () => {
  assert.equal(typeof model.validateSearchQuery, 'function');
  assert.deepEqual(model.validateSearchQuery({ niche: ' Dentistas ', city: ' Luziânia ', limit: 3 }), { niche: 'Dentistas', city: 'Luziânia', limit: 3 });
  for (const input of [{ niche: '', city: 'X', limit: 3 }, { niche: 'X', city: '', limit: 3 }, { niche: 'X', city: 'Y', limit: 0 }, { niche: 'X', city: 'Y', limit: 21 }, { niche: 'X', city: 'Y', limit: 2.5 }]) assert.throws(() => model.validateSearchQuery(input));
});

test('normalização distingue site não localizado de falta de evidência e remove links inseguros', () => {
  assert.equal(typeof model.normalizeSearchResult, 'function');
  const base = { provider: 'fixture', externalId: '1', company: 'Empresa', city: 'Goiânia', sources: ['https://example.com/fonte', 'javascript:alert(1)'] };
  assert.equal(model.normalizeSearchResult({ ...base, websiteChecked: true }).siteSituation, 'Site não localizado');
  assert.equal(model.normalizeSearchResult(base).siteSituation, 'Não verificado');
  assert.equal(model.normalizeSearchResult({ ...base, website: 'https://empresa.example.com' }).siteSituation, 'Site existente');
  assert.equal(model.normalizeSearchResult({ ...base, websiteChecked: true, website: 'https://instagram.com/empresa' }).siteSituation, 'Site não localizado');
  assert.equal(model.normalizeSearchResult({ ...base, sources: [], websiteChecked: true }).siteSituation, 'Não verificado');
  assert.deepEqual(model.normalizeSearchResult(base).sources, ['https://example.com/fonte']);
});

test('fonte fixture é explícita, respeita o limite e não inventa pessoa de contato', async () => {
  assert.equal(typeof server.searchProspects, 'function');
  const response = await server.searchProspects({ niche: 'Clínicas', city: 'Cidade Teste', limit: 3 }, { PROSPECT_SEARCH_PROVIDER: 'fixture' });
  assert.equal(response.isTestData, true);
  assert.equal(response.results.length, 3);
  assert.equal(response.results[0].contactName, '');
  assert.deepEqual(response.results.map(item => item.siteSituation), ['Site existente', 'Site não localizado', 'Não verificado']);
  assert.equal((await server.searchProspects({ niche: 'Clínicas', city: 'Cidade Teste', limit: 1 }, { PROSPECT_SEARCH_PROVIDER: 'fixture' })).results.length, 1);
});

test('fonte real sem chave informa configuração e nunca retorna fixtures', async () => {
  assert.equal(typeof server.searchProspects, 'function');
  await assert.rejects(() => server.searchProspects({ niche: 'X', city: 'Y', limit: 2 }, {}), /GOOGLE_PLACES_API_KEY/);
});

test('adaptador Google usa chave só na requisição do servidor e mapeia contatos públicos', async () => {
  assert.equal(typeof server.searchProspects, 'function');
  const response = await server.searchProspects({ niche: 'Dentistas', city: 'Luziânia', limit: 2 }, { GOOGLE_PLACES_API_KEY: 'test-secret-key' }, async (url, options) => {
    assert.equal(url, 'https://places.googleapis.com/v1/places:searchText');
    assert.equal(options.headers['X-Goog-Api-Key'], 'test-secret-key');
    const query = JSON.parse(options.body);
    assert.equal(query.pageSize, 2);
    assert.ok(query.textQuery.includes('Luziânia'));
    return new Response(JSON.stringify({ places: [{ id: 'place-1', displayName: { text: 'Empresa real simulada' }, internationalPhoneNumber: '+55 62 99999-0001', googleMapsUri: 'https://maps.google.com/?cid=1' }] }), { status: 200 });
  });
  assert.equal(response.results[0].phone, '5562999990001');
  assert.equal(response.results[0].siteSituation, 'Site não localizado');
  assert.equal(response.isTestData, false);
  assert.ok(!JSON.stringify(response).includes('test-secret-key'));
});

test('identidades normalizam telefone brasileiro, acentos e capitalização', () => {
  assert.equal(typeof model.prospectIdentityKeys, 'function');
  const keys = model.prospectIdentityKeys({ company: ' Clínica EXEMPLO ', city: 'Luziânia', phone: '(62) 99999-0001', sources: [] });
  assert.ok(keys.includes('phone:5562999990001'));
  assert.ok(keys.includes('business:clinica exemplo|luziania'));
  assert.ok(model.isProspectDuplicate({ company: 'Clínica Exemplo', city: 'Luziânia', phone: '5562999990001', sources: [] }, { company: 'Outro nome', phone: '62999990001', sources: [] }));
});

test('dedup entre fontes reconhece município legado sem UF sem misturar UFs diferentes', () => {
  const osm = { company: 'Barbearia Exemplo', city: 'Luziânia, GO', phone: '', provider: 'openstreetmap', externalId: 'node/1', sources: ['https://www.openstreetmap.org/node/1'] };
  const googleLegacy = { company: 'BARBEARIA EXEMPLO', city: 'Luziânia', phone: '', provider: 'google-places', externalId: 'place-1', sources: ['https://maps.google.com/?cid=1'] };
  assert.equal(model.isProspectDuplicate(osm, googleLegacy), true);
  assert.equal(model.isProspectDuplicate(osm, { ...googleLegacy, city: 'Luziânia, SP' }), false);
});
