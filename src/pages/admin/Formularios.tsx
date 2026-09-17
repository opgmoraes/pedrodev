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
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              cliente: {s.clientSlug}
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, marginTop: 8 }}>
              {JSON.stringify(s.answers, null, 2)}
            </pre>
          </div>
        ))}
        {subs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>nenhum briefing enviado ainda</p>}
      </div>
    </div>
  )
}
