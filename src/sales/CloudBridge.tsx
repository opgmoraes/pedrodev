import ArrowIcon from "../components/ArrowIcon";
import "./clouds.css";

// Bancos diferentes, tratados a partir das referências enviadas pelo usuário.
const layers = [
  { name: "left", file: "nuvens-atmosfera-esquerda.webp", width: 1983, height: 793 },
  { name: "right", file: "nuvens-atmosfera-direita.webp", width: 1902, height: 827 },
];

export default function CloudBridge() {
  return (
    <section id="transicao" className="sky-bridge" aria-label="Conheça meus projetos" data-motion-scene>
      <div className="sky-caption">
        <p>Seu projeto começa com uma ideia.<br /><em>Veja onde as minhas chegaram.</em></p>
        <a href="#projetos" aria-label="Conhecer os projetos"><ArrowIcon direction="down" /></a>
      </div>
      <div className="sky-light" aria-hidden="true" />
      <div className="sky-banks" aria-hidden="true">
        <div className="sky-distant"><div className="sky-volume"><svg viewBox="77 499 1921 868" width="1921" height="868" focusable="false"><image href="/assets/visuals/nuvem-isolada-enviada.webp" width="2048" height="2048" /></svg></div></div>
        {layers.map(layer => (
          <div className={`sky-sheet sky-sheet-${layer.name}`} key={layer.name}>
            <div className="sky-cloud-motion"><img src={`/assets/visuals/${layer.file}`} width={layer.width} height={layer.height} alt="" loading="lazy" decoding="async" /></div>
          </div>
        ))}
      </div>
      <div className="sky-mist" aria-hidden="true" />
    </section>
  );
}
