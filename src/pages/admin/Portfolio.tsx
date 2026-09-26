import { useEffect, useState } from 'react'
import {
  getPortfolioContent,
  savePortfolioContent,
  type PortfolioContent,
  type PortfolioProject,
} from '../../lib/portfolioContent'

const DEFAULTS: PortfolioContent = {
  heroDescription:
    'Graduado em Análise e Desenvolvimento de Sistemas (ADS). Desenvolvedor Web e Founder — construo do zero e cuido pra continuar funcionando depois.',
  sobreP1:
    'Construo produtos do zero: penso no design, escrevo o código e ligo tudo às APIs que fazem funcionar de verdade. Quando o usuário nem repara na tecnologia por trás, é sinal de que deu certo.',
  sobreP2:
    'Isso junta engenharia com atenção a detalhe: interface rápida, fluida e que não atravanca quem tá usando.',
  projetos: [
    {
      title: 'BITTO',
      description:
        'Plataforma de estudos alimentada por IA que transforma qualquer arquivo ou texto em flashcards, quizzes e resumos automáticos. Conta com sistema de XP, planner e assistente virtual.',
      statusText: 'Em Produção',
      statusColor: 'azul',
      link1Text: 'Acessar Plataforma',
      link1Url: 'https://www.usebitto.com',
      link2Text: 'Repositório',
      link2Url: 'https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20bitto.',
      footnote: 'Repositório privado — código proprietário, acesso mediante solicitação.',
    },
    {
      title: 'CineGift',
      description:
        'Experiência digital interativa que converte fotos, vídeos e mensagens em um ingresso de cinema personalizado para presentear pessoas especiais.',
      statusText: 'Em Produção',
      statusColor: 'azul',
      link1Text: 'Acessar Plataforma',
      link1Url: 'https://www.cinegift.com.br/',
      link2Text: 'Repositório',
      link2Url: 'https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20CineGift.',
      footnote: 'Repositório privado — código proprietário, acesso mediante solicitação.',
    },
    {
      title: 'Kont Hub',
      description:
        'MicroSaaS focado na gestão contábil moderna: CRM de clientes, pipeline Kanban de tarefas, gestão financeira e cofre de documentos em nuvem.',
      statusText: 'Em Desenvolvimento',
      statusColor: 'ambar',
      link1Text: 'Solicitar Repositório',
      link1Url: 'https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20Kont%20Hub.',
      link2Text: '',
      link2Url: '',
      footnote: 'Repositório privado — código proprietário, acesso mediante solicitação.',
    },
  ],
}

export default function Portfolio() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getPortfolioContent().then((saved) => {
      if (saved) setContent({ ...DEFAULTS, ...saved, projetos: (saved.projetos as any) ?? DEFAULTS.projetos })
      setLoading(false)
    })
  }, [])

  function updateProject(i: number, patch: Partial<PortfolioProject>) {
    setContent((c) => {
      const projetos = [...c.projetos] as PortfolioContent['projetos']
      projetos[i] = { ...projetos[i], ...patch }
      return { ...c, projetos }
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await savePortfolioContent(content)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <div className="mono" style={{ color: 'var(--text-muted)' }}>carregando…</div>

  return (
    <div>
      <div className="crumb">admin / portfólio</div>
      <h1>Portfólio</h1>
      <p className="page-subtitle">
        edita o que aparece em <a href="/portifolio" target="_blank" rel="noreferrer" className="link-underline">/portifolio</a> — as imagens dos projetos continuam fixas por enquanto
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Hero &amp; Sobre</h2>
        <label>Parágrafo do hero (abaixo do título)</label>
        <textarea rows={3} value={content.heroDescription} onChange={(e) => setContent({ ...content, heroDescription: e.target.value })} />
        <label>Sobre — parágrafo 1</label>
        <textarea rows={3} value={content.sobreP1} onChange={(e) => setContent({ ...content, sobreP1: e.target.value })} />
        <label>Sobre — parágrafo 2</label>
        <textarea rows={3} value={content.sobreP2} onChange={(e) => setContent({ ...content, sobreP2: e.target.value })} />
      </div>

      {content.projetos.map((p, i) => (
        <div className="card" key={i}>
          <h2 style={{ marginTop: 0 }}>Projeto {i + 1}</h2>
          <label>Título</label>
          <input value={p.title} onChange={(e) => updateProject(i, { title: e.target.value })} />
          <label>Descrição</label>
          <textarea rows={3} value={p.description} onChange={(e) => updateProject(i, { description: e.target.value })} />
          <div className="grid grid-2">
            <div>
              <label>Status</label>
              <input value={p.statusText} onChange={(e) => updateProject(i, { statusText: e.target.value })} />
            </div>
            <div>
              <label>Cor do status</label>
              <select value={p.statusColor} onChange={(e) => updateProject(i, { statusColor: e.target.value as PortfolioProject['statusColor'] })}>
                <option value="azul">azul — em produção</option>
                <option value="ambar">âmbar — em desenvolvimento</option>
                <option value="verde">verde — concluído</option>
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div>
              <label>Link principal — texto</label>
              <input value={p.link1Text} onChange={(e) => updateProject(i, { link1Text: e.target.value })} />
            </div>
            <div>
              <label>Link principal — URL</label>
              <input value={p.link1Url} onChange={(e) => updateProject(i, { link1Url: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-2">
            <div>
              <label>Link secundário — texto (opcional)</label>
              <input value={p.link2Text} onChange={(e) => updateProject(i, { link2Text: e.target.value })} />
            </div>
            <div>
              <label>Link secundário — URL</label>
              <input value={p.link2Url} onChange={(e) => updateProject(i, { link2Url: e.target.value })} />
            </div>
          </div>
          <label>Nota de rodapé</label>
          <input value={p.footnote} onChange={(e) => updateProject(i, { footnote: e.target.value })} />
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'salvando…' : 'salvar alterações'}
        </button>
        {saved && <span style={{ color: 'var(--success)', fontSize: 13 }}>salvo — já está no ar</span>}
      </div>
    </div>
  )
}
