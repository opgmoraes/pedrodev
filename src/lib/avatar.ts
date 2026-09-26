// Pequeno helper pra avatar com iniciais no painel — mesma cor sempre pro
// mesmo nome (hash simples), usando tons que já existem na paleta da marca.
const PALETTE = ['#2F5DFF', '#D9A441', '#35D07F', '#8B5CF6', '#F0645C']

export function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function getAvatarColor(name?: string) {
  if (!name) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
