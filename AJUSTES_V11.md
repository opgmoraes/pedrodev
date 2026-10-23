# V11 — Atmosfera das nuvens

Duas faixas de nuvens distintas foram tratadas com o gerador integrado (skill imagegen), usando as duas imagens fornecidas como referências de formas e composição. A textura e a iluminação foram unificadas. As quatro figuras recortadas individualmente deixaram de ser a composição principal; os arquivos anteriores permanecem no projeto.

## Assets ativos

- `public/assets/visuals/nuvens-atmosfera-esquerda.webp`
- `public/assets/visuals/nuvens-atmosfera-direita.webp`
- `public/assets/visuals/nuvem-isolada-enviada.webp` (plano de névoa distante)

Estilos da transição em `src/sales/clouds.css`. Movimento lateral em sentidos distintos, névoa frontal, profundidade ao rolar, pausa fora da tela e suporte a movimento reduzido. Frase mantida: “O próximo passo é construir.” Os seis passos e a copy da V10 são preservados.

## Aplicar

Extraia o ZIP no mesmo local da pasta `pedrodev` e permita substituir os arquivos. É uma atualização para o projeto já entregue. Inclui os novos assets e todos os arquivos necessários à transição.

## Verificação

Build TypeScript/Vite e inspeção visual no desktop e no celular. Sem rolagem lateral no celular.

## Prompts finais

### Plano 1

Edit the supplied cloud images into a SINGLE coherent premium atmospheric cloud BANK for a website transition. Use these as the cloud shapes and subject references, preserve recognizable large lobes but integrate them naturally. NOT a sheet of separate cutouts. Wide panoramic landscape image. Photorealistic water-vapor texture, actual aerial photography quality, soft physically realistic silver-white highlights, detailed subtle blue-gray internal shadows. A low continuous cloud sea covering the bottom 40 percent of canvas, with a slightly taller irregular mass on the left 25 percent, low near the center and right. TOP 55 percent genuinely transparent alpha, semitransparent fine wisps along the upper contours, lower edge opaque offwhite. Cohesive natural backlighting from upper center, no harsh outlines, no plastic or cotton-like smooth objects, no cartoon, no painted gradient clouds, no checkerboard, no text, no sky, no terrain. Fine texture must remain visible, no overexposure. This is one isolated LEFT/MIDDLE depth plane, not a completed webpage.

### Plano 2

Edit the supplied cloud images into a SINGLE coherent premium atmospheric cloud BANK for a website transition. Use these as cloud subject references but blend into one organic formation instead of separate cutouts. Wide panoramic landscape image. Photorealistic aerial water-vapor clouds, detailed translucent filaments, soft white highlights and nuanced pale cool-blue shadows, natural backlighting from upper center consistent across bank. A low rolling cloud sea covering the bottom 40 percent, with a large softly billowing mass on the RIGHT 25 percent descending to a lower asymmetric foreground toward left. Upper 55 percent genuinely transparent alpha and semitransparent soft cloud contours. Opaque offwhite cloud bottom touching canvas bottom. No harsh cutout edges, no plastic-looking 3D blobs, no cotton-like smooth objects, no separate puffs, no checkerboard, no text, no sky, no terrain, no blown-out white. Keep real fine cloud texture. This is one isolated RIGHT/FOREGROUND depth plane for parallax, distinct from left-dominant cloud shapes.

