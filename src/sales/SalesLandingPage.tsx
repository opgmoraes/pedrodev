import { useEffect, useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const WHATS_NUMBER = '5561936182176'
const EMAIL = 'pedrogm.dev@gmail.com'
const INSTAGRAM_URL = 'https://www.instagram.com/pedrogm.dev/'

function waLink(message: string) {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`
}

// Revela a seção com um fade + leve subida quando ela entra na tela —
// dispara uma vez só (não fica escondendo/mostrando ao rolar pra cima e
// pra baixo) e respeita quem prefere menos movimento na tela.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

// Formas de luz borradas no fundo das seções — dão atmosfera e profundidade
// sem virar poluição visual. Ficam atrás de tudo (z-0), o conteúdo real
// sempre fica em z-10 por cima.
function Glow({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{ background: color, filter: 'blur(90px)', opacity: 0.35, ...style }}
    />
  )
}

// Paleta: creme/grafite alternados (nunca só escuro), com azul como
// única cor de destaque — usada com moderação em CTAs, ícones e nas
// palavras em itálico serifado dos títulos.
const CREME = '#EDEAE2'
const GRAFITE = '#15150F'
const CARD_CLARO = '#C7CCD6' // cinza-azulado neutro, equivalente ao "sage" do Jonas
const CARD_ESCURO = '#1D212B'
const AZUL = '#2F5DFF'

const SERVICOS = [
  {
    tag: 'Mais visto',
    titulo: 'Landing Page de Alta Conversão',
    dor: 'O link do anúncio cai num site genérico e o cliente some.',
    entrega: 'Página feita pra vender: rápida, direta, com WhatsApp em destaque.',
    bullets: [
      'Foco no que o cliente quer resolver, não em enfeite',
      'Rápida no celular — de lá vem a maioria das visitas',
      'Pronta pra usar em anúncio, bio ou cartão',
    ],
    prazo: 'Até 7 dias úteis',
    cta: 'Quero uma landing page',
  },
  {
    titulo: 'Sistema de Gestão Simples',
    dor: 'Planilha quebrando, pedido perdido no meio das conversas.',
    entrega: 'Sistema simples pra controlar clientes, pedidos ou agenda — só o essencial.',
    bullets: [
      'Sob medida pro seu processo, não um modelo genérico',
      'Interface simples, dá pra usar pelo celular',
      'É seu: acesso e dados exportáveis, sem refém',
    ],
    prazo: '2 a 4 semanas (após entender seu processo)',
    cta: 'Quero organizar minha gestão',
  },
  {
    titulo: 'Automação de Atendimento',
    dor: 'Demora pra responder faz o cliente desistir.',
    entrega: 'Assistente que responde no WhatsApp/site e já manda pra você só quem tá pronto pra fechar.',
    bullets: [
      'Responde dúvidas e horários sozinho, 24h',
      'Te avisa quando o cliente quer negociar',
      'Fala na linguagem do seu negócio',
    ],
    prazo: 'Até 10 dias úteis',
    cta: 'Quero automatizar meu atendimento',
  },
  {
    titulo: 'Site Profissional',
    dor: 'Negócio some no Google, ou o site parece de 2015.',
    entrega: 'Site institucional moderno, com o que gera confiança em quem te conhece agora.',
    bullets: [
      'Design com a cara do seu negócio',
      'Otimizado pra aparecer no Google',
      'Treinamento rápido pra ajustes simples sozinho',
    ],
    prazo: 'Até 14 dias úteis',
    cta: 'Quero um site profissional',
  },
]

const FAQ = [
  { p: 'Vai demorar muito?', r: 'Prazo combinado antes de começar, com aviso a cada etapa. Nada de sumir durante o projeto.' },
  { p: 'E se eu não souber explicar o que eu quero?', r: 'Normal. A primeira conversa é pra eu entender seu negócio — você não precisa chegar com briefing pronto.' },
  { p: 'Vai ser difícil de usar depois?', r: 'Não. Entrego com explicação simples e fico disponível pra dúvidas depois. Se você usa WhatsApp, consegue usar.' },
  { p: 'E se der problema depois da entrega?', r: 'Todo projeto sai com período de ajustes incluso — bug de funcionamento eu corrijo sem custo.' },
  { p: 'Como funciona o pagamento?', r: 'Entrada + parcela na entrega. Você só paga o restante com o resultado no ar e aprovado.' },
]

const COMO_FUNCIONA = [
  { n: '01', t: 'Conversa inicial', d: 'Me chama no WhatsApp e já te dou um direcionamento — sem formulário longo.' },
  { n: '02', t: 'Proposta clara', d: 'Escopo, prazo e valor por escrito antes de qualquer pagamento.' },
  { n: '03', t: 'Construção com você por perto', d: 'Mostro o andamento nas etapas principais, antes de virar retrabalho.' },
  { n: '04', t: 'Entrega + suporte', d: 'Tudo funcionando, com explicação de uso e período de ajustes garantido.' },
]

const PARA_QUEM = {
  sim: [
    'Pequenas empresas e profissionais autônomos que querem vender mais online',
    'Quem precisa de algo pronto em semanas, não em meses',
    'Quem quer um site ou sistema que é seu, sem depender de plataforma alheia',
  ],
  nao: [
    'Projetos gigantes com equipe própria de TI já definida',
    'Quem busca só o mais barato do mercado, sem se importar com qualidade',
    'Quem precisa de algo pronto ainda hoje',
  ],
}

function Crumb({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <p
      className="text-[11px] tracking-[0.2em] uppercase mb-4"
      style={{ color: dark ? 'rgba(237,234,226,0.45)' : 'rgba(21,21,15,0.45)' }}
    >
      {children}
    </p>
  )
}

export default function SalesLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="antialiased min-h-screen" style={{ background: CREME, color: GRAFITE }}>
      {/* NAV */}
      <nav
        className="fixed top-0 w-full z-[65] px-6 py-5 md:px-12 flex justify-between items-center backdrop-blur-md border-b"
        style={{ background: `${CREME}cc`, borderColor: 'rgba(21,21,15,0.1)' }}
      >
        <a href="#topo" className="text-sm font-semibold tracking-tight">
          Pedro Gomes <span style={{ color: AZUL }}>· tech</span>
        </a>
        <div className="text-xs tracking-widest uppercase space-x-8 hidden md:flex items-center" style={{ color: 'rgba(21,21,15,0.65)' }}>
          <a href="#servicos" className="hover:opacity-70 transition-opacity">Serviços</a>
          <a href="#como-funciona" className="hover:opacity-70 transition-opacity">Como funciona</a>
          <a href="#provas" className="hover:opacity-70 transition-opacity">O que já construí</a>
          <a href="#faq" className="hover:opacity-70 transition-opacity">Dúvidas</a>
          <a href="#contato" className="hover:opacity-70 transition-opacity">Contato</a>
          <Link to="/portifolio" className="hover:opacity-70 transition-opacity">Portfólio</Link>
          <a
            href={waLink('Olá Pedro, vim pelo site e quero saber mais sobre um projeto.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full font-semibold normal-case tracking-normal text-white hover:opacity-90 transition-opacity"
            style={{ background: GRAFITE }}
          >
            Falar no WhatsApp
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded relative z-[70]"
          style={{ color: GRAFITE, outlineColor: AZUL }}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 text-sm tracking-widest uppercase"
          style={{ background: CREME, color: GRAFITE }}
        >
          <a onClick={() => setMenuOpen(false)} href="#servicos">Serviços</a>
          <a onClick={() => setMenuOpen(false)} href="#como-funciona">Como funciona</a>
          <a onClick={() => setMenuOpen(false)} href="#provas">O que já construí</a>
          <a onClick={() => setMenuOpen(false)} href="#faq">Dúvidas</a>
          <a onClick={() => setMenuOpen(false)} href="#contato">Contato</a>
          <Link onClick={() => setMenuOpen(false)} to="/portifolio">Portfólio</Link>
        </div>
      )}

      {/* HERO — claro */}
      <section id="topo" className="relative overflow-hidden min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20">
        <Glow color={AZUL} style={{ width: 420, height: 420, top: '-10%', right: '-10%' }} />
        <Glow color="#D9A441" style={{ width: 320, height: 320, bottom: '-5%', left: '-8%', opacity: 0.18 }} />
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          <div className="mb-8 flex items-center justify-center gap-3 hero-fade-1">
            <span className="w-2 h-2 rounded-full" style={{ background: AZUL }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(21,21,15,0.55)' }}>
              Disponível para novos projetos
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.15] tracking-tight mb-6 hero-fade-2">
            Site, sistema ou atendimento{' '}
            <em className="font-serif" style={{ color: AZUL, fontStyle: 'italic' }}>travando</em> o seu negócio?
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl leading-relaxed font-light mb-12 hero-fade-3" style={{ color: 'rgba(21,21,15,0.65)' }}>
            Eu resolvo isso — sob medida, com prazo e valor definidos antes de começar.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 hero-fade-4">
            <a
              href={waLink('Olá Pedro, vim pelo site e quero entender como você pode ajudar meu negócio.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-white hover:opacity-90 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: AZUL, boxShadow: `0 16px 40px -12px ${AZUL}80`, outlineColor: AZUL }}
            >
              Conversar no WhatsApp agora
            </a>
            <a
              href="#servicos"
              className="px-8 py-4 rounded-full text-sm uppercase tracking-widest border hover:opacity-70 hover:border-[rgba(21,21,15,0.5)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ borderColor: 'rgba(21,21,15,0.3)', outlineColor: AZUL }}
            >
              Ver serviços
            </a>
          </div>
        </div>
      </section>

      {/* SERVIÇOS — escuro */}
      <section id="servicos" className="relative overflow-hidden py-28 px-6 md:px-12" style={{ background: GRAFITE, color: CREME }}>
        <Glow color={AZUL} style={{ width: 500, height: 500, top: '-15%', left: '50%', transform: 'translateX(-50%)', opacity: 0.15 }} />
        <Reveal className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <Crumb dark>o que eu faço</Crumb>
            <h2 className="text-3xl md:text-5xl font-medium mb-4">
              O que eu <em style={{ color: AZUL, fontStyle: 'italic' }} className="font-serif">resolvo</em> pra você
            </h2>
            <p className="text-lg font-light" style={{ color: 'rgba(237,234,226,0.6)' }}>
              Escolha o que está travando seu negócio agora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICOS.map((s) => (
              <div
                key={s.titulo}
                className="p-8 rounded-2xl border backdrop-blur-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(47,93,255,0.4)]"
                style={{
                  background: s.tag ? 'rgba(47,93,255,0.08)' : 'rgba(29,33,43,0.55)',
                  borderColor: s.tag ? `${AZUL}66` : 'rgba(237,234,226,0.1)',
                  boxShadow: s.tag
                    ? `inset 0 1px 0 rgba(237,234,226,0.08), 0 20px 45px -18px ${AZUL}55`
                    : 'inset 0 1px 0 rgba(237,234,226,0.08), 0 20px 40px -20px rgba(0,0,0,0.5)',
                }}
              >
                {s.tag && (
                  <span
                    className="self-start mb-4 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium border"
                    style={{ color: AZUL, borderColor: `${AZUL}55`, background: `${AZUL}1a` }}
                  >
                    {s.tag}
                  </span>
                )}
                <h3 className="text-2xl font-medium mb-3">{s.titulo}</h3>
                <p className="text-sm italic mb-4" style={{ color: 'rgba(237,234,226,0.45)' }}>{s.dor}</p>
                <p className="mb-6 leading-relaxed" style={{ color: 'rgba(237,234,226,0.85)' }}>{s.entrega}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm" style={{ color: 'rgba(237,234,226,0.65)' }}>
                      <span className="shrink-0" style={{ color: AZUL }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mb-4" style={{ color: 'rgba(237,234,226,0.4)' }}>{s.prazo}</p>
                <a
                  href={waLink(`Olá Pedro, tenho interesse em: ${s.titulo}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b pb-2 hover:opacity-70 transition-opacity self-start"
                  style={{ borderColor: 'rgba(237,234,226,0.3)' }}
                >
                  {s.cta} <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* COMO FUNCIONA — claro */}
      <section id="como-funciona" className="py-28 px-6 md:px-12">
        <Reveal className="max-w-6xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <Crumb>o processo</Crumb>
            <h2 className="text-3xl md:text-5xl font-medium mb-4">Como funciona</h2>
            <p className="text-lg font-light" style={{ color: 'rgba(21,21,15,0.6)' }}>Sem mistério, sem sumiço.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {COMO_FUNCIONA.map((step) => (
              <div key={step.n} className="transition-transform duration-300 hover:-translate-y-1">
                <span className="text-4xl font-medium font-serif italic" style={{ color: `${GRAFITE}33` }}>{step.n}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{step.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(21,21,15,0.6)' }}>{step.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PARA QUEM — cartões cinza-azulado sobre claro, como os cards "sage" do Jonas */}
      <section className="py-28 px-6 md:px-12" style={{ background: '#E3E0D6' }}>
        <Reveal className="max-w-4xl mx-auto w-full">
          <div className="mb-16 text-center">
            <Crumb>o encaixe</Crumb>
            <h2 className="text-3xl md:text-5xl font-medium mb-4">
              É <em style={{ color: AZUL, fontStyle: 'italic' }} className="font-serif">pra você</em> se...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl" style={{ background: CARD_CLARO }}>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#1a2e7a' }}>É pra você</h3>
              <ul className="space-y-3">
                {PARA_QUEM.sim.map((item) => (
                  <li key={item} className="flex gap-2 text-sm" style={{ color: '#20232b' }}>
                    <span className="shrink-0 font-semibold" style={{ color: AZUL }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border" style={{ borderColor: 'rgba(21,21,15,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'rgba(21,21,15,0.5)' }}>Não é pra você</h3>
              <ul className="space-y-3">
                {PARA_QUEM.nao.map((item) => (
                  <li key={item} className="flex gap-2 text-sm" style={{ color: 'rgba(21,21,15,0.55)' }}>
                    <span className="shrink-0" style={{ color: 'rgba(21,21,15,0.35)' }}>✕</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROVA — escuro */}
      <section id="provas" className="relative overflow-hidden py-28 px-6 md:px-12" style={{ background: GRAFITE, color: CREME }}>
        <Glow color="#D9A441" style={{ width: 380, height: 380, bottom: '-10%', right: '-10%', opacity: 0.12 }} />
        <Reveal className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <Crumb dark>construído do zero</Crumb>
            <h2 className="text-3xl md:text-5xl font-medium mb-4">O que eu já construí</h2>
            <p className="text-lg font-light" style={{ color: 'rgba(237,234,226,0.6)' }}>Plataformas completas, do zero ao ar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(47,93,255,0.35)]" style={{ background: 'rgba(29,33,43,0.55)', borderColor: 'rgba(237,234,226,0.1)', boxShadow: 'inset 0 1px 0 rgba(237,234,226,0.08)' }}>
              <h4 className="font-semibold mb-2">BITTO</h4>
              <p className="text-sm" style={{ color: 'rgba(237,234,226,0.6)' }}>Plataforma de estudos com IA — transforma qualquer material em flashcards, quizzes e resumos.</p>
            </div>
            <div className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(47,93,255,0.35)]" style={{ background: 'rgba(29,33,43,0.55)', borderColor: 'rgba(237,234,226,0.1)', boxShadow: 'inset 0 1px 0 rgba(237,234,226,0.08)' }}>
              <h4 className="font-semibold mb-2">CineGift</h4>
              <p className="text-sm" style={{ color: 'rgba(237,234,226,0.6)' }}>Experiência digital que transforma fotos e vídeos em um ingresso de cinema personalizado.</p>
            </div>
            <div className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(47,93,255,0.35)]" style={{ background: 'rgba(29,33,43,0.55)', borderColor: 'rgba(237,234,226,0.1)', boxShadow: 'inset 0 1px 0 rgba(237,234,226,0.08)' }}>
              <h4 className="font-semibold mb-2">Kont Hub</h4>
              <p className="text-sm" style={{ color: 'rgba(237,234,226,0.6)' }}>Sistema de gestão contábil: CRM, pipeline de tarefas, financeiro e cofre de documentos.</p>
            </div>
          </div>
          <p className="text-center text-sm mt-10" style={{ color: 'rgba(237,234,226,0.45)' }}>
            Quer ver a história completa por trás desses projetos?{' '}
            <Link to="/portifolio" className="underline hover:opacity-70 transition-opacity" style={{ color: CREME }}>Conheça meu portfólio</Link>
          </p>
        </Reveal>
      </section>

      {/* FAQ — claro */}
      <section id="faq" className="py-28 px-6 md:px-12">
        <Reveal className="max-w-3xl mx-auto w-full">
          <div className="mb-16 text-center">
            <Crumb>dúvidas</Crumb>
            <h2 className="text-3xl md:text-5xl font-medium mb-4">Perguntas que todo mundo faz</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.p}
                className="group rounded-xl border p-6"
                style={{ borderColor: 'rgba(21,21,15,0.15)', background: '#E3E0D6' }}
              >
                <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                  {item.p}
                  <span className="group-open:rotate-45 transition-transform text-xl" style={{ color: AZUL }}>+</span>
                </summary>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'rgba(21,21,15,0.65)' }}>{item.r}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA FINAL — escuro */}
      <section className="relative overflow-hidden py-28 px-6 md:px-12" style={{ background: GRAFITE, color: CREME }}>
        <Glow color={AZUL} style={{ width: 460, height: 460, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.22 }} />
        <Reveal className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6">
            Bora <em style={{ color: AZUL, fontStyle: 'italic' }} className="font-serif">resolver</em> isso?
          </h2>
          <p className="text-lg font-light mb-10" style={{ color: 'rgba(237,234,226,0.65)' }}>
            Me chama no WhatsApp e me conta o que está travando. Em minutos eu já te digo o melhor caminho.
          </p>
          <a
            href={waLink('Olá Pedro, vim pelo site e quero conversar sobre um projeto.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-white hover:opacity-90 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ background: AZUL, boxShadow: `0 20px 50px -15px ${AZUL}99` }}
          >
            Falar com Pedro agora <span>→</span>
          </a>
        </Reveal>
      </section>

      {/* CONTATO — claro */}
      <section id="contato" className="py-24 px-6 md:px-12">
        <Reveal className="max-w-3xl mx-auto w-full text-center">
          <Crumb>fale comigo</Crumb>
          <h2 className="text-2xl md:text-3xl font-medium mb-10">Outros jeitos de me encontrar</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink('Olá Pedro, vim pelo site e quero conversar sobre um projeto.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ borderColor: 'rgba(21,21,15,0.2)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.13.07.72-.17 1.4z" /></svg>
              WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ borderColor: 'rgba(21,21,15,0.2)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l9.75 6.75 9.75-6.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
              {EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ borderColor: 'rgba(21,21,15,0.2)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              @pedrogm.dev
            </a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER — claro */}
      <footer className="py-10 px-6 text-center">
        <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(21,21,15,0.4)' }}>© 2026 Pedro Gabriel Gomes</p>
        <p className="text-xs mt-2">
          <Link to="/portifolio" className="hover:opacity-70 transition-opacity underline" style={{ color: 'rgba(21,21,15,0.5)' }}>
            Ver portfólio completo
          </Link>
        </p>
      </footer>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href={waLink('Olá Pedro, vim pelo site e quero conversar sobre um projeto.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="whatsapp-pulse fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ background: AZUL }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.13.07.72-.17 1.4z" />
        </svg>
      </a>
    </div>
  )
}
