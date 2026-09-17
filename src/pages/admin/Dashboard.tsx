import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

export default function Dashboard() {
  const [counts, setCounts] = useState({ clientes: 0, projetos: 0 })

  useEffect(() => {
    async function load() {
      const [clientesSnap, projetosSnap] = await Promise.all([
        getCountFromServer(collection(db, 'clients')),
        getCountFromServer(collection(db, 'projects')),
      ])
      setCounts({ clientes: clientesSnap.data().count, projetos: projetosSnap.data().count })
    }
    load()
  }, [])

  return (
    <div>
      <div className="crumb">admin / dashboard</div>
      <h1>Dashboard</h1>
      <div className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>clientes</div>
          <div style={{ fontSize: 32 }}>{counts.clientes}</div>
        </div>
        <div className="card">
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>projetos ativos</div>
          <div style={{ fontSize: 32 }}>{counts.projetos}</div>
        </div>
        <div className="card">
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: 12 }}>a receber</div>
          <div style={{ fontSize: 32 }}>—</div>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: 24, fontSize: 13 }}>
        V1 mostra contagem real de clientes/projetos direto do Firestore. Financeiro
        entra na V2.
      </p>
    </div>
  )
}
