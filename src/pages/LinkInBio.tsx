import type { ReactNode } from 'react'
import { useSEO } from '../lib/seo'

const WHATS_NUMBER = '5561936182176'
const EMAIL = 'pedrogm.dev@gmail.com'
const AZUL = '#2F5DFF'
const GRAFITE = '#15150F'
const CREME = '#EDEAE2'

function waLink(message: string) {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`
}

type LinkItem = {
  href: string
  title: string
  subtitle: string
  icon: ReactNode
  external?: boolean
  highlight?: boolean
}

const LINKS: LinkItem[] = [
  {
    href: waLink('Olá Pedro, vim pelo link da bio e quero fazer um orçamento.'),
    title: 'Precisa de um site ou sistema?',
    subtitle: 'Fale comigo e receba um orçamento',
    external: true,
    highlight: true,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.13.07.72-.17 1.4z" />
      </svg>
    ),
  },
  {
    href: '/',
    title: 'Conheça meus serviços',
    subtitle: 'Landing pages, sistemas, automações e sites',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
  {
    href: '/portifolio',
    title: 'Veja meu portfólio',
    subtitle: 'Projetos que já construí do zero',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/pedrogm.dev/',
    title: 'Me siga no Instagram',
    subtitle: '@pedrogm.dev — bastidores e conteúdo',
    external: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/pedrogmdev',
    title: 'LinkedIn',
    subtitle: '/in/pedrogmdev',
    external: true,
    icon: <i className="devicon-linkedin-plain colored text-xl" />,
  },
  {
    href: `mailto:${EMAIL}`,
    title: 'E-mail',
    subtitle: EMAIL,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l9.75 6.75 9.75-6.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
]

export default function LinkInBio() {
  useSEO({
    title: 'Pedro Gomes | Dev e Founder em Luziânia (GO) — Links',
    description: 'Desenvolvedor sob medida pra pequenas empresas e profissionais autônomos em Luziânia (GO). Orçamento, portfólio e redes.',
    path: '/link',
  })
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center px-6 py-16" style={{ background: CREME, color: GRAFITE }}>
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 380, height: 380, top: '-12%', right: '-15%', background: AZUL, filter: 'blur(100px)', opacity: 0.22 }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, bottom: '-10%', left: '-12%', background: '#D9A441', filter: 'blur(90px)', opacity: 0.15 }}
      />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        <img
          src="/assets/perfil/foto-perfil.jpg"
          alt="Pedro Gabriel Gomes"
          className="w-24 h-24 rounded-full object-cover mb-5 border-4"
          style={{ borderColor: CREME, boxShadow: `0 0 0 3px ${AZUL}, 0 12px 30px -8px ${AZUL}66` }}
        />
        <h1 className="text-xl font-semibold mb-1">Pedro Gomes</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(21,21,15,0.6)' }}>
          Desenvolvedor sob medida pra pequenas empresas e profissionais autônomos
        </p>

        <div className="w-full flex flex-col gap-3">
          {LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-4 w-full p-4 rounded-2xl border backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={
                link.highlight
                  ? {
                      background: AZUL,
                      borderColor: AZUL,
                      color: '#fff',
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 20px 40px -15px ${AZUL}80`,
                      outlineColor: '#fff',
                    }
                  : {
                      background: 'rgba(21,21,15,0.82)',
                      borderColor: 'rgba(237,234,226,0.1)',
                      color: CREME,
                      boxShadow: 'inset 0 1px 0 rgba(237,234,226,0.08), 0 16px 32px -18px rgba(0,0,0,0.4)',
                      outlineColor: AZUL,
                    }
              }
            >
              <span
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: link.highlight ? 'rgba(255,255,255,0.2)' : 'rgba(237,234,226,0.08)' }}
              >
                {link.icon}
              </span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-semibold">{link.title}</span>
                <span className="block text-xs" style={{ opacity: 0.7 }}>{link.subtitle}</span>
              </span>
              <span className="text-sm" style={{ opacity: 0.5 }}>→</span>
            </a>
          ))}
        </div>

        <p className="text-[11px] mt-10 tracking-widest uppercase" style={{ color: 'rgba(21,21,15,0.35)' }}>
          pedrogm.com.br
        </p>
      </div>
    </div>
  )
}
