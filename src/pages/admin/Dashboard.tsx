import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { publicStatus, publishAllLinks } from "../../lib/sharing";
import { money } from "../../lib/brand";
import { ErrorMessage, loadError } from "../../components/Feedback";
type Row = {
  id: string;
  name?: string;
  clientName?: string;
  status?: string;
  service?: string;
  value?: number;
};
export default function Dashboard() {
  const [data, setData] = useState<{
    clients: Row[];
    projects: Row[];
    quotes: Row[];
    payments: Row[];
  }>({ clients: [], projects: [], quotes: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const [clients, projects, quotes, payments] = await Promise.all(
          ["clients", "projects", "quotes", "payments"].map((c) =>
            getDocs(collection(db, c)),
          ),
        );
        setData({
          clients: clients.docs.map((d) => ({ id: d.id, ...d.data() })),
          projects: projects.docs.map((d) => ({ id: d.id, ...d.data() })),
          quotes: await Promise.all(
            quotes.docs.map(async (d) => ({
              id: d.id,
              ...d.data(),
              status: await publicStatus("quotes", d.data()),
            })),
          ),
          payments: payments.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
      } catch {
        setError(loadError);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  async function sync() {
    setSyncing(true);
    setError("");
    setNotice("");
    try {
      await publishAllLinks();
      setNotice("Links de clientes, propostas e contratos atualizados.");
    } catch {
      setError(
        "Não foi possível atualizar os links. Confira as regras de acesso e tente novamente.",
      );
    } finally {
      setSyncing(false);
    }
  }
  const active = data.projects.filter((p) => p.status !== "Concluído");
  const pending = data.quotes.filter((q) => q.status === "pendente");
  const receivable = data.payments
    .filter((p) => p.status === "pendente")
    .reduce((sum, p) => sum + (p.value || 0), 0);
  const hour = new Date().getHours();
  return (
    <>
      <div className="dashboard-welcome">
        <div
          className="studio-eyebrow"
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            color: "#9fbbe6",
            marginBottom: 15,
          }}
        >
          VISÃO GERAL
        </div>
        <h1>
          {hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"},
          Pedro.
        </h1>
        <p>Um novo dia para transformar boas ideias em entregas.</p>
      </div>
      <ErrorMessage message={error} />
      {loading && <p role="status">Carregando indicadores…</p>}
      <div className="grid grid-3">
        {[
          ["Clientes", data.clients.length, "/admin/clientes"],
          ["Projetos em andamento", active.length, "/admin/projetos"],
          ["Contas a receber", money(receivable), "/admin/financeiro"],
        ].map(([label, value, path]) => (
          <Link className="card" to={String(path)} key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{loading ? "—" : value}</div>
            <span style={{ color: "var(--accent)", fontSize: 11 }}>
              Ver detalhes ↗
            </span>
          </Link>
        ))}
      </div>
      <div className="grid grid-2 dashboard-lists">
        <section className="card">
          <h2>Projetos em andamento</h2>
          {!active.length && !loading && (
            <p>Nenhum projeto em andamento. Cadastre o próximo.</p>
          )}
          {active.slice(0, 5).map((p) => (
            <Link
              className="dashboard-list-row"
              to="/admin/projetos"
              key={p.id}
            >
              <span>{p.name}</span>
              <span className="badge">{p.status}</span>
            </Link>
          ))}
          <Link to="/admin/projetos" className="link-underline">
            Gerenciar projetos ↗
          </Link>
        </section>
        <section className="card">
          <h2>Propostas aguardando resposta</h2>
          {!pending.length && !loading && <p>Nenhuma proposta pendente.</p>}
          {pending.slice(0, 5).map((q) => (
            <Link
              className="dashboard-list-row"
              to="/admin/orcamentos"
              key={q.id}
            >
              <span>
                {q.clientName || "Cliente"}
                <small>{q.service}</small>
              </span>
              <span className="dashboard-money">{money(q.value || 0)}</span>
            </Link>
          ))}
          <Link to="/admin/orcamentos" className="link-underline">
            Gerenciar propostas ↗
          </Link>
        </section>
      </div>
      <h2>Ações rápidas</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/admin/clientes" className="badge badge-accent">
          + Novo cliente
        </Link>
        <Link to="/admin/projetos" className="badge badge-accent">
          + Novo projeto
        </Link>
        <Link to="/admin/orcamentos" className="badge badge-accent">
          + Nova proposta
        </Link>
      </div>
      <section className="card" style={{ marginTop: 28 }}>
        <h2>Links compartilhados</h2>
        <p>
          Se você já tinha clientes e propostas cadastrados antes desta
          atualização, prepare os links existentes uma vez. As novas criações
          são preparadas automaticamente.
        </p>
        <button className="secondary" onClick={sync} disabled={syncing}>
          {syncing ? "Atualizando…" : "Preparar links existentes"}
        </button>
        {notice && (
          <p className="form-feedback" role="status">
            {notice}
          </p>
        )}
      </section>
    </>
  );
}
