import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App';
import SkillsPage from '../src/skills/SkillsPage';
import { publicSeo } from '../src/lib/publicContent';

export function renderPublicPage(path: string) {
  if (path === '/skills') return { markup: renderToString(<StaticRouter location={path}><SkillsPage /></StaticRouter>), seo: { title: 'Skills Packs | Pedro Gomes', description: 'Packs de skills para negócios, criação de conteúdo e serviços. Arquivos, manual de instalação e comandos de uso.', path: '/skills' } };
  const seo = publicSeo(path === '/portifolio');
  return { markup: renderToString(<StaticRouter location={path}><App /></StaticRouter>), seo };
}
