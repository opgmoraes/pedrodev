import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/seo";
import { BRAND, contactLink } from "../lib/brand";
import { SERVICOS } from "../lib/services";
import SocialLinks from "../components/SocialLinks";
import type {
  PortfolioContent,
  PortfolioProject,
} from "../lib/portfolioContent";
import "./sales.css";
import CloudBridge from "./CloudBridge";
import RecruiterSection from "./RecruiterSection";
import ProjectShowcase from "./ProjectShowcase";
import { useStudioMotion } from "./useStudioMotion";

const steps = [
  ["Conversa", "Entendo seu negócio e o que você precisa resolver."],
  ["Proposta", "Escopo, prazo e investimento definidos antes de começar."],
  ["Direção visual", "Uma experiência alinhada à identidade da sua marca."],
  ["Desenvolvimento", "Seu projeto ganha forma, com acompanhamento próximo."],
  ["Revisão", "Você testa e aprova os ajustes combinados."],
  ["Entrega", "Projeto publicado, com seus arquivos, acessos e orientações."],
];
const faqs = [
  ["Qual é o prazo?", "Landing pages a partir de 7 dias úteis. O prazo final depende do escopo e dos materiais."],
  ["Como funciona o pagamento?", "Entrada e saldo na entrega, conforme a proposta aprovada."],
  ["Os arquivos e acessos ficam comigo?", "Sim. Você recebe os arquivos e acessos previstos no escopo, além do suporte combinado."],
];
const serviceCopy: Record<string, [string, string]> = {
  "landing-page": ["Landing pages", "Apresente sua oferta e leve visitantes ao WhatsApp."],
  "site-institucional": ["Sites institucionais", "Mostre seus serviços e facilite o primeiro contato."],
  "captacao-leads": ["Captação de leads", "Receba contatos e acompanhe cada oportunidade."],
  "sistemas-automacoes": ["Sistemas & automações", "Organize a operação e automatize tarefas repetitivas."],
};
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
                  filter: "blur(4px)",
                },
                { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
              ],
              {
                duration: 800,
                delay: Math.min(i * 80, 240),
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
  children = "Conversar sobre meu projeto",
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
      <span aria-hidden="true">↗</span>
    </a>
  );
}
export default function SalesLandingPage({
  portfolio = false,
}: {
  portfolio?: boolean;
}) {
  const studioRef = useRef<HTMLDivElement>(null);
  useStudioMotion(studioRef);
  const [menu, setMenu] = useState(false);
  const [content, setContent] = useState<Partial<PortfolioContent>>({});
  const [cms, setCms] = useState<PortfolioProject[]>([]);
  useSEO({
    title: portfolio
      ? "Projetos | Pedro Gomes"
      : "Pedro Gomes | Sites e sistemas com a sua identidade",
    description:
      "Sites, landing pages e sistemas web sob medida. Conheça projetos reais de Pedro Gomes e converse sobre o seu negócio.",
    path: portfolio ? "/portifolio" : "/",
  });
  useEffect(() => {
    import("../lib/portfolioContent")
      .then(({ getPortfolioContent }) => getPortfolioContent())
      .then((c) => {
        if (c) {
          setContent(c);
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
  return (
    <div className="studio" ref={studioRef}>
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
          <a href="#recrutadores" onClick={() => setMenu(false)}>
            Recrutadores
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
          WhatsApp <span>↗</span>
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
      <main id="conteudo">
        <section
          className={`studio-hero ${portfolio ? "is-portfolio" : ""}`}
          id="topo"
          data-motion-scene
        >
          <div className="hero-atmosphere" aria-hidden="true">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="hero-light-grid" />
          </div>
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">PEDRO GOMES · DESENVOLVEDOR WEB</p>
            <h1>
              {portfolio ? (
                <>
                  <span className="hero-line">
                    <span>Ideias que</span>
                  </span>
                  <span className="hero-line">
                    <span>ganharam</span>
                  </span>
                  <span className="hero-line">
                    <span>
                      <em>vida digital.</em>
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="hero-line">
                    <span>Seu próximo</span>
                  </span>
                  <span className="hero-line">
                    <span>nível começa</span>
                  </span>
                  <span className="hero-line">
                    <span>
                      <em>no digital.</em>
                    </span>
                  </span>
                </>
              )}
            </h1>
            <p className="studio-hero-description">
              {portfolio
                ? content.heroDescription ||
                  "Interfaces e produtos que saíram do papel."
                : "Apresente seu negócio, facilite o contato e organize sua rotina com sites e sistemas sob medida."}
            </p>
            <div className="studio-hero-actions">
              <CTA>{portfolio ? "Falar no WhatsApp" : "Conversar sobre meu projeto"}</CTA>
              {portfolio ? (
                <a href="#projetos" className="studio-outline-button">
                  Explorar projetos <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <Link to="/portifolio" className="studio-outline-button">
                  Ver meu portfólio <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
            <SocialLinks />
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
              alt="Pedro Gomes, desenvolvedor web, com iluminação azul"
              {...{ fetchpriority: "high" }}
              width="1254"
              height="1254"
            />
            <div className="portrait-foreground" aria-hidden="true" />
            <span className="portrait-signature">
              PEDRO GOMES <small>DESIGN + CODE</small>
            </span>
          </div>
          <div className="hero-bottom">
            <span>
              <i /> DISPONÍVEL PARA NOVOS PROJETOS
            </span>
            <a href="#projetos">
              Explore meu trabalho <span>↓</span>
            </a>
          </div>
        </section>
        <CloudBridge />
        <ProjectShowcase portfolio={portfolio} cms={cms} />
        <RecruiterSection />
        {!portfolio && (
          <section className="studio-solutions studio-section" id="servicos">
            <Reveal>
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">SERVIÇOS</p>
                  <h2>O que vamos <em>construir?</em></h2>
                </div>

              </div>
              <div className="studio-services">
                {SERVICOS.map((s, i) => (
                  <a
                    href={contactLink(
                      `Olá Pedro, tenho interesse em ${s.titulo}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={s.id}
                  >
                    <span className="studio-service-number">0{i + 1}</span>
                    <h3>{serviceCopy[s.id]?.[0] || s.titulo}</h3>
                    <p>{serviceCopy[s.id]?.[1] || s.descricao}</p>
                    <span className="studio-service-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </section>
        )}
        {!portfolio && (
          <section className="studio-process studio-section" id="processo">
            <Reveal>
              <div className="studio-section-heading">
                <div>
                  <p className="studio-eyebrow">COMO FUNCIONA · 6 ETAPAS</p>
                  <h2>Você acompanha.<br /><em>Do início à entrega.</em></h2>
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
        {!portfolio && (
          <section className="studio-faq studio-section" id="faq">
            <Reveal className="studio-split">
              <div>
                <p className="studio-eyebrow">FAQ</p>
                <h2>Dúvidas <em>rápidas.</em></h2>
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
            <h2>Vamos <em>conversar?</em></h2>
            <p className="studio-final-note">Conte sua ideia. Eu ajudo a definir o próximo passo.</p>
            <CTA>Conversar sobre meu projeto</CTA>
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
          <a href="#recrutadores">Recrutadores</a>
          <Link to="/login">Área interna</Link>
        </div>
        <a href="#topo">Voltar ao topo ↑</a>
      </footer>

    </div>
  );
}
