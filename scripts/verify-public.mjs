import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

for (const [file, path] of [['dist/index.html', '/'], ['dist/portifolio/index.html', '/portifolio']]) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /data-prerendered="true"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one H1`);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://pedrogm.com.br${path.replaceAll('/', '\\/')}">`));
  if (path === '/') assert.match(html, /Quanto custa criar um site ou sistema\?/);
  assert.match(html, path === '/' ? /Seu negócio merece/ : /Ideias em/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="\/assets\//);
  assert.doesNotMatch(html, /reposit[oó]rio|alta conversão|vídeos em motion|preparando seu espaço/i);
  const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, `${path}: one schema graph`);
  const graph = JSON.parse(schemas[0][1])['@graph'];
  const faq = graph.find(item => item['@type'] === 'FAQPage');
  if (path === '/') assert.equal(faq.mainEntity.length, 8);
  else {
    assert.equal(faq, undefined);
    assert.match(html, /pg-portfolio/);
    assert.doesNotMatch(html, /studio-portrait|sky-bridge|portrait-main/);
    assert.match(html, /Filtrar projetos/);
  }
  for (const question of faq?.mainEntity || []) {
    assert.ok(html.includes(question.name), `Visible FAQ question: ${question.name}`);
    assert.ok(html.includes(question.acceptedAnswer.text), 'Schema answer must be in visible page');
  }
  assert.equal(graph.filter(item => item['@type'] === 'Person').length, 1);
  assert.equal(graph.filter(item => item['@type'] === 'ProfessionalService').length, 1);
  if (path === '/') {
    const names = [...html.matchAll(/<h3>\s*([^<]+)<\/h3>/g)].slice(0, 6).map(match => match[1]);
    assert.deepEqual(names, ['BITTO Sistema', 'Tal do Fut', 'Traço Norte', 'Aflora', 'Bagagem Dev', 'Solvia']);
  } else {
    const list = graph.find(item => item['@type'] === 'ItemList');
    assert.equal(list.itemListElement.length, 13);
    const expectedOrder = ['BITTO Sistema', 'Tal do Fut', 'Traço Norte', 'Aflora', 'Bagagem Dev', 'Solvia'];
    assert.deepEqual(list.itemListElement.slice(0, 6).map(entry => entry.item.name), expectedOrder);
    assert.deepEqual([...html.matchAll(/<h3>\s*([^<]+)<\/h3>/g)].slice(0, 6).map(match => match[1]), expectedOrder);
    assert.equal(list.itemListElement.find(item => item.item.name === 'Tal do Fut').item.url, undefined);
    assert.equal(list.itemListElement.find(item => item.item.name === 'KontHub').item.url, undefined);
    assert.doesNotMatch(html, /konthub-mvp\.vercel\.app/);
    for (const name of ['Brasa 65', 'Traço Norte', 'Solvia', 'EloVet', 'Aflora']) {
      const item = list.itemListElement.find(entry => entry.item.name === name)?.item;
      assert.equal(item?.url, undefined);
      assert.equal(item?.genre, 'Projeto conceitual para marca fictícia');
      assert.ok(html.includes(name));
    }
  }
  for (const match of html.matchAll(/<img[^>]+src="(\/assets\/[^\"]+)"/g)) await access(`dist${match[1]}`);
  console.log(`Verified ${path}: public HTML, canonical, schema, FAQs and assets.`);
}
{
  const html = await readFile('dist/skills/index.html', 'utf8');
  assert.match(html, /data-prerendered="true"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, '/skills: one H1');
  assert.match(html, /<link rel="canonical" href="https:\/\/pedrogm\.com\.br\/skills">/);
  assert.match(html, /https:\/\/pedrogm\.com\.br\/assets\/skills\/v2\/ultimate\.png/);
  assert.match(html, /Comprando separados/);
  assert.match(html, /R\$\s+99,70/);
  assert.match(html, /R\$\s+69,90/);
  assert.match(html, /R\$\s+29,80/);
  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, '/skills: one schema graph');
  const graph = JSON.parse(scripts[0][1])['@graph'];
  const list = graph.find(item => item['@type'] === 'ItemList');
  assert.deepEqual(list.itemListElement.map(item => item.name), ['Founder Pack', 'Creator Pack', 'Service Pro Pack', 'Ultimate Skills Pack']);
  for (const item of list.itemListElement) assert.ok(html.includes(item.name));
  for (const name of ['founder', 'creator', 'service', 'ultimate']) await access(`dist/assets/skills/v2/${name}.svg`);
  await access('dist/assets/skills/v2/ultimate.png');
  const faq = graph.find(item => item['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 6);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(question.name));
    assert.ok(html.includes(question.acceptedAnswer.text));
  }
  console.log('Verified /skills: prices, savings, canonical, pack list, FAQs and covers.');
}
const shell = await readFile('dist/private-shell.html', 'utf8');
assert.match(shell, /name="robots" content="noindex, follow"/);
assert.doesNotMatch(shell, /data-prerendered="true"/);
const routes = JSON.parse(await readFile('vercel.json', 'utf8')).rewrites;
for (const path of ['/login', '/admin/:path*', '/cliente/:path*', '/proposta/:path*', '/contrato/:path*']) {
  assert.equal(routes.find(route => route.source === path)?.destination, '/private-shell.html');
}
console.log('Verified private-route shell and deployment mappings.');

const concepts = await readFile('src/lib/conceptProjects.ts', 'utf8');
const sources = [...concepts.matchAll(/"src": "([^"]+)"/g)];
assert.equal(sources.length, 148);
for (const [, src] of sources) await access(`dist${src}`);
console.log("Verified 148 concept screenshots and fictional-project metadata.");


{
 const html=await readFile('dist/link/index.html','utf8');
 assert.match(html,/data-prerendered="true"/);
 for(const href of ['/portifolio','/skills']) assert.ok(html.includes(`href="${href}"`));
 assert.match(html,/Pedir orçamento/);
 const skills=await readFile('dist/skills/index.html','utf8');
 const graph=JSON.parse([...skills.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)][0][1])['@graph'];
 assert.equal(graph.filter(item=>item['@type']==='Product').length,4);
 for(const item of graph.filter(item=>item['@type']==='Product')) { assert.equal(item.offers.priceCurrency,'BRL'); assert.ok(item.offers.url.startsWith('https://pay.cakto.com.br/')); }
 for(const name of ['reception','developer','reviewer','writer']) await access(`dist/assets/skills/office/${name}.png`);
 console.log('Verified server-rendered links, four Product offers and original pixel sprites.');
}
