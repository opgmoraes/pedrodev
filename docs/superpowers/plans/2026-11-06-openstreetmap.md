# OpenStreetMap — piloto de barbearias

Implementar o pedido autorizado sobre o checkout atual sem sobrescrever alterações anteriores. Preservar Google Places e fixture. Sem deploy/push/publicação de regras ou envio de mensagens.

- [x] Testar primeiro: UF/cidade, nicho piloto, query Overpass limitada, normalização, ausência de site, atribuição, resultado vazio, indisponibilidade e timeout.
- [x] Adaptador exclusivo do servidor para Overpass público, sem chave. Restringir município por UF e limite 1–20. Identidades OSM incluem tipo/id. Não inferir ausência de site de campo não preenchido.
- [x] Reutilizar revisão/importação; mostrar UF, mensagem da fonte, atribuição e links; persistir atribuição no lead. Preservar autenticação admin e transações existentes.
- [x] Ajustar somente PROSPECT_SEARCH_PROVIDER no .env.local, preservando bytes das outras variáveis. Não imprimir segredos.
- [x] Validar emulador com registros OSM fictícios, preservar cadastro anterior e repetir importação sem duplicar. Testar endpoint autenticado local e tentar consulta pública real barbearias/Luziânia GO/5 separadamente.
- [x] Rodar TypeScript, build, testes e documentar resultados, arquivos e endereço local.

Revisão independente detectou diferença Google sem UF vs OSM com UF na identidade. Corrigida com teste que falhou antes e passou depois; comparação preserva UFs conhecidas distintas. Consulta real válida retornou timeout504, sem importação. A primeira chamada tinha codificação do terminal corrompida; foi refeita pelo script UTF-8. Testes fictícios31/31, incluindo preservação de telefone incompleto sem inventar DDD. Detalhes em docs/prospeccao/openstreetmap-piloto.md.

Decisões: Overpass público padrão https://overpass-api.de/api/interpreter, uma consulta delimitada com timeout e sem retentativas automáticas. Consulta vazia não significa ausência de empresas. Não importar resultados reais sem revisão do usuário. Fonte OSM preserva atribuição © OpenStreetMap contributors com link de licença.
