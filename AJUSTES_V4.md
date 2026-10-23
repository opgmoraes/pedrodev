# Revisão V4 — camiseta lisa e cinco camadas de nuvens

- Removidas todas as marcas do peito e das duas mangas na foto iluminada.
- Preservados o fundo transparente, a iluminação azul/ciano e o enquadramento.
- Nova foto integrada à hero, apresentação, login e bio.
- Nuvens ampliadas para cinco planos: distante, fundo, intermediário, frente e névoa próxima.
- Movimentos contínuos independentes de 16 a 43 segundos, com direções opostas, deslocamento vertical e variação suave de escala.
- Mantidos o parallax na rolagem, a pausa fora da área visível e o respeito a movimento reduzido.
- A mesma imagem de nuvens é reutilizada pelas cinco camadas, sem cinco downloads diferentes.

## Imagem final

Edição feita com a ferramenta integrada de imagens. A versão WebP é uma transcodificação para uso no site.

- PNG: `public/assets/perfil/pedro-camiseta-lisa.png`.
- WebP usado pelo navegador: `public/assets/perfil/pedro-camiseta-lisa.webp`.

Prompt final:

> Precise object edit of this supplied transparent photographic portrait. Remove ALL printed logos, writing, symbols and graphics from the navy blue T-shirt: the Agro Startup print on the chest AND the white marks on BOTH sleeves. Replace only those printed areas with matching plain navy fabric, preserving realistic fabric texture, wrinkles, folds, seams and the existing electric blue/cyan lighting and highlights. The finished shirt must be completely plain, no writing or logos anywhere. Preserve the man's face, smile, teeth, skin, hair, identity, pose, body, framing and all lighting exactly as in the input. Keep the real transparent alpha background. Do not add anything. Do not change the person or restyle the photograph.

## Verificação

Build TypeScript/Vite aprovado. Nova foto e transição inspecionadas no navegador. Confirmadas cinco camadas, com as cinco instâncias da imagem carregadas e cena visível. Não foram alteradas regras do banco ou fluxos operacionais.
