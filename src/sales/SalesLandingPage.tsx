import { useState } from 'react'
import { Link } from 'react-router-dom'

const WHATS_NUMBER = '5561936182176'

function waLink(message: string) {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`
}

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

const PARA_QUEM = {
  sim: [
    'Pequenas empresas e profissionais liberais que querem vender mais online',
    'Quem precisa de algo pronto em semanas, não em meses',
    'Quem quer um site ou sistema que é seu, sem depender de plataforma alheia',
  ],
  nao: [
    'Projetos gigantes com equipe própria de TI já definida',
    'Quem busca só o mais barato do mercado, sem se importar com qualidade',
    'Quem precisa de algo pronto ainda hoje',
  ],
}

const COMO_FUNCIONA = [
  { n: '01', t: 'Conversa inicial', d: 'Me chama no WhatsApp e já te dou um direcionamento — sem formulário longo.' },
  { n: '02', t: 'Proposta clara', d: 'Escopo, prazo e valor por escrito antes de qualquer pagamento.' },
  { n: '03', t: 'Construção com você por perto', d: 'Mostro o andamento nas etapas principais, antes de virar retrabalho.' },
  { n: '04', t: 'Entrega + suporte', d: 'Tudo funcionando, com explicação de uso e período de ajustes garantido.' },
]

export default function SalesLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-[#0a0a0a] text-gray-100 antialiased selection:bg-white selection:text-black min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-6 py-5 md:px-12 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-900">
        <a href="#topo" className="text-sm font-semibold tracking-widest uppercase">
          Pedro Gomes <span className="text-gray-500 font-normal">· dev</span>
        </a>
        <div className="text-xs tracking-widest uppercase text-gray-400 space-x-8 hidden md:flex items-center">
          <a href="#servicos" className="hover:text-white transition-colors">Serviços</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#provas" className="hover:text-white transition-colors">O que já construí</a>
          <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
          <Link to="/portifolio" className="hover:text-white transition-colors">Portfólio</Link>
          <a
            href={waLink('Olá Pedro, vim pelo site e quero saber mais sobre um projeto.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white text-black rounded-full font-semibold normal-case tracking-normal hover:bg-gray-200 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-sm tracking-widest uppercase text-gray-300">
          <a onClick={() => setMenuOpen(false)} href="#servicos">Serviços</a>
          <a onClick={() => setMenuOpen(false)} href="#como-funciona">Como funciona</a>
          <a onClick={() => setMenuOpen(false)} href="#provas">O que já construí</a>
          <a onClick={() => setMenuOpen(false)} href="#faq">Dúvidas</a>
          <Link onClick={() => setMenuOpen(false)} to="/portifolio">Portfólio</Link>
        </div>
      )}

      {/* HERO */}
      <section id="topo" className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-5xl mx-auto w-full text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs tracking-widest uppercase text-gray-400">Disponível para novos projetos</p>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.15] tracking-tight mb-6">
            Site, sistema ou atendimento travando o seu negócio?
          </h1>

          <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed font-light mb-12">
            Eu resolvo isso — sob medida, com prazo e valor definidos antes de começar.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a
              href={waLink('Olá Pedro, vim pelo site e quero entender como você pode ajudar meu negócio.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors"
            >
              Conversar no WhatsApp agora
            </a>
            <a
              href="#servicos"
              className="px-8 py-4 border border-gray-700 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Ver serviços e valores
            </a>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-28 px-6 md:px-12 bg-[#0d0d0d] border-t border-gray-900/70">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">O que eu resolvo pra você</h2>
            <p className="text-gray-400 text-lg font-light">Escolha o que está travando seu negócio agora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICOS.map((s) => (
              <div key={s.titulo} className="bg-[#121212] p-8 rounded-2xl border border-gray-800/60 hover:border-gray-700 transition-all flex flex-col">
                {s.tag && (
                  <span className="self-start mb-4 px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-full text-[10px] text-emerald-400 tracking-widest uppercase font-medium">
                    {s.tag}
                  </span>
                )}
                <h3 className="text-2xl font-medium mb-3">{s.titulo}</h3>
                <p className="text-sm text-gray-500 italic mb-4">{s.dor}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{s.entrega}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-400">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mb-4">{s.prazo}</p>
                <a
                  href={waLink(`Olá Pedro, tenho interesse em: ${s.titulo}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b border-gray-700 pb-2 hover:border-white transition-all self-start"
                >
                  {s.cta} <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-28 px-6 md:px-12 border-t border-gray-900/70">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">Como funciona</h2>
            <p className="text-gray-400 text-lg font-light">Sem mistério, sem sumiço.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {COMO_FUNCIONA.map((step) => (
              <div key={step.n} className="relative">
                <span className="text-gray-700 text-4xl font-medium serif-text">{step.n}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{step.t}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-28 px-6 md:px-12 bg-[#0d0d0d] border-t border-gray-900/70">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">É pra você se...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121212] p-8 rounded-2xl border border-emerald-500/20">
              <h3 className="text-emerald-400 text-sm uppercase tracking-widest font-semibold mb-4">É pra você</h3>
              <ul className="space-y-3">
                {PARA_QUEM.sim.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#121212] p-8 rounded-2xl border border-gray-800/60">
              <h3 className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-4">Não é pra você</h3>
              <ul className="space-y-3">
                {PARA_QUEM.nao.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-500">
                    <span className="text-gray-600 shrink-0">✕</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA / O QUE JÁ CONSTRUÍ */}
      <section id="provas" className="py-28 px-6 md:px-12 bg-[#0d0d0d] border-t border-gray-900/70">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">O que eu já construí</h2>
            <p className="text-gray-400 text-lg font-light">Plataformas completas, do zero ao ar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-gray-800/60">
              <h4 className="font-semibold mb-2">BITTO</h4>
              <p className="text-sm text-gray-400">Plataforma de estudos com IA — transforma qualquer material em flashcards, quizzes e resumos.</p>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-gray-800/60">
              <h4 className="font-semibold mb-2">CineGift</h4>
              <p className="text-sm text-gray-400">Experiência digital que transforma fotos e vídeos em um ingresso de cinema personalizado.</p>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-gray-800/60">
              <h4 className="font-semibold mb-2">Kont Hub</h4>
              <p className="text-sm text-gray-400">Sistema de gestão contábil: CRM, pipeline de tarefas, financeiro e cofre de documentos.</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-10">
            Quer ver a história completa por trás desses projetos?{' '}
            <Link to="/portifolio" className="underline hover:text-white transition-colors">Conheça meu portfólio</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-6 md:px-12 border-t border-gray-900/70">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">Perguntas que todo mundo faz</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.p} className="group bg-[#121212] rounded-xl border border-gray-800/60 p-6 open:border-gray-700">
                <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-100">
                  {item.p}
                  <span className="text-gray-500 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-4">{item.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 px-6 md:px-12 bg-[#0c0c0e] border-t border-gray-800/80">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6">Bora resolver isso?</h2>
          <p className="text-gray-400 text-lg font-light mb-10">
            Me chama no WhatsApp e me conta o que está travando. Em minutos eu já te digo o melhor caminho.
          </p>
          <a
            href={waLink('Olá Pedro, vim pelo site e quero conversar sobre um projeto.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors"
          >
            Falar com Pedro agora <span>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center border-t border-gray-900">
        <p className="text-xs text-gray-600 tracking-widest uppercase">© 2026 Pedro Gabriel Gomes</p>
        <p className="text-xs text-gray-600 mt-2">
          <Link to="/portifolio" className="hover:text-white transition-colors underline">Ver portfólio completo</Link>
        </p>
      </footer>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href={waLink('Olá Pedro, vim pelo site e quero conversar sobre um projeto.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-colors"
      >
        <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.13.07.72-.17 1.4z" />
        </svg>
      </a>
    </div>
  )
}
