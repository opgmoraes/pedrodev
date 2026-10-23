import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../lib/firebaseClient';
import { contactLink, money } from '../lib/brand';
import { DEFAULT_PAYMENT_TERMS, DOCUMENT_CONDITIONS, documentReference, type CommercialDocument } from '../lib/documentContent';
import ArrowIcon from './ArrowIcon';
import './client-document.css';

type Data = CommercialDocument & { clientCompany?: string; clientDocument?: string; clientAddress?: string; clientSlug?: string };
export default function ClientDocument({ kind }: { kind: 'quote' | 'contract' }) {
  const { slug } = useParams();
  const contract = kind === 'contract';
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setData(null); setError(''); setChecked(false);
    async function load() {
      try {
        if (!hasFirebaseConfig || !slug) throw new Error('configuration');
        const snap = await getDoc(doc(db, contract ? 'publicContracts' : 'publicQuotes', slug));
        if (active) setData(snap.exists() ? snap.data() as Data : null);
      } catch { if (active) setError('Não foi possível abrir o documento. Tente novamente.'); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [slug, contract, attempt]);
  async function decide(status: 'aprovado' | 'recusado' | 'aceito') {
    if (!data || !slug || saving || (contract && !checked)) return;
    setSaving(true); setError('');
    try {
      await updateDoc(doc(db, contract ? 'publicContracts' : 'publicQuotes', slug), {
        status, [contract ? 'acceptedAt' : 'statusUpdatedAt']: serverTimestamp(),
      });
      setData({ ...data, status });
    } catch { setError('Não foi possível registrar. Se você já respondeu em outra aba, atualize o documento.'); }
    finally { setSaving(false); }
  }
  async function download() {
    if (!data) return;
    try {
    const { generateContractPdf, generateProposalPdf } = await import('../lib/pdf');
    const params = { ...data, company: data.clientCompany, document: data.clientDocument, address: data.clientAddress,
      reference: slug, publicUrl: window.location.href };
    if (contract) generateContractPdf(params); else generateProposalPdf(params);
    } catch { setError('Não foi possível gerar o PDF. Tente novamente.'); }
  }
  const title = contract ? 'Contrato de serviços' : 'Uma proposta para o seu próximo passo.';
  const state = data?.status || 'pendente';
  return (
    <main className="client-document">
      <nav className="document-nav" aria-label="Navegação do documento">
        <Link className="document-logo" to="/"><span>PG</span> Pedro Gomes<small>DESENVOLVIMENTO DIGITAL</small></Link>
        <a href={contactLink()} target="_blank" rel="noopener noreferrer">Falar com Pedro <ArrowIcon /></a>
      </nav>
      {loading ? <div className="document-empty" role="status">Preparando seu documento…</div> : !data ? (
        <section className="document-empty"><h1>{error ? 'Vamos tentar novamente?' : 'Documento não encontrado'}</h1>
          <p>{error || 'Confira o endereço ou peça um novo link ao Pedro.'}</p>
          {error && <button onClick={() => setAttempt(attempt + 1)}>Tentar novamente</button>}
        </section>
      ) : <>
        <header className="document-hero">
          <div className="document-eyebrow">{contract ? 'ACORDO DO PROJETO' : 'PROPOSTA COMERCIAL'} <span>{documentReference(slug)}</span></div>
          <h1>{title}</h1>
          <p>Preparado para <strong>{data.clientName}</strong>{data.clientCompany ? ` · ${data.clientCompany}` : ''}</p>
          <div className="document-hero-bottom"><span className="document-state">{({pendente: 'Aguardando sua resposta', aprovado: 'Proposta aprovada', recusado: 'Ajustes solicitados', aceito: 'Contrato aceito'} as Record<string, string>)[state] || state}</span>
            <button className="document-download" onClick={download}>Baixar PDF <ArrowIcon direction="down" /></button></div>
        </header>
        <div className="document-grid">
          <article className="document-paper">
            {contract && <section><span className="document-eyebrow">AS PARTES</span><h2>{data.clientName}</h2>
              {data.clientDocument && <p>CPF/CNPJ: {data.clientDocument}</p>}
              {data.clientAddress && <p>{data.clientAddress}</p>}
              <p>Contratado: Pedro Gomes · Desenvolvimento digital</p></section>}
            <section><span className="document-eyebrow">01 / {contract ? 'OBJETO E ENTREGAS' : 'SEU PROJETO'}</span><h2>{data.service}</h2>
              {!!data.items?.length && <ol className="document-deliverables">{data.items.map((item, i) => <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>}
            </section>
            <section><span className="document-eyebrow">02 / PAGAMENTO</span><p className="document-prewrap">{data.paymentTerms || DEFAULT_PAYMENT_TERMS}</p></section>
            {data.notes && <section><span className="document-eyebrow">03 / COMBINADOS DO PROJETO</span><p className="document-prewrap">{data.notes}</p></section>}
            <section><span className="document-eyebrow">CONDIÇÕES DO PROJETO</span>{DOCUMENT_CONDITIONS.map(([label, content]) => <div className="document-condition" key={label}><h3>{label}</h3><p>{content}</p></div>)}</section>
          </article>
          <aside className="document-summary">
            <div className="document-investment"><span className="document-eyebrow">INVESTIMENTO</span><strong>{money(data.value)}</strong><div><span>Prazo estimado</span><b>{data.deadlineDays} dias</b></div><small>Após pagamento combinado, briefing e materiais completos.</small></div>
            <section className="document-decision" aria-busy={saving}>
              {error && <div role="alert" className="document-error">{error}<button onClick={() => setAttempt(attempt + 1)}>Atualizar documento</button></div>}
              {state === 'pendente' ? <><h2>{contract ? 'Tudo certo para começar?' : 'Vamos tirar do papel?'}</h2><p>{contract ? 'Leia o escopo e as condições antes de registrar seu aceite.' : 'Sua resposta fica registrada para darmos o próximo passo.'}</p>
                {contract && <label className="document-consent"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />Li e concordo com o escopo e as condições deste contrato.</label>}
                <button disabled={saving || (contract && !checked)} onClick={() => decide(contract ? 'aceito' : 'aprovado')}>{saving ? 'Registrando…' : contract ? 'Aceitar contrato' : 'Aprovar proposta'} <ArrowIcon direction="right" /></button>
                {!contract && <button className="document-secondary" disabled={saving} onClick={() => decide('recusado')}>Solicitar ajustes</button>}
              </> : <div role="status"><h2>{state === 'recusado' ? 'Vamos ajustar juntos.' : 'Resposta registrada.'}</h2><p>{state === 'recusado' ? 'Converse com Pedro para alinhar os detalhes que precisam mudar.' : 'Pedro acompanhará sua resposta pelo painel e combinará os próximos passos com você.'}</p><a className="document-contact" href={contactLink(`Olá Pedro, quero conversar sobre ${data.service}. Referência ${documentReference(slug)}.`)} target="_blank" rel="noopener noreferrer">Conversar no WhatsApp <ArrowIcon /></a></div>}
            </section>
          </aside>
        </div>
        {data.clientSlug && <p><Link className="document-contact" to={`/cliente/${data.clientSlug}`}><ArrowIcon direction="left" /> Voltar para sua área de projetos</Link></p>}
        <footer className="document-footer">Preparado com cuidado por Pedro Gomes.<Link to="/">Conheça meu trabalho <ArrowIcon /></Link></footer>
      </>}
    </main>
  );
}
