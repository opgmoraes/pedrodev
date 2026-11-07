# OpenStreetMap — piloto de barbearias

**Atualização:** o timeout foi diagnosticado e o adaptador passou a separar e medir município/empresas. Consulte [a correção e as medições reais](correcao-timeout-osm.md); os resultados do piloto original abaixo são históricos.

O provedor `openstreetmap` consulta a Overpass API pública no servidor local, sem chave ou cartão. Google Places e `fixture` continuam disponíveis. As alterações anteriores não commitadas foram preservadas.

## Conferir

Servidor desta validação: **http://127.0.0.1:5175/admin/prospeccao**.

Faça login local com `admin@pedrodev.test` / `Pedrodev-local-123!`, preencha nicho **barbearias**, cidade **Luziânia**, UF **GO**, limite **5**, e clique em **Buscar leads**. Também é aceito escrever `Luziânia, GO` no campo cidade e deixar UF sem seleção. Se preencher ambos, as UFs precisam ser iguais. O piloto aceita `barbearia` e `barbearias`; outros nichos retornam instrução clara.

O `.env.local` foi configurado com `PROSPECT_SEARCH_PROVIDER=openstreetmap`, sem alterar outras variáveis. Esse arquivo permanece ignorado pelo Git. A instância 5175 usa `npm run dev:local -- --port 5175 --strictPort`, portanto Auth/Firestore continuam nos emuladores. Um processo já iniciado com `PROSPECT_SEARCH_PROVIDER=fixture` no ambiente mantém essa preferência; a porta 5174 foi mantida com fixture para os testes HTTP.

Resultados podem ser revisados e selecionados antes de importar. O link `https://www.openstreetmap.org/{tipo}/{id}` identifica cada registro original. A atribuição **© OpenStreetMap contributors** é mostrada, ligada à [licença](https://www.openstreetmap.org/copyright), preservada no documento importado e mostrada na edição do lead.

Telefone, site e e-mail só são preenchidos quando registrados na fonte. Telefone brasileiro com DDD ou código do país é normalizado; telefone incompleto é preservado e exibido como texto original da fonte para revisão, sem inventar DDD. Telefone comercial encontrado não comprova WhatsApp ativo. Quando não há site, a classificação é **Não verificado**, nunca uma conclusão de que a empresa não possui site.

## Consulta e limites

Uma requisição POST para `https://overpass-api.de/api/interpreter`, limitada ao município dentro da UF (fronteiras administrativas nível 8 e área estadual nível 4). Busca nodes/ways/relations com nome e marcações de barbearia: `shop=hairdresser` com `hairdresser=barber`, indicação masculina sem indicação feminina ou nome de barbearia; também reconhece `shop=barber`. A cobertura depende das marcações existentes, e não representa lista completa dos estabelecimentos.

Limite compartilhado 1–20; Overpass recebe também limite na saída. A resolução e a busca de empresas são separadas, com cache municipal e limites de execução remotos de 8/12 s, espera HTTP local de 28/32 s para incluir fila, e até 80 s no navegador. Sem retentativas automáticas. Respostas parciais com erro são descartadas. Município não localizado, consulta sem resultados, serviço indisponível/ocupado e timeout têm mensagens distintas. A autenticação de administrador e o índice privado de deduplicação existentes são reutilizados. A deduplicação entre fontes reconhece cidade legada sem UF; UFs conhecidas diferentes permanecem distintas.

Referências: [tags de cabeleireiros/barbearias](https://wiki.openstreetmap.org/wiki/Tag:shop=hairdresser), [tipo de cabeleireiro](https://wiki.openstreetmap.org/wiki/Key:hairdresser), [filtros por área](https://dev.overpass-api.de/overpass-doc/en/full_data/area.html), [recursos compartilhados do Overpass](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html).

## Resultados separados

**Dados fictícios:** 31 testes: 12 de busca/adaptadores/identidades, 6 do fluxo manual, 10 de regras/integração no Firestore Emulator, 3 HTTP com autenticação real no Auth Emulator e provedor fixture. A amostra OSM fica em `tests/fixtures/openstreetmap-barbers.json`, com nomes explicitamente marcados TESTE. Na importação desses dois registros, um lead anterior foi preservado e um criado; repetir criou zero, com dois ignorados. A atribuição, o link de origem e Não verificado são conferidos no documento salvo. Inclui preservação de telefone sem DDD e regressão de deduplicação entre Google e OSM. Os testes existentes de concorrência, Google, fixture e bloqueio de usuários comuns foram mantidos. Nenhum fixture foi importado no namespace do cadastro manual.

**Consulta real:** executada via endpoint local autenticado com `barbearias`, `Luziânia, GO`, limite 5. A tentativa válida entre 20:55:55 e 20:56:26 UTC de 06/11/2026 retornou **HTTP 504 — tempo de espera excedido**. Não houve lista conclusiva nem importação de leads reais. Não tratar isso como zero empresas. O relatório exato está em [osm-consulta-real-2026-11-06.json](osm-consulta-real-2026-11-06.json). Uma chamada anterior teve o acento corrompido pelo terminal e foi descartada; o script UTF-8 evita essa corrupção.

Para tentar a consulta real novamente, explicitamente, sem importar:

```powershell
node scripts/query-osm-pilot.mjs
```

Esse script usa apenas a conta fictícia do emulador, exige servidor localhost e provedor OSM, grava o relatório JSON e não envia mensagens. Não fica rodando em segundo plano nem repete consultas sozinho.

## Comandos de validação

Com os emuladores e a instância fixture na porta 5174 ativos:

```powershell
node --test tests/prospect-search.test.mjs tests/prospects.test.mjs tests/firestore.rules.test.mjs tests/prospect-search-http.test.mjs
npm run check
npm run build
npm run check:public
git diff --check
```

O teste visual no Chrome não foi repetido: nesta sessão o controle do navegador tem um bloqueio conhecido. A validação foi por HTTP, SDK e emuladores. Nenhum deploy, push, publicação de regras remotas ou envio de mensagens foi realizado.

## Arquivos desta etapa

- Adaptador: `server/openstreetmap.ts`, `server/searchError.ts`, `server/prospectSearch.ts`.
- Modelo e persistência: `src/lib/prospectSearch.ts`, `src/lib/prospectStore.ts`, `src/lib/prospects.ts`.
- Interface: `src/pages/admin/ProspectSearchPanel.tsx`, `src/pages/admin/Prospeccao.tsx`, `src/pages/admin/prospeccao.css`.
- Configuração: `.env.local` (ignorado) e `.env.example`.
- Verificação: `tests/prospect-search.test.mjs`, `tests/firestore.rules.test.mjs`, `tests/fixtures/openstreetmap-barbers.json`, `scripts/query-osm-pilot.mjs`.
- Registros: este documento, os links nos roteiros existentes, `docs/superpowers/plans/2026-11-06-openstreetmap.md` e o relatório JSON da consulta real.
