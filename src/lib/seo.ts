import { useEffect } from 'react'

type SeoOptions = {
  title: string
  description: string
  /** Caminho da rota, ex: "/portifolio". Usado pra montar a URL canônica. */
  path?: string
}

const SITE_URL = 'https://pedrogm.com.br'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Atualiza title, description, og:*, twitter:* e a URL canônica pra cada
 * página da SPA. Sem isso, toda rota (portfólio, bio, home) fica com o
 * mesmo <title> fixo do index.html — ruim pro SEO e pra CTR na busca.
 */
export function useSEO({ title, description, path = '/' }: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertCanonical(url)
  }, [title, description, path])
}
