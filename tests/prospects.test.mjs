import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const path = new URL('../src/lib/prospects.ts', import.meta.url);
const source = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const model = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
const whatsappSource = fs.readFileSync(new URL('../src/lib/whatsapp.ts', import.meta.url), 'utf8');
const whatsappOutput = ts.transpileModule(whatsappSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { buildWhatsappLink } = await import(`data:text/javascript;base64,${Buffer.from(whatsappOutput).toString('base64')}`);

test('WhatsApp preserva DDD 55 nacional e codifica a mensagem', () => {
  assert.equal(buildWhatsappLink('(55) 99999-1234', 'Olá & demo'), 'https://wa.me/5555999991234?text=Ol%C3%A1%20%26%20demo');
  assert.equal(buildWhatsappLink('+55 (62) 99999-1234', 'Demo'), 'https://wa.me/5562999991234?text=Demo');
});

test('cadastro normaliza fontes e mantém leads separados de clientes', () => {
  assert.equal(typeof model.prepareProspect, 'function');
  const result = model.prepareProspect({ ...model.EMPTY_PROSPECT, company: ' Empresa teste ', sources: ' https://example.com\n\n Google Maps ', phone: '(62) 99999-9999' });
  assert.equal(result.company, 'Empresa teste');
  assert.deepEqual(result.sources, ['https://example.com', 'Google Maps']);
  assert.equal(result.phone, '62999999999');
  assert.equal(result.status, 'Recebido');
  assert.equal(result.clientId, undefined);
  assert.equal(result.contactedAt, undefined);
});

test('validação rejeita empresa vazia, URL insegura e telefone incompleto', () => {
  assert.equal(typeof model.prepareProspect, 'function');
  for (const change of [{ company: ' ' }, { demoUrl: 'javascript:alert(1)' }, { demoUrl: 'ftp://example.com' }, { phone: '123' }, { status: 'Contatado' }, { nextFollowUp: '2026-02-31' }]) {
    assert.throws(() => model.prepareProspect({ ...model.EMPTY_PROSPECT, company: 'Teste', ...change }));
  }
  assert.equal(model.prepareProspect({ ...model.EMPTY_PROSPECT, company: 'Teste', demoUrl: 'https://example.com/demo' }).demoUrl, 'https://example.com/demo');
});

test('briefing copiado inclui contexto de pesquisa e instrução para criar demo', () => {
  assert.equal(typeof model.buildProspectBriefing, 'function');
  const text = model.buildProspectBriefing({ ...model.EMPTY_PROSPECT, company: 'Estúdio Exemplo', contactName: 'Ana', sources: ['https://example.com'], siteSituation: 'Sem site', diagnosis: 'Agendamento manual', briefing: 'Página com serviços e agendamento.' });
  for (const value of ['Estúdio Exemplo', 'Ana', 'https://example.com', 'Sem site', 'Agendamento manual', 'Página com serviços e agendamento.']) assert.ok(text.includes(value), value);
  assert.match(text, /demo/i);
});

test('contato só produz atualização após confirmação explícita', () => {
  assert.equal(typeof model.confirmProspectContact, 'function');
  assert.equal(model.confirmProspectContact(false, 'timestamp'), null);
  assert.deepEqual(model.confirmProspectContact(true, 'timestamp'), { status: 'Contatado', contactedAt: 'timestamp', updatedAt: 'timestamp' });
});

test('rascunho sobrevive à navegação interna e fica isolado por administrador', () => {
  assert.equal(typeof model.storeProspectDraft, 'function');
  const form = { ...model.EMPTY_PROSPECT, company: 'Rascunho', briefing: 'Ainda não salvo' };
  model.storeProspectDraft('admin-a', { form, selectedId: 'lead-a' });
  assert.deepEqual(model.readProspectDraft('admin-a'), { form, selectedId: 'lead-a' });
  assert.equal(model.readProspectDraft('admin-b'), undefined);
  model.storeProspectDraft('admin-a', undefined);
  assert.equal(model.readProspectDraft('admin-a'), undefined);
});
