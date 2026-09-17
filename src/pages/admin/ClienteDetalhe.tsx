import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

type Client = {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  document?: string
  address?: string
  secondaryContact?: string
  notes?: string
  slug: string
}
type Project = { id: string; name: string; status: string }

export default function ClienteDetalhe() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!id) return
    const snap = await getDoc(doc(db, 'clients', id))
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() } as Client
      setClient(data)
      setNotes(data.notes || '')
    }
    const pSnap = await getDocs(query(collection(db, 'projects'), where('clientId', '==', id)))
    setProjects(pSnap.docs.map((d) => ({ id: d.id, name: d.data().name, status: d.data().status })))
  }

  useEffect(() => {
    load()
  }, [id])

  async function saveNotes() {
    if (!id) return
    setSaving(true)
    await updateDoc(doc(db, 'clients', id), { notes })
    setSaving(false)
  }

  if (!client) return <div className="mono" style={{ color: 'var(--text-muted)' }}>carregando…</div>

  return (
    <div>
      <div className="crumb">
        <Link to="/admin/clientes">admin / clientes</Link> / {client.name}
      </div>
      <h1>{client.name}</h1>

      <div className="grid grid-2" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="card">
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>dados do cliente</div>
          <p><strong>email:</strong> {client.email}</p>
          <p><strong>whatsapp:</strong> {client.phone}</p>
          <p><strong>empresa:</strong> {client.company || '—'}</p>
          <p><strong>CPF/CNPJ:</strong> {client.document || '—'}</p>
          <p><strong>endereço:</strong> {client.address || '—'}</p>
          <p><strong>contato secundário:</strong> {client.secondaryContact || '—'}</p>
          <p className="mono" style={{ fontSize: 13, color: 'var(--text-muted)' }}>/cliente/{client.slug}</p>

          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>projetos</div>
          {projects.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>nenhum projeto ainda</p>}
          {projects.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{p.name}</span>
              <span className="badge">{p.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>histórico / observações</div>
          <textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotações sobre conversas, decisões, pendências…"
            style={{ marginTop: 12 }}
          />
          <button style={{ marginTop: 12 }} onClick={saveNotes} disabled={saving}>
            {saving ? 'salvando…' : 'salvar histórico'}
          </button>
        </div>
      </div>
    </div>
  )
}
