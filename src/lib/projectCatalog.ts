import type { PortfolioProject } from './portfolioContent';

export type ProjectScreen = { src: string; label: string; device: 'desktop' | 'mobile' };
export type ShowcaseProject = {
  id: string; title: string; category: string; group: 'Educação' | 'Sistemas' | 'Experiências';
  description: string; challenge: string; solution: string; tech: string[];
  features: string[]; url: string; repo: string; status: string; screens: ProjectScreen[];
};
const publicScreen = (id: string, label = 'Página inicial'): ProjectScreen => ({src: `/assets/projetos/${id}/publico-desktop.webp`, label, device: 'desktop'});
const legacyScreens = (id: string, desktop: number, mobile: number): ProjectScreen[] => [
  ...Array.from({length: desktop}, (_, i) => ({src: `/assets/projetos/${id}/galeria/desktop-${i + 1}.webp`, label: `Interface · ${i + 1}`, device: 'desktop' as const})),
  ...Array.from({length: mobile}, (_, i) => ({src: `/assets/projetos/${id}/galeria/mobile-${i + 1}.webp`, label: `Versão mobile · ${i + 1}`, device: 'mobile' as const})),
];

export const PROJECTS: ShowcaseProject[] = [
  {
    id: 'bitto', title: 'BITTO', category: 'Plataforma de estudos com IA', group: 'Educação',
    description: 'Do material parado à prática: flashcards, quizzes e revisões com IA.',
    challenge: 'Transformar textos e PDFs em uma rotina de estudo mais ativa.',
    solution: 'Uma plataforma que reúne geração de materiais, prática e planejamento de estudos.',
    tech: ['JavaScript', 'Firebase', 'APIs de IA', 'Vercel'],
    features: ['Importação de PDFs', 'Flashcards e quizzes', 'Revisões e planner'],
    url: 'https://www.usebitto.com/', repo: 'https://github.com/usebittotech/bitto-oficial', status: 'Publicado',
    screens: [...legacyScreens('bitto', 6, 4), publicScreen('bitto', 'Site público')],
  },
  {
    id: 'cinegift', title: 'CineGift', category: 'Presentes em formato de cinema', group: 'Experiências',
    description: 'Fotos, vídeos e mensagens viram uma sessão de cinema para presentear.',
    challenge: 'Dar uma experiência especial a memórias que normalmente ficam na galeria do celular.',
    solution: 'Um criador com prévia e temas visuais para montar e compartilhar uma surpresa digital.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Cloudflare R2'],
    features: ['Criador com prévia', 'Temas personalizados', 'Ingresso e sessão digital'],
    url: 'https://www.cinegift.com.br/', repo: 'https://github.com/opgmoraes/cinegift', status: 'Publicado',
    screens: [publicScreen('cinegift'), ...legacyScreens('cinegift', 3, 3)],
  },
  {
    id: 'konthub', title: 'KontHub', category: 'Gestão para escritórios contábeis', group: 'Sistemas',
    description: 'Clientes, tarefas, finanças e documentos em um só ambiente.',
    challenge: 'Centralizar a rotina de um escritório contábil e reduzir a dispersão de informações.',
    solution: 'Um MVP com módulos de clientes, quadro Kanban, financeiro e documentos em nuvem.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Firebase', 'Cloudflare R2'],
    features: ['Gestão de clientes', 'Kanban operacional', 'Financeiro e documentos'],
    url: 'https://konthub-mvp.vercel.app/', repo: 'https://github.com/opgmoraes/konthub', status: 'MVP em desenvolvimento',
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
    url: 'https://opgmoraes.github.io/bagagemdev/', repo: 'https://github.com/opgmoraes/bagagemdev', status: 'Publicado',
    screens: [publicScreen('bagagemdev'), {src:'/assets/projetos/bagagemdev/quiz.webp',label:'Quiz de orientação',device:'desktop'}, {src:'/assets/projetos/bagagemdev/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
  {
    id: 'formamissal', title: 'FormaMissal', category: 'Formação e calendário litúrgico', group: 'Educação',
    description: 'Um apoio prático para aprender o Missal e preparar as celebrações.',
    challenge: 'Tornar o conteúdo de formação acessível na rotina de acólitos e formadores.',
    solution: 'Guias de formação, checklist de sacristia e calendário reunidos em um site de acesso livre.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PWA'],
    features: ['Formação sobre o Missal', 'Calendário litúrgico', 'Checklist de preparação'],
    url: 'https://opgmoraes.github.io/formamissal/', repo: 'https://github.com/opgmoraes/formamissal', status: 'Publicado',
    screens: [publicScreen('formamissal'), {src:'/assets/projetos/formamissal/calendario.webp',label:'Calendário litúrgico',device:'desktop'}, {src:'/assets/projetos/formamissal/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
  {
    id: 'taldofut', title: 'TaldoFut', category: 'Organização de jogos entre amigos', group: 'Sistemas',
    description: 'Da lista de presença ao sorteio dos times, a pelada fica organizada.',
    challenge: 'Facilitar a organização dos jogadores, das confirmações e dos times de cada jogo.',
    solution: 'Áreas para administrador e jogador, com lista em tempo real e sorteio por nível.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
    features: ['Lista em tempo real', 'Sorteio equilibrado', 'Controle de pagamentos'],
    url: 'https://opgmoraes.github.io/taldofut/', repo: 'https://github.com/opgmoraes/taldofut', status: 'Publicado',
    screens: [publicScreen('taldofut'), {src:'/assets/projetos/taldofut/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
  {
    id: 'pedrodev', title: 'PedroDEV', category: 'Portfólio e operação de projetos', group: 'Sistemas',
    description: 'A vitrine pública e a gestão de projetos conectadas no mesmo sistema.',
    challenge: 'Apresentar o trabalho e organizar o atendimento aos clientes em um único projeto.',
    solution: 'Portfólio com galerias e uma área interna para clientes, propostas, contratos e financeiro.',
    tech: ['React', 'TypeScript', 'Vite', 'Firebase', 'jsPDF'],
    features: ['Portfólio interativo', 'Propostas e contratos', 'Área de clientes e financeiro'],
    url: '', repo: 'https://github.com/opgmoraes/pedrodev', status: 'Em evolução',
    screens: [publicScreen('pedrodev'), {src:'/assets/projetos/pedrodev/publico-mobile.webp',label:'Página inicial no celular',device:'mobile'}],
  },
];

export const PROJECT_DEFAULTS: PortfolioProject[] = PROJECTS.map(p => ({
  id:p.id, title:p.title, description:p.description, statusText:p.status,
  statusColor:p.id === 'konthub' || p.id === 'pedrodev' ? 'ambar' : 'verde',
  link1Text:p.url ? 'Visitar site' : '', link1Url:p.url,
  link2Text:'Ver código', link2Url:p.repo, footnote:'',
}));

// Old documents stored only BITTO, CineGift and KontHub, in this order.
// IDs prevent a later reorder from attaching one project's copy to another.
export function mergeProjectContent(saved: PortfolioProject[] = []): PortfolioProject[] {
  const legacyIds = ['bitto', 'cinegift', 'konthub'];
  const byId = new Map(saved.map((p,i) => [p.id || legacyIds[i],p]));
  return PROJECT_DEFAULTS.map(p => {
    const old = byId.get(p.id!);
    if (!old) return {...p};
    const migrated = {...old};
    if (/wa\.me\/.*(?:reposit|repo)/i.test(migrated.link1Url || '')) {
      migrated.link1Url=p.link1Url; migrated.link1Text=p.link1Text;
    }
    if (/wa\.me\/.*(?:reposit|repo)/i.test(migrated.link2Url || '')) {
      migrated.link2Url=p.link2Url; migrated.link2Text=p.link2Text;
    }
    if (/repositório privado/i.test(migrated.footnote || '')) {
      if (!migrated.link2Url) {migrated.link2Url=p.link2Url; migrated.link2Text=p.link2Text;}
      migrated.footnote='';
    }
    return {...p,...migrated,id:p.id};
  });
}

export const safeProjectUrl = (value: string | undefined) => /^https?:\/\//i.test(value || '') ? value : '';
