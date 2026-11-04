import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App';
import SkillsPage from '../src/skills/SkillsPage';
import LinkInBio from '../src/pages/LinkInBio';
import { publicSeo } from '../src/lib/publicContent';

export function renderPublicPage(path: string) {
  if (path === '/skills') return { markup: renderToString(<StaticRouter location={path}><SkillsPage /></StaticRouter>), seo: { title: 'Skills de IA para negócios, conteúdo e serviços | Pedro Gomes', description: 'Compare Founder, Creator, Service Pro e Ultimate: 28 skills no combo por R$ 69,90, com economia de R$ 29,80 frente aos packs avulsos. Veja instalação e compatibilidade.', path: '/skills' } };
  if (path === '/link') return { markup: renderToString(<StaticRouter location={path}><LinkInBio /></StaticRouter>), seo: {title:'Pedro Gomes | Links, projetos e contato',description:'Conheça os projetos de Pedro Gomes, peça um orçamento e explore os packs de skills para IA.',path:'/link'} };
  const seo = publicSeo(path === '/portifolio');
  return { markup: renderToString(<StaticRouter location={path}><App /></StaticRouter>), seo };
}

