import { Link } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon';
import { BRAND, contactLink } from '../lib/brand';
import { useSEO } from '../lib/seo';
import '../public/public.css';
import './link-in-bio.css';

const cards = [
  { title: 'Meu site', note: 'O que eu faço e como trabalho', href: '/', art: 'site', number: '01' },
  { title: 'Portfólio', note: 'Projetos para explorar por dentro', href: '/portifolio', art: 'portfolio', number: '02' },
  { title: 'Contato', note: 'Vamos conversar sobre sua ideia', href: contactLink('Olá Pedro, vim pela página de links e quero conversar sobre um projeto.'), art: 'contact', number: '03' },
  { title: 'Skills para IA', note: 'Packs para negócios, conteúdo e serviços', href: '/skills', art: 'skills', number: '04' },
] as const;

export default function LinkInBio() {
  useSEO({ title: 'Pedro Gomes | Links, projetos e contato', description: 'Meu site, portfólio, contato e packs de skills para IA em um só lugar.', path: '/link' });
  return <main className="bio-page"><div className="bio-glow" aria-hidden="true"/><div className="bio-shell">
    <header className="bio-hero"><span className="bio-eyebrow">PEDRO GOMES / DESENVOLVEDOR WEB</span><div className="bio-portrait"><img src={BRAND.cinematic} alt="Pedro Gomes" width="1254" height="1254"/></div><h1>Ideias que<br/><em>ganham forma.</em></h1><p>Sites e sistemas para negócios que querem aparecer com personalidade.</p><a className="bio-down" href="#vitrine" aria-label="Explorar links"><ArrowIcon direction="down"/></a></header>
    <section id="vitrine" className="bio-vitrine" aria-label="Links principais"><div className="bio-vitrine-head"><span>ESCOLHA SEU CAMINHO</span><span>01 — 04</span></div><nav>{cards.map(card => { const content = <><span className="bio-card-content"><small>{card.number} / PEDRO GOMES</small><strong>{card.title}</strong><span>{card.note}</span><span className="bio-card-action">Explorar <ArrowIcon/></span></span><span className={`bio-card-art ${card.art}`} aria-hidden="true">{card.art === 'site' ? <span>pg.</span> : card.art === 'portfolio' ? <img src="/assets/projetos/traco-norte/conceito/desktop/01-inicio-capa.webp" alt=""/> : card.art === 'skills' ? <><i/><i/><i/></> : <span>@</span>}</span></>; return card.href.startsWith('/') ? <Link to={card.href} className={`bio-card ${card.art}`} key={card.number}>{content}</Link> : <a href={card.href} target="_blank" rel="noopener noreferrer" className={`bio-card ${card.art}`} key={card.number}>{content}</a>})}</nav></section>
    <footer className="bio-footer"><span>Design + desenvolvimento por Pedro Gomes.</span><span>Luziânia, GO · Atendimento online</span></footer>
  </div></main>;
}
