import ArrowIcon from "../../components/ArrowIcon";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { createClient } from "../../lib/sharing";
import { generateSlug } from "../../lib/slug";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { getInitials, getAvatarColor } from "../../lib/avatar";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  document?: string;
  address?: string;
  secondaryContact?: string;
  notes?: string;
  slug: string;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  document: "",
  address: "",
  secondaryContact: "",
  notes: "",
};

export default function Clientes() {
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q),
    );
  }, [clients, search]);

  async function load() {
    setError("");
    try {
      const snap = await getDocs(
        query(collection(db, "clients"), orderBy("createdAt", "desc")),
      );
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Client));
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
      const slug = generateSlug(form.company || form.name);
      await createClient({ ...form, slug, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setLoading(false);
      load();
    } catch {
      setError(saveError);
    } finally {
      setLoading(false);
    }
  }

  function whatsappPrimeiroContato(c: Client) {
    return buildWhatsappLink(c.phone, templates.primeiroContato(c.name));
  }

  function whatsappBriefing(c: Client) {
    const link = `${window.location.origin}/cliente/${c.slug}`;
    return buildWhatsappLink(c.phone, templates.briefingLink(c.name, link));
  }

  return (
    <div>
      <ErrorMessage message={error} />
      <div className="crumb">admin / clientes</div>
      <h1>Clientes</h1>
      <div
        className="grid grid-2"
        style={{ marginTop: 20, alignItems: "start" }}
      >
        <div className="card">
          <div className="list-toolbar">
            <input
              type="search"
              className="list-search"
              placeholder="buscar por nome ou empresa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="count-pill">
              {filtered.length} cliente{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="table-scroll">
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
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="name-cell">
                        <div
                          className="avatar avatar-sm"
                          style={{ background: getAvatarColor(c.name) }}
                        >
                          {getInitials(c.name)}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td>{c.company || "—"}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      {c.phone ? (
                        <>
                          <a
                            href={whatsappPrimeiroContato(c)}
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
                              contato
                            </span>
                          </a>
                          <a
                            href={whatsappBriefing(c)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="badge">briefing</span>
                          </a>
                        </>
                      ) : (
                        <span
                          style={{ color: "var(--text-muted)", fontSize: 12 }}
                        >
                          sem telefone
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/clientes/${c.id}`}
                        className="mono"
                        style={{ color: "var(--accent)", fontSize: 13 }}
                      >
                        ver <ArrowIcon direction="right" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && clients.length > 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--text-muted)" }}>
                      nenhum cliente bate com essa busca
                    </td>
                  </tr>
                )}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--text-muted)" }}>
                      nenhum cliente ainda
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
            novo cliente
          </div>
          <label htmlFor="field-1">nome</label>
          <input
            id="field-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <label htmlFor="field-2">email</label>
          <input
            id="field-2"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label htmlFor="field-3">whatsapp (com DDD)</label>
          <input
            id="field-3"
            placeholder="62999999999"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <label htmlFor="field-4">empresa (opcional)</label>
          <input
            id="field-4"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

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
              <label htmlFor="field-5">CPF/CNPJ (opcional)</label>
              <input
                id="field-5"
                value={form.document}
                onChange={(e) => setForm({ ...form, document: e.target.value })}
              />
              <label htmlFor="field-6">endereço (opcional)</label>
              <input
                id="field-6"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <label htmlFor="field-7">contato secundário (opcional)</label>
              <input
                id="field-7"
                placeholder="nome e telefone de outra pessoa da empresa"
                value={form.secondaryContact}
                onChange={(e) =>
                  setForm({ ...form, secondaryContact: e.target.value })
                }
              />
              <label htmlFor="field-8">
                observações / histórico inicial (opcional)
              </label>
              <textarea
                id="field-8"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </>
          )}

          <button style={{ marginTop: 20 }} disabled={loading}>
            {loading ? "salvando…" : "salvar cliente"}
          </button>
        </form>
      </div>
    </div>
  );
}
