import type { PortfolioProject } from './portfolioContent';

export type ProjectScreen = { src: string; label: string; device: 'desktop' | 'mobile' };
export type ShowcaseProject = {
  id: string; title: string; category: string; group: 'Educação' | 'Sistemas' | 'Experiências';
  description: string; challenge: string; solution: string; tech: string[];
  features: string[]; url: string; status: string; cover?: string; screens: ProjectScreen[];
};
const publicScreen = (id: string, label = 'Página inicial'): ProjectScreen => ({src: `/assets/projetos/${id}/publico-desktop.webp`, label, device: 'desktop'});
const legacyScreens = (id: string, desktop: number, mobile: number): ProjectScreen[] => [
  ...Array.from({length: desktop}, (_, i) => ({src: `/assets/projetos/${id}/galeria/desktop-${i + 1}.webp`, label: `Interface · ${i + 1}`, device: 'desktop' as const})),
  ...Array.from({length: mobile}, (_, i) => ({src: `/assets/projetos/${id}/galeria/mobile-${i + 1}.webp`, label: `Versão mobile · ${i + 1}`, device: 'mobile' as const})),
];

export const PROJECTS: ShowcaseProject[] = [
  {
    id: 'bitto', title: 'BITTO Sistema', category: 'Plataforma de estudos com IA', group: 'Educação',
    description: 'Do material parado à prática: flashcards, quizzes e revisões com IA.',
    challenge: 'Transformar textos e PDFs em uma rotina de estudo mais ativa.',
    solution: 'Uma plataforma que reúne geração de materiais, prática e planejamento de estudos.',
    tech: ['JavaScript', 'Firebase', 'APIs de IA', 'Vercel'],
    features: ['Importação de PDFs', 'Flashcards e quizzes', 'Revisões e planner'],
    url: 'https://www.usebitto.com/pages/login.html', status: 'Publicado',
    screens: legacyScreens('bitto', 6, 4),
  },
  {
    id: 'bitto-landing', title: 'BITTO Landing Page', category: 'Landing page de produto', group: 'Educação',
    description: 'Uma apresentação da BITTO que conecta ferramentas de estudo, demonstrações e planos.',
    challenge: 'Explicar a proposta da plataforma e orientar o visitante até o primeiro uso.',
    solution: 'Uma landing page responsiva com demonstrações das ferramentas, planos e acesso à plataforma.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    features: ['Apresentação das ferramentas', 'Demonstrações do produto', 'Planos e chamadas para cadastro'],
    url: 'https://www.usebitto.com/', status: 'Publicado',
    cover: '/assets/projetos/bitto-landing/prints/capa.webp',
    screens: [{"src": "/assets/projetos/bitto-landing/prints/bitto_01_desktop_inicio.webp", "label": "Página inicial", "device": "desktop"}, {"src": "/assets/projetos/bitto-landing/prints/bitto_02_desktop_ferramentas.webp", "label": "Ferramentas", "device": "desktop"}, {"src": "/assets/projetos/bitto-landing/prints/bitto_03_desktop_planos.webp", "label": "Planos", "device": "desktop"}, {"src": "/assets/projetos/bitto-landing/prints/bitto_04_mobile_inicio.webp", "label": "Página inicial", "device": "mobile"}, {"src": "/assets/projetos/bitto-landing/prints/bitto_05_tablet_inicio.webp", "label": "Página inicial no tablet", "device": "desktop"}, {"src": "/assets/projetos/bitto-landing/prints/bitto_06_mobile_ferramentas.webp", "label": "Ferramentas", "device": "mobile"}],
  },
  {
    id: 'cinegift', title: 'CineGift', category: 'Presentes em formato de cinema', group: 'Experiências',
    description: 'Fotos, vídeos e mensagens viram uma sessão de cinema para presentear.',
    challenge: 'Dar uma experiência especial a memórias que normalmente ficam na galeria do celular.',
    solution: 'Um criador com prévia e temas visuais para montar e compartilhar uma surpresa digital.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Cloudflare R2'],
    features: ['Criador com prévia', 'Temas personalizados', 'Ingresso e sessão digital'],
    url: 'https://www.cinegift.com.br/', status: 'Publicado',
    cover: '/assets/projetos/cinegift/prints/capa.webp',
    screens: [{"src": "/assets/projetos/cinegift/prints/cinegift_01_desktop_inicio.webp", "label": "Página inicial", "device": "desktop"}, ...legacyScreens('cinegift', 3, 3)],
  },
  {
    id: 'konthub', title: 'KontHub', category: 'Gestão para escritórios contábeis', group: 'Sistemas',
    description: 'Clientes, tarefas, finanças e documentos em um só ambiente.',
    challenge: 'Centralizar a rotina de um escritório contábil e reduzir a dispersão de informações.',
    solution: 'Um MVP com módulos de clientes, quadro Kanban, financeiro e documentos em nuvem.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Firebase', 'Cloudflare R2'],
    features: ['Gestão de clientes', 'Kanban operacional', 'Financeiro e documentos'],
    url: 'https://konthub-mvp.vercel.app/', status: 'MVP em desenvolvimento',
    screens: [
      {src:'/assets/projetos/konthub/galeria/desktop-2.webp',label:'Dashboard do MVP',device:'desktop'},
      ...legacyScreens('konthub', 5, 1).filter(s=>!s.src.endsWith('desktop-2.webp')),
      publicScreen('konthub', 'Acesso ao sistema'),
    ],
  },
  {
    id: 'bagagemdev', title: 'Bagagem Dev', category: 'Orientação para começar em TI', group: 'Educação',
    description: 'Roadmaps, cursos e um quiz para encontrar o próximo passo em tecnologia.',
    challenge: 'Ajudar quem está começando a escolher uma direção entre tantas áreas de TI.',
    solution: 'Conteúdo organizado por área, com recursos gratuitos, ferramentas e orientação interativa.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
    features: ['Roadmaps por área', 'Quiz de orientação', 'Curadoria de cursos'],
    url: 'https://opgmoraes.github.io/bagagemdev/', status: 'Publicado',
    cover: '/assets/projetos/bagagemdev/prints/capa.webp',
    screens: [{"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_01_desktop_inicio.webp", "label": "Página inicial", "device": "desktop"}, {"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_02_desktop_areas.webp", "label": "Áreas de TI", "device": "desktop"}, {"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_03_desktop_quiz.webp", "label": "Quiz de orientação", "device": "desktop"}, {"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_04_mobile_inicio.webp", "label": "Página inicial", "device": "mobile"}, {"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_05_tablet_inicio.webp", "label": "Página inicial no tablet", "device": "desktop"}, {"src": "/assets/projetos/bagagemdev/prints/bagagem_dev_06_mobile_quiz.webp", "label": "Quiz de orientação", "device": "mobile"}],
  },
  {
    id: 'formamissal', title: 'FormaMissal', category: 'Formação e calendário litúrgico', group: 'Educação',
    description: 'Um apoio prático para aprender o Missal e preparar as celebrações.',
    challenge: 'Tornar o conteúdo de formação acessível na rotina de acólitos e formadores.',
    solution: 'Guias de formação, checklist de sacristia e calendário reunidos em um site de acesso livre.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PWA'],
    features: ['Formação sobre o Missal', 'Calendário litúrgico', 'Checklist de preparação'],
    url: 'https://opgmoraes.github.io/formamissal/', status: 'Publicado',
    cover: '/assets/projetos/formamissal/prints/capa.webp',
    screens: [{"src": "/assets/projetos/formamissal/prints/forma_missal_01_desktop_inicio.webp", "label": "Página inicial", "device": "desktop"}, {"src": "/assets/projetos/formamissal/prints/forma_missal_02_desktop_calendario.webp", "label": "Calendário litúrgico", "device": "desktop"}, {"src": "/assets/projetos/formamissal/prints/forma_missal_03_desktop_checklist.webp", "label": "Checklist de preparação", "device": "desktop"}, {"src": "/assets/projetos/formamissal/prints/forma_missal_04_mobile_inicio.webp", "label": "Página inicial", "device": "mobile"}, {"src": "/assets/projetos/formamissal/prints/forma_missal_05_tablet_inicio.webp", "label": "Página inicial no tablet", "device": "desktop"}, {"src": "/assets/projetos/formamissal/prints/forma_missal_06_mobile_checklist.webp", "label": "Checklist de preparação", "device": "mobile"}],
  },
  {
    id: 'taldofut', title: 'TaldoFut', category: 'Organização de jogos entre amigos', group: 'Sistemas',
    description: 'Da lista de presença ao sorteio dos times, a pelada fica organizada.',
    challenge: 'Facilitar a organização dos jogadores, das confirmações e dos times de cada jogo.',
    solution: 'Áreas para administrador e jogador, com lista em tempo real e sorteio por nível.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
    features: ['Lista em tempo real', 'Sorteio equilibrado', 'Controle de pagamentos'],
    url: 'https://opgmoraes.github.io/taldofut/', status: 'Publicado',
    screens: [publicScreen('taldofut'), {src:'/assets/projetos/taldofut/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
  {
    id: 'pedrodev', title: 'PedroDEV', category: 'Portfólio e operação de projetos', group: 'Sistemas',
    description: 'A vitrine pública e a gestão de projetos conectadas no mesmo sistema.',
    challenge: 'Apresentar o trabalho e organizar o atendimento aos clientes em um único projeto.',
    solution: 'Portfólio com galerias e uma área interna para clientes, propostas, contratos e financeiro.',
    tech: ['React', 'TypeScript', 'Vite', 'Firebase', 'jsPDF'],
    features: ['Portfólio interativo', 'Propostas e contratos', 'Área de clientes e financeiro'],
    url: '', status: 'Privado',
    screens: [publicScreen('pedrodev'), {src:'/assets/projetos/pedrodev/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
];

// Only deployment URLs curated here may be shown, including when old CMS data
// still contains repository links or access-request URLs.
const PUBLIC_PROJECT_URLS = new Set(PROJECTS.map(p => p.url).filter(Boolean));
export function safeProjectUrl(value: string | undefined): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return PUBLIC_PROJECT_URLS.has(url.href) ? url.href : '';
  } catch { return ''; }
}

export const PROJECT_DEFAULTS: PortfolioProject[] = PROJECTS.map(p => ({
  id:p.id, title:p.title, description:p.description, statusText:p.url ? p.status : 'Privado',
  statusColor:p.url ? 'verde' : 'ambar',
  link1Text:p.url ? (p.id === 'bitto' ? 'Acessar sistema' : 'Visitar site') : '', link1Url:p.url,
  link2Text:'', link2Url:'', footnote:'',
}));

export function mergeProjectContent(saved: PortfolioProject[] = []): PortfolioProject[] {
  const legacyIds = ['bitto', 'cinegift', 'konthub'];
  const byId = new Map(saved.map((p,i) => [p.id || legacyIds[i],p]));
  return PROJECT_DEFAULTS.map(p => {
    const old = byId.get(p.id!);
    return {
      ...p,
      description: old?.description || p.description,
      title: p.id === 'bitto' || p.id === 'bitto-landing' ? p.title : old?.title || p.title,
      // Publication state and external links are controlled by the catalog.
      // Do not restore legacy repo URLs, labels or repository-access notes.
      footnote: old?.footnote && !/reposit|github|gitlab|bitbucket|ver c[oó]digo/i.test(old.footnote) ? old.footnote : '',
    };
  });
}
