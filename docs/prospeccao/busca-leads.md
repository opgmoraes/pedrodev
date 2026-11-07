# Buscar leads no servidor local

O provedor gratuito `openstreetmap` foi adicionado ao piloto; consulte [OpenStreetMap — barbearias](openstreetmap-piloto.md). Google Places e fixture abaixo continuam disponíveis.

Em `/admin/prospeccao`, preencha nicho, cidade e limite (1–20). **Buscar leads** consulta o servidor; nada é importado automaticamente. Revise empresa, nome comercial se encontrado, telefone, e-mail e situação do site; confira os links das fontes, selecione as caixas e clique em **Importar selecionados**. Ao revisar um campo, selecione novamente a linha para confirmar sua escolha. É possível importar subconjuntos em etapas.

Google Places informa normalmente telefone da empresa, não nome de funcionário nem e-mail. Ausência desses dados aparece como não localizado/não informado; nenhum contato pessoal é inventado. Telefone comercial encontrado não comprova que haja WhatsApp naquele número.

- **Site existente:** endereço de site retornado pela fonte; não avalia funcionamento ou qualidade.
- **Site não localizado:** consulta concluída com fonte identificada, sem site oficial retornado. Links de redes sociais não são classificados como site oficial. Não significa que a empresa não tenha site.
- **Não verificado:** faltam dados ou evidências para avaliar.

A observação original da fonte é preservada separadamente da situação escolhida na revisão. A revisão e a observação são identificadas no diagnóstico importado.

## Fonte real

Preencha no `.env.local` (ignorado pelo Git), ou nas variáveis do processo do servidor:

```dotenv
PROSPECT_SEARCH_PROVIDER=google-places
GOOGLE_PLACES_API_KEY=sua_chave_do_google_places
```

Reinicie `npm run dev:local`. Essa configuração usa o adaptador [Places Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search). A chave deve pertencer a um projeto com Places API (New) habilitada; a utilização é sujeita à configuração de cobrança/cota do provedor. O servidor pede apenas campos de identificação, endereço, contato comercial, site e link do Maps, até 20 resultados em uma página. Não há coleta do conteúdo dos sites nem avaliação automática de qualidade do site.

**Nunca use `VITE_GOOGLE_PLACES_API_KEY`.** A chave só é lida pelo middleware Node em `server/`; não vai na requisição do navegador nem no bundle da aplicação. O navegador manda apenas consulta e Firebase ID token para `/api/prospect-search`. O servidor valida a sessão e o documento `admins/{uid}` antes de consultar o provedor. Há limite de tamanho da consulta, timeout, bloqueio de origem diferente e resposta sem cache. A rota existe apenas no servidor de desenvolvimento, não em um deploy estático ou `vite preview`.

Sem chave, a fonte real responde com instrução para configurar `GOOGLE_PLACES_API_KEY`; **não** substitui resultados reais por dados fictícios.

## Fonte de teste

Com Auth e Firestore Emulator ativos conforme o [roteiro local](README.md), em PowerShell:

```powershell
$env:PROSPECT_SEARCH_PROVIDER = 'fixture'
npm run dev:local -- --port 5174 --strictPort
```

Abra `http://127.0.0.1:5174/login`, entre com a conta fictícia documentada e vá para Prospecção. A fonte fixture retorna até três empresas explicitamente marcadas **TESTE**, sem consulta externa. A interface exibe **DADOS DE TESTE**. Retornar a `google-places` requer trocar a variável e reiniciar o servidor. Servidores em outras portas não herdam a alteração desse processo.

## Importação e duplicatas

As importações usam `prospects` e o índice auxiliar privado `prospectImportKeys`, ambos acessíveis só a administradores. Transações e hashes de identidade protegem contra repetição do lote e importações simultâneas. São comparados identificador da fonte, telefone brasileiro normalizado, empresa/cidade normalizadas e URLs específicas das fontes. Cadastros legados, inclusive sem `createdAt`, são consultados sem sobrescrever seus campos. Nomes iguais sem cidade são tratados conservadoramente como possível duplicata.

Correspondências existentes são puladas: não se altera briefing, mensagem, demo ou status. Não há mesclagem automática. O resumo mostra quantos foram criados e quantos foram ignorados. Falsos positivos (ex.: telefone compartilhado ou filiais de mesmo nome na mesma cidade) devem ser revisados; este fluxo prefere preservar um cadastro a criar uma duplicata. A garantia transacional cobre importações concorrentes; criação manual simultânea fora do índice não tem a mesma garantia.

Os novos registros mantêm origem `search:fixture` ou `search:google-places`, ID externo, cidade/nicho pesquisados, endereço, site, fontes, identidades e evidência da pesquisa. O restante usa o fluxo manual existente, sem envio de mensagens nem criação de clientes/propostas/contratos.

## Validação realizada

```powershell
npm run test:prospects
npm run test:search
node --test tests/firestore.rules.test.mjs
npm run test:search:http
npm run check
npm run build
npm run check:public
```

Os testes de regras exigem Firestore Emulator na porta 8080 e usam namespace exclusivo `demo-pedrodev-rules`. `test:search:http` exige Auth/Firestore locais, conta do `seed:local` e servidor na porta 5174 com fonte **fixture**. O teste HTTP recusa executar consultas reais, usando o cabeçalho `X-Prospect-Fixture-Only`. A conta comum criada pelo teste é descartada ao final. Nenhum lead do cadastro manual é apagado.

Passaram **25 testes** conjuntos: 6 do modelo manual, 6 de busca/adaptador, 10 de regras/integração e 3 do endpoint HTTP. TypeScript cliente/servidor, build e verificação das páginas públicas passaram. O build foi executado com uma chave canário fictícia e seus arquivos JavaScript para navegador foram inspecionados: a chave e o adaptador de consulta externo não estão presentes.

Cobertura validada: parâmetros, três estados do site, URLs inseguras, chave ausente sem fallback fictício, mapeamento do adaptador Google com resposta simulada, bloqueio de visitantes/usuários comuns, método/origem/limite, retorno HTTP real local com fixture, primeira e segunda importações, concorrência e preservação dos campos de lead anterior. A chamada autenticada ao Google real **não foi executada**: não foi usada chave real. A validação de interface visual continua limitada pela indisponibilidade do controle do Chrome nesta sessão.

Arquivos desta etapa: `server/prospectSearch.ts`, `server/prospectSearchApi.ts`, `src/lib/prospectSearch.ts`, `src/lib/prospectStore.ts`, `src/lib/prospects.ts`, `src/pages/admin/ProspectSearchPanel.tsx`, `src/pages/admin/Prospeccao.tsx`, `src/pages/admin/prospeccao.css`, `vite.config.ts`, `tsconfig.server.json`, `firestore.rules`, `package.json`, `.env.example`, testes de busca/modelo/HTTP/importação e este roteiro. Alterações anteriores não commitadas foram mantidas. Sem deploy, push ou publicação de regras remotas.
