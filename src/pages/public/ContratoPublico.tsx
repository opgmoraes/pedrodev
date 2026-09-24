import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, limit, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebaseClient'

type Contract = {
  id: string
  clientName?: string
  clientCompany?: string
  clientDocument?: string
  clientAddress?: string
  service: string
  items?: string[]
  value: number
  deadlineDays: number
  status: 'pendente' | 'aceito'
}

export default function ContratoPublico() {
  const { slug } = useParams<{ slug: string }>()
  const [contract, setContract] = useState<Contract | null | 'not-found'>(null)
  const [checked, setChecked] = useState(false)
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!slug) return
    const snap = await getDocs(query(collection(db, 'contracts'), where('slug', '==', slug), limit(1)))
    if (snap.empty) {
      setContract('not-found')
      return
    }
    const d = snap.docs[0]
    setContract({ id: d.id, ...(d.data() as any) })
  }

  useEffect(() => {
    load()
  }, [slug])

  async function handleAceitar() {
    if (!contract || contract === 'not-found') return
    setSaving(true)
    await updateDoc(doc(db, 'contracts', contract.id), {
      status: 'aceito',
      acceptedAt: serverTimestamp(),
    })
    setContract({ ...contract, status: 'aceito' })
    setSaving(false)
  }

  if (contract === null) {
    return <div className="container mono" style={{ textAlign: 'center', paddingTop: 80 }}>carregando…</div>
  }

  if (contract === 'not-found') {
    return (
      <div className="container" style={{ maxWidth: 480, textAlign: 'center', paddingTop: 80 }}>
        <div className="crumb" style={{ justifyContent: 'center' }}>home / contrato</div>
        <h1>Contrato não encontrado</h1>
        <p style={{ color: 'var(--text-muted)' }}>O link pode estar incorreto. Fale com o Pedro pra receber um novo.</p>
        <Link to="/"><button className="secondary" style={{ marginTop: 20 }}>Voltar pro site</button></Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="crumb">home / contrato</div>
      <h1 style={{ marginBottom: 4 }}>Contrato de Prestação de Serviços</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>Leia com atenção antes de aceitar.</p>

      <div className="card" style={{ marginTop: 20, lineHeight: 1.8 }}>
        <p><strong>CONTRATANTE:</strong> {contract.clientName}{contract.clientDocument ? ` — CPF/CNPJ: ${contract.clientDocument}` : ''}</p>
        {contract.clientAddress && <p><strong>Endereço:</strong> {contract.clientAddress}</p>}
        <p><strong>CONTRATADO:</strong> Pedro Gomes | Tech</p>

        <p style={{ marginTop: 20 }}><strong>OBJETO DO CONTRATO:</strong> {contract.service}</p>
        {contract.items && contract.items.length > 0 && (
          <ul style={{ paddingLeft: 20 }}>
            {contract.items.map((i) => <li key={i}>{i}</li>)}
          </ul>
        )}

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>valor</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>R$ {contract.value}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>prazo</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{contract.deadlineDays} dias</div>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          O prazo começa a contar a partir da confirmação do pagamento combinado e do preenchimento do
          briefing pelo contratante. Ajustes fora do escopo descrito acima podem gerar aditivo de valor
          e prazo, sempre combinado antes de qualquer execução. Após a entrega, o contratante tem um
          período de ajustes gratuito para correção de eventuais problemas de funcionamento.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {contract.status === 'pendente' ? (
          <>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ marginTop: 4 }} />
              <span style={{ fontSize: 14 }}>Li e concordo com os termos descritos neste contrato.</span>
            </label>
            <button disabled={!checked || saving} onClick={handleAceitar} style={{ marginTop: 16 }}>
              {saving ? 'salvando…' : 'Aceitar contrato'}
            </button>
          </>
        ) : (
          <p style={{ margin: 0 }}>
            <span className="badge" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>✓ contrato aceito</span>
            <br /><br />
            Contrato aceito! Próximo passo: confirmação de pagamento e envio do briefing. O Pedro vai te
            chamar no WhatsApp com os detalhes.
          </p>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← voltar pro site</Link>
      </p>
    </div>
  )
}
