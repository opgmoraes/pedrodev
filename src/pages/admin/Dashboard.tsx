import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

const ICON = {
  clientes: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  projetos: 'M20.25 14.15v4.25c0 1.09-.79 2.04-1.87 2.18-2.09.28-4.22.42-6.38.42s-4.29-.14-6.38-.42a2.18 2.18 0 0 1-1.87-2.18v-4.25M3 12.49V8.7c0-1.08.77-2.02 1.84-2.18a48 48 0 0 1 3.41-.38m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.89',
  financeiro: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

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
      <h1>{greeting()}, Pedro</h1>
      <p className="page-subtitle">visão geral do que está rodando agora</p>

      <div className="grid grid-3">
        <div className="card">
          <div className="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={ICON.clientes} /></svg>
          </div>
          <div className="stat-label">clientes</div>
          <div className="stat-value">{counts.clientes}</div>
        </div>
        <div className="card">
          <div className="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={ICON.projetos} /></svg>
          </div>
          <div className="stat-label">projetos ativos</div>
          <div className="stat-value">{counts.projetos}</div>
        </div>
        <div className="card" style={{ opacity: 0.6 }}>
          <div className="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={ICON.financeiro} /></svg>
          </div>
          <div className="stat-label">a receber</div>
          <div className="stat-value" style={{ color: 'var(--text-faint)' }}>em breve</div>
        </div>
      </div>

      <h2>ações rápidas</h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link to="/admin/clientes"><button className="secondary">+ novo cliente</button></Link>
        <Link to="/admin/projetos"><button className="secondary">+ novo projeto</button></Link>
        <Link to="/admin/orcamentos"><button className="secondary">+ novo orçamento</button></Link>
      </div>

      <p style={{ marginTop: 32 }}>
        V1 mostra contagem real de clientes/projetos direto do Firestore. Financeiro
        entra na V2.
      </p>
    </div>
  )
}
