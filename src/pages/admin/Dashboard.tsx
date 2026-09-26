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
          <div className="stat-label">clientes</div>
          <div className="stat-value">{counts.clientes}</div>
        </div>
        <div className="card">
          <div className="stat-label">projetos ativos</div>
          <div className="stat-value">{counts.projetos}</div>
        </div>
        <div className="card" style={{ opacity: 0.6 }}>
          <div className="stat-label">a receber</div>
          <div className="stat-value" style={{ color: 'var(--text-faint)' }}>em breve</div>
        </div>
      </div>
      <p style={{ marginTop: 24 }}>
        V1 mostra contagem real de clientes/projetos direto do Firestore. Financeiro
        entra na V2.
      </p>
    </div>
  )
}
