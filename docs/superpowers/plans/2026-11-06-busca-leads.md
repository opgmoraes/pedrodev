# Busca local de leads — plano

**Objetivo:** ampliar o fluxo autorizado em `/admin/prospeccao` com busca por nicho/cidade/limite, revisão e importação privada sem duplicação. Sem deploy, envio de mensagens ou alteração de contas externas.

**Decisões:** middleware apenas do servidor Vite local, Firebase ID token e consulta de administrador no servidor; chave `GOOGLE_PLACES_API_KEY` sem prefixo VITE. Fonte configurável `PROSPECT_SEARCH_PROVIDER=google-places|fixture`; nunca substituir fonte real por dados fictícios silenciosamente. Limite 1–20 por consulta. Adaptador Google Places Text Search (New) conforme documentação oficial. Fontes são evidência; website ausente em consulta concluída significa Site não localizado, evidência insuficiente significa Não verificado.

- [x] Testes primeiro: consulta, normalização, site desconhecido/ausente/presente, configuração ausente e autenticação do endpoint.
- [x] Implementar modelo compartilhado, middleware do servidor e resultados de teste identificados.
- [x] Importar seleções com transações Firestore e índice privado de identidades (provedor, telefone, empresa/cidade/fontes). Comparar cadastros legados sem os sobrescrever.
- [x] Adicionar formulário de busca, revisão editável e checkboxes; exibir fontes clicáveis, fonte de teste/real, resultados já cadastrados e resumo da importação.
- [x] Validar em emulador importação repetida/concorrente e preservação de campos existentes; testar endpoint HTTP local e build. Documentar variáveis, limites e testes realizados.

**Resultados:** 25 testes conjuntos passaram (6 modelo manual, 6 busca/adaptador, 10 regras/integração, 3 HTTP com Firebase Auth Emulator real). Primeira importação criou 2 e preservou 1; repetição criou 0 e pulou 3; duas importações concorrentes criaram 1. TypeScript cliente/servidor e build passaram. Revisão independente identificou ambiguidade entre situação revisada e observação original da fonte: ambas agora são identificadas e preservadas. Busca autenticada ao Google real não foi realizada; API de origem é simulada no teste do adaptador, fonte fixture é usada no HTTP e Firestore. Sem validação visual automatizada devido ao bloqueio anterior do Chrome. Cadastro manual concorrente ainda não participa do índice de importação, limitação documentada.

**Autorização:** pedido explícito de implementação. Reutilizar checkout atual, preservar o trabalho anterior não commitado, sem commits. Chaves reais não serão lidas nem expostas em saídas; configuração de exemplo contém apenas nomes de variáveis.
