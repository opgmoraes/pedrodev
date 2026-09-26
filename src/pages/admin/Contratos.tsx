import { useEffect, useMemo, useState } from 'react'
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'
import { generateContractPdf } from '../../lib/pdf'
import { buildWhatsappLink } from '../../lib/whatsapp'
import { generateSlug } from '../../lib/slug'

type Client = { id: string; name: string; phone: string; company?: string; document?: string; address?: string }
type Quote = {
  id: string
  clientId: string
  service: string
  items?: string[]
  value: number
  deadlineDays: number
  status?: string
}
type Contract = {
  id: string
  quoteId: string
  clientName: string
  clientCompany?: string
  clientPhone?: string
  clientDocument?: string
  clientAddress?: string
  service: string
  items?: string[]
  value: number
  deadlineDays: number
  slug: string
  status: 'pendente' | 'aceito'
}

export default function Contratos() {
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filteredContracts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return contracts
    return contracts.filter(
      (c) => c.clientName.toLowerCase().includes(q) || c.service.toLowerCase().includes(q)
    )
  }, [contracts, search])

  async function load() {
    const [clientsSnap, quotesSnap, contractsSnap] = await Promise.all([
      getDocs(collection(db, 'clients')),
      getDocs(query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'contracts'), orderBy('createdAt', 'desc'))),
    ])
    const clientList = clientsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Client[]
    setClients(clientList)
    setQuotes(quotesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Quote[])
    setContracts(contractsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contract[])
  }

  useEffect(() => {
    load()
  }, [])

  const contractedQuoteIds = new Set(contracts.map((c) => c.quoteId))
  const orcamentosAprovados = quotes.filter((q) => q.status === 'aprovado' && !contractedQuoteIds.has(q.id))

  async function gerarContrato(quote: Quote) {
    setLoading(true)
    const client = clients.find((c) => c.id === quote.clientId)
    await addDoc(collection(db, 'contracts'), {
      quoteId: quote.id,
      clientId: quote.clientId,
      clientName: client?.name ?? null,
      clientCompany: client?.company ?? null,
      clientPhone: client?.phone ?? null,
      clientDocument: client?.document ?? null,
      clientAddress: client?.address ?? null,
      service: quote.service,
      items: quote.items ?? [],
      value: quote.value,
      deadlineDays: quote.deadlineDays,
      slug: generateSlug(),
      status: 'pendente',
      createdAt: serverTimestamp(),
    })
    setLoading(false)
    load()
  }

  return (
    <div>
      <div className="crumb">admin / contratos</div>
      <h1>Contratos</h1>

      {orcamentosAprovados.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
            orçamentos aprovados sem contrato ainda
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orcamentosAprovados.map((q) => {
              const client = clients.find((c) => c.id === q.clientId)
              return (
                <div
                  key={q.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>{client?.name ?? '—'} · {q.service} · R$ {q.value}</span>
                  <button disabled={loading} onClick={() => gerarContrato(q)}>
                    Gerar contrato
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card">
        <div className="list-toolbar">
          <input
            type="search"
            className="list-search"
            placeholder="buscar por cliente ou serviço…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="count-pill">{filteredContracts.length} contrato{filteredContracts.length === 1 ? '' : 's'}</span>
        </div>
        <div className="table-scroll">
        <table>
          <thead>
            <tr><th>cliente</th><th>serviço</th><th>valor</th><th>status</th><th>ações</th></tr>
          </thead>
          <tbody>
            {filteredContracts.map((c) => {
              const wa = c.clientPhone
                ? buildWhatsappLink(
                    c.clientPhone,
                    `Olá, ${c.clientName}! Segue o contrato do seu projeto pra leitura e aceite:\n\n${window.location.origin}/contrato/${c.slug}`
                  )
                : null
              return (
                <tr key={c.id}>
                  <td>{c.clientName}</td>
                  <td>{c.service}</td>
                  <td>R$ {c.value}</td>
                  <td>
                    <span
                      className="badge"
                      style={c.status === 'aceito' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <a href={`/contrato/${c.slug}`} target="_blank" rel="noreferrer">
                      <span className="badge">ver contrato</span>
                    </a>
                    <span
                      className="badge"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/contrato/${c.slug}`)}
                    >
                      copiar link
                    </span>
                    {wa && (
                      <a href={wa} target="_blank" rel="noreferrer">
                        <span className="badge">enviar whatsapp</span>
                      </a>
                    )}
                    <span
                      className="badge"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        generateContractPdf({
                          clientName: c.clientName,
                          document: c.clientDocument,
                          address: c.clientAddress,
                          service: c.service,
                          items: c.items,
                          value: c.value,
                          deadlineDays: c.deadlineDays,
                        })
                      }
                    >
                      baixar pdf
                    </span>
                  </td>
                </tr>
              )
            })}
            {contracts.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>nenhum contrato ainda</td></tr>
            )}
            {filteredContracts.length === 0 && contracts.length > 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>nenhum contrato bate com essa busca</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
