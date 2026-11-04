import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const MEASUREMENT_ID = 'G-N89ZGJ3JJC';
const pageTitles: Record<string,string> = { '/':'Criação de sites e sistemas em Luziânia | Pedro Gomes', '/portifolio':'Portfólio de sites e sistemas | Pedro Gomes', '/link':'Pedro Gomes | Links, projetos e contato', '/skills':'Skills de IA para negócios, conteúdo e serviços | Pedro Gomes' };
const publicPaths = new Set(['/', '/portifolio', '/link', '/skills']);
type Gtag = (...args: unknown[]) => void;
declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag; } }

/** Only public, canonical paths are measured; no query strings or private IDs. */
export default function PublicAnalytics() {
  const { pathname } = useLocation();
  const lastPage = useRef('');
  const path = pathname.replace(/\/$/, '') || '/';
  const enabled = import.meta.env.PROD && publicPaths.has(path);
  useEffect(() => {
    if (!enabled || lastPage.current === path) return;
    const previousPage = lastPage.current;
    lastPage.current = path;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }
    window.gtag('event', 'page_view', {
      page_location: `${window.location.origin}${path}`,
      page_title: pageTitles[path],
      page_referrer: previousPage ? `${window.location.origin}${previousPage}` : (document.referrer ? new URL(document.referrer).origin : ''),
    });
  }, [enabled, path]);
  return enabled ? <Analytics beforeSend={event => {
    const url = new URL(event.url);
    const canonicalPath = url.pathname.replace(/\/$/, '') || '/';
    if (!publicPaths.has(canonicalPath)) return null;
    url.search = ''; url.hash = '';
    return { ...event, url: url.toString() };
  }} /> : null;
}
