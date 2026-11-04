export const packs = [
  { id: 'founder', name: 'Founder Pack', focus: 'Negócios', count: 10, price: 39.9, checkout: 'https://pay.cakto.com.br/35qntfa_1274332', promise: 'Descubra oportunidades, confronte ideias e planeje a validação antes de construir.', audience: 'Para quem quer criar ou avaliar um negócio.', examples: ['Tribunal do Micro SaaS', 'Detetive de Dores', 'Laboratório de Validação'], tone: 'amber' },
  { id: 'creator', name: 'Creator Pack', focus: 'Conteúdo', count: 8, price: 29.9, checkout: 'https://pay.cakto.com.br/b2vwizy_1274338', promise: 'Transforme pesquisa em pautas, roteiros, peças e uma rotina de conteúdo.', audience: 'Para criadores e marcas pessoais.', examples: ['Content Planner', 'Script Storytelling', 'Creator Director'], tone: 'violet' },
  { id: 'service', name: 'Service Pro Pack', focus: 'Serviços', count: 9, price: 29.9, checkout: 'https://pay.cakto.com.br/8cmyz5d_1274343', promise: 'Encontre clientes, monte ofertas, prepare propostas e organize a entrega.', audience: 'Para profissionais e pequenas agências.', examples: ['Lead Intelligence', 'Proposal Builder', 'Service Director'], tone: 'cyan' },
] as const;
export const ultimate = { id: 'ultimate', name: 'Ultimate Skills Pack', count: 28, price: 69.9, checkout: 'https://pay.cakto.com.br/3cyjark_1274348' };
export const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const separateTotal = packs.reduce((sum, pack) => sum + pack.price, 0);
export const saving = Math.round((separateTotal - ultimate.price) * 100) / 100;


export const faqs = [
  { question: 'O que é uma skill de IA?', answer: 'É um conjunto de instruções e materiais que orienta um assistente em uma tarefa específica. Cada pack reúne skills em arquivos SKILL.md, manual de instalação e exemplos de comandos.' },
  { question: 'Como recebo o pack depois da compra?', answer: 'Após a confirmação do pagamento, a Cakto está configurada para enviar por e-mail o link de um arquivo ZIP no Google Drive. Abra o ZIP e comece pelo MANUAL-INSTALACAO.md.' },
  { question: 'Funciona no Codex, ChatGPT e Claude?', answer: 'Os arquivos seguem o formato SKILL.md. Codex e Claude Code permitem instalar as pastas de skills. No ChatGPT e no Claude web, o upload pela interface depende dos recursos disponíveis na sua conta. Anexar o ZIP à conversa não instala as skills permanentemente.' },
  { question: 'As skills são usadas automaticamente?', answer: 'Depois de instaladas e ativas, o assistente pode escolher a skill relevante conforme seu pedido. Você também pode citar o nome da skill para direcionar o uso. O comportamento depende da plataforma e da configuração da conta.' },
  { question: 'O pagamento é único?', answer: 'Sim. Os quatro produtos estão configurados na Cakto como pagamento único, sem assinatura.' },
  { question: 'Qual é a economia do Ultimate?', answer: `Founder, Creator e Service Pro somam ${money(separateTotal)} quando comprados separadamente. O Ultimate reúne as 28 skills por ${money(ultimate.price)}, uma economia de ${money(saving)} nessa comparação.` },
];
export const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', url: 'https://pedrogm.com.br/skills', name: 'Skills de IA para negócios, conteúdo e serviços | Pedro Gomes', description: 'Compare quatro packs de skills de IA, veja preços, instalação, compatibilidade e economia do combo Ultimate.', inLanguage: 'pt-BR' },
    { '@type': 'ItemList', name: 'Packs de skills de IA', itemListElement: [...packs, ultimate].map((pack, index) => ({ '@type': 'ListItem', position: index + 1, name: pack.name, url: `https://pedrogm.com.br/skills#${pack.id}` })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ],
};

