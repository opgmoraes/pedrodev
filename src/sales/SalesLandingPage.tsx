import ArrowIcon from "../components/ArrowIcon";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/seo";
import { FAQS, publicSeo, publicSchema } from "../lib/publicContent";
import { BRAND, contactLink } from "../lib/brand";
import ServiceExplorer from "./ServiceExplorer";
import SocialLinks from "../components/SocialLinks";
import type {
  PortfolioProject,
} from "../lib/portfolioContent";
import "./sales.css";
import CloudBridge from "./CloudBridge";
import RecruiterSection from "./RecruiterSection";
import ProjectShowcase from "./ProjectShowcase";
import { useStudioMotion } from "./useStudioMotion";
import "./refresh.css";
import "./editorial.css";
import PortfolioCollection from "./PortfolioCollection";

const steps = [
  ["Conversa", "Entendo seu negócio e o que você precisa resolver."],
  ["Proposta", "Escopo, prazo e investimento definidos antes de começar."],
  ["Direção visual", "Uma experiência alinhada à identidade da sua marca."],
  ["Desenvolvimento", "Seu projeto ganha forma, com acompanhamento próximo."],
  ["Revisão", "Você testa e aprova os ajustes combinados."],
  ["Entrega", "Projeto publicado, com seus arquivos, acessos e orientações."],
];
const faqs = FAQS;
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const animations: Animation[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        if (preference.matches) return;
        const targets = Array.from(el.children) as HTMLElement[];
        for (const [i, target] of targets.entries()) {
          animations.push(
            target.animate(
              [
                {
                  opacity: 0.25,
                  transform: "translateY(26px)",

                },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 250,
                delay: Math.min(i * 40, 120),
                easing: "cubic-bezier(.16,1,.3,1)",
                fill: "backwards",
              },
            ),
          );
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    const stop = () => {
      if (preference.matches) animations.forEach((a) => a.finish());
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
function CTA({
  children = "Quero falar sobre meu projeto",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`studio-button ${className}`}
      href={contactLink()}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true"><ArrowIcon /></span>
    </a>
  );
}
export default function SalesLandingPage({
  portfolio = false,
}: {
  portfolio?: boolean;
}) {
  const studioRef = useRef<HTMLDivElement>(null);
  useStudioMotion(studioRef, !portfolio);
  const [menu, setMenu] = useState(false);
  const [cms, setCms] = useState<PortfolioProject[]>([]);
  useSEO(publicSeo(portfolio));
  useEffect(() => {
    import("../lib/portfolioContent")
      .then(({ getPortfolioContent }) => getPortfolioContent())
      .then((c) => {
        if (c) {
          if (c.projetos) setCms(c.projetos);
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);
  if (portfolio) return <PortfolioCollection cms={cms} />;
  return (
    <div className="studio editorial-site" ref={studioRef}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="studio-nav">
        <Link className="studio-brand" to="/" aria-label="Pedro Gomes — início">
          pg<span>.</span>
        </Link>
        <nav
          className={menu ? "studio-links is-open" : "studio-links"}
          aria-label="Navegação principal"
          id="studio-menu"
        >
          <Link to="/portifolio" onClick={() => setMenu(false)}>
            Portfólio
          </Link>
          <a
            href={portfolio ? "/#servicos" : "#servicos"}
            onClick={() => setMenu(false)}
          >
            Serviços
          </a>
          <a href={portfolio ? "/#processo" : "#processo"} onClick={() => setMenu(false)}>
            Como funciona
          </a>
          <a href="#contato" onClick={() => setMenu(false)}>
            Contato
          </a>
        </nav>
        <a
          className="studio-nav-contact"
          href={contactLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp <span><ArrowIcon /></span>
        </a>
        <button
          className="studio-menu"
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menu}
          aria-controls="studio-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "✕" : "☰"}
        </button>
      </header>
      <script id="public-schema" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(publicSchema(portfolio)).replace(/</g, "\\u003c")}} />
      <main id="conteudo">
        <section
          className={`studio-hero ${portfolio ? "is-portfolio" : ""}`}
          id="topo"
          data-motion-scene
        >
          <div className="hero-atmosphere" aria-hidden="true">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="hero-light-grid" /><div className="hero-orbit" />
          </div>
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">Pedro Gomes · Desenvolvimento web</p>
            <h1>Seu próximo cliente<br />precisa entender<br /><span>o seu valor.</span></h1>
            <p className="studio-hero-description">
              {portfolio
                ? "De uma landing page a uma plataforma completa. Explore interfaces, funcionalidades e decisões de projetos que desenvolvi."
                : "Sites que apresentam sua marca com clareza. Landing pages que conduzem ao contato. Sistemas que simplificam o trabalho. Do design ao código, eu construo com você."}
            </p>
            <div className="studio-hero-actions">
              <CTA>{portfolio ? "Falar no WhatsApp" : "Vamos criar seu site"}</CTA>
              {portfolio ? (
                <a href="#projetos" className="studio-outline-button">
                  Explorar projetos <span aria-hidden="true"><ArrowIcon direction="down" /></span>
                </a>
              ) : (
                <Link to="/portifolio" className="studio-outline-button">
                  Explorar meu trabalho <span aria-hidden="true"><ArrowIcon /></span>
                </Link>
              )}
            </div>
            <p className="hero-assurance">Contato direto comigo. Escopo, prazo e investimento definidos antes de começar.</p>
            <div className="hero-delivery"><span>Design sob medida</span><span>Desktop e mobile</span><span>Pronto para publicar</span></div>
          </div>
          <div className="studio-portrait">
            <div className="portrait-aura" aria-hidden="true" />
            <img
              className="portrait-blur"
              src={BRAND.cinematic}
              alt=""
              aria-hidden="true"
              width="1254"
              height="1254"
            />
            <img
              className="portrait-main"
              src={BRAND.cinematic}
              alt="Pedro Gomes, desenvolvedor web em Luziânia, Goiás"
              {...{ fetchpriority: "high" }}
              width="1254"
              height="1254"
            />
            <div className="portrait-foreground" aria-hidden="true" />
            <div className="portrait-project"><img src="/assets/projetos/bitto/galeria/desktop-1.webp" alt="Prévia do sistema BITTO desenvolvido por Pedro" width="1400" height="900" /><span>Da interface ao produto funcionando.</span></div><span className="portrait-signature">
              Pedro Gomes<small>Design + desenvolvimento</small>
            </span>
          </div>
          <div className="hero-bottom">
            <span>
              <i /> Luziânia, GO · Atendimento online
            </span>
            <a href="#projetos">
              Veja o que eu desenvolvo <span><ArrowIcon direction="down" /></span>
            </a>
          </div>
        </section>
        <CloudBridge />
        <ProjectShowcase portfolio={portfolio} cms={cms} />

        {!portfolio && (
          <section className="studio-solutions studio-section" id="servicos">
            <Reveal>
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">SERVIÇOS</p>
                  <h2>Uma solução para<br /><em>o seu momento.</em></h2>
                  <p className="section-lead">Uma presença profissional para apresentar seu trabalho. Uma página para divulgar sua oferta. Ou um sistema para fazer a operação funcionar melhor.</p>
                </div>

              </div>
              <ServiceExplorer />
            </Reveal>
          </section>
        )}
        {!portfolio && (
          <section className="studio-process studio-section" id="processo">
            <Reveal>
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">COMO FUNCIONA · 6 ETAPAS</p>
                  <h2>Você sabe o que contrata.<br /><em>E acompanha a entrega.</em></h2>
                  <p className="section-lead">A proposta vem antes do desenvolvimento. Você aprova o escopo, entende o investimento e acompanha as etapas do seu projeto.</p>
                </div>

              </div>
              <ol className="studio-steps">
                {steps.map(([title, text], i) => (
                  <li key={title}>
                    <span>0{i + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>
        )}
        <RecruiterSection />
        {(
          <section className="studio-faq studio-section" id="faq">
            <Reveal className="studio-split">
              <div>
                <p className="studio-eyebrow">Antes de contratar</p>
                <h2>Uma boa decisão<br /><em>começa com clareza.</em></h2>
              </div>
              <div>
                {faqs.map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </section>
        )}
        <section className="studio-final studio-section" id="contato">
          <Reveal>
            <h2>Seu próximo projeto<br /><em>começa com uma conversa.</em></h2>
            <p className="studio-final-note">Me conte o que você quer apresentar, vender ou organizar. Eu te ajudo a definir a solução e preparo uma proposta com as entregas, o prazo e o investimento.</p>
            <CTA>Quero uma proposta para meu projeto</CTA>
            <SocialLinks className="social-links-contact" />
            <a className="studio-email" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
          </Reveal>
        </section>
      </main>
      <footer className="studio-footer">
        <Link className="studio-brand" to="/">
          pg<span>.</span>
        </Link>
        <span>© {new Date().getFullYear()} Pedro Gomes</span>
        <div>
          <Link to="/portifolio">Portfólio</Link>
          <a href="#recrutadores">Sobre mim</a>
          <Link to="/login">Área interna</Link>
        </div>
        <a href="#topo">Voltar ao topo <ArrowIcon direction="up" /></a>
      </footer>

    </div>
  );
}
