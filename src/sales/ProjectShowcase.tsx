import ArrowIcon from "../components/ArrowIcon";
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../lib/portfolioContent';
import { PROJECTS, mergeProjectContent, safeProjectUrl } from '../lib/projectCatalog';
import './projects.css';

const accents = ['#7a9fff', '#ee968f', '#79b8b1', '#ce9ddc', '#c9b47a', '#a4c782', '#8caaed', '#9eaac7'];

export default function ProjectShowcase({portfolio, cms}: {portfolio:boolean; cms:PortfolioProject[]}) {
  const [selected,setSelected] = useState<string | null>(null);
  const [device,setDevice] = useState<'desktop'|'mobile'>('desktop');
  const [slide,setSlide] = useState(0);
  const [zoomed,setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const slideRef = useRef(0);
  slideRef.current = slide;
  const content = useMemo(() => mergeProjectContent(cms),[cms]);
  const active = PROJECTS.find(p => p.id === selected);
  const copy = content.find(p => p.id === selected);
  const screens = active?.screens.filter(s => s.device === device) || [];
  const featuredIds = ['bitto', 'taldofut', 'bagagemdev'];
  const visible = portfolio ? PROJECTS : featuredIds.flatMap(id => PROJECTS.filter(p => p.id === id));

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
  useEffect(() => {
    const track = gallery.current;
    if (!track || !selected) return;
    track.scrollTo({left:0, behavior:'instant' as ScrollBehavior});
    const resize = new ResizeObserver(() => {
      track.scrollTo({left:slideRef.current * track.clientWidth, behavior:'instant' as ScrollBehavior});
    });
    resize.observe(track);
    return () => resize.disconnect();
  },[selected,device]);
  function goToSlide(index:number, keyboard = false) {
    const track = gallery.current;
    if (!track) return;
    const next = Math.max(0, Math.min(index, screens.length - 1));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({left:next * track.clientWidth, behavior:keyboard || reduced ? 'instant' as ScrollBehavior : 'smooth'});
  }
  function close() {
    dialog.current?.close();
    setSelected(null);
    opener.current?.focus();
  }
  return <section className="studio-work studio-section project-showcase" data-layout={portfolio ? "portfolio" : "home"} id="projetos">
    <div className="studio-section-heading">
      <div><p className="studio-eyebrow">PORTFÓLIO · {portfolio ? `${PROJECTS.length} PROJETOS` : 'EM DESTAQUE'}</p>
        <h2>Projetos que mostram<br/><em>o que eu entrego.</em></h2>
      </div>
      <p>Abra um projeto e veja as telas, as funcionalidades e o problema que ele resolve.</p>
    </div>
    <div className="project-grid">
      {visible.map((p, position) => {
        const index=PROJECTS.indexOf(p);
        const text=content.find(c=>c.id===p.id)!;
        return <article key={p.id} id={`projeto-${p.id}`} className="project-card" style={{'--project-accent':accents[index]} as CSSProperties}>
          <button className="project-cover" onClick={e=>{opener.current=e.currentTarget;setSlide(0);setZoomed(false);setDevice(window.matchMedia('(max-width: 899px)').matches && p.screens.some(s=>s.device==='mobile') ? 'mobile' : 'desktop');setSelected(p.id);}} aria-label={`Explorar projeto ${text.title}`}>
            <div className="project-cover-label"><span>{String(position+1).padStart(2,'0')}</span><span aria-hidden="true"><ArrowIcon /></span></div>
            <div className={`project-window${p.cover ? " has-cover" : ""}`}><div className="project-window-bar" aria-hidden="true"><i/><i/><i/><span>{p.title}</span></div>
              <img src={p.cover || p.screens[0].src} alt={`Tela real do projeto ${p.title}`} width="1400" height="900" loading="lazy" decoding="async"/>
            </div>
            <span className="project-cover-cta">Explorar projeto <span aria-hidden="true"><ArrowIcon /></span></span>
          </button>
          <div className="project-card-info">
            <div className="project-card-heading"><h3>{text.title}</h3><span className="project-status" data-status={text.statusColor}>{text.statusText}</span></div>
            <p>{text.description}</p>
            <div className="project-tech" aria-label={`Tecnologias de ${p.title}`}>{p.tech.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
            {portfolio && <details className="project-case-summary">
              <summary>O que este projeto resolve</summary>
              <p><strong>O desafio.</strong> {p.challenge}</p>
              <p><strong>A solução.</strong> {p.solution}</p>
              <ul>{p.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
              {safeProjectUrl(p.url) && <a href={safeProjectUrl(p.url)} target="_blank" rel="noopener noreferrer">{p.id==='bitto' ? 'Acessar sistema publicado' : 'Visitar site publicado'} <ArrowIcon direction="right" /></a>}
            </details>}

          </div>
        </article>;
      })}
    </div>
    {!portfolio && <div className="project-all"><span>Seu projeto pode ser o próximo.</span><Link className="studio-outline-button" to="/portifolio#projetos">Ver os {PROJECTS.length} projetos <span aria-hidden="true"><ArrowIcon /></span></Link></div>}
    <dialog ref={dialog} className="studio-dialog project-dialog" aria-labelledby="project-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{
      if ((e.target as HTMLElement).tagName === 'A') return;
      if(e.key==='ArrowRight'){e.preventDefault();goToSlide(slide+1,true);}
      if(e.key==='ArrowLeft'){e.preventDefault();goToSlide(slide-1,true);}
    }}>
      {active && copy && <div className="project-detail">
        <header className="project-detail-header"><div><p className="studio-eyebrow">{active.category}</p><h2 id="project-title">{copy.title}</h2></div><button autoFocus className="project-close" onClick={close} aria-label="Fechar projeto">✕</button></header>
        <div className="project-detail-intro">
        <p className="project-detail-description">{copy.description}</p>
        <div className="project-detail-links">
          {safeProjectUrl(copy.link1Url) && <a href={safeProjectUrl(copy.link1Url)} target="_blank" rel="noopener noreferrer">{copy.link1Text || 'Visitar site'} <span aria-hidden="true"><ArrowIcon /></span></a>}
          <span>{copy.statusText}</span>
        </div>
        </div>
        <div className="project-media">
        <div className="project-screen-toolbar"><div className="project-device-switch" role="group" aria-label="Visualização das telas">
          {(['desktop','mobile'] as const).filter(d=>active.screens.some(s=>s.device===d)).map(d=><button key={d} aria-pressed={device===d} onClick={()=>{setDevice(d);setSlide(0);setZoomed(false);}}>{d==='desktop'?'Computador':'Celular'}</button>)}
        </div><span aria-live="polite">{screens[slide]?.label} · {slide+1}/{screens.length}</span></div>
        <button className="project-zoom" aria-pressed={zoomed} onClick={()=>setZoomed(z=>!z)}>{zoomed ? "Ajustar à janela" : "Ampliar imagem"} <span aria-hidden="true">⤢</span></button>
        <div className={`project-carousel ${device}${zoomed ? ' is-zoomed' : ''}`}>
          <div className="project-carousel-track" ref={gallery} role="region" aria-roledescription="carrossel" aria-label={`Telas de ${copy.title}`} tabIndex={0} onScroll={e=>{
            const track=e.currentTarget;
            if (track.clientWidth) setSlide(Math.max(0,Math.min(screens.length-1,Math.round(track.scrollLeft/track.clientWidth))));
          }}>
            {screens.map((screen,i)=><div className="project-carousel-slide" key={screen.src} role="group" aria-roledescription="slide" aria-label={`${i+1} de ${screens.length}: ${screen.label}`} aria-hidden={i!==slide}>
              <div className="project-screen"><img src={screen.src} alt={`${copy.title} — ${screen.label}`} loading={i===0 ? 'eager' : 'lazy'} decoding="async" draggable={false}/></div>
            </div>)}
          </div>
          {screens.length>1 && <>
            <button className="project-stage-arrow previous" aria-label="Tela anterior" disabled={slide===0} onClick={()=>goToSlide(slide-1)}><ArrowIcon direction="left"/></button>
            <button className="project-stage-arrow next" aria-label="Próxima tela" disabled={slide===screens.length-1} onClick={()=>goToSlide(slide+1)}><ArrowIcon direction="right"/></button>
          </>}
        </div>
        {screens.length>1 && <div className="project-screen-nav">
          <button className="project-desktop-nav" disabled={slide===0} onClick={()=>goToSlide(slide-1)}><ArrowIcon direction="left" /> Anterior</button>
          <div className="project-screen-dots">{screens.map((s,i)=><button key={s.src} aria-label={`Ver tela ${i+1}: ${s.label}`} aria-pressed={slide===i} onClick={()=>goToSlide(i)}/>)}</div>
          <button className="project-desktop-nav" disabled={slide===screens.length-1} onClick={()=>goToSlide(slide+1)}>Próximo <ArrowIcon direction="right" /></button>
        </div>}
        {screens.length>1 && <p className="project-swipe-hint">Deslize para explorar as telas <span aria-hidden="true">↔</span></p>}

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
