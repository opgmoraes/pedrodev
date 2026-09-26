import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

type Submission = { id: string; clientSlug: string; answers: Record<string, string> }

export default function Formularios() {
  const [subs, setSubs] = useState<Submission[]>([])

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'formSubmissions'), orderBy('createdAt', 'desc')))
      setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)))
    }
    load()
  }, [])

  return (
    <div>
      <div className="crumb">admin / formularios</div>
      <h1>Briefings recebidos</h1>
      <div className="grid" style={{ marginTop: 20 }}>
        {subs.map((s) => (
          <div key={s.id} className="card">
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              cliente: {s.clientSlug}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(s.answers).map(([question, answer]) => (
                <div key={question} style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{question}</div>
                  <div style={{ fontSize: 14 }}>{answer || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {subs.length === 0 && <p>nenhum briefing enviado ainda</p>}
      </div>
    </div>
  )
}
