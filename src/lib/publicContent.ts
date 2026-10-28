import { PROJECTS } from './projectCatalog';

export const SITE_URL = 'https://pedrogm.com.br';
export const FAQS = [
  ['O que você desenvolve?', 'Desenvolvo landing pages, sites institucionais, sistemas web e integrações sob medida. A escolha depende do que seu negócio precisa: apresentar serviços, receber contatos ou organizar a operação.'],
  ['Qual a diferença entre site e landing page?', 'Uma landing page concentra uma oferta e uma ação, como pedir um orçamento pelo WhatsApp. Um site institucional apresenta a empresa, seus serviços e diferentes caminhos de contato.'],
  ['Quanto custa criar um site ou sistema?', 'O investimento depende das páginas, funcionalidades, integrações e materiais necessários. Depois da conversa inicial, envio uma proposta com as entregas, o prazo e as condições de pagamento.'],
  ['Como funciona o desenvolvimento?', 'Começamos pelo objetivo do projeto. Depois de aprovar a proposta, você acompanha a direção visual, o desenvolvimento e a revisão. A publicação e a entrega dos acessos seguem o escopo combinado.'],
  ['Qual é o prazo de entrega?', 'Landing pages têm prazo a partir de 7 dias úteis. Sites e sistemas dependem do escopo e dos materiais disponíveis. O prazo do seu projeto fica definido na proposta, antes de começar.'],
  ['Você atende empresas de outras cidades?', 'Sou desenvolvedor em Luziânia, Goiás, e atendo projetos remotamente. A conversa, a apresentação da proposta e o acompanhamento podem acontecer online.'],
  ['O site funciona no celular e pode aparecer no Google?', 'Os projetos são desenvolvidos com layout responsivo e estrutura técnica para busca. Indexação e posicionamento dependem também do conteúdo, da concorrência e dos critérios dos buscadores; não há garantia de primeira posição.'],
  ['Como funcionam pagamento, domínio e suporte?', 'Pagamento, domínio, hospedagem, acessos e suporte são definidos na proposta. Você recebe os arquivos e acessos previstos no escopo e sabe o que está incluído antes de contratar.'],
] as const;

export function publicSeo(portfolio = false) {
  return portfolio ? {
    title: 'Portfólio de sites e sistemas | Pedro Gomes',
    description: 'Conheça BITTO, Tal do Fut, Bagagem Dev e outros projetos de Pedro Gomes. Veja interfaces e funcionalidades e converse sobre seu site ou sistema.',
    path: '/portifolio',
  } : {
    title: 'Criação de sites e sistemas em Luziânia | Pedro Gomes',
    description: 'Sites, landing pages e sistemas web sob medida com Pedro Gomes, desenvolvedor em Luziânia, GO. Veja projetos e peça uma proposta com escopo e prazo definidos.',
    path: '/',
  };
}

export function publicSchema(portfolio = false) {
  const seo = publicSeo(portfolio);
  const pageId = `${SITE_URL}${seo.path}#page`;
  const personId = `${SITE_URL}/#pedro`;
  const businessId = `${SITE_URL}/#business`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': personId, name: 'Pedro Gomes', alternateName: 'Pedro Gabriel Gomes', jobTitle: 'Desenvolvedor web', url: SITE_URL, image: `${SITE_URL}/assets/perfil/pedro-moletom-v3.webp`, sameAs: ['https://www.linkedin.com/in/pedrogmdev', 'https://www.instagram.com/pedrogm.dev/'] },
      { '@type': 'ProfessionalService', '@id': businessId, name: 'Pedro Gomes — Desenvolvimento Web', url: SITE_URL, description: 'Desenvolvimento de sites, landing pages, sistemas web e integrações sob medida.', founder: { '@id': personId }, email: 'pedrogm.dev@gmail.com', telephone: '+5561936182176', address: { '@type': 'PostalAddress', addressLocality: 'Luziânia', addressRegion: 'GO', addressCountry: 'BR' }, areaServed: { '@type': 'Country', name: 'Brasil' } },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'Pedro Gomes', inLanguage: 'pt-BR', publisher: { '@id': businessId } },
      { '@type': portfolio ? 'CollectionPage' : 'WebPage', '@id': pageId, url: `${SITE_URL}${seo.path}`, name: seo.title, description: seo.description, inLanguage: 'pt-BR', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': personId } },
      ...(portfolio ? [{ '@type': 'ItemList', '@id': `${SITE_URL}/portifolio#projetos`, name: 'Projetos de desenvolvimento web', itemListElement: PROJECTS.map((project, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: project.title, description: project.description, creator: { '@id': personId }, mainEntityOfPage: `${SITE_URL}/portifolio#projeto-${project.id}`, image: `${SITE_URL}${project.cover || project.screens[0].src}`, ...(project.url ? { url: project.url } : {}) } })) }] : [
        ...['Landing pages', 'Sites institucionais', 'Sistemas web', 'Integrações e automações'].map((name, i) => ({ '@type': 'Service', '@id': `${SITE_URL}/#service-${i+1}`, name, provider: { '@id': businessId }, url: `${SITE_URL}/#servicos`, areaServed: { '@type': 'Country', name: 'Brasil' } })),
      ]),
      { '@type': 'FAQPage', '@id': `${SITE_URL}${seo.path}#faq`, isPartOf: { '@id': pageId }, mainEntity: FAQS.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
      ...(portfolio ? [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Portfólio', item: `${SITE_URL}/portifolio` }] }] : []),
    ],
  };
}
