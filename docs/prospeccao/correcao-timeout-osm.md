# Diagnóstico e correção do timeout OSM — 06/11/2026

Endereço local: **http://127.0.0.1:5175/admin/prospeccao**. Fonte permanece `openstreetmap`, sem troca silenciosa de provedor. Nenhum lead real foi criado, alterado ou removido.

## Evidências reais, antes da correção

Relatórios em `docs/prospeccao/diagnostico-timeout/` incluem consulta, status e tempo, sem tokens de autenticação:

| Etapa | Resultado | Tempo |
|---|---|---|
| HTTP local: barbearias / Luziânia / UF GO / 5 | 504, atingiu o prazo local original | 30,3 s; login 126 ms |
| Só localizar município no Overpass | 200, relação **334525** (Luziânia), IBGE 5212501 | 27,7 s |
| Consulta mínima de disponibilidade | 429, resposta explícita de capacidade esgotada | 0,85 s |
| Localização restrita por nome antes da UF | 502, resposta explícita de capacidade esgotada | 0,86 s |
| Só barbearias na área municipal já conhecida | 502, resposta explícita de capacidade esgotada | 0,80 s |

O login não explica o atraso. A localização municipal isolada consumiu quase todo o prazo local de 30 s. Além disso, mesmo uma consulta mínima foi recusada pela fonte por sobrecarga. A consulta de empresas isolada foi recusada antes de uma execução conclusiva; não há evidência para afirmar que ela retornaria zero empresas ou que demorou por volume de estabelecimentos.

## Mudanças

- Duas consultas medidas separadamente: município e empresas.
- Resolução municipal filtra candidatos pelo nome antes de conferir a UF. A consulta de empresas usa apenas a área derivada do ID confirmado do município.
- Seleção de `shop=hairdresser` dentro da área é feita uma vez; os critérios de barbearia filtram esse conjunto. `shop=barber` é consultado também. A saída continua limitada ao número solicitado.
- Cache de município de 30 minutos, no máximo 100 entradas, por cidade/UF. Não são cacheados erros ou buscas municipais sem resultado. A busca de empresas continua atualizada a cada solicitação.
- Diagnóstico HTTP seguro com etapa, causa, tempos municipais/empresas/autorização/total e status remoto quando disponível. Não inclui chaves nem tokens.
- Mensagens diferentes para fonte ocupada/indisponível, timeout da própria fonte, prazo de espera local e consulta concluída vazia. Respostas parciais nunca viram uma lista vazia de sucesso.

A [documentação oficial do Overpass](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html) informa fila de até 15 segundos antes da execução. Por isso o prazo intermediário experimental de 12 s foi descartado: a versão final reserva 28 s para localização (execução remota de 8 s mais fila/margem) e 32 s para empresas (execução remota de 12 s mais fila/margem). O navegador aguarda até 80 s para não abortar antes dos limites do servidor e da autenticação. O objetivo não é esconder indisponibilidade aumentando um único prazo: a consulta foi dividida, restringida e instrumentada. Não há retentativas automáticas nem alternância de endpoints para contornar limites.

## Consulta real final — resultado separado dos testes

Ambos os formatos foram enviados pelo endpoint local autenticado:

| Entrada | Resultado real final | Diagnóstico |
|---|---|---|
| Cidade `Luziânia`, UF `GO`, barbearias, limite 5 | 504 em 28,2 s | Prazo local ao localizar município; empresas: 0 ms, etapa não executada |
| Cidade `Luziânia, GO`, sem UF selecionada, barbearias, limite 5 | 504 em 28,1 s | Mesmo estágio; formato interpretado corretamente, sem erro de UF |

**Continuou bloqueada pela resposta insuficiente da fonte; não retornou uma busca concluída com zero empresas.** Os resultados não foram importados. Os relatórios finais são `local-separate-final.json` e `local-combined-final.json`; as demais medições anteriores foram mantidas como evidência.

Para reproduzir individualmente, sem alterar Firestore:

```powershell
node scripts/diagnose-osm.mjs local-separate local-separate-new
node scripts/diagnose-osm.mjs local-combined local-combined-new
```

O script usa somente o administrador fictício do Auth Emulator. Ele exige o servidor local na porta 5175, gera relatórios locais e não importa leads ou envia mensagens.

## Testes e preservação de dados

Passaram **33 testes locais**: 14 de busca/modelo/adaptadores, 6 do fluxo manual, 10 de regras/integração e 3 do endpoint HTTP com fixture. Os testes simulados conferem equivalência dos dois formatos, cache municipal, etapas, erros remotos e locais, município não encontrado versus busca concluída vazia, atribuição e contatos. A regressão do Firestore Emulator continua validando primeira importação, repetição sem duplicatas, concorrência e preservação de briefing/demo/mensagem/status existentes.

TypeScript cliente/servidor e build passaram. A validação das páginas públicas e de whitespace é repetida na finalização. Os dados de teste são identificados como fictícios e permanecem no namespace de testes; não comprovam disponibilidade atual do Overpass público. A revisão independente não encontrou defeitos bloqueadores no escopo corrigido.

Arquivos desta correção: `server/openstreetmap.ts`, `server/searchError.ts`, `server/prospectSearchApi.ts`, `src/lib/prospectSearch.ts`, `src/pages/admin/ProspectSearchPanel.tsx`, `tests/prospect-search.test.mjs`, `scripts/diagnose-osm.mjs`, `scripts/query-osm-pilot.mjs`, este documento, referências nos roteiros existentes, plano e relatórios de diagnóstico. Não houve mudança nas regras Firestore nem no código de importação nesta etapa. Sem deploy, push, publicação remota ou envio de mensagens.
