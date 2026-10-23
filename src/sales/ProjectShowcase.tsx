import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../lib/portfolioContent';
import { PROJECTS, mergeProjectContent, safeProjectUrl } from '../lib/projectCatalog';
import './projects.css';

const accents = ['#7a9fff', '#ee968f', '#79b8b1', '#ce9ddc', '#c9b47a', '#a4c782', '#8caaed'];

export default function ProjectShowcase({portfolio, cms}: {portfolio:boolean; cms:PortfolioProject[]}) {
  const [selected,setSelected] = useState<string | null>(null);
  const [device,setDevice] = useState<'desktop'|'mobile'>('desktop');
  const [slide,setSlide] = useState(0);
  const [zoomed,setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const content = useMemo(() => mergeProjectContent(cms),[cms]);
  const active = PROJECTS.find(p => p.id === selected);
  const copy = content.find(p => p.id === selected);
  const screens = active?.screens.filter(s => s.device === device) || [];
  const visible = portfolio ? PROJECTS : PROJECTS.slice(0,3);

  useEffect(() => {
    if (window.location.hash !== '#projetos') return;
    const frame = requestAnimationFrame(() => document.getElementById('projetos')?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  },[portfolio]);
  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow='hidden';
    return () => {document.body.style.overflow=previous;};
  },[selected]);
  useEffect(() => {gallery.current?.scrollTo({top:0});},[slide,device,zoomed]);
  function close() {
    dialog.current?.close();
    setSelected(null);
    opener.current?.focus();
  }
  return <section className="studio-work studio-section project-showcase" data-layout={portfolio ? "portfolio" : "home"} id="projetos">
    <div className="studio-section-heading">
      <div><p className="studio-eyebrow">PORTFÓLIO · {portfolio ? '07 PROJETOS' : 'EM DESTAQUE'}</p>
        <h2>Ideias diferentes.<br/><em>Produtos de verdade.</em></h2>
      </div>
      <p>Explore as telas.<br/>Conheça o que está por trás.</p>
    </div>
    <div className="project-grid">
      {visible.map(p => {
        const index=PROJECTS.indexOf(p);
        const text=content.find(c=>c.id===p.id)!;
        return <article key={p.id} className="project-card" style={{'--project-accent':accents[index]} as CSSProperties}>
          <button className="project-cover" onClick={e=>{opener.current=e.currentTarget;setSlide(0);setZoomed(false);setDevice('desktop');setSelected(p.id);}} aria-label={`Explorar projeto ${text.title}`}>
            <div className="project-cover-label"><span>{String(index+1).padStart(2,'0')}</span><span aria-hidden="true">↗</span></div>
            <div className="project-window"><div className="project-window-bar" aria-hidden="true"><i/><i/><i/><span>{p.title}</span></div>
              <img src={p.screens[0].src} alt={`Tela real do projeto ${p.title}`} width="1400" height="900" loading="lazy" decoding="async"/>
            </div>
            <span className="project-cover-cta">Por dentro do projeto <span aria-hidden="true">↗</span></span>
          </button>
          <div className="project-card-info">
            <div className="project-card-heading"><h3>{text.title}</h3><span className="project-status" data-status={text.statusColor}>{text.statusText}</span></div>
            <p>{text.description}</p>
            <div className="project-tech" aria-label={`Tecnologias de ${p.title}`}>{p.tech.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
          </div>
        </article>;
      })}
    </div>
    {!portfolio && <div className="project-all"><span>Mais ideias, outras soluções.</span><Link className="studio-outline-button" to="/portifolio#projetos">Ver os 7 projetos <span aria-hidden="true">↗</span></Link></div>}
    <dialog ref={dialog} className="studio-dialog project-dialog" aria-labelledby="project-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{
      if ((e.target as HTMLElement).tagName === 'A') return;
      if(e.key==='ArrowRight'){e.preventDefault();setSlide(s=>Math.min(s+1,screens.length-1));}
      if(e.key==='ArrowLeft'){e.preventDefault();setSlide(s=>Math.max(s-1,0));}
    }}>
      {active && copy && <div className="project-detail">
        <header className="project-detail-header"><div><p className="studio-eyebrow">{active.category}</p><h2 id="project-title">{copy.title}</h2></div><button autoFocus className="project-close" onClick={close} aria-label="Fechar projeto">✕</button></header>
        <div className="project-detail-intro">
        <p className="project-detail-description">{copy.description}</p>
        <div className="project-detail-links">
          {safeProjectUrl(copy.link1Url) && <a href={safeProjectUrl(copy.link1Url)} target="_blank" rel="noopener noreferrer">{copy.link1Text || 'Visitar site'} <span aria-hidden="true">↗</span></a>}
          {safeProjectUrl(copy.link2Url) && <a href={safeProjectUrl(copy.link2Url)} target="_blank" rel="noopener noreferrer">{copy.link2Text || 'Ver código'} <span aria-hidden="true">↗</span></a>}
          <span>{copy.statusText}</span>
        </div>
        </div>
        <div className="project-media">
        <div className="project-screen-toolbar"><div className="project-device-switch" role="group" aria-label="Visualização das telas">
          {(['desktop','mobile'] as const).filter(d=>active.screens.some(s=>s.device===d)).map(d=><button key={d} aria-pressed={device===d} onClick={()=>{setDevice(d);setSlide(0);setZoomed(false);}}>{d==='desktop'?'Computador':'Celular'}</button>)}
        </div><span aria-live="polite">{screens[slide]?.label} · {slide+1}/{screens.length}</span></div>
        <button className="project-zoom" aria-pressed={zoomed} onClick={()=>setZoomed(z=>!z)}>{zoomed ? "Ajustar à janela" : "Ampliar imagem"} <span aria-hidden="true">⤢</span></button>
        <div className={`project-screen ${device}${zoomed ? " is-zoomed" : ""}`} ref={gallery}>
          <img key={screens[slide]?.src} src={screens[slide]?.src} alt={`${copy.title} — ${screens[slide]?.label}`} />
        </div>
        {screens.length>1 && <div className="project-screen-nav"><button aria-label="Tela anterior" disabled={slide===0} onClick={()=>setSlide(s=>s-1)}>← Anterior</button><div className="project-screen-dots">{screens.map((s,i)=><button key={s.src} aria-label={`Ver tela ${i+1}: ${s.label}`} aria-pressed={slide===i} onClick={()=>setSlide(i)}/>)}</div><button aria-label="Próxima tela" disabled={slide===screens.length-1} onClick={()=>setSlide(s=>s+1)}>Próxima →</button></div>}
        </div>
        <div className="project-detail-context">
        <div className="project-case"><div><h3>O desafio</h3><p>{active.challenge}</p></div><div><h3>A solução</h3><p>{active.solution}</p></div></div>
        <div className="project-detail-bottom"><div><h3>O que tem no projeto</h3><ul>{active.features.map(f=><li key={f}>{f}</li>)}</ul></div><div><h3>Tecnologias</h3><div className="project-tech">{active.tech.map(t=><span key={t}>{t}</span>)}</div></div></div>
        {copy.footnote && <p className="project-note">{copy.footnote}</p>}
        </div>
      </div>}
    </dialog>
  </section>;
}
