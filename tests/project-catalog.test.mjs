import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/lib/projectCatalog.ts', import.meta.url),'utf8');
const output = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {PROJECTS,PROJECT_DEFAULTS,mergeProjectContent,safeProjectUrl} = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);

test('all seven projects have real local screens and a repository link',()=>{
  assert.equal(PROJECTS.length,7);
  assert.equal(new Set(PROJECTS.map(p=>p.id)).size,7);
  for(const p of PROJECTS){
    assert.match(p.repo,/^https:\/\/github\.com\//);
    assert.ok(p.screens.some(s=>s.device==='desktop'));
    assert.ok(p.screens.some(s=>s.device==='mobile'));
    for(const screen of p.screens) assert.ok(fs.statSync(new URL(`../public${screen.src}`,import.meta.url)).size>100,screen.src);
  }
});
test('a legacy three-project document preserves edits and adds the other four',()=>{
  const legacy=PROJECT_DEFAULTS.slice(0,3).map(({id,...p},i)=>({...p,title:`Título editado ${i}`}));
  const merged=mergeProjectContent(legacy);
  assert.equal(merged.length,7);
  assert.equal(merged.find(p=>p.id==='cinegift').title,'Título editado 1');
  assert.equal(merged.find(p=>p.id==='bagagemdev').title,'Bagagem Dev');
});
test('stable IDs survive a reordered admin document',()=>{
  const saved=[{...PROJECT_DEFAULTS[4],title:'Missal editado'},{...PROJECT_DEFAULTS[0],title:'Bitto editado'}];
  const merged=mergeProjectContent(saved);
  assert.equal(merged.find(p=>p.id==='formamissal').title,'Missal editado');
  assert.equal(merged.find(p=>p.id==='bitto').title,'Bitto editado');
  assert.equal(merged.find(p=>p.id==='cinegift').title,'CineGift');
});
test('old repository-request links migrate to the public GitHub repositories',()=>{
  const old=PROJECT_DEFAULTS.slice(0,3).map(({id,...p})=>({...p,link2Url:'https://wa.me/556100000000?text=solicitar%20reposit%C3%B3rio',footnote:'Repositório privado — acesso mediante solicitação.'}));
  const merged=mergeProjectContent(old);
  for(let i=0;i<3;i++){
    assert.equal(merged[i].link2Url,PROJECTS[i].repo);
    assert.equal(merged[i].footnote,'');
  }
  const kontLegacy = PROJECT_DEFAULTS.slice(0,3).map(({id,...p})=>({...p}));
  kontLegacy[2].link1Url='https://wa.me/556100000000?text=reposit%C3%B3rio';
  kontLegacy[2].link2Url='';
  kontLegacy[2].footnote='Repositório privado — código proprietário';
  assert.equal(mergeProjectContent(kontLegacy)[2].link2Url,PROJECTS[2].repo);
  assert.equal(mergeProjectContent(kontLegacy)[2].link1Url,PROJECTS[2].url);
  const custom=mergeProjectContent([{...PROJECT_DEFAULTS[0],link2Url:'https://example.com/case',footnote:'Minha observação'}]);
  assert.equal(custom[0].link2Url,'https://example.com/case');
  assert.equal(custom[0].footnote,'Minha observação');
});
test('unsafe URLs never become external project links',()=>{
  assert.equal(safeProjectUrl('javascript:alert(1)'), '');
  assert.equal(safeProjectUrl('data:text/html,hello'), '');
  assert.equal(safeProjectUrl('https://github.com/opgmoraes/pedrodev'),'https://github.com/opgmoraes/pedrodev');
});
