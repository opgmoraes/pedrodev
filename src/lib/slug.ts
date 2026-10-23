// Identificador opaco para links de compartilhamento.
export function generateSlug(): string {
  return crypto.randomUUID().replace(/-/g, "");
}
