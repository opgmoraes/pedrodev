# Projetos — V12

## O que mudou

- Sete projetos no portfólio, com filtros de educação, sistemas e experiências.
- Três destaques na home, com acesso à coleção completa.
- Galeria com computador/celular, navegação por teclado, tecnologias, desafio e solução.
- 35 telas reais otimizadas em WebP. Nenhuma interface foi inventada por IA.
- Editor administrativo ampliado para sete projetos, com IDs estáveis e compatibilidade com o documento antigo de três projetos.
- Links para os repositórios públicos enviados por Pedro; o link antigo de solicitação pelo WhatsApp é migrado quando corresponde ao padrão anterior.

## Fontes das imagens

As capturas públicas de Bagagem Dev, FormaMissal, BITTO, CineGift, KontHub e TaldoFut foram obtidas dos sites publicados em 22/10/2026. As telas adicionais de BITTO, CineGift e KontHub foram reaproveitadas dos arquivos reais já presentes no projeto; podem mostrar versões anteriores. PedroDEV foi capturado da versão local deste portfólio. As novas telas de celular de Bagagem Dev, FormaMissal, TaldoFut e PedroDEV foram renderizadas em uma janela de 390px por meio de iframe, preservando a interface real.

Não foi necessário entrar em contas, cadastrar dados ou fazer pagamentos. Telas internas não foram recapturadas por dependerem de autenticação. O status publicado indica que o site público respondeu, não uma auditoria de todos os fluxos comerciais.

## Catálogo e edição

O catálogo técnico e as imagens ficam em `src/lib/projectCatalog.ts`. Textos, status e links continuam editáveis em `/admin/portfolio`. O conteúdo salvo é combinado com os sete projetos padrão por ID; os três registros antigos sem ID são associados a BITTO, CineGift e KontHub na ordem original.

## Validação

- Build TypeScript + Vite.
- Cinco testes: integridade de catálogo/imagens, migração de três para sete projetos, reordenação por ID, atualização dos links antigos e bloqueio de URLs inseguras.
- Navegação no navegador: filtros 7/3/3/1, abertura de galerias, troca de tela, visualização mobile, Escape e retorno de foco ao card.
- Layout de celular conferido em 390px, sem rolagem horizontal.
- Salvamento real no Firestore não foi exercitado neste ambiente sem configuração Firebase. A integração existente foi preservada.

Execute `node --test tests/project-catalog.test.mjs` e `npm run build` para repetir as verificações.
