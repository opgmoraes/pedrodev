# Revisão V5 — moletom, retoque leve e ícones

## Alterações

- Moletom preto boxy, sem estampas, com mangas longas e capuz abaixado, usando as referências enviadas.
- Suavização leve das espinhas, com preservação de textura e identidade como orientação da edição.
- Iluminação azul/ciano e transparência mantidas.
- Retrato integrado ao site, apresentação, login e bio.
- Ícones oficiais de marca do conjunto Font Awesome Free Brands, com SVGs locais, cores herdadas e tamanhos consistentes. Importação somente dos quatro ícones utilizados.
- Área de interação e hover com superfície translúcida, borda e brilho. Em celular, redes da hero em duas colunas.
- Cinco camadas de nuvens e funcionalidades existentes preservadas.

## Imagem

Edição feita com a ferramenta integrada de imagens; a versão WebP é uma transcodificação para o navegador.

- PNG: `public/assets/perfil/pedro-moletom.png`.
- WebP utilizado: `public/assets/perfil/pedro-moletom.webp`.
- Fotos anteriores preservadas.

Prompt final:

> Use case: identity-preserve clothing edit. Image 1 is the EDIT TARGET: Pedro's transparent portrait. Images 2-5 are CLOTHING REFERENCES only, NOT background or pose references. Replace ONLY his navy short-sleeve T-shirt with a completely plain BLACK BOXY PULLOVER HOODIE inspired by image 2: heavyweight matte black cotton fleece, relaxed boxy cut, dropped shoulders, roomy long sleeves, no zipper, no drawstrings, no logos, no patches, no writing, subtle kangaroo pocket if visible. CRITICAL: the hood is DOWN, resting behind his neck and shoulders; his entire head, hair, ears and neck remain visible, not covered. Keep his original waist-up pose and framing and realistic body proportions, relaxed arms. Reproduce the existing cobalt-blue and cyan rim lighting along the hoodie shoulders and sleeves, black fabric still reads black with blue edge reflections and realistic folds. Very lightly retouch acne/isolated pimples on his face, especially cheeks and forehead, preserving natural pores, skin texture, beard, smile, teeth and EXACT facial features and recognizable identity. Do not change his smile, jaw, nose, eyes, eyebrows, hair, skin tone or face shape; no beauty filter, no waxy skin. High fidelity photographic edit, not illustration. Keep the background genuinely transparent alpha. No new background, objects, accessories or text.

## Ícones e licença

Componente: `src/components/SocialLinks.tsx`. Font Awesome Free Brands; licença incluída em `public/licenses/fontawesome-brands.txt`.

## Verificação

Build TypeScript/Vite aprovado. Foto e quatro ícones da hero conferidos no navegador. Sem alteração das regras de dados ou dos fluxos do sistema.

Após substituir a pasta, rode `npm install` para instalar a nova dependência de ícones. Preserve seu `.env`. Se usar `INICIAR_LOCAL.bat`, a instalação já acontece automaticamente quando não existe uma instalação do projeto.
