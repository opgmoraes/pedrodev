import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../components/ArrowIcon';
import { BRAND, contactLink } from '../lib/brand';
import { useSEO } from '../lib/seo';
import '../public/public.css';
import './link-in-bio.css';
import './link-refresh.css';

type IconName = 'site' | 'portfolio' | 'contact' | 'skills';
const cards: { title: string; note: string; href: string; icon: IconName }[] = [
  { title: 'Contato direto', note: 'Me conte sua ideia. Eu respondo pelo WhatsApp.', href: contactLink('Olá Pedro, vim pela página de links e quero conversar sobre um projeto.'), icon: 'contact' },
  { title: 'Meu site', note: 'Veja como trabalho e o que posso criar para seu negócio.', href: '/', icon: 'site' },
  { title: 'Portfólio', note: 'Abra os projetos e conheça os detalhes antes de me chamar.', href: '/portifolio', icon: 'portfolio' },
  { title: 'Skill Lab', note: 'Packs de skills para negócios, conteúdo e serviços.', href: '/skills', icon: 'skills' },
];

function CardIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    site: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></>,
    portfolio: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m6 16 4-4 3 2 4-5 2 2"/></>,
    contact: <><path d="M20 11.5a8 8 0 0 1-8 8 8.2 8.2 0 0 1-3.4-.7L4 20l1.2-4.6A8 8 0 1 1 20 11.5Z"/><path d="M9 9.5c.7 2.2 2.1 3.6 4.4 4.5l1.5-1"/></>,
    skills: <><path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5L10 13l-6.5-2L10 9Z"/><path d="m18 18 .6 1.4L20 20l-1.4.6L18 22l-.6-1.4L16 20l1.4-.6Z"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function LinkInBio() {
  useSEO({ title: 'Pedro Gomes | Links, projetos e contato', description: 'Meu site, portfólio, contato e Skill Lab em um só lugar.', path: '/link' });
  return <main className="bio-page"><div className="bio-glow" aria-hidden="true"/><div className="bio-shell">
    <header className="bio-hero"><span className="bio-eyebrow">PEDRO GOMES / DESENVOLVEDOR WEB</span><div className="bio-portrait"><img src={BRAND.cinematic} alt="Pedro Gomes" width="1254" height="1254"/></div><span className="bio-status">Disponível para novos projetos</span><h1>Pedro <em>Gomes.</em></h1><p>Crio sites e sistemas sob medida. Você fala direto comigo, do primeiro desenho até a publicação.</p><a className="bio-down" href="#vitrine" aria-label="Explorar links"><ArrowIcon direction="down"/></a></header>
    <nav id="vitrine" className="bio-vitrine" aria-label="Links principais">{cards.map(card => {
      const content = <><span className="bio-link-icon"><CardIcon name={card.icon}/></span><span className="bio-link-copy"><strong>{card.title}</strong><span>{card.note}</span></span><span className="bio-link-arrow"><ArrowIcon/></span></>;
      return card.href.startsWith('/') ? <Link to={card.href} className={`bio-link bio-link-${card.icon}`} key={card.icon}>{content}</Link> : <a href={card.href} target="_blank" rel="noopener noreferrer" className={`bio-link bio-link-${card.icon}`} key={card.icon}>{content}</a>;
    })}</nav>
    <footer className="bio-footer"><span>Design + desenvolvimento por Pedro Gomes.</span><span>Luziânia, GO · Atendimento online</span></footer>
  </div></main>;
}
