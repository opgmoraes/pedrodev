// Gera um link wa.me com mensagem pré-preenchida.
// V1: sem API oficial — Pedro só abre o link e toca em Enviar.

export function buildWhatsappLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`
}

export const templates = {
  primeiroContato: (nome: string) =>
    `Olá, ${nome}! Aqui é o Pedro. Vamos dar início ao seu projeto — em breve te envio o link do briefing e da proposta por aqui mesmo.`,
  orcamento: (nome: string, servico: string, valor: number, prazoDias: number, link?: string) =>
    `Olá, ${nome}! Segue o orçamento do seu projeto:\n\n` +
    `Serviço: ${servico}\nValor: R$ ${valor}\nPrazo: ${prazoDias} dias\n\n` +
    (link ? `Veja e aprove a proposta aqui: ${link}\n\n` : '') +
    `Qualquer dúvida me chama por aqui.`,
  followUp: (nome: string) =>
    `Olá, ${nome}! Passando aqui pra saber se você já teve tempo de olhar a proposta que te enviei. Fico à disposição.`,
  briefingLink: (nome: string, link: string) =>
    `Olá, ${nome}! Segue o link do seu briefing, é rapidinho de preencher: ${link}`,
}
