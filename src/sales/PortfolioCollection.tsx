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
  return <div className="studio portfolio-collection editorial-portfolio" ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <script id="public-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(publicSchema(true)).replace(/</g,'\\u003c')}} />
    <header className="collection-header">
      <Link to="/" className="collection-brand" aria-label="Pedro Gomes — página inicial">pg<span>.</span><small>Pedro Gomes</small></Link>
      <nav aria-label="Navegação do portfólio"><Link to="/">Página inicial</Link><a href="#projetos" aria-current="page">Portfólio</a><a className="studio-button" href={contactLink()} target="_blank" rel="noopener noreferrer">Vamos conversar <span aria-hidden="true"><ArrowIcon /></span></a></nav>
    </header>
    <main id="conteudo">
      <section className="collection-hero" id="topo" aria-labelledby="collection-title">
        <div className="collection-hero-copy">
          <p className="collection-kicker">Portfólio de Pedro Gomes</p>
          <h1 id="collection-title">Explore o que<br />eu construo.</h1>
        </div>
        <div className="collection-hero-aside">
          <p>Uma interface bonita é o começo. Entre nos projetos para ver como cada ideia funciona na prática.</p>
          <a href="#projetos">Escolha um projeto <ArrowIcon direction="down" /></a>
          <small>Projetos publicados, privados e conceituais.<br />Cada um identificado na galeria.</small>
        </div>
      </section>
      <ProjectShowcase portfolio cms={cms} />
      <section className="collection-contact" id="contato" data-reveal><div><p>Tem uma ideia em andamento?</p><h2>Vamos definir o próximo passo.</h2></div><div><p>Me conte o que seu negócio precisa apresentar, organizar ou simplificar. Eu retorno para entender o escopo e alinhar prazo e investimento.</p><a className="studio-button" href={contactLink("Olá Pedro, quero conversar sobre um projeto. Tenho uma ideia e gostaria de entender o escopo, prazo e investimento.")} target="_blank" rel="noopener noreferrer">Conversar sobre meu projeto <span aria-hidden="true"><ArrowIcon /></span></a><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></div></section>
    </main>
    <footer className="collection-footer"><span>© {new Date().getFullYear()} Pedro Gomes</span><Link to="/">Voltar à página inicial <ArrowIcon direction="left" /></Link><a href="#topo">Voltar ao topo <ArrowIcon direction="up" /></a></footer>
  </div>;
}
