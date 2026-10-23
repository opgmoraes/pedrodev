// O nome torna o endereço reconhecível; o token aleatório mantém o link imprevisível.
export function generateSlug(label = ''): string {
  const name = label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-$/, '');
  const token = crypto.randomUUID().replace(/-/g, '');
  return name ? `${name}-${token}` : token;
}
