# Prospecção — plano e decisões

**Objetivo:** executar o fluxo manual aprovado em `/admin/prospeccao`, sem publicar regras, fazer deploy ou push.
**Arquitetura:** React e Firebase existentes; coleção privada `prospects`, sem vínculo automático com clientes ou documentos públicos. Helpers tipados para validação, briefing e confirmação de contato; página usa os padrões do painel.

- [x] Testar regras (visitante, usuário comum e administrador), validação de URL/telefone, briefing e confirmação explícita.
- [x] Implementar modelo com empresa, nome/telefone/e-mail comercial, fontes em linhas, situação do site, diagnóstico, briefing, URL da demo, mensagem, status, próxima data de retorno e timestamps. Fontes persistidas como array; origem manual e versão do esquema permitem evolução posterior.
- [x] Implementar listagem, busca, cadastro e edição. Manter rascunho em falhas; impedir troca acidental de lead com alterações pendentes. Ações usam dados salvos. Contato é registrado somente por botão e confirmação, nunca pela abertura do WhatsApp ou seleção de status.
- [x] Integrar rota, menu, regras e emuladores opcionais de Auth/Firestore para teste isolado. O modo de emulador só funciona em desenvolvimento e usa projeto fictício.
- [x] Rodar testes, TypeScript, build e fluxo local automatizado; registrar resultados e instruções. Teste visual bloqueado pela expiração da autorização do Chrome.

## Revisão e decisões finais

Revisão independente identificou perda de rascunho na navegação SPA; corrigida com armazenamento em memória por UID, recuperação no retorno e teste de isolamento entre administradores. O helper de WhatsApp já existente confundia DDD 55 com país; corrigido com teste que reproduziu a falha. Java 8 do sistema não serve ao emulador: Java 17 portátil temporário usado sem mudar a instalação. Build exige execução fora do sandbox devido ao acesso do esbuild aos diretórios ancestrais; sem operações de deploy. Consulte `docs/prospeccao/README.md` para roteiro e limitações.

**Revisão:** URL apenas HTTP(S), telefone brasileiro com DDD, briefing incompleto, falha de permissão, perda de alterações e confirmação cancelada. Busca automática, Hermes, geração da demo e envio automático não fazem parte desta versão.

**Autorização:** implementação solicitada expressamente pelo usuário após a análise; executar no checkout atual, sem commits e sem operações remotas. Não é necessária nova aprovação de desenho.
