export type CatalogSkill = { name: string; description: string };

export const skillCatalog: Record<'founder' | 'creator' | 'service', CatalogSkill[]> = {
  founder: [
    { name: 'O Dono', description: 'Organiza a direção do negócio e ajuda a decidir qual especialista usar em cada etapa.' },
    { name: 'Garimpeiro de Oportunidades', description: 'Pesquisa nichos e problemas para encontrar oportunidades de produtos digitais.' },
    { name: 'Detetive de Dores', description: 'Investiga reclamações e dificuldades reais de um público antes de propor soluções.' },
    { name: 'Tribunal do Micro SaaS', description: 'Coloca uma ideia sob análise crítica, com argumentos, riscos e um veredito para revisar.' },
    { name: 'Laboratório de Validação', description: 'Planeja entrevistas e testes para avaliar uma ideia antes de construir.' },
    { name: 'Copywriter', description: 'Ajuda a escrever e revisar textos de páginas, ofertas e comunicações comerciais.' },
    { name: 'Designer UI/UX Motion', description: 'Planeja a experiência, a interface e o movimento de um produto digital.' },
    { name: 'Engenheiro de Software e Cibersegurança', description: 'Transforma requisitos em plano técnico, implementação e cuidados de segurança.' },
    { name: 'Marketeiro', description: 'Estrutura posicionamento, canais e ações de divulgação para um negócio.' },
    { name: 'Social Media', description: 'Planeja conteúdo e rotina de publicação para redes sociais.' },
  ],
  creator: [
    { name: 'Creator Director', description: 'Coordena pesquisa, planejamento, produção e evolução do conteúdo.' },
    { name: 'Trend Audience Researcher', description: 'Pesquisa tendências e interesses do público para encontrar pautas com contexto.' },
    { name: 'Content Planner', description: 'Organiza pilares, calendário e séries para uma rotina de conteúdo.' },
    { name: 'Script Storytelling', description: 'Estrutura ganchos, narrativa, falas e chamadas para ação em roteiros.' },
    { name: 'Motion Visual Director', description: 'Planeja direção visual, cenas e movimento para peças de conteúdo.' },
    { name: 'Content Repurposer', description: 'Adapta uma peça original para outros formatos e canais.' },
    { name: 'Community Monetization', description: 'Planeja comunidade, parcerias e caminhos de monetização.' },
    { name: 'Growth Analyst', description: 'Lê métricas de conteúdo e propõe experimentos para melhorar a estratégia.' },
  ],
  service: [
    { name: 'Service Director', description: 'Coordena aquisição, oferta, entrega e acompanhamento de serviços.' },
    { name: 'Market ICP Researcher', description: 'Pesquisa nichos e define o perfil de cliente prioritário.' },
    { name: 'Lead Intelligence', description: 'Pesquisa possíveis clientes em fontes públicas e organiza oportunidades verificáveis.' },
    { name: 'Outreach Follow-up', description: 'Prepara abordagens e acompanhamentos comerciais para revisão antes do envio.' },
    { name: 'Offer Pricing Architect', description: 'Estrutura escopo, pacotes e lógica de preço de um serviço.' },
    { name: 'Proposal Builder', description: 'Organiza entregáveis, cronograma e condições em uma proposta comercial.' },
    { name: 'Sales Negotiator', description: 'Ajuda a preparar conversas comerciais e respostas a objeções.' },
    { name: 'Project Scope Manager', description: 'Organiza briefing, etapas e limites do projeto contratado.' },
    { name: 'Client Success', description: 'Planeja onboarding, acompanhamento e retenção do cliente.' },
  ],
};

export const ultimateSkill: CatalogSkill = {
  name: 'Ultimate Orchestrator',
  description: 'Coordena as skills de negócios, conteúdo e serviços quando uma tarefa atravessa os três packs.',
};
