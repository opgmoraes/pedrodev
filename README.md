# Pedro Gomes · Site e workspace

## Versão atual — V11

Composição de nuvens refeita em faixas contínuas com textura e iluminação tratadas a partir das imagens enviadas. Movimento independente, névoa e passagem suave para os projetos. Frase nas nuvens, seis etapas, copy e área técnica preservadas. Consulte `AJUSTES_V11.md`.

## Começar

```bash
npm ci
cp .env.example .env
# Preencha as seis variáveis VITE_FIREBASE_* com a configuração Web do seu projeto.
npm run dev
```

O site comercial e as galerias funcionam sem Firebase. Login e dados dependem da configuração; sem ela, o sistema exibe uma mensagem e mantém os botões de acesso desabilitados. Nunca coloque chaves de serviço/Admin SDK no navegador.

## Configuração obrigatória do Firebase

1. Ative Authentication → E-mail/senha e, se desejar, Google.
2. Crie sua conta no Authentication e copie o UID.
3. Pelo Console do Firestore, crie a coleção `admins`, documento com **o seu UID como ID**, e um campo `name` com seu nome. Somente o Console/Admin SDK pode criar administradores. Uma conta Google comum NÃO ganha acesso ao painel.
4. Publique `firestore.rules` em Firestore → Regras. O arquivo `firebase.json` também permite publicar pelo CLI com `firebase deploy --only firestore:rules --project SEU_PROJECT_ID` após autenticar.
5. Em Authentication → Configurações → Domínios autorizados, inclua o domínio usado no deploy.
6. Se já havia dados: entre no painel e clique em **Preparar links existentes**. Isso cria visões compartilháveis para clientes, propostas e contratos sem expor as coleções privadas. Não apaga cadastros e não sobrescreve decisões públicas existentes.

Faça a migração de código e regras em uma janela de manutenção: a versão antiga depende das regras antigas. Depois da atualização, revise um link existente e crie uma proposta de teste antes de retomar o atendimento.

## Rotas

| Rota                        | Conteúdo                                                             |
| --------------------------- | -------------------------------------------------------------------- |
| `/`                         | Site comercial e projetos                                            |
| `/portifolio`, `/portfolio` | Portfólio dedicado aos projetos, apresentação e contato              |
| `/link`                     | Bio e redes                                                          |
| `/trilha`, `/startup`       | Conteúdos existentes preservados                                     |
| `/login`                    | E-mail/senha, Google e recuperação de senha                          |
| `/admin`                    | Indicadores reais, propostas pendentes, projetos e migração de links |
| `/admin/clientes`           | Cadastro, busca e links de WhatsApp                                  |
| `/admin/clientes/:id`       | Dados editáveis, projetos e histórico                                |
| `/admin/projetos`           | Cadastro e atualização de status                                     |
| `/admin/orcamentos`         | Catálogo, proposta, PDF e link compartilhado                         |
| `/admin/contratos`          | Geração a partir de proposta aprovada, PDF e aceite                  |
| `/admin/financeiro`         | Parcelas, vencimentos, recebidos, atraso e baixa manual              |
| `/admin/formularios`        | Respostas aos briefings                                              |
| `/admin/portfolio`          | Conteúdo do hero, sobre e textos/links dos três projetos             |
| `/cliente/:slug`            | Projetos do cliente e envio do briefing                              |
| `/proposta/:slug`           | Escopo, valor, prazo e decisão                                       |
| `/contrato/:slug`           | Documento e aceite                                                   |

## Compartilhamento e dados

