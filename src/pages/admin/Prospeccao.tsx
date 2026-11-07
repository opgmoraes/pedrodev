import { useEffect, useRef, useState } from "react";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { buildWhatsappLink } from "../../lib/whatsapp";
import { auth } from "../../lib/firebaseClient";
import { listProspects, markProspectContacted, saveProspect } from "../../lib/prospectStore";
import { buildProspectBriefing, EMPTY_PROSPECT, prepareProspect, PROSPECT_STATUSES, prospectToForm, readProspectDraft, safeDemoUrl, SITE_SITUATIONS, storeProspectDraft, validCommercialPhone, type Prospect, type ProspectForm } from "../../lib/prospects";
import "./prospeccao.css";
import ProspectSearchPanel from "./ProspectSearchPanel";

export default function Prospeccao() {
  const [leads, setLeads] = useState<Prospect[]>([]);
  const [selected, setSelected] = useState<Prospect>();
  const [form, setForm] = useState<ProspectForm>({ ...EMPTY_PROSPECT });
  const [baseline, setBaseline] = useState(JSON.stringify(EMPTY_PROSPECT));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copyFallback, setCopyFallback] = useState("");
  const [orphanDraft, setOrphanDraft] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const editor = useRef<HTMLHeadingElement>(null);
  const adminId = auth.currentUser?.uid ?? "";
  const dirty = JSON.stringify(form) !== baseline;

  useEffect(() => {
    let active = true;
    listProspects().then(items => {
      if (!active) return;
      setLeads(items);
      const draft = readProspectDraft(adminId);
      if (draft) {
        const lead = items.find(item => item.id === draft.selectedId);
        // Lead removido por outro administrador não vira um cadastro novo acidentalmente.
        if (draft.selectedId && !lead) {
          setError("O lead do rascunho não está mais disponível. O rascunho foi mantido nesta aba.");
          setForm(draft.form); setOrphanDraft(true);
          return;
        }
        setSelected(lead); setForm(draft.form);
        setBaseline(JSON.stringify(lead ? prospectToForm(lead) : EMPTY_PROSPECT));
        setNotice("Rascunho recuperado. Salve para registrar as alterações.");
      }
      setDraftReady(true);
    })
      .catch(() => { if (active) setError(loadError); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [adminId]);

  useEffect(() => {
    // Uma falha de leitura não pode apagar um rascunho que ainda não foi recuperado.
    if (draftReady && !loading && adminId && !orphanDraft) storeProspectDraft(adminId, dirty ? { form, selectedId: selected?.id } : undefined);
  }, [adminId, dirty, draftReady, form, loading, orphanDraft, selected?.id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function selectLead(lead?: Prospect) {
    if (dirty && !window.confirm("Descartar as alterações ainda não salvas?")) return;
    const next = lead ? prospectToForm(lead) : { ...EMPTY_PROSPECT };
    setOrphanDraft(false);
    setSelected(lead); setForm(next); setBaseline(JSON.stringify(next));
    setError(""); setNotice(""); setCopyFallback("");
    editor.current?.focus();
  }

  function field<K extends keyof ProspectForm>(key: K, value: ProspectForm[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setNotice(""); setCopyFallback("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const id = await saveProspect(form, selected);
      const lead: Prospect = {
        ...selected, ...prepareProspect(form, selected?.status === "Contatado"), id,
        schemaVersion: selected?.schemaVersion ?? 1, origin: selected?.origin ?? "manual",
        contactedAt: selected?.contactedAt ?? null,
      };
      setLeads(items => selected ? items.map(item => item.id === id ? lead : item) : [lead, ...items]);
      const next = prospectToForm(lead);
      setSelected(lead); setForm(next); setBaseline(JSON.stringify(next));
      setNotice("Lead salvo. As ações abaixo usam os dados salvos.");
    } catch (err) {
      setError(err instanceof Error && !('code' in err) ? err.message : saveError);
    } finally { setSaving(false); }
  }

  async function copyBriefing() {
    if (!selected) return;
    setError(""); setNotice("");
    const text = buildProspectBriefing(selected);
    try { await navigator.clipboard.writeText(text); setNotice("Briefing copiado. Cole no Codex para criar a demo."); }
    catch { setCopyFallback(text); setError("Não foi possível copiar automaticamente. Selecione o texto abaixo e copie manualmente."); }
  }

  async function markContacted() {
    if (!selected) return;
    const confirmed = window.confirm(`Você confirma que enviou a abordagem para ${selected.company}? Abrir o WhatsApp não confirma o envio.`);
    if (!confirmed) return;
    setSaving(true); setError(""); setNotice("");
    try {
      await markProspectContacted(selected.id, confirmed);
      const items = await listProspects(); setLeads(items);
      const lead = items.find(item => item.id === selected.id);
      if (lead) {
        const next = prospectToForm(lead); setSelected(lead); setForm(next); setBaseline(JSON.stringify(next));
      }
      setNotice("Contato confirmado e data registrada.");
    } catch { setError("Não foi possível atualizar a confirmação. Recarregue a lista para conferir o registro antes de tentar novamente."); }
    finally { setSaving(false); }
  }

  const term = search.trim().toLocaleLowerCase("pt-BR");
  const filtered = leads.filter(lead => (!statusFilter || lead.status === statusFilter) &&
    [lead.company, lead.contactName, lead.phone, lead.diagnosis].some(value => value.toLocaleLowerCase("pt-BR").includes(term)));
  const actionsDisabled = !selected || dirty || saving || loading;
  const demoUrl = selected ? safeDemoUrl(selected.demoUrl) : "";
  const whatsappUrl = selected && validCommercialPhone(selected.phone) && selected.message.trim()
    ? buildWhatsappLink(selected.phone, selected.message) : "";

  return <div className="prospecting-page">
    <div className="crumb">admin / prospecção</div>
    <h1>Prospecção</h1>
    <p className="page-subtitle">Receba a pesquisa, prepare a demo e acompanhe o próximo contato.</p>
    {import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true" && <p className="badge">Ambiente local · dados nos emuladores</p>}
    <ErrorMessage message={error} />
    {notice && <p className="form-feedback" role="status">{notice}</p>}
    <ProspectSearchPanel existing={leads} disabled={loading || saving} onImported={async () => { setLeads(await listProspects()); }} />
    <div className="grid prospecting-grid">
      <section className="card" aria-label="Leads cadastrados">
        <div className="list-toolbar">
          <input type="search" aria-label="Buscar leads" placeholder="buscar empresa ou contato…" value={search} onChange={e => setSearch(e.target.value)} />
          <span className="count-pill">{filtered.length} leads</span>
          <button className="secondary" disabled={saving || loading} onClick={() => selectLead()}>Novo lead</button>
        </div>
        <label htmlFor="prospect-filter">Filtrar status</label>
        <select id="prospect-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos</option>{PROSPECT_STATUSES.map(status => <option key={status}>{status}</option>)}
        </select>
        {loading ? <p role="status">Carregando leads…</p> : <div className="table-scroll"><table>
          <thead><tr><th>empresa / contato</th><th>status / retorno</th><th><span className="sr-only">ações</span></th></tr></thead>
          <tbody>{filtered.map(lead => <tr key={lead.id} aria-selected={lead.id === selected?.id}>
            <td><strong>{lead.company}</strong><div>{lead.contactName || lead.phone || "Contato não informado"}</div></td>
            <td><span className="badge">{lead.status}</span><div>{lead.nextFollowUp ? `Retorno: ${lead.nextFollowUp.split("-").reverse().join("/")}` : "Sem retorno agendado"}</div></td>
            <td><button className="secondary" disabled={saving} aria-label={`Editar ${lead.company}`} onClick={() => selectLead(lead)}>Editar</button></td>
          </tr>)}{!filtered.length && <tr><td colSpan={3}>{leads.length ? "Nenhum lead corresponde à busca." : "Nenhum lead ainda. Cadastre o primeiro ao lado."}</td></tr>}</tbody>
        </table></div>}
      </section>
      <section className="card">
        <h2 ref={editor} tabIndex={-1}>{selected ? `Editar ${selected.company}` : "Novo lead"}</h2>
        <form onSubmit={save}>
          <fieldset disabled={saving || loading || orphanDraft}>
            <legend className="sr-only">Dados do lead</legend>
            <label htmlFor="prospect-company">Empresa *</label><input id="prospect-company" required value={form.company} onChange={e => field("company", e.target.value)} />
            <label htmlFor="prospect-contact">Contato comercial</label><input id="prospect-contact" value={form.contactName} onChange={e => field("contactName", e.target.value)} />
            <div className="grid grid-2">
              <div><label htmlFor="prospect-phone">WhatsApp com DDD</label><input id="prospect-phone" type="tel" placeholder="62999999999" value={form.phone} onChange={e => field("phone", e.target.value)} /></div>
              <div><label htmlFor="prospect-email">E-mail comercial</label><input id="prospect-email" type="email" value={form.email} onChange={e => field("email", e.target.value)} /></div>
            </div>
            <label htmlFor="prospect-sources">Fontes da pesquisa (uma por linha)</label><textarea id="prospect-sources" rows={3} placeholder="URLs ou referências consultadas" value={form.sources} onChange={e => field("sources", e.target.value)} />
            <label htmlFor="prospect-site">Situação do site</label><select id="prospect-site" value={form.siteSituation} onChange={e => field("siteSituation", e.target.value)}>{SITE_SITUATIONS.map(value => <option key={value}>{value}</option>)}</select>
            <label htmlFor="prospect-diagnosis">Diagnóstico</label><textarea id="prospect-diagnosis" rows={3} value={form.diagnosis} onChange={e => field("diagnosis", e.target.value)} />
            <label htmlFor="prospect-briefing">Briefing para a demo</label><textarea id="prospect-briefing" rows={6} value={form.briefing} onChange={e => field("briefing", e.target.value)} />
            <label htmlFor="prospect-demo">URL da demo</label><input id="prospect-demo" type="url" placeholder="https://…" value={form.demoUrl} onChange={e => field("demoUrl", e.target.value)} />
            <label htmlFor="prospect-message">Mensagem para WhatsApp</label><textarea id="prospect-message" rows={5} placeholder="Escreva e revise a abordagem. Inclua o link da demo quando estiver pronta." value={form.message} onChange={e => field("message", e.target.value)} />
            <div className="grid grid-2">
              <div><label htmlFor="prospect-status">Status</label><select id="prospect-status" value={form.status} onChange={e => field("status", e.target.value as ProspectForm["status"])}>{PROSPECT_STATUSES.map(value => <option key={value} disabled={value === "Contatado"}>{value}</option>)}</select></div>
              <div><label htmlFor="prospect-follow-up">Próxima data de retorno</label><input id="prospect-follow-up" type="date" value={form.nextFollowUp} onChange={e => field("nextFollowUp", e.target.value)} /></div>
            </div>
            <p className="prospect-hint">O status Contatado é registrado pelo botão de confirmação abaixo.</p>
            <button type="submit">{saving ? "Salvando…" : "Salvar lead"}</button>
          </fieldset>
        </form>
        <div className="prospect-actions" aria-label="Ações do lead">
          <button className="secondary" disabled={actionsDisabled || !selected?.briefing.trim()} onClick={copyBriefing}>Copiar briefing</button>
          {!actionsDisabled && demoUrl ? <a className="badge" href={demoUrl} target="_blank" rel="noreferrer">Abrir demo</a> : <button className="secondary" disabled>Abrir demo</button>}
          {!actionsDisabled && whatsappUrl ? <a className="badge badge-accent" href={whatsappUrl} target="_blank" rel="noreferrer">Abrir WhatsApp</a> : <button className="secondary" disabled>Abrir WhatsApp</button>}
          <button className="secondary" disabled={actionsDisabled || !whatsappUrl} onClick={markContacted}>Marcar como contatado</button>
        </div>
        <p className="prospect-hint">{dirty || !selected ? "Salve o lead para liberar as ações." : "Abrir o WhatsApp não registra envio. Confirme o contato somente depois de enviar a mensagem."}</p>
        {selected?.contactedAt && <p>Último contato confirmado: {selected.contactedAt.toDate().toLocaleString("pt-BR")}</p>}
        {selected?.sourceAttribution && <p className="prospect-hint"><a href={selected.sourceAttribution.url} target="_blank" rel="noreferrer">{selected.sourceAttribution.text}</a></p>}
        {selected?.sourcePhone && <p className="prospect-hint">Telefone original na fonte: {selected.sourcePhone}</p>}
        {copyFallback && <><label htmlFor="prospect-copy">Briefing para copiar manualmente</label><textarea id="prospect-copy" readOnly rows={10} value={copyFallback} onFocus={e => e.target.select()} /></>}
      </section>
    </div>
  </div>;
}
