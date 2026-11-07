import { useState } from "react";
import { auth } from "../../lib/firebaseClient";
import { importSearchProspects } from "../../lib/prospectStore";
import { BRAZIL_UFS, isProspectDuplicate, validateSearchQuery, type SearchLead, type SearchResponse } from "../../lib/prospectSearch";
import { SITE_SITUATIONS, type Prospect } from "../../lib/prospects";
import { ErrorMessage } from "../../components/Feedback";

type Props = { existing: Prospect[]; disabled: boolean; onImported: () => Promise<void> };

export default function ProspectSearchPanel({ existing, disabled, onImported }: Props) {
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [limit, setLimit] = useState(5);
  const [response, setResponse] = useState<SearchResponse>();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const results = response?.results || [];
  const duplicate = (lead: SearchLead) => existing.some(item => isProspectDuplicate(lead, item));

  async function search(event: React.FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const query = validateSearchQuery({ niche, city, limit, ...(uf ? { uf } : {}) });
      if (!auth.currentUser) throw new Error("Entre como administrador para buscar leads.");
      setBusy(true); setResponse(undefined); setSelected(new Set());
      const token = await auth.currentUser.getIdToken();
      const result = await fetch("/api/prospect-search", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        // Duas etapas, fila pública e autenticação: o navegador não deve abortar antes do servidor.
        body: JSON.stringify(query), signal: AbortSignal.timeout(80000),
      });
      if (!result.headers.get("content-type")?.includes("application/json")) {
        if (result.status === 404) throw new Error("A rota /api/prospect-search não existe neste deploy.");
        if (result.status >= 500) throw new Error(`Falha no servidor de busca (HTTP ${result.status}). Consulte os logs do deploy.`);
        throw new Error(`Resposta inesperada do servidor de busca (HTTP ${result.status}).`);
      }
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Não foi possível buscar leads.");
      setResponse(data as SearchResponse);
    } catch (failure) {
      setError(failure instanceof Error ? failure.name === "TimeoutError" ? "A busca demorou demais. Tente novamente." : failure.message : "Falha na busca. Tente novamente.");
    } finally { setBusy(false); }
  }

  function review(index: number, changes: Partial<SearchLead>) {
    setResponse(current => current ? { ...current, results: current.results.map((lead, i) => i === index ? { ...lead, ...changes } : lead) } : current);
    // Após revisar, a pessoa seleciona novamente o resultado que deseja importar.
    setSelected(current => { const next = new Set(current); next.delete(index); return next; });
  }

  async function importSelected() {
    setBusy(true); setError(""); setNotice("");
    let imported = false;
    try {
      const summary = await importSearchProspects(results.filter((lead, index) => selected.has(index) && !duplicate(lead)));
      imported = true;
      setSelected(new Set());
      setNotice(`${summary.imported} lead(s) importado(s); ${summary.skipped} duplicata(s) preservada(s).`);
      await onImported();
    } catch (failure) {
      setError(imported ? "A importação foi concluída, mas a lista não atualizou. Recarregue a página para conferir os leads." : failure instanceof Error && !("code" in failure) ? failure.message : "A importação não foi concluída. Confira a conexão e as permissões e tente novamente; a deduplicação protege uma nova tentativa.");
    } finally { setBusy(false); }
  }

  return <section className="card prospect-search-panel" aria-labelledby="prospect-search-heading">
    <h2 id="prospect-search-heading">Buscar leads</h2>
    <p>Pesquise empresas e revise os resultados antes de importar. Leads já cadastrados são preservados.</p>
    <ErrorMessage message={error} />
    {notice && <p role="status" className="form-feedback">{notice}</p>}
    <form onSubmit={search}>
      <fieldset disabled={busy || disabled} className="prospect-search-fields">
        <legend className="sr-only">Parâmetros da pesquisa</legend>
        <div><label htmlFor="search-niche">Nicho</label><input id="search-niche" required maxLength={100} placeholder="Ex.: clínicas odontológicas" value={niche} onChange={event => setNiche(event.target.value)} /></div>
        <div><label htmlFor="search-city">Cidade</label><input id="search-city" required maxLength={100} placeholder="Ex.: Luziânia, GO" value={city} onChange={event => setCity(event.target.value)} /></div>
        <div><label htmlFor="search-uf">UF</label><select id="search-uf" value={uf} onChange={event => setUf(event.target.value)}><option value="">UF na cidade</option>{BRAZIL_UFS.map(value => <option key={value}>{value}</option>)}</select></div>
        <div><label htmlFor="search-limit">Limite de resultados</label><input id="search-limit" type="number" min={1} max={20} step={1} required value={limit} onChange={event => setLimit(Number(event.target.value))} /></div>
        <button type="submit">{busy ? "Processando…" : "Buscar leads"}</button>
      </fieldset>
    </form>
    {response && <>
      <p role="status" className="prospect-hint">{response.isTestData ? "DADOS DE TESTE — empresas e contatos fictícios. Nenhuma busca real foi executada." : `Fonte: ${response.provider}. Confira os contatos e as fontes antes de abordar.`} {results.length} resultado(s).</p>
      {response.attribution && <p className="prospect-hint"><a href={response.attribution.url} target="_blank" rel="noreferrer">{response.attribution.text}</a></p>}
      {results.length ? <>
        <p className="prospect-hint">Telefone encontrado não significa WhatsApp confirmado. “Site não localizado” se refere à fonte consultada e não comprova ausência de site.</p>
        <div className="table-scroll"><table>
          <thead><tr><th>importar</th><th>empresa / contato comercial</th><th>situação do site / fontes</th></tr></thead>
          <tbody>{results.map((lead, index) => {
            const exists = duplicate(lead);
            return <tr key={`${lead.provider}:${lead.externalId}:${index}`}>
              <td><input type="checkbox" aria-label={`Importar ${lead.company}`} disabled={busy || disabled || exists} checked={selected.has(index) && !exists} onChange={event => setSelected(current => { const next = new Set(current); if (event.target.checked) next.add(index); else next.delete(index); return next; })} />{exists && <span className="badge">Já cadastrado</span>}</td>
              <td><fieldset disabled={busy || exists}>
                <label htmlFor={`result-company-${index}`}>Empresa</label><input id={`result-company-${index}`} value={lead.company} onChange={event => review(index, { company: event.target.value })} />
                <p>{lead.address || lead.city}</p>
                <label htmlFor={`result-contact-${index}`}>Contato comercial (se identificado)</label><input id={`result-contact-${index}`} value={lead.contactName} placeholder="Nome não informado pela fonte" onChange={event => review(index, { contactName: event.target.value })} />
                <label htmlFor={`result-phone-${index}`}>Telefone comercial encontrado</label><input id={`result-phone-${index}`} type="tel" value={lead.phone} placeholder="Telefone não localizado" onChange={event => review(index, { phone: event.target.value })} />
                {lead.sourcePhone && !lead.phone && <p>Telefone registrado na fonte: {lead.sourcePhone}. Confira o DDD antes de usar.</p>}
                <label htmlFor={`result-email-${index}`}>E-mail comercial</label><input id={`result-email-${index}`} type="email" value={lead.email} placeholder="E-mail não localizado" onChange={event => review(index, { email: event.target.value })} />
              </fieldset></td>
              <td><label htmlFor={`result-site-${index}`}>Situação do site</label><select id={`result-site-${index}`} disabled={busy || exists} value={lead.siteSituation} onChange={event => review(index, { siteSituation: event.target.value })}>{SITE_SITUATIONS.map(value => <option key={value}>{value}</option>)}</select>
                <p>Observação original da fonte: {lead.evidenceNote}</p>
                <ul>{lead.sources.map(url => <li key={url}><a href={url} target="_blank" rel="noreferrer">{url}</a></li>)}</ul>
              </td>
            </tr>;
          })}</tbody>
        </table></div>
        <button className="secondary" disabled={busy || disabled || !results.some((lead, index) => selected.has(index) && !duplicate(lead))} onClick={importSelected}>Importar selecionados ({results.filter((lead, index) => selected.has(index) && !duplicate(lead)).length})</button>
      </> : <p>{response.message || "Nenhum resultado encontrado. Tente outro nicho ou cidade."}</p>}
    </>}
  </section>;
}
