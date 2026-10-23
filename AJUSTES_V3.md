# Revisão V3 — direção cinematográfica

Versão atual: inspirada na referência fornecida pelo usuário, com azul elétrico, superfícies escuras, iluminação no retrato, profundidade e animação. A revisão V2 está preservada apenas como histórico.

## Direção visual

- Hero escura, com navegação em cápsula translúcida, título em três linhas e destaque azul em gradiente.
- Retrato reiluminado com azul/ciano nas bordas, centro do rosto natural e fundo transparente.
- Uma segunda camada do retrato com blur compõe a profundidade. O retrato principal permanece nítido.
- Luzes difusas e brilho ambiente; movimento sutil com o mouse no desktop.
- Entrada do título por máscara, desfoque e deslocamento. Foto e textos de apoio entram com tempos diferentes.
- Transição de nuvens reais em duas camadas: fundo desfocado e frente com textura. A rolagem desloca as camadas em velocidades diferentes; o fim dissolve na seção clara do portfólio.
- Projetos com respostas de perspectiva/elevação ao hover, serviços com superfícies iluminadas, etapas com detalhes azuis e contato com iluminação ambiente.
- Animação das seções ao entrar na tela, com Web Animations API e IntersectionObserver.
- WhatsApp, LinkedIn, GitHub, Instagram e portfólio preservados.

## Movimento e carregamento

- O conteúdo das seções não fica oculto permanentemente esperando imagens. As animações de entrada são aplicadas ao entrar na área visível; os títulos da hero têm animação CSS curta.
- O sistema mantém a abertura imediata em HTML e os módulos do Firebase separados da primeira renderização. A abertura recebeu o mesmo fundo escuro da hero.
- As animações contínuas da hero e das nuvens pausam quando as respectivas cenas saem da área visível.
- Eventos de rolagem agendam no máximo um frame de atualização; os deslocamentos são variáveis CSS, sem renderização React a cada movimento.
- `prefers-reduced-motion` desliga efeitos contínuos e parallax. As animações de seção respeitam a preferência e encerram o movimento se ela mudar.
- O código do painel, dados, regras de segurança e financeiro foi preservado.

## Arquivos das imagens

Edição e geração feitas com a ferramenta integrada de imagens; sem CLI/API de geração. As versões WebP são transcodificações dos PNGs finais, mantendo transparência e composição.

| Finalidade        | PNG de edição                             | Arquivo usado pelo navegador                                                         |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Retrato iluminado | `public/assets/perfil/pedro-luz-azul.png` | `public/assets/perfil/pedro-luz-azul.webp`, cerca de 167 kB                          |
| Camadas de nuvens | `public/assets/visuals/nuvens.png`        | `public/assets/visuals/nuvens.webp`, cerca de 242 kB, reutilizado pelas duas camadas |

As fotos originais e a edição neutra da V2 foram preservadas.

### Prompt do retrato

> Use case: lighting-weather / identity-preserve. Edit the supplied transparent photographic cutout of Pedro for a premium cinematic developer portfolio website, navy black and electric cobalt blue art direction. Preserve exact same person, facial geometry, smile, teeth, curly hair, pose, navy shirt, body proportions and original printed Agro Startup logos. Change only lighting and photographic color treatment: dramatic cobalt blue rim light along the right edge of hair, cheek, shoulder and arm; soft cyan rim on opposite side; subtle electric blue reflected light on the navy shirt; flattering realistic key light on the center of the face with natural warm brown skin texture, preserving recognizability. Punchy but tasteful editorial studio portrait, deep shadows and clear face, high quality detail, no plastic skin, no face beautification or cartoon. Waist-up cutout centered with complete hair silhouette. Genuine transparent alpha background. Do not add background, external halo shapes, fog, smoke, clouds, objects, glasses, accessories, lettering or watermark. Important: the lighting MUST be visible on the subject itself, especially a brilliant blue edge light on shoulders and hair, rather than merely leaving the original lighting unchanged.

### Prompt das nuvens

> Use case: compositing. Asset type: panoramic realistic cloud-bank overlay for a high-end web portfolio section transition. Generate ONLY a wide horizontal bank of photorealistic voluminous white and very pale cool blue cumulus clouds with soft atmospheric wisps, beautifully illuminated, dimensional, delicate photographic texture, not cotton balls or cartoon. Genuine transparent alpha around the clouds. Wide landscape canvas, about 3:2 aspect ratio. Clouds concentrated in the bottom two-thirds, irregular rounded peaks reaching toward the top; thick continuous cloudy base running fully across the lower edge and extending off the left and right edges so it can blend into a white website section. Upper third mostly transparent, generous transparent gaps between high wisps. A mix of low foreground mist and several taller cloud mounds, not a row of identical shapes. Soft cool blue shadows in cloud undersides, white highlights, subtle cobalt reflected light, suitable over a midnight navy/electric blue sky background created separately with CSS. No sky background, no horizon, no ground, no stars, no objects, no people, no text, no graphic effects. The clouds themselves should remain mostly white with refined pale blue shadows, not bright neon blue.

## Verificação

- Home desktop inspecionada no navegador, com retrato iluminado e fundo azul.
- Transição de nuvens inspecionada visualmente; valores de parallax alterados durante a rolagem foram observados no elemento.
- Visualizações em 390 e 768 px inspecionadas, sem overflow horizontal.
- Menu mobile abre; navegação ao portfólio funciona; galeria BITTO abre, muda para celular e avança para a tela 2/4.
- TypeScript e build de produção aprovados.
- A preferência de movimento reduzido foi revisada no código; não foi alterada a configuração do sistema do usuário.
- Sem deploy e sem teste no Firebase real, que ainda depende das configurações do proprietário.

Para executar no Windows: extraia o projeto e use `INICIAR_LOCAL.bat` com Node.js instalado. Preserve seu `.env` se já tiver preenchido.
