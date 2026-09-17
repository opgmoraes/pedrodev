import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'
import { buildWhatsappLink, templates } from '../../lib/whatsapp'
import { generateProposalPdf, generateContractPdf } from '../../lib/pdf'

type Client = { id: string; name: string; phone: string; company?: string; document?: string; address?: string }
type Quote = {
  id: string
  clientId: string
  clientName?: string
  clientPhone?: string
  clientCompany?: string
  clientDocument?: string
  clientAddress?: string
  service: string
  value: number
  deadlineDays: number
}

export default function Orcamentos() {
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState({ clientId: '', service: '', value: '', deadlineDays: '' })
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const [cSnap, qSnap] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))),
    ])
    const clientsList = cSnap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name as string,
        phone: data.phone as string,
        company: data.company as string | undefined,
        document: data.document as string | undefined,
        address: data.address as string | undefined,
      }
    })
    const clientsMap = new Map(clientsList.map((c) => [c.id, c]))
    setClients(clientsList)
    setQuotes(
      qSnap.docs.map((d) => {
        const data = d.data()
        const client = clientsMap.get(data.clientId)
        return {
          id: d.id,
          clientId: data.clientId,
          clientName: client?.name,
          clientPhone: client?.phone,
          clientCompany: client?.company,
          clientDocument: client?.document,
          clientAddress: client?.address,
          service: data.service,
          value: data.value,
          deadlineDays: data.deadlineDays,
        }
      })
    )
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await addDoc(collection(db, 'quotes'), {
      clientId: form.clientId,
      service: form.service,
      value: Number(form.value),
      deadlineDays: Number(form.deadlineDays),
      createdAt: serverTimestamp(),
    })
    setForm({ clientId: '', service: '', value: '', deadlineDays: '' })
    setLoading(false)
    load()
  }

  function whatsappOrcamento(q: Quote) {
    if (!q.clientPhone || !q.clientName) return null
    return buildWhatsappLink(q.clientPhone, templates.orcamento(q.clientName, q.service, q.value, q.deadlineDays))
  }

  function whatsappFollowUp(q: Quote) {
    if (!q.clientPhone || !q.clientName) return null
    return buildWhatsappLink(q.clientPhone, templates.followUp(q.clientName))
  }

  function handleProposalPdf(q: Quote) {
    if (!q.clientName) return
    generateProposalPdf({
      clientName: q.clientName,
      company: q.clientCompany,
      service: q.service,
      value: q.value,
      deadlineDays: q.deadlineDays,
    })
  }

  function handleContractPdf(q: Quote) {
    if (!q.clientName) return
    generateContractPdf({
      clientName: q.clientName,
      document: q.clientDocument,
      address: q.clientAddress,
      service: q.service,
      value: q.value,
      deadlineDays: q.deadlineDays,
    })
  }

  return (
    <div>
      <div className="crumb">admin / orcamentos</div>
      <h1>Orçamentos / Propostas</h1>
      <div className="grid grid-2" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="card">
          <table>
            <thead>
              <tr><th>cliente</th><th>serviço</th><th>valor</th><th>prazo</th><th>ações</th></tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const linkOrcamento = whatsappOrcamento(q)
                const linkFollowUp = whatsappFollowUp(q)
                return (
                  <tr key={q.id}>
                    <td>{q.clientName ?? '—'}</td>
                    <td>{q.service}</td>
                    <td>R$ {q.value}</td>
                    <td>{q.deadlineDays}d</td>
                    <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {linkOrcamento && (
                        <>
                          <a href={linkOrcamento} target="_blank" rel="noreferrer">
                            <span className="badge" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>enviar</span>
                          </a>
                          <a href={linkFollowUp!} target="_blank" rel="noreferrer">
                            <span className="badge">follow-up</span>
                          </a>
                        </>
                      )}
                      <span className="badge" style={{ cursor: 'pointer' }} onClick={() => handleProposalPdf(q)}>
                        PDF proposta
                      </span>
                      <span className="badge" style={{ cursor: 'pointer' }} onClick={() => handleContractPdf(q)}>
                        PDF contrato
                      </span>
                    </td>
                  </tr>
                )
              })}
              {quotes.length === 0 && <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>nenhum orçamento ainda</td></tr>}
            </tbody>
          </table>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>novo orçamento</div>
          <label>cliente</label>
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
            <option value="">selecione</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label>serviço / escopo</label>
          <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
          <label>valor (R$)</label>
          <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <label>prazo (dias)</label>
          <input type="number" value={form.deadlineDays} onChange={(e) => setForm({ ...form, deadlineDays: e.target.value })} required />
          <button style={{ marginTop: 20 }} disabled={loading}>{loading ? 'salvando…' : 'criar orçamento'}</button>
        </form>
      </div>
    </div>
  )
}
