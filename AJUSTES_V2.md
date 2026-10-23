# Revisão V2 — layout, foto e carregamento

## O que mudou

- Hero clara, em duas colunas, com título curto, foto recortada e botões de WhatsApp e portfólio.
- Removidos fundo luminoso, grade, texto lateral, etiqueta flutuante da foto e CTA fixo que repetia o contato.
- WhatsApp, LinkedIn, GitHub e Instagram em uma linha visível na hero e também na área de contato.
- Portfólio dedicado, com abertura própria, projetos, apresentação e contato, sem repetir serviços/processo/FAQ da página comercial.
- Nenhum texto começa escondido por animação ou aguardando IntersectionObserver.
- Abertura em HTML/CSS inline antes do React, sem barra de progresso fictícia ou tempo mínimo de espera.
- Carregamento de rotas com marca, texto de estado e esqueleto; o painel mantém seu layout quando uma página interna está sendo carregada.
- Firebase e proteção administrativa saíram do código inicial da home. No build medido, o bundle principal passou de aproximadamente 644 kB para 192 kB (cerca de 70% menor; os dados do Firebase são carregados separadamente).
- Fontes e ícones externos deixam de bloquear a renderização inicial. Durante o download, o site usa a fonte do sistema.
- Recursos operacionais, regras do Firebase, propostas, contratos e financeiro da versão anterior foram preservados.

## Imagem

Edição feita com a ferramenta integrada de imagens, sem uso de API/CLI de geração. A foto original foi preservada.

- Entrada: `public/assets/perfil/foto-perfil.jpg`.
- Recorte final em PNG: `public/assets/perfil/pedro-recortado.png`.
- Versão WebP com transparência, usada no site: `public/assets/perfil/pedro-recortado.webp`, aproximadamente 124 kB.
- A conversão para WebP mantém o recorte e reduz a transferência; não muda o enquadramento.

Prompt final utilizado:

> Use case: background-extraction. Edit target: the supplied photograph of Pedro, a smiling young man wearing a dark navy Agro Startup T-shirt. Create a clean photographic cutout for his professional developer website. Remove the entire blue wall and white shapes behind him; output actual transparent alpha background. Preserve his exact identity, face shape, smile, teeth, skin tone, hair texture, pose, body proportions and shirt including existing small printed logos; do not invent clothing or change facial features. Improve only exposure, neutral white balance, gentle sharpness and natural detail, keeping realistic skin texture. Clean accurate edges around curly hair, shoulders and arms, no white halo, no background glow, no added objects or text, no stylization, no excessive skin smoothing. Keep head and shoulders fully inside the frame and original waist-up framing. Deliver transparent PNG suitable for layering over a light neutral website background.

## Verificação

- Build de produção aprovado.
- Home inspecionada no navegador em desktop.
- Layouts em 390 e 768 px inspecionados, sem overflow horizontal.
- Menu mobile abre e apresenta os caminhos corretos.
- Botão “Ver meu portfólio” navega para a página com título próprio e quatro redes visíveis.
- A abertura em HTML foi observada durante o carregamento real da prévia.
- A imagem recortada carregou corretamente no navegador.
- As regras de segurança não mudaram nesta revisão. Os seis testes da versão anterior permanecem disponíveis.
- Não houve configuração ou teste no Firebase real nem publicação em produção.
