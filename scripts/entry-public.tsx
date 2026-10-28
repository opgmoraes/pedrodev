import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App';
import { publicSeo } from '../src/lib/publicContent';

export function renderPublicPage(path: string) {
  const seo = publicSeo(path === '/portifolio');
  return { markup: renderToString(<StaticRouter location={path}><App /></StaticRouter>), seo };
}
