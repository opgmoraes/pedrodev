import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Public pages only: no authentication, CMS reads or customer documents at build time.
const root = process.cwd();
await build({ build: { ssr: 'scripts/entry-public.tsx', outDir: '.prerender', emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'public.mjs' } } }, ssr: { noExternal: ['@fortawesome/free-brands-svg-icons'] } });
const { renderPublicPage } = await import(pathToFileURL(resolve(root, '.prerender/public.mjs')).href);
const template = await readFile(resolve(root, 'dist/index.html'), 'utf8');
await writeFile(resolve(root, 'dist/app-shell.html'), template);
await writeFile(resolve(root, 'dist/private-shell.html'), template.replace('content="index, follow"', 'content="noindex, follow"'));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const path of ['/', '/portifolio']) {
  const { markup, seo } = renderPublicPage(path);
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(seo.title)}</title>`);
  for (const [attribute, name, value] of [
    ['name', 'description', seo.description], ['property', 'og:title', seo.title],
    ['property', 'og:description', seo.description], ['property', 'og:url', `https://pedrogm.com.br${seo.path}`],
    ['name', 'twitter:title', seo.title], ['name', 'twitter:description', seo.description],
  ]) html = html.replace(new RegExp(`<meta ${attribute}="${name}" content="[^"]*"\\s*\\/?>(?:\\r?\\n)?`), `<meta ${attribute}="${name}" content="${escape(value)}">\n`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="https://pedrogm.com.br${seo.path}">`);
  if (path === '/portifolio') html = html.replace(/<link rel="preload" as="image"[^>]*>/g, '');
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf('</body>', start);
  if (start < 0 || end < 0) throw new Error('Missing HTML root');
  html = html.slice(0, start) + `<div id="root" data-prerendered="true">${markup}</div>\n` + html.slice(end);
  const folder = path === '/' ? 'dist' : 'dist/portifolio';
  await mkdir(resolve(root, folder), { recursive: true });
  await writeFile(resolve(root, folder, 'index.html'), html);
  console.log(`Public HTML generated: ${path}`);
}
