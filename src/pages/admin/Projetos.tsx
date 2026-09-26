import { useEffect, useMemo, useState } from 'react'
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

type Client = { id: string; name: string }
type Project = {
  id: string
  name: string
  status: string
  clientId: string
  clientName?: string
}

const STATUSES = [
  'Rascunho',
  'Aguardando cliente',
  'Em desenvolvimento',
  'Em revisão',
  'Concluído',
  'Atrasado',
]

export default function Projetos() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState({ name: '', clientId: '', status: 'Rascunho' })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.clientName ?? '').toLowerCase().includes(q)
    )
  }, [projects, search])

  async function load() {
    const [pSnap, cSnap] = await Promise.all([
      getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'))),
      getDocs(collection(db, 'clients')),
    ])
    const clientsList = cSnap.docs.map((d) => ({ id: d.id, name: d.data().name as string }))
    const clientsMap = new Map(clientsList.map((c) => [c.id, c.name]))
    setClients(clientsList)
    setProjects(
      pSnap.docs.map((d) => {
        const data = d.data()
        return { id: d.id, name: data.name, status: data.status, clientId: data.clientId, clientName: clientsMap.get(data.clientId) }
      })
    )
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.clientId) return
    setLoading(true)
    await addDoc(collection(db, 'projects'), { ...form, createdAt: serverTimestamp() })
    setForm({ name: '', clientId: '', status: 'Rascunho' })
    setLoading(false)
    load()
  }

  async function updateStatus(id: string, status: string) {
    await updateDoc(doc(db, 'projects', id), { status })
    load()
  }

  return (
    <div>
      <div className="crumb">admin / projetos</div>
      <h1>Projetos</h1>
      <div className="grid grid-2" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="card">
          <div className="list-toolbar">
            <input
              type="search"
              className="list-search"
              placeholder="buscar por projeto ou cliente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="count-pill">{filtered.length} projeto{filtered.length === 1 ? '' : 's'}</span>
          </div>
          <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>projeto</th>
                <th>cliente</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.clientName ?? '—'}</td>
                  <td>
                    <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && projects.length > 0 && (
                <tr>
                  <td colSpan={3} style={{ color: 'var(--text-muted)' }}>nenhum projeto bate com essa busca</td>
                </tr>
              )}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ color: 'var(--text-muted)' }}>nenhum projeto ainda</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>novo projeto</div>
          <label>nome do projeto</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>cliente</label>
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
            <option value="">selecione</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button style={{ marginTop: 20 }} disabled={loading}>
            {loading ? 'salvando…' : 'criar projeto'}
          </button>
        </form>
      </div>
    </div>
  )
}