- `clients`, `projects`, `quotes`, `contracts`, `payments` e as respostas dos briefings são privados para administradores.
- `publicClients` contém apenas nome e resumo dos projetos. Não contém CPF, telefone, e-mail, endereço nem notas internas.
- `publicQuotes` contém apenas os dados apresentados na proposta; `publicContracts` contém os dados necessários ao contrato, inclusive identificação do contratante. Links são confidenciais: qualquer pessoa com o link pode ler o documento e registrar a decisão inicial. Isso é um fluxo por link, não autenticação do cliente.
- Não há listagem pública dessas coleções. As decisões só podem ocorrer uma vez, sem alterar valor ou escopo.
- Novos slugs usam UUID completo. Links antigos continuam preservados pela migração; os tokens curtos antigos não são automaticamente rotacionados.
- Decisões do cliente são lidas dos documentos compartilhados pelo painel; `status` no registro privado legado pode ficar desatualizado. Use `publicStatus()` ao adicionar novas integrações.
- O financeiro é manual: uma proposta aprovada não significa pagamento recebido. Cadastre as parcelas e dê baixa somente após confirmar o recebimento.
- Não há envio automático de WhatsApp/e-mail. Os botões abrem mensagens prontas; as decisões aparecem no painel após recarregar a página.
- As regras validam o briefing, mas não incluem proteção de volume por IP. Para grande tráfego, adicione App Check e um backend com limitação de envio.

## Design e conteúdo

`src/sales/sales.css`: site público. `src/styles.css`: identidade compartilhada e telas operacionais. `src/lib/brand.ts`: dados centrais de contato. `src/lib/services.ts`: catálogo compartilhado com propostas.

O portfólio usa suas imagens existentes. A galeria possui computador/celular, navegação e fechamento por Escape. Não foi inventado um vídeo de demonstração: as imagens são usadas até existirem vídeos reais. As imagens e a quantidade de telas ficam no catálogo em `SalesLandingPage.tsx`. Textos e links dos três projetos podem ser alterados pelo painel.

## Build e publicação

```bash
npm run check
npm run build
npm run preview
```

Na Vercel: framework Vite, build `npm run build`, saída `dist`. Configure as seis variáveis de `.env.example`. O `vercel.json` preserva o fallback de rotas da SPA. O build não publica as regras do Firestore automaticamente.

Para aplicar ao repositório existente, copie os arquivos do ZIP sobre o checkout, preservando seu `.env` e seu diretório `.git`, rode `npm ci`, verifique e faça o commit. Não é necessário criar outro projeto Firebase.

## Testes de acesso

```bash
npm run test:rules
```

Requer Java e download do emulador Firestore na primeira execução. Usa o projeto **demo-pedrodev**, sem acessar dados reais. Os casos cobrem leitura privada, listagem de links, escalada de privilégios, administrador, decisão imutável, aceite e validação do briefing. Consulte `VALIDACAO.md` para o resultado desta entrega.

## Limites desta versão

Esta entrega conclui o redesign e amplia os módulos existentes, incluindo financeiro manual. Não implementa o escopo futuro de IA de mensagens, cofre de senhas, infraestrutura, cobranças recorrentes automáticas ou gateway de pagamento. Esses recursos exigem definições e integrações próprias; não há botões fingindo executá-los.

A ativação em produção depende das configurações acima e de uma verificação autenticada com seu Firebase. Sem as credenciais Web e a conta autorizada, não foi possível validar login/gravação no seu banco real.

## Histórico — revisão visual V2

Hero clara em duas colunas, foto com fundo removido e links visíveis de WhatsApp, LinkedIn, GitHub, Instagram e portfólio. O resumo editável do CMS é usado na página dedicada de portfólio; a apresentação da home é curta e fixa.

O HTML inclui uma abertura com marca antes do JavaScript. As páginas sob demanda usam uma tela de carregamento coerente e o painel mantém seu layout enquanto carrega o conteúdo. Fontes e ícones externos não bloqueiam mais a primeira renderização. Não há espera artificial para mostrar o conteúdo.

A foto recortada fica em `public/assets/perfil/pedro-recortado.png`; a versão de entrega ao navegador é `pedro-recortado.webp`. O original foi preservado. Mais detalhes em `AJUSTES_V2.md`.

No Windows, após instalar Node.js, também é possível abrir `INICIAR_LOCAL.bat` com dois cliques para instalar as dependências, se necessário, e abrir o site. O instalador `.bat` não foi executado neste ambiente Linux; os comandos `npm ci` e `npm run dev` são os mesmos usados pelo projeto.
