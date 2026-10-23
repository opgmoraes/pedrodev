import { publishClient } from "../../lib/sharing";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
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
type Project = { id: string; name: string; status: string };

const TABS = ["visão geral", "projetos", "histórico"] as const;
type Tab = (typeof TABS)[number];

export default function ClienteDetalhe() {
  const [error, setError] = useState("");
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("visão geral");

  async function load() {
    setError("");
    try {
      if (!id) return;
      const snap = await getDoc(doc(db, "clients", id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Client;
        setClient(data);
        setNotes(data.notes || "");
      }
      const pSnap = await getDocs(
        query(collection(db, "projects"), where("clientId", "==", id)),
      );
      setProjects(
        pSnap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          status: d.data().status,
        })),
      );
    } catch {
      setError(loadError);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function saveNotes() {
    try {
      if (!id) return;
      setSaving(true);
      await updateDoc(doc(db, "clients", id), { notes });
      setSaving(false);
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  async function saveClient(e: React.FormEvent) {
    e.preventDefault();
    if (!client || !id) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { id: ignored, ...data } = client;
      await updateDoc(doc(db, "clients", id), data);
      await publishClient(id);
      setEditing(false);
      setNotice("Dados atualizados.");
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  if (error && !client) return <ErrorMessage message={error} />;
  if (!client)
    return (
      <div className="mono" style={{ color: "var(--text-muted)" }}>
        carregando…
      </div>
    );

  return (
    <div>
      <ErrorMessage message={error} />
      <div className="crumb">
        <Link to="/admin/clientes">admin / clientes</Link> / {client.name}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <div
          className="avatar avatar-lg"
          style={{ background: getAvatarColor(client.name) }}
        >
          {getInitials(client.name)}
        </div>
        <div>
          <h1 style={{ marginBottom: 2 }}>{client.name}</h1>
          <div
            className="mono"
            style={{ fontSize: 12, color: "var(--text-faint)" }}
          >
            {client.company || "sem empresa cadastrada"}
          </div>
        </div>
      </div>

      <div className="profile-tabs" style={{ marginTop: 20 }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {notice && (
        <p className="form-feedback" role="status">
          {notice}
        </p>
      )}
      <button className="secondary" onClick={() => setEditing(!editing)}>
        {editing ? "Fechar edição" : "Editar dados do cliente"}
      </button>
      {editing && (
        <form
          className="card"
          onSubmit={saveClient}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <h2>Dados do cliente</h2>
          {(
            [
              "name",
              "email",
              "phone",
              "company",
              "document",
              "address",
              "secondaryContact",
            ] as const
          ).map((field, i) => (
            <div key={field}>
              <label htmlFor={`edit-${field}`}>
                {
                  [
                    "Nome",
                    "E-mail",
                    "WhatsApp",
                    "Empresa",
                    "CPF/CNPJ",
                    "Endereço",
                    "Contato secundário",
                  ][i]
                }
              </label>
              <input
                id={`edit-${field}`}
                type={field === "email" ? "email" : "text"}
                required={field === "name" || field === "email"}
                value={client[field] || ""}
                onChange={(e) =>
                  setClient({ ...client, [field]: e.target.value })
                }
              />
            </div>
          ))}
          <button disabled={saving} style={{ marginTop: 20 }}>
            {saving ? "Salvando…" : "Salvar dados"}
          </button>
        </form>
      )}
      {tab === "visão geral" && (
        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              dados do cliente
            </div>
            <p>
              <strong>email:</strong> {client.email}
            </p>
            <p>
              <strong>whatsapp:</strong> {client.phone}
            </p>
            <p>
              <strong>empresa:</strong> {client.company || "—"}
            </p>
            <p>
              <strong>CPF/CNPJ:</strong> {client.document || "—"}
            </p>
            <p>
              <strong>endereço:</strong> {client.address || "—"}
            </p>
            <p>
              <strong>contato secundário:</strong>{" "}
              {client.secondaryContact || "—"}
            </p>
            <p
              className="mono"
              style={{ fontSize: 13, color: "var(--text-muted)" }}
            >
              /cliente/{client.slug}
            </p>
          </div>
          <div className="card">
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              resumo
            </div>
            <div className="stat-label">projetos</div>
            <div className="stat-value" style={{ marginBottom: 16 }}>
              {projects.length}
            </div>
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                <span style={{ fontSize: 13 }}>{p.name}</span>
                <span className="badge">{p.status}</span>
              </div>
            ))}
            {projects.length === 0 && (
              <p style={{ fontSize: 13 }}>nenhum projeto ainda</p>
            )}
          </div>
        </div>
      )}

      {tab === "projetos" && (
        <div className="card">
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            projetos do cliente
          </div>
          {projects.length === 0 && (
            <p style={{ fontSize: 13 }}>nenhum projeto ainda</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span>{p.name}</span>
              <span className="badge">{p.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "histórico" && (
        <div className="card">
          <div
            className="mono"
            style={{ fontSize: 12, color: "var(--text-muted)" }}
          >
            histórico / observações
          </div>
          <textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotações sobre conversas, decisões, pendências…"
            style={{ marginTop: 12 }}
          />
          <button
            style={{ marginTop: 12 }}
            onClick={saveNotes}
            disabled={saving}
          >
            {saving ? "salvando…" : "salvar histórico"}
          </button>
        </div>
      )}
    </div>
  );
}
