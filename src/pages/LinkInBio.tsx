import ArrowIcon from "../components/ArrowIcon";
import { Link } from "react-router-dom";
import { SocialIcon } from "../components/SocialLinks";
import { BRAND, contactLink } from "../lib/brand";
import { useSEO } from "../lib/seo";
import "./link-in-bio.css";

const networks = [
  { name: "Instagram", href: BRAND.instagram },
  { name: "LinkedIn", href: BRAND.linkedin },
  { name: "GitHub", href: BRAND.github },
] as const;
function Arrow() { return <span aria-hidden="true" className="bio-arrow"><ArrowIcon /></span>; }

export default function LinkInBio() {
  useSEO({
    title: "Pedro Gomes | Links, projetos e contato",
    description: "Sites e sistemas para tirar sua ideia do papel. Conheça meu trabalho, converse sobre seu projeto e conecte-se comigo.",
    path: "/link",
  });
  return (
    <div className="bio-page">
      <div className="bio-shell">
        <header className="bio-topbar">
          <Link to="/" aria-label="Pedro Gomes — início" className="bio-wordmark">pedro <span>gm.</span></Link>
          <span className="bio-topbar-note">Sites · Sistemas · Automações</span>
          <Link to="/" aria-label="Conhecer meu site" className="bio-home-arrow"><Arrow /></Link>
        </header>
        <main className="bio-layout">
          <figure className="bio-photo-block">
            <div className="bio-photo">
              <img src="/assets/perfil/pedro-trabalhando-bio.webp" alt="Pedro Gomes trabalhando no computador" width="1000" height="1250" fetchPriority="high" />
            </div>
            <figcaption><span>Pedro Gomes</span><span>DESIGN + CÓDIGO</span></figcaption>
          </figure>
          <section className="bio-content" aria-labelledby="bio-heading">
            <p className="bio-greeting"><span aria-hidden="true" />DESENVOLVEDOR & FOUNDER</p>
            <h1 id="bio-heading"><span className="bio-heading-desktop">Design com intenção.<br />Código com <em>propósito.</em></span><span className="bio-heading-mobile">Pedro <em>Gomes</em></span></h1>
            <p className="bio-description">Sites e sistemas para tirar sua ideia do papel.</p>
            <a className="bio-contact" href={contactLink("Olá Pedro, vim pela bio e quero conversar sobre meu projeto.")} target="_blank" rel="noopener noreferrer"><SocialIcon name="WhatsApp" /><span>Conversar sobre meu projeto</span><Arrow /></a>
            <Link to="/portifolio" className="bio-portfolio"><span className="bio-code" aria-hidden="true">&lt;/&gt;</span><span><strong>Conheça meu trabalho</strong><small>Sites, sistemas e produtos digitais.</small></span><Arrow /></Link>
            <nav className="bio-secondary" aria-label="Serviços e perfil profissional">
              <a href="/#servicos"><span>Serviços & soluções</span><Arrow /></a>
              <a href="/#sobre"><span>Conheça quem desenvolve</span><Arrow /></a>
            </nav>
            <nav className="bio-networks" aria-label="Minhas redes sociais">
              {networks.map(network => <a key={network.name} href={network.href} target="_blank" rel="noopener noreferrer"><SocialIcon name={network.name} /><span>{network.name}</span></a>)}
            </nav>
            <a className="bio-email" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <p className="bio-mobile-footer">DESIGN + CÓDIGO. FEITO POR PEDRO.</p>
          </section>
        </main>
        <footer className="bio-footer"><Link to="/">pedrogm.com.br</Link><span>Pedro Gomes · Desenvolvedor web</span></footer>
      </div>
    </div>
  );
}
