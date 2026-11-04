import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon';
import { contactLink, BRAND } from '../lib/brand';
import { publicSchema } from '../lib/publicContent';
import type { PortfolioProject } from '../lib/portfolioContent';
import ProjectShowcase from './ProjectShowcase';
import { useStudioMotion } from './useStudioMotion';
import { useRevealMotion } from '../lib/useRevealMotion';
import './collection.css';

export default function PortfolioCollection({ cms }: { cms: PortfolioProject[] }) {
  const root = useRef<HTMLDivElement>(null);
  useStudioMotion(root);
  useRevealMotion(root);
  return <div className="studio portfolio-collection" ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <script id="public-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(publicSchema(true)).replace(/</g,'\\u003c')}} />
    <header className="collection-header">
      <Link to="/" className="collection-brand" aria-label="Pedro Gomes — página inicial">pg<span>.</span><small>Pedro Gomes</small></Link>
      <nav aria-label="Navegação do portfólio"><Link to="/">Página inicial</Link><a href="#projetos" aria-current="page">Portfólio</a><Link to="/skills">Skills</Link><a className="studio-button" href={contactLink()} target="_blank" rel="noopener noreferrer">Vamos conversar <span aria-hidden="true"><ArrowIcon /></span></a></nav>
    </header>
    <main id="conteudo">
      <section className="collection-hero" id="topo" aria-labelledby="collection-title">
        <div className="collection-hero-copy" data-reveal>
          <p className="collection-kicker">DESIGN + DESENVOLVIMENTO WEB</p>
          <h1 id="collection-title">Sites e sistemas<br />para seu negócio.</h1>
          <p className="collection-hero-description">Transformo ideias em experiências digitais que apresentam sua oferta, organizam processos e ajudam o cliente a dar o próximo passo.</p>
          <div className="collection-hero-actions">
            <a className="studio-button" href="#projetos">Ver projetos em destaque <span aria-hidden="true"><ArrowIcon direction="down" /></span></a>
            <a className="collection-contact-link" href={contactLink()} target="_blank" rel="noopener noreferrer">Falar sobre meu projeto <ArrowIcon /></a>
          </div>
          <p className="collection-hero-services">Landing pages <i /> Sites institucionais <i /> Sistemas web</p>
        </div>
        <div className="collection-hero-media" data-motion-scene data-reveal aria-label="Prévia de um sistema web desenvolvido para a BITTO">
          <div className="collection-preview-desktop"><div className="collection-preview-bar"><span /><span /><span /><small>BITTO Sistema</small></div><img src="/assets/projetos/bitto/galeria/desktop-1.webp" alt="Tela do sistema BITTO" width="1400" height="900" fetchPriority="high" /></div>
          <div className="collection-preview-mobile"><img src="/assets/projetos/bitto/galeria/mobile-1.webp" alt="Versão mobile do sistema BITTO" width="390" height="844" loading="lazy" /></div>
          <span className="collection-preview-note">Produto em uso <span aria-hidden="true">↗</span></span>
        </div>
      </section>
      <section className="collection-intro" aria-label="Sobre os projetos">
        <div className="collection-intro-grid">
          <div><p className="collection-subtitle">Projetos publicados, internos e conceituais — com telas e decisões de cada um.</p></div>
          <div className="collection-intro-note"><p>Da plataforma de estudos BITTO à organização de jogos do Tal do Fut. Explore as telas, os recursos e as decisões por trás de cada projeto.</p></div>
        </div>
        <div className="collection-legend"><span>Design e desenvolvimento por Pedro Gomes</span><span>Interfaces desktop e mobile</span></div>
      </section>
      <ProjectShowcase portfolio cms={cms} />
      <section className="collection-contact" id="contato" data-reveal><div><p>Tem uma ideia em andamento?</p><h2>Vamos definir o próximo passo.</h2></div><div><p>Me conte o que seu negócio precisa apresentar, organizar ou simplificar. Eu retorno para entender o escopo e alinhar prazo e investimento.</p><a className="studio-button" href={contactLink("Olá Pedro, quero conversar sobre um projeto. Tenho uma ideia e gostaria de entender o escopo, prazo e investimento.")} target="_blank" rel="noopener noreferrer">Conversar sobre meu projeto <span aria-hidden="true"><ArrowIcon /></span></a><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></div></section>
    </main>
    <footer className="collection-footer"><span>© {new Date().getFullYear()} Pedro Gomes</span><Link to="/">Voltar à página inicial <ArrowIcon direction="left" /></Link><a href="#topo">Voltar ao topo <ArrowIcon direction="up" /></a></footer>
  </div>;
}
