import { useState } from 'react'
import { Link } from 'react-router-dom'

const WHATS_NUMBER = '5561993359477'

function waLink(message: string) {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`
}

const SERVICOS = [
  {
    tag: 'Mais visto',
    titulo: 'Landing Page de Alta Conversão',
    dor: 'Você anuncia, mas o link cai num site genérico e o cliente some.',
    entrega: 'Uma página feita pra vender: rápida, clara e com botão de WhatsApp em todo lugar.',
    bullets: [
      'Escrita focada no que seu cliente quer resolver — não em enfeite',
      'Carrega rápido no celular (é de lá que vêm 8 em cada 10 visitantes)',
      'Botão de WhatsApp e formulário prontos pra captar contato',
      'Você recebe o link pra usar em anúncio, bio do Instagram ou cartão',
    ],
    prazo: 'Entrega em até 7 dias úteis',
    cta: 'Quero uma landing page',
  },
  {
    titulo: 'Sistema de Gestão Simples',
    dor: 'Planilha quebrando, caderno de anotação, WhatsApp cheio de pedido perdido.',
    entrega: 'Um sistema simples pra controlar clientes, pedidos, estoque ou agenda — só o que você precisa, sem inchar.',
    bullets: [
      'Feito sob medida pro seu processo real, não um modelo pronto genérico',
      'Login separado pra você e sua equipe, cada um vê o que precisa',
      'Interface simples — quem usa celular no dia a dia consegue usar',
      'Você não fica refém: o sistema é seu, com acesso e dados exportáveis',
    ],
    prazo: 'Prazo combinado após entender seu processo (normalmente 2 a 4 semanas)',
    cta: 'Quero organizar minha gestão',
  },
  {
    titulo: 'Automação de Atendimento',
    dor: 'Você perde venda porque demora pra responder, ou gasta a manhã inteira respondendo a mesma pergunta.',
    entrega: 'Um assistente automático que responde no WhatsApp/site, qualifica o cliente e já manda pra você só quem está pronto pra fechar.',
    bullets: [
      'Responde dúvidas frequentes e horários sozinho, 24h por dia',
      'Encaminha pra você automaticamente quando o cliente quer negociar',
      'Reduz o "sumiço" de lead por demora na resposta',
      'Configurado com a linguagem do seu negócio, não uma IA genérica',
    ],
    prazo: 'Entrega em até 10 dias úteis',
    cta: 'Quero automatizar meu atendimento',
  },
  {
    titulo: 'Site Profissional',
    dor: 'Seu negócio não aparece no Google, ou o site atual parece de 2015.',
    entrega: 'Um site institucional moderno, com as informações que geram confiança pra quem está te conhecendo agora.',
    bullets: [
      'Design atual, com a cara do seu negócio — não um template genérico',
      'Otimizado pra aparecer em buscas no Google',
      'Página de contato, serviços e sobre já estruturadas pra converter',
      'Você recebe treinamento rápido pra fazer pequenos ajustes sozinho',
    ],
    prazo: 'Entrega em até 14 dias úteis',
    cta: 'Quero um site profissional',
  },
]

const FAQ = [
  {
    p: 'Vai demorar muito?',
    r: 'Cada serviço tem um prazo definido antes de começar (você vê o prazo de cada um acima) e eu te aviso em cada etapa — briefing, layout, desenvolvimento e entrega. Nada de "sumir" durante o projeto.',
  },
  {
    p: 'E se eu não souber explicar direito o que eu quero?',
    r: 'Normal, a maioria dos clientes chega assim. A primeira conversa é justamente pra eu entender seu negócio e traduzir isso em algo prático — você não precisa chegar com um briefing pronto.',
  },
  {
    p: 'Vai ser difícil de usar depois de pronto?',
    r: 'Não. Tudo é entregue com uma explicação simples de como usar no dia a dia, e fico disponível pra tirar dúvida depois da entrega. Se você usa WhatsApp e Instagram, consegue usar o que eu entrego.',
  },
  {
    p: 'E se der problema depois da entrega?',
    r: 'Todo projeto sai com um período de ajustes incluso após a entrega. Bug de funcionamento eu corrijo sem custo adicional dentro desse período.',
  },
  {
    p: 'Como funciona o pagamento?',
    r: 'Trabalho com entrada + parcela na entrega (a proporção varia por projeto). Você só paga o restante quando o resultado está no ar e aprovado por você.',
  },
  {
    p: 'Isso vai ficar bonito de verdade, ou vai parecer feito às pressas?',
    r: 'Você pode conferir produtos completos que eu já construí do zero na seção "O que eu já construí" abaixo — o padrão de acabamento é o mesmo em qualquer projeto, grande ou pequeno.',
  },
]

const COMO_FUNCIONA = [
  { n: '01', t: 'Conversa inicial', d: 'Você me chama no WhatsApp, me conta o que precisa e eu já te dou um direcionamento — sem enrolação, sem formulário de 20 perguntas.' },
  { n: '02', t: 'Proposta clara', d: 'Você recebe escopo, prazo e valor por escrito antes de qualquer pagamento. Sem letra miúda.' },
  { n: '03', t: 'Construção com você por perto', d: 'Te mostro o andamento nas etapas principais, pra ajustar antes de virar retrabalho.' },
  { n: '04', t: 'Entrega + suporte', d: 'Você recebe tudo funcionando, com explicação de uso e um período de ajustes garantido.' },
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

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.15] tracking-tight mb-8">
            Seu negócio perdendo clientes por um site ou atendimento que não convence?
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed font-light mb-12">
            Eu construo landing pages, sistemas de gestão, automações de atendimento e sites profissionais sob medida para pequenas empresas e profissionais liberais — sem enrolação técnica, com prazo e valor definidos antes de começar.
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
            <p className="text-gray-400 text-lg font-light">Quatro formas de fazer sua presença digital trabalhar a seu favor — escolha a que resolve o problema que está te atrapalhando agora.</p>
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
            <h2 className="text-3xl md:text-5xl font-medium mb-4">Como funciona, do início ao fim</h2>
            <p className="text-gray-400 text-lg font-light">Sem mistério: você sabe exatamente o que esperar em cada etapa.</p>
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

      {/* PROVA / O QUE JÁ CONSTRUÍ */}
      <section id="provas" className="py-28 px-6 md:px-12 bg-[#0d0d0d] border-t border-gray-900/70">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">O que eu já construí</h2>
            <p className="text-gray-400 text-lg font-light">
              Plataformas completas, do zero ao ar — a mesma qualidade e cuidado técnico que aplico em qualquer projeto, incluindo o seu.
            </p>
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
            Me chama no WhatsApp e me conta o que está travando seu negócio agora. Em poucos minutos eu já te digo o melhor caminho.
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
    </div>
  )
}
