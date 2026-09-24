// Catálogo de serviços — fonte única de verdade usada em Orçamentos,
// Propostas públicas, PDFs e (futuramente) Kit de Entrega.
// Valores são só sugestão de faixa pra ajudar na hora de orçar; o admin
// sempre digita o valor final na hora de criar o orçamento.

export type ServiceItem = {
  id: string
  titulo: string
  publico: string
  descricao: string
  itens: string[]
  prazoSugeridoDias: number
  faixaValor: { min: number; max: number }
  precoInicialSugerido: number
}

export const SERVICOS: ServiceItem[] = [
  {
    id: 'landing-page',
    titulo: 'Landing Page',
    publico: 'Estética, barbearias, clínicas, dentistas, corretores, imobiliárias, academias, prestadores de serviço, infoprodutores etc.',
    descricao: 'Para negócios que precisam de uma página profissional para apresentar e captar clientes.',
    itens: [
      'Página responsiva',
      'CTA para WhatsApp',
      'Formulário',
      'Serviços/benefícios',
      'Depoimentos',
      'FAQ',
      'Localização',
      'SEO básico',
      'Google Analytics',
      'Pixel, se necessário',
      'Publicação do site',
    ],
    prazoSugeridoDias: 7,
    faixaValor: { min: 597, max: 997 },
    precoInicialSugerido: 797,
  },
  {
    id: 'site-institucional',
    titulo: 'Site Institucional',
    publico: 'Empresas que precisam de uma presença digital mais completa.',
    descricao: 'Presença digital completa: home, sobre, serviços e contato em um site institucional.',
    itens: [
      'Home',
      'Sobre a empresa',
      'Serviços',
      'Contato',
      'WhatsApp',
      'Localização',
      'Formulários',
      'SEO básico',
      'Responsividade',
      'Google Analytics',
      'Publicação',
      'Integrações necessárias',
    ],
    prazoSugeridoDias: 14,
    faixaValor: { min: 997, max: 1997 },
    precoInicialSugerido: 997,
  },
  {
    id: 'captacao-leads',
    titulo: 'Sistema de Captação de Leads',
    publico: 'Negócios que precisam transformar visitantes em contatos/clientes de forma organizada.',
    descricao: 'Solução focada em transformar visitantes em contatos/clientes, sem precisar da API oficial do WhatsApp.',
    itens: [
      'Landing page',
      'Formulário de captura',
      'CTA',
      'WhatsApp',
      'Captura e organização dos dados',
      'Página de obrigado',
      'Integração com e-mail',
      'Google Analytics',
      'Pixel',
      'Rastreamento básico',
    ],
    prazoSugeridoDias: 10,
    faixaValor: { min: 797, max: 1497 },
    precoInicialSugerido: 997,
  },
  {
    id: 'sistemas-automacoes',
    titulo: 'Sistemas Web e Automações',
    publico: 'Empresas que precisam automatizar processos internos.',
    descricao: 'Projetos personalizados: sistemas internos, dashboards, painéis administrativos, automações e integrações.',
    itens: [
      'Sistemas internos',
      'Dashboards',
      'Painéis administrativos',
      'Formulários inteligentes',
      'Cadastros',
      'Área de clientes',
      'Agendamentos',
      'Calculadoras',
      'Automações',
      'Integrações com APIs',
      'Integrações com IA',
    ],
    prazoSugeridoDias: 21,
    faixaValor: { min: 1497, max: 4997 },
    precoInicialSugerido: 1997,
  },
]

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICOS.find((s) => s.id === id)
}
