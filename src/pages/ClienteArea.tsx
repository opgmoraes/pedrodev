import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

const STEPS = ['Briefing', 'Pagamento', 'Desenvolvimento', 'Revisão', 'Aprovação', 'Deploy', 'Entrega']

export default function ClienteArea() {
  const { slug } = useParams()
  const [client, setClient] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({
    negocio: '', publico: '', objetivo: '', cores: '', referencias: '',
  })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function load() {
      const cSnap = await getDocs(query(collection(db, 'clients'), where('slug', '==', slug)))
      if (cSnap.empty) return
      const cDoc = cSnap.docs[0]
      const c = { id: cDoc.id, ...cDoc.data() }
      setClient(c)
      const pSnap = await getDocs(query(collection(db, 'projects'), where('clientId', '==', cDoc.id)))
      if (!pSnap.empty) setProject(pSnap.docs[0].data())
    }
    load()
  }, [slug])

  async function sendBriefing(e: React.FormEvent) {
    e.preventDefault()
    await addDoc(collection(db, 'formSubmissions'), { clientSlug: slug, answers, createdAt: serverTimestamp() })
    setSent(true)
  }

  if (!client) {
    return <div className="container mono">carregando…</div>
  }

  const currentStepIndex = project ? STEPS.indexOf(project.status) : -1

  return (
    <div className="container">
      <div className="crumb">cliente / {client.name}</div>
      <h1>Olá, {client.name}</h1>
      <p style={{ color: 'var(--text-muted)' }}>{project?.name ?? 'Projeto ainda não iniciado'}</p>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>acompanhamento</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <span key={s} className="badge" style={{
              borderColor: i <= currentStepIndex ? 'var(--accent)' : 'var(--border)',
              color: i <= currentStepIndex ? 'var(--accent)' : 'var(--text-muted)',
            }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>briefing</div>
        {sent ? (
          <p style={{ marginTop: 12 }}>Briefing enviado. Obrigado!</p>
        ) : (
          <form onSubmit={sendBriefing}>
            <label>Sobre o negócio</label>
            <textarea rows={2} value={answers.negocio} onChange={(e) => setAnswers({ ...answers, negocio: e.target.value })} />
            <label>Público-alvo</label>
            <textarea rows={2} value={answers.publico} onChange={(e) => setAnswers({ ...answers, publico: e.target.value })} />
            <label>Objetivo do projeto</label>
            <textarea rows={2} value={answers.objetivo} onChange={(e) => setAnswers({ ...answers, objetivo: e.target.value })} />
            <label>Cores/preferências visuais</label>
            <input value={answers.cores} onChange={(e) => setAnswers({ ...answers, cores: e.target.value })} />
            <label>Referências (links)</label>
            <input value={answers.referencias} onChange={(e) => setAnswers({ ...answers, referencias: e.target.value })} />
            <button style={{ marginTop: 20 }}>enviar briefing</button>
          </form>
        )}
      </div>
    </div>
  )
}
