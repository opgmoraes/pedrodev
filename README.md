# Sistema Operacional — MVP (V1) — Firebase + portfólio real integrado

O portfólio que você me mandou (`pedrodev.zip`) agora faz parte do
sistema de verdade — não é mais um site estático separado por fora.
As rotas `/`, `/trilha` e `/startup` são componentes React
(`src/portfolio/PortfolioHome.tsx`, `PortfolioTrilha.tsx`,
`PortfolioStartup.tsx`) que renderizam o HTML real do seu site, com o
CSS original (`src/portfolio/portfolio.css`) e toda a interatividade
original portada pra um hook React
(`src/portfolio/usePortfolioEffects.ts` — navbar ao rolar, menu mobile,
glow do cursor, scroll reveal, slider de projetos, copiar e-mail).

Tailwind (via CDN), Google Fonts (Inter + PT Serif) e os ícones Devicon
foram adicionados no `index.html` do projeto — é o que faz as classes
utilitárias do seu HTML original continuarem funcionando dentro do
React.

As imagens do portfólio (`assets/perfil`, `assets/projetos`,
`assets/trilha`) foram copiadas pra `public/assets/` — o Vite serve
essa pasta direto na raiz do domínio, então os caminhos `/assets/...`
funcionam igual em dev e em produção.

## O que já funciona
- `/`, `/trilha`, `/startup` → seu portfólio real, dentro do React
- Login admin via Firebase Auth, protegendo tudo em `/admin/*`
- CRUD de clientes (CPF/CNPJ, endereço, contato secundário, histórico
  editável em `/admin/clientes/:id`)
- CRUD de projetos com status e vínculo a cliente
- Orçamentos, com **PDF de proposta e contrato** (jsPDF)
- **WhatsApp** (`wa.me` pré-preenchido) em Clientes e Orçamentos
- Área do cliente pública por slug, com timeline e formulário de briefing
- `firestore.rules` restringindo listagem completa das coleções sem login

## O que ainda não foi feito
- O admin (`/admin/*`) e o `/login` ainda usam um design system
  provisório meu (cores/tipografia diferentes do seu portfólio). Dá pra
  unificar depois usando as mesmas cores (`#0a0a0a`, Inter + PT Serif)
  — é só avisar que eu faço.
- IA de mensagens, financeiro/parcelas, cofre de credenciais,
  infraestrutura, recorrências, integração Cakto — ficam pra V2/V3.

---

## O que fazer por fora (passo a passo)

### 1. Criar o projeto no Firebase
1. console.firebase.google.com → Adicionar projeto.
2. Em **Build → Authentication**, ative "E-mail/senha" e cadastre seu
   usuário admin manualmente (Users → Add user).
3. Em **Build → Firestore Database**, crie o banco (modo produção).
4. Em **Project Settings → General → Seus apps → Web**, copie o
   `firebaseConfig`.

### 2. Variáveis de ambiente
Copie `.env.example` para `.env` e preencha com os valores do passo 1.4.

### 3. Publicar as regras de segurança
Firebase Console → Firestore Database → Regras → cole o conteúdo de
`firestore.rules` → Publicar.

### 4. Rodar localmente
```
npm install
npm run dev
```
Agora `localhost:5173/` já mostra o portfólio real, `/trilha` e
`/startup` também.

### 5. GitHub + Vercel
```
git init && git add . && git commit -m "MVP V1 com portfólio real integrado"
```
Push pro GitHub, importe na Vercel (build padrão, sem configuração
especial — voltou a ser o `vite build` normal). Adicione as 6 variáveis
`VITE_FIREBASE_...` em Environment Variables.

### 6. Domínio próprio
Depois do deploy, configure em Vercel → Settings → Domains.

## Sobre a segurança (recapitulando)
- A config do Firebase Web não é secreta — quem protege de fato são as
  `firestore.rules`, publicadas no passo 3.
- A regra de `clients`/`projects` impede listar a coleção inteira sem
  login; teste isso antes de usar com cliente real.
- Nada de Admin SDK/service key roda no navegador aqui.

---

Quer que eu já unifique o visual do admin com a identidade do seu
portfólio agora, ou prefere testar esse fluxo primeiro?
