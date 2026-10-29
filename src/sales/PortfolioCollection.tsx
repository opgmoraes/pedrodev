import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon';
import { contactLink, BRAND } from '../lib/brand';
import { publicSchema } from '../lib/publicContent';
import type { PortfolioProject } from '../lib/portfolioContent';
import ProjectShowcase from './ProjectShowcase';
import { useStudioMotion } from './useStudioMotion';
import './collection.css';

export default function PortfolioCollection({ cms }: { cms: PortfolioProject[] }) {
  const root = useRef<HTMLDivElement>(null);
  useStudioMotion(root);
  return <div className="studio portfolio-collection" ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <script id="public-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(publicSchema(true)).replace(/</g,'\\u003c')}} />
    <header className="collection-header">
      <Link to="/" className="collection-brand" aria-label="Pedro Gomes — página inicial">pg<span>.</span><small>Pedro Gomes</small></Link>
      <nav aria-label="Navegação do portfólio"><Link to="/">Página inicial</Link><a href="#projetos" aria-current="page">Portfólio</a><a href={contactLink()} target="_blank" rel="noopener noreferrer">Vamos conversar <ArrowIcon /></a></nav>
    </header>
    <main id="conteudo">
      <section className="collection-intro" id="topo" aria-labelledby="collection-title">
        <nav className="collection-breadcrumb" aria-label="Localização"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Portfólio</span></nav>
        <div className="collection-intro-grid">
          <div><h1 id="collection-title">Portfólio<span aria-hidden="true">.</span></h1><p className="collection-subtitle">Ideias que ganharam interface.</p></div>
          <div className="collection-intro-note"><p>Sites, plataformas e sistemas que desenvolvi. Entre em cada projeto para conhecer as telas, os recursos e o problema que ele resolve.</p><a href="#projetos">Encontre seu próximo ponto de partida <ArrowIcon direction="down" /></a></div>
        </div>
        <div className="collection-legend"><span>Design e desenvolvimento por Pedro Gomes</span><span>Interfaces desktop e mobile</span></div>
      </section>
      <ProjectShowcase portfolio cms={cms} />
      <section className="collection-contact" id="contato"><div><p>Gostou de algum caminho?</p><h2>Seu próximo projeto<br />pode começar aqui.</h2></div><div><p>Me conte o que você quer construir. Vamos conversar sobre uma solução para o seu negócio.</p><a href={contactLink()} target="_blank" rel="noopener noreferrer">Conversar sobre meu projeto <ArrowIcon /></a><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></div></section>
    </main>
    <footer className="collection-footer"><span>© {new Date().getFullYear()} Pedro Gomes</span><Link to="/">Voltar à página inicial <ArrowIcon direction="left" /></Link><a href="#topo">Voltar ao topo <ArrowIcon direction="up" /></a></footer>
  </div>;
}
