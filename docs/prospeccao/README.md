# Prospecção local

Busca gratuita por cidade/UF: veja [o piloto OpenStreetMap para barbearias](openstreetmap-piloto.md).

Acesse `/admin/prospeccao` pelo menu administrativo. O fluxo usa apenas `prospects`; não cria clientes, propostas, contratos ou documentos públicos. A coleção nasce na primeira gravação, com as regras locais limitando leitura e escrita a usuários presentes em `admins/{uid}`.

## Testar sem Firebase remoto

Pré-requisitos: dependências do projeto, Node e Java 11 ou superior para o Firebase CLI 13 instalado. Nesta sessão foi usado Java 17 portátil em `%TEMP%/pedrodev-prospect-jre17/jdk-17.0.21+9-jre`, sem alterar o Java do sistema. Se necessário, no terminal dos emuladores:

```powershell
$env:JAVA_HOME = Join-Path $env:TEMP 'pedrodev-prospect-jre17/jdk-17.0.21+9-jre'
$env:PATH = "$env:JAVA_HOME/bin;$env:PATH"
npm run emulators
```

Em outro terminal:

```powershell
npm run seed:local
npm run dev:local
```

Abra `http://127.0.0.1:5173/login`. Conta fictícia exclusiva dos emuladores:

- E-mail: `admin@pedrodev.test`
- Senha: `Pedrodev-local-123!`

`dev:local` força um projeto fictício `demo-pedrodev` em desenvolvimento, mesmo se houver variáveis de um projeto real. Auth e Firestore usam somente `127.0.0.1:9099` e `127.0.0.1:8080`. O login e a autorização continuam passando pelo Firebase Auth e pelo documento de administrador. O modo de emuladores não é ativado no build de produção. `npm run dev` mantém a configuração Firebase habitual; regras locais não alteram as permissões remotas.

Os dados dos emuladores são temporários por padrão. Não confunda esse ambiente com o cadastro definitivo.

## Roteiro manual

1. Entre no painel e abra Prospecção. Cadastre uma empresa fictícia, contato comercial, telefone com DDD, fontes (uma por linha), situação do site, diagnóstico e briefing. Salve.
2. Clique em **Copiar briefing** e cole no Codex. O texto inclui empresa, contato, fontes, situação, diagnóstico e briefing. Se o navegador impedir a cópia, o painel exibe o texto para seleção manual.
3. Crie a demo fora do painel. Volte ao lead, cole uma URL HTTP(S), escreva a abordagem com o link, selecione **Demo pronta**, agende uma data de retorno e salve.
4. Use **Abrir demo** para conferir o endereço e **Abrir WhatsApp** para preparar a conversa. O painel não envia a mensagem nem registra contato por abrir o link.
5. Clique em **Marcar como contatado**. Cancele a confirmação e confira que nada mudou. Só confirme depois de enviar a abordagem; a confirmação grava status e timestamp do contato.
6. Recarregue para conferir a persistência. Edite o lead, busque por empresa/contato e filtre por status. Edite um briefing sem salvar, navegue para outro item do painel e volte: o rascunho é recuperado na memória da mesma aba. Recarregar/fechar com alterações exibe a proteção nativa do navegador; rascunhos não são gravados em disco.

As ações usam dados salvos e ficam desabilitadas enquanto há alterações pendentes. WhatsApp exige telefone válido e mensagem; copiar exige briefing; abrir demo exige URL válida.

## Estrutura para evolução

`src/lib/prospects.ts` define o modelo e a validação; `src/lib/prospectStore.ts` concentra acesso ao Firestore. Campos: `company`, `contactName`, `phone`, `email`, `sources` (array de referências), `siteSituation`, `diagnosis`, `briefing`, `demoUrl`, `message`, `status`, `nextFollowUp` (data local `YYYY-MM-DD`), `schemaVersion: 1`, `origin: manual`, `createdAt`, `updatedAt` e `contactedAt`. Datas de auditoria são timestamps do servidor. A busca com fonte configurável foi adicionada e está documentada em [Buscar leads](busca-leads.md); Hermes continua fora desta etapa.

## Verificação

```powershell
npm run test:prospects
npm run check
npm run test:rules
npm run build
npm run check:public
git diff --check
```

`test:rules` inicia seu próprio emulador Firestore; encerre outro emulador na porta 8080 antes de usá-lo. Com os emuladores já em execução, pode rodar `node --test tests/firestore.rules.test.mjs` diretamente. A suíte limpa e usa somente o namespace fictício `demo-pedrodev-rules`, separado do namespace de cadastro manual `demo-pedrodev`.

- Modelo/WhatsApp/rascunho: 6 testes.
- Regras e integração: 9 testes; incluem visitantes e usuários comuns bloqueados, CRUD admin, criação/edição do lead, demo, cancelamento/confirmação do contato e isolamento dos cadastros existentes.
- Login local verificado com SDK Auth real conectado ao emulador e leitura de `admins/{uid}`.
- Limite: teste visual/interativo não concluído porque a autorização do Chrome expirou. O servidor respondeu HTTP 200 em `/admin/prospeccao`; isso não substitui o teste visual.
- Falha preexistente observada: `tests/project-catalog.test.mjs` não resolve `./conceptProjects` a partir do módulo `data:` gerado pelo próprio teste (`ERR_UNSUPPORTED_RESOLVE_REQUEST`). Esses arquivos não foram alterados nesta implementação.

Nenhum deploy, push ou publicação de regras remotas foi realizado.
