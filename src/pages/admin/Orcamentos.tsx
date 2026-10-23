import { money } from "../../lib/brand";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { createShared, publicStatus } from "../../lib/sharing";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { buildWhatsappLink, templates } from "../../lib/whatsapp";
import { generateProposalPdf, generateContractPdf } from "../../lib/pdf";
import { SERVICOS, getServiceById } from "../../lib/services";
import { generateSlug } from "../../lib/slug";

type Client = {
  id: string;
  name: string;
  phone: string;
  company?: string;
  document?: string;
  address?: string;
};
type Quote = {
  id: string;
  clientId: string;
  clientName?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientDocument?: string;
  clientAddress?: string;
  serviceId?: string;
  service: string;
  items?: string[];
  value: number;
  deadlineDays: number;
  slug?: string;
  paymentTerms?: string;
  notes?: string;
  status?: "pendente" | "aprovado" | "recusado";
};

export default function Orcamentos() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    clientId: "",
    serviceId: "",
    service: "",
    items: "",
    value: "",
    deadlineDays: "",
    paymentTerms: "",
    notes: "",
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotes;
    return quotes.filter(
      (qt) =>
        (qt.clientName ?? "").toLowerCase().includes(q) ||
        qt.service.toLowerCase().includes(q),
    );
  }, [quotes, search]);

  function handleServiceSelect(serviceId: string) {
    const svc = getServiceById(serviceId);
    if (!svc) {
      setForm({ ...form, serviceId: "", service: "", items: "" });
      return;
    }
    setForm({
      ...form,
      serviceId,
      service: svc.titulo,
      items: svc.itens.join("\n"),
      value: form.value || String(svc.precoInicialSugerido),
      deadlineDays: form.deadlineDays || String(svc.prazoSugeridoDias),
    });
  }

  async function load() {
    setError("");
    try {
      const [cSnap, qSnap] = await Promise.all([
        getDocs(collection(db, "clients")),
        getDocs(query(collection(db, "quotes"), orderBy("createdAt", "desc"))),
      ]);
      const clientsList = cSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name as string,
          phone: data.phone as string,
          company: data.company as string | undefined,
          document: data.document as string | undefined,
          address: data.address as string | undefined,
        };
      });
      const clientsMap = new Map(clientsList.map((c) => [c.id, c]));
      setClients(clientsList);
      setQuotes(
        await Promise.all(
          qSnap.docs.map(async (d) => {
            const data = d.data();
            const client = clientsMap.get(data.clientId);
            return {
              id: d.id,
              clientId: data.clientId,
              clientName: data.clientName || client?.name,
              clientPhone: client?.phone,
              clientCompany: data.clientCompany || client?.company,
              clientDocument: client?.document,
              clientAddress: client?.address,
              serviceId: data.serviceId,
              service: data.service,
              items: data.items ?? [],
              value: data.value,
              deadlineDays: data.deadlineDays,
              slug: data.slug,
              paymentTerms: data.paymentTerms,
              notes: data.notes,
              status: await publicStatus("quotes", data),
            };
          }),
        ),
      );
    } catch {
      setError(loadError);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);
      const client = clients.find((c) => c.id === form.clientId);
      await createShared("quotes", {
        clientId: form.clientId,
        // Snapshot do cliente no momento da criação: a página pública de
        // proposta lê só este documento (sem auth), então precisa ter tudo
        // que vai exibir já aqui dentro.
        clientName: client?.name ?? null,
        clientCompany: client?.company ?? null,
        serviceId: form.serviceId || null,
        service: form.service,
        items: form.items
          ? form.items
              .split("\n")
              .map((i) => i.trim())
              .filter(Boolean)
          : [],
        value: Number(form.value),
        deadlineDays: Number(form.deadlineDays),
        paymentTerms: form.paymentTerms.trim(),
        notes: form.notes.trim(),
        slug: generateSlug(client?.company || client?.name),
        status: "pendente",
        createdAt: serverTimestamp(),
      });
      setForm({
        clientId: "",
        serviceId: "",
        service: "",
        items: "",
        value: "",
        deadlineDays: "",
    paymentTerms: "",
    notes: "",
      });
      setLoading(false);
      load();
    } catch {
      setError(saveError);
    } finally {
      setLoading(false);
    }
  }

  function whatsappOrcamento(q: Quote) {
    if (!q.clientPhone || !q.clientName) return null;
    const link = q.slug
      ? `${window.location.origin}/proposta/${q.slug}`
      : undefined;
    return buildWhatsappLink(
      q.clientPhone,
      templates.orcamento(
        q.clientName,
        q.service,
        q.value,
        q.deadlineDays,
        link,
      ),
    );
  }

  function whatsappFollowUp(q: Quote) {
    if (!q.clientPhone || !q.clientName) return null;
    return buildWhatsappLink(q.clientPhone, templates.followUp(q.clientName));
  }

  function handleProposalPdf(q: Quote) {
    if (!q.clientName) return;
    generateProposalPdf({
      clientName: q.clientName,
      company: q.clientCompany,
      publicUrl: q.slug ? `${window.location.origin}/proposta/${q.slug}` : undefined,
      service: q.service,
      items: q.items,
      value: q.value,
      deadlineDays: q.deadlineDays,
      paymentTerms: q.paymentTerms,
      notes: q.notes,
      reference: q.slug || q.id,
      status: q.status,
    });
  }

  function handleContractPdf(q: Quote) {
    if (!q.clientName) return;
    generateContractPdf({
      draft: true,
      clientName: q.clientName,
      company: q.clientCompany,
      document: q.clientDocument,
      address: q.clientAddress,
      service: q.service,
      items: q.items,
      value: q.value,
      deadlineDays: q.deadlineDays,
      paymentTerms: q.paymentTerms,
      notes: q.notes,
      reference: q.slug || q.id,
      status: "pendente",
    });
  }

  return (
    <div>
      <ErrorMessage message={error} />
      {notice && <p className="form-feedback" role="status">{notice}</p>}
      <div className="crumb">admin / orcamentos</div>
      <h1>Orçamentos / Propostas</h1>
      <div
        className="grid grid-2"
        style={{ marginTop: 20, alignItems: "start" }}
      >
        <div className="card">
          <div className="list-toolbar">
            <input
              type="search"
              className="list-search"
              placeholder="buscar por cliente ou serviço…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="count-pill">
              {filtered.length} orçamento{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>cliente</th>
                  <th>serviço</th>
                  <th>valor</th>
                  <th>prazo</th>
                  <th>status</th>
                  <th>ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => {
                  const linkOrcamento = whatsappOrcamento(q);
                  const linkFollowUp = whatsappFollowUp(q);
                  return (
                    <tr key={q.id}>
                      <td>{q.clientName ?? "—"}</td>
                      <td>
                        {q.service}
                        {q.items && q.items.length > 0 && (
                          <details style={{ marginTop: 4 }}>
                            <summary
                              style={{
                                cursor: "pointer",
                                fontSize: 11,
                                color: "var(--text-muted)",
                              }}
                            >
                              {q.items.length} itens
                            </summary>
                            <ul
                              style={{
                                margin: "6px 0 0",
                                paddingLeft: 16,
                                fontSize: 12,
                                color: "var(--text-muted)",
                              }}
                            >
                              {q.items.map((it) => (
                                <li key={it}>{it}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </td>
                      <td>{money(q.value)}</td>
                      <td>{q.deadlineDays}d</td>
                      <td>
                        <span
                          className="badge"
                          style={
                            q.status === "aprovado"
                              ? {
                                  borderColor: "var(--accent)",
                                  color: "var(--accent)",
                                }
                              : q.status === "recusado"
                                ? { borderColor: "#f87171", color: "#f87171" }
                                : undefined
                          }
                        >
                          {q.status ?? "pendente"}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {q.slug && (
                          <>
                            <a
                              href={`/proposta/${q.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="badge">ver proposta</span>
                            </a>
                            <button type="button" className="badge secondary"
                              onClick={async () => {
                                try { await navigator.clipboard.writeText(`${window.location.origin}/proposta/${q.slug}`); setNotice('Link da proposta copiado.'); }
                                catch { setError('Não foi possível copiar. Abra a proposta e copie o endereço.'); }
                              }}
                            >
                              copiar link
                            </button>
                          </>
                        )}
                        {linkOrcamento && (
                          <>
                            <a
                              href={linkOrcamento}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span
                                className="badge"
                                style={{
                                  borderColor: "var(--accent)",
                                  color: "var(--accent)",
                                }}
                              >
                                enviar
                              </span>
                            </a>
                            <a
                              href={linkFollowUp!}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="badge">follow-up</span>
                            </a>
                          </>
                        )}
                        <button type="button" className="badge secondary"
                          onClick={() => handleProposalPdf(q)}
                        >
                          PDF proposta
                        </button>
                        <button type="button" className="badge secondary"
                          onClick={() => handleContractPdf(q)}
                        >
                          Minuta de contrato
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: "var(--text-muted)" }}>
                      nenhum orçamento ainda
                    </td>
                  </tr>
                )}
                {filtered.length === 0 && quotes.length > 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: "var(--text-muted)" }}>
                      nenhum orçamento bate com essa busca
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <div
            className="mono"
            style={{ fontSize: 12, color: "var(--text-muted)" }}
          >
            novo orçamento
          </div>
          <label htmlFor="field-1">cliente</label>
          <select
            id="field-1"
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            required
          >
            <option value="">selecione</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label htmlFor="field-2">serviço do catálogo</label>
          <select
            id="field-2"
            value={form.serviceId}
            onChange={(e) => handleServiceSelect(e.target.value)}
          >
            <option value="">personalizado (sem catálogo)</option>
            {SERVICOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.titulo} · sugestão R$ {s.faixaValor.min}–{s.faixaValor.max}
              </option>
            ))}
          </select>

          <label htmlFor="field-3">nome do serviço (aparece pro cliente)</label>
          <input
            id="field-3"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            required
          />

          <label htmlFor="field-4">
            escopo / itens inclusos (um por linha)
          </label>
          <textarea
            id="field-4"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
            rows={6}
            style={{ width: "100%", resize: "vertical" }}
          />

          <label htmlFor="field-5">valor (R$)</label>
          <input
            id="field-5"
            type="number"
            min="0.01"
            step="0.01"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
          {form.serviceId && (
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: -8,
              }}
            >
              Faixa sugerida pro catálogo: R${" "}
              {getServiceById(form.serviceId)?.faixaValor.min}–
              {getServiceById(form.serviceId)?.faixaValor.max}
            </p>
          )}

          <label htmlFor="field-6">prazo (dias)</label>
          <input
            id="field-6"
            type="number"
            min="1"
            step="1"
            value={form.deadlineDays}
            onChange={(e) => setForm({ ...form, deadlineDays: e.target.value })}
            required
          />
          <label htmlFor="quote-payment">Condições de pagamento</label>
          <textarea id="quote-payment" rows={3} maxLength={2000} placeholder="Ex.: 50% no início e 50% na entrega." value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })} />
          <label htmlFor="quote-notes">Combinados específicos (opcional)</label>
          <textarea id="quote-notes" rows={3} maxLength={4000} placeholder="Revisões, materiais, manutenção e outros detalhes combinados." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button style={{ marginTop: 20 }} disabled={loading}>
            {loading ? "salvando…" : "criar orçamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
