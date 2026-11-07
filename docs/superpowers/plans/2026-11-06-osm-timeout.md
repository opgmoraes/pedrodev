# Correção diagnosticada do timeout OSM

Pedido autorizado: reproduzir cidade/UF separadas e combinadas, localizar o atraso, restringir a consulta se necessário e preservar cadastro/importação. Sem deploy/mensagens ou mudança de provedor silenciosa.

Evidências antes de editar: endpoint local504 em30,3s (Auth126ms); localização municipal isolada200 em27,7s encontrou relação334525; consulta mínima429 em0,85s; resolução restrita e consulta de leads por área exata502 em0,8s com resposta explícita de capacidade esgotada. Logo há atraso na resolução e sobrecarga real da fonte, não um problema de login ou busca comprovadamente vazia.

- [x] Testar fases isoladas, cache por cidade/UF, equivalência dos formatos, ausência de município vs busca vazia, indisponibilidade remota vs deadline local.
- [x] Separar município e leads; resolver candidatos por nome antes do filtro estadual; usar ID da área municipal na busca de categorias; cache municipal limitado e sem cachear erros; não repetir automaticamente nem trocar de servidor para contornar limites.
- [x] Incluir fase/tempos/motivo seguros no diagnóstico HTTP, mantendo mensagens claras na interface.
- [x] Repetir requisições reais pelos dois formatos e salvar resultados/tempos separados de fixtures; rodar regressões e build.

Resultado:33 testes passaram e TypeScript/build concluídos. Revisão independente sem bloqueadores. Corrigido prazo experimental curto após verificar fila documentada de15s; orçamento final28/32s com80s no cliente. Ambas as buscas reais finais permaneceram bloqueadas na etapa municipal por deadline local28s, sem busca de empresas e sem interpretação como zero. Detalhes em docs/prospeccao/correcao-timeout-osm.md.
