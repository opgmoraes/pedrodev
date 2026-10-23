# PedroDEV V19 — documentos e área do cliente

Esta versão mantém o acesso administrativo por `admins/{UID}`, como na V17.
Não usa a autorização por e-mail da V18.

## O que está implementado

- Área interna com clientes, projetos, propostas, contratos, briefing, financeiro e edição do portfólio.
- Propostas e contratos personalizados com cliente, empresa, entregas, valor e prazo.
- Condições de pagamento e combinados específicos preenchidos ao criar a proposta e reaproveitados no contrato.
- PDFs com identidade azul-marinho e azul, tipografia incorporada, paginação e referência do documento.
- Proposta e contrato online com o mesmo conteúdo do PDF e possibilidade de baixar o documento.
- Aprovação ou solicitação de ajustes da proposta; aceite do contrato mediante confirmação dos termos.
- Central de documentos na área de cada cliente, junto ao andamento e ao briefing.
- Link do cliente disponível na ficha interna para abrir, copiar ou enviar pelo WhatsApp.
- Briefing exportável em PDF, identificado pelo nome do cliente.

## Primeiro acesso

1. Mantenha as seis variáveis `VITE_FIREBASE_*` na Vercel, conforme `.env.example`.
2. Publique `firestore.rules` no Firestore.
3. Em Authentication, copie o UID da sua conta. No Firestore crie `admins/{esse UID}` com `name: "Pedro Gomes"` (string). Não use ID automático.
4. Publique este código na Vercel e entre em `/login`.
5. No dashboard, clique **Preparar links existentes** uma vez para reunir os documentos dos clientes já cadastrados. Isso preserva as decisões e os endereços anteriores.

## Fluxo de atendimento

1. Cadastre o cliente em **Clientes**. Novos endereços usam o nome da empresa ou do cliente seguido de um token aleatório completo; os links anteriores permanecem válidos.
2. Crie a proposta em **Orçamentos**, incluindo os itens, pagamento e combinados.
3. Compartilhe a proposta ou a área exclusiva do cliente.
4. Após a aprovação, vá a **Contratos** e clique **Gerar contrato**. O contrato recebe seu próprio link e aparece na área do cliente.
5. O cliente lê e registra o aceite. O painel consulta a decisão da versão pública.
6. Cadastre o projeto para acompanhamento e registre os recebimentos em **Financeiro**.

A opção “Minuta de contrato” no orçamento é somente uma exportação preliminar: ela não cria um contrato no banco e não tem link de aceite. Use a seção **Contratos** para o documento compartilhável.

## Validação e limites

- Build de produção e testes das regras no emulador Firebase.
- Fluxo integrado testado: criar cliente, publicar proposta, aprovar, criar contrato, aceitar e reunir documentos, sem expor telefone, e-mail ou anotações internas na central pública.
- Testes verificam bloqueio de alterações de preço/condições pelo visitante, listagem pública e reversão de decisões.
- PDFs renderizados e conferidos, incluindo quebra de conteúdo longo.
- Nenhum dado foi criado no seu Firebase real durante o desenvolvimento. Login e operação em produção ainda precisam ser conferidos após publicar as regras e cadastrar seu UID.
- Financeiro registra recebimentos manualmente; não é um checkout conectado a gateway.
- O aceite registra status e horário no Firestore; não há assinatura digital com certificado.
- Cada link dá acesso ao conteúdo do destinatário. Compartilhe-o com o respectivo cliente.

Os exemplos em `exemplos-documentos/` usam dados fictícios e servem para conferir a aparência. Os botões de PDF do sistema preenchem os dados reais dos seus cadastros.
