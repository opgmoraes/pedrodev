# Nuvens enviadas pelo usuário — V8

A imagem `vecteezy_clouds-transparent-background_53573690.png`, enviada pelo usuário, contém quatro nuvens diferentes com transparência. Os quatro recortes são definidos em `src/sales/cloudSprites.ts` e aplicados no navegador sobre os pixels da imagem original, convertida para WebP em `public/assets/visuals/nuvens-enviadas.webp`.

Cada nuvem tem posição e movimento próprios: 25, 21, 16 e 18 segundos, em direções alternadas. Uma camada de nuvens distantes distinta completa o horizonte, com parallax e névoa frontal. A preferência de movimento reduzido é respeitada e as animações pausam fora da tela.

Origem do arquivo: imagem fornecida pelo usuário; o nome original identifica Vecteezy. Nenhuma licença adicional foi atribuída ao arquivo.

## Aplicar atualização

Extraia o ZIP no mesmo local da pasta `pedrodev`, permitindo substituir os arquivos. Inclui as imagens necessárias e a correção da formação (ADS concluído, sem bacharelado em andamento).

## Verificações

Build de produção com TypeScript/Vite, inspeção visual em desktop e celular.
