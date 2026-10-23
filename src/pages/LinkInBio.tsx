import { Link } from "react-router-dom";
import { SocialIcon } from "../components/SocialLinks";
import { BRAND, contactLink } from "../lib/brand";
import { useSEO } from "../lib/seo";
import "./link-in-bio.css";

const networks = [
  { name: "Instagram", href: BRAND.instagram, detail: "Bastidores & ideias" },
  { name: "LinkedIn", href: BRAND.linkedin, detail: "Carreira & conexões" },
  { name: "GitHub", href: BRAND.github, detail: "Código & projetos" },
] as const;
const featured = [
  { name: "BITTO", detail: "Estudos com IA", image: "/assets/projetos/bitto/galeria/desktop-1.webp" },
  { name: "CineGift", detail: "Memórias em cena", image: "/assets/projetos/cinegift/publico-desktop.webp" },
];
function Arrow() { return <span aria-hidden="true" className="bio-arrow">↗</span>; }

export default function LinkInBio() {
  useSEO({
    title: "Pedro Gomes | Sites, sistemas e boas ideias",
    description: "Seu próximo projeto começa aqui. Conheça meu trabalho, peça um orçamento ou conecte-se comigo.",
    path: "/link",
  });
  return (
    <div className="bio-page">
      <div className="bio-shell">
        <header className="bio-topbar">
          <Link to="/" aria-label="Pedro Gomes — início" className="bio-wordmark">pedro<span>gm.</span></Link>
          <span className="bio-status"><i aria-hidden="true" />Dev & founder</span>
        </header>
        <main id="conteudo" className="bio-layout">
          <section className="bio-intro" aria-labelledby="bio-heading">
            <div className="bio-orbit" aria-hidden="true" />
            <div className="bio-intro-copy">
              <p className="bio-eyebrow">DESIGN COM INTENÇÃO. CÓDIGO COM PROPÓSITO.</p>
              <h1 id="bio-heading">Boas ideias<br />merecem <em>vida.</em></h1>
              <p className="bio-intro-description">Eu sou Pedro Gomes. Transformo ideias em sites e sistemas que fazem sentido para o seu negócio.</p>
            </div>
            <div className="bio-portrait">
              <span className="bio-portrait-glow" aria-hidden="true" />
              <img src={BRAND.cinematic} alt="Pedro Gomes com moletom preto e iluminação azul" width="1254" height="1254" fetchPriority="high" />
              <span className="bio-portrait-caption">Pedro Gomes <small>DESENVOLVEDOR WEB</small></span>
              <span className="bio-portrait-note" aria-hidden="true">do conceito<br />ao primeiro clique.</span>
            </div>
            <div className="bio-intro-bottom"><span>Sites · Sistemas · Automações</span><span>Feito por mim, para você.</span></div>
          </section>

          <div className="bio-destinations">
            <a className="bio-contact" href={contactLink("Olá Pedro, vim pela bio e quero conversar sobre meu projeto.")} target="_blank" rel="noopener noreferrer">
              <div className="bio-contact-top"><span className="bio-eyebrow">VAMOS CONSTRUIR ALGO?</span><SocialIcon name="WhatsApp" /></div>
              <h2>Seu próximo projeto<br />começa com um <em>oi.</em></h2>
              <div className="bio-contact-bottom"><span>Conversar no WhatsApp</span><Arrow /></div>
            </a>

            <section className="bio-work" aria-labelledby="bio-work-heading">
              <div className="bio-section-heading"><h2 id="bio-work-heading">Ideias que já ganharam forma</h2><span aria-hidden="true">01 / TRABALHOS</span></div>
              <Link to="/portifolio" className="bio-work-link" aria-label="Ver portfólio com BITTO, CineGift e outros projetos">
                <div className="bio-projects">
                  {featured.map(project => <div className="bio-project" key={project.name}>
                    <div className="bio-project-image"><img src={project.image} alt={`Interface do projeto ${project.name}`} width="1600" height="1000" loading="lazy" /></div>
                    <span>{project.name}<small>{project.detail}</small></span>
                  </div>)}
                </div>
                <div className="bio-work-bottom"><span>Explorar meu portfólio</span><Arrow /></div>
              </Link>
            </section>

            <nav className="bio-networks" aria-label="Minhas redes sociais">
              {networks.map(network => <a key={network.name} href={network.href} target="_blank" rel="noopener noreferrer"><SocialIcon name={network.name} /><span>{network.name}<small>{network.detail}</small></span><Arrow /></a>)}
            </nav>

            <div className="bio-secondary">
              <a href="/#recrutadores"><span className="bio-secondary-symbol" aria-hidden="true">↳</span><span>É recrutador?<small>Conheça meu perfil técnico</small></span><Arrow /></a>
              <a href="/#servicos"><span className="bio-secondary-symbol" aria-hidden="true">✳</span><span>Como posso ajudar<small>Conheça meus serviços</small></span><Arrow /></a>
            </div>
            <a className="bio-email" href={`mailto:${BRAND.email}`}><span>Prefere e-mail?</span>{BRAND.email}<Arrow /></a>
          </div>
        </main>
        <footer className="bio-footer"><Link to="/">pedrogm.com.br</Link><span>Design + código + um pouco de café.</span></footer>
      </div>
    </div>
  );
}
