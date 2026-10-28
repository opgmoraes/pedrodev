import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

for (const [file, path] of [['dist/index.html', '/'], ['dist/portifolio/index.html', '/portifolio']]) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /data-prerendered="true"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one H1`);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://pedrogm.com.br${path.replaceAll('/', '\\/')}">`));
  assert.match(html, /Quanto custa criar um site ou sistema\?/);
  assert.match(html, /Seu próximo projeto/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="\/assets\//);
  assert.doesNotMatch(html, /reposit[oó]rio|alta conversão|vídeos em motion|preparando seu espaço/i);
  const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, `${path}: one schema graph`);
  const graph = JSON.parse(schemas[0][1])['@graph'];
  const faq = graph.find(item => item['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 8);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(question.name), `Visible FAQ question: ${question.name}`);
    assert.ok(html.includes(question.acceptedAnswer.text), 'Schema answer must be in visible page');
  }
  assert.equal(graph.filter(item => item['@type'] === 'Person').length, 1);
  assert.equal(graph.filter(item => item['@type'] === 'ProfessionalService').length, 1);
  if (path === '/') {
    const names = [...html.matchAll(/<h3>\s*([^<]+)<\/h3>/g)].slice(0, 4).map(match => match[1]);
    assert.deepEqual(names, ['BITTO Sistema', 'Tal do Fut', 'Bagagem Dev', 'BITTO Landing Page']);
  } else {
    const list = graph.find(item => item['@type'] === 'ItemList');
    assert.equal(list.itemListElement.length, 8);
    assert.equal(list.itemListElement.find(item => item.item.name === 'Tal do Fut').item.url, undefined);
  }
  for (const match of html.matchAll(/<img[^>]+src="(\/assets\/[^\"]+)"/g)) await access(`dist${match[1]}`);
  console.log(`Verified ${path}: public HTML, canonical, schema, FAQs and assets.`);
}
const shell = await readFile('dist/private-shell.html', 'utf8');
assert.match(shell, /name="robots" content="noindex, follow"/);
assert.doesNotMatch(shell, /data-prerendered="true"/);
const routes = JSON.parse(await readFile('vercel.json', 'utf8')).rewrites;
for (const path of ['/login', '/admin/:path*', '/cliente/:path*', '/proposta/:path*', '/contrato/:path*']) {
  assert.equal(routes.find(route => route.source === path)?.destination, '/private-shell.html');
}
console.log('Verified private-route shell and deployment mappings.');
