import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'
import { buildWhatsappLink, templates } from '../../lib/whatsapp'

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

const emptyForm = {
  name: '', email: '', phone: '', company: '', document: '', address: '', secondaryContact: '', notes: '',
}

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  async function load() {
    const snap = await getDocs(query(collection(db, 'clients'), orderBy('createdAt', 'desc')))
    setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client)))
  }

  useEffect(() => {
    load()
  }, [])

  function slugify(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`
    await addDoc(collection(db, 'clients'), { ...form, slug, createdAt: serverTimestamp() })
    setForm(emptyForm)
    setLoading(false)
    load()
  }

  function whatsappPrimeiroContato(c: Client) {
    return buildWhatsappLink(c.phone, templates.primeiroContato(c.name))
  }

  function whatsappBriefing(c: Client) {
    const link = `${window.location.origin}/cliente/${c.slug}`
    return buildWhatsappLink(c.phone, templates.briefingLink(c.name, link))
  }

  return (
    <div>
      <div className="crumb">admin / clientes</div>
      <h1>Clientes</h1>
      <div className="grid grid-2" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>nome</th>
                <th>empresa</th>
                <th>whatsapp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.company || '—'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    {c.phone ? (
                      <>
                        <a href={whatsappPrimeiroContato(c)} target="_blank" rel="noreferrer">
                          <span className="badge" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                            contato
                          </span>
                        </a>
                        <a href={whatsappBriefing(c)} target="_blank" rel="noreferrer">
                          <span className="badge">briefing</span>
                        </a>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>sem telefone</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/clientes/${c.id}`} className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>
                      ver →
                    </Link>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: 'var(--text-muted)' }}>nenhum cliente ainda</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>novo cliente</div>
          <label>nome</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label>whatsapp (com DDD)</label>
          <input
            placeholder="62999999999"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <label>empresa (opcional)</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />

          {!showMore && (
            <button
              type="button"
              className="secondary"
              style={{ marginTop: 20 }}
              onClick={() => setShowMore(true)}
            >
              + adicionar CPF/CNPJ, endereço e histórico
            </button>
          )}

          {showMore && (
            <>
              <label>CPF/CNPJ (opcional)</label>
              <input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} />
              <label>endereço (opcional)</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <label>contato secundário (opcional)</label>
              <input
                placeholder="nome e telefone de outra pessoa da empresa"
                value={form.secondaryContact}
                onChange={(e) => setForm({ ...form, secondaryContact: e.target.value })}
              />
              <label>observações / histórico inicial (opcional)</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </>
          )}

          <button style={{ marginTop: 20 }} disabled={loading}>
            {loading ? 'salvando…' : 'salvar cliente'}
          </button>
        </form>
      </div>
    </div>
  )
}
