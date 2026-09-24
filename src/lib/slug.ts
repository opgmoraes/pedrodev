// Gera um slug curto e único o suficiente pra links públicos
// (/proposta/:slug, /contrato/:slug etc.). Não precisa ser sequencial
// nem legível — só difícil de adivinhar.
export function generateSlug(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10)
  }
  return Math.random().toString(36).slice(2, 12)
}
