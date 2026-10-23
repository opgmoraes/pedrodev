import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { money } from "../../lib/brand";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
type Payment = {
  id: string;
  description: string;
  clientId: string;
  clientName: string;
  value: number;
  dueDate: string;
  status: "pendente" | "pago";
};
type Client = { id: string; name: string };
const empty = { description: "", clientId: "", value: "", dueDate: "" };
function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export default function Financeiro() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState("todos");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  async function load() {
    try {
      const [p, c] = await Promise.all([
        getDocs(query(collection(db, "payments"), orderBy("dueDate"))),
        getDocs(collection(db, "clients")),
      ]);
      setPayments(p.docs.map((d) => ({ id: d.id, ...d.data() }) as Payment));
      setClients(c.docs.map((d) => ({ id: d.id, name: d.data().name })));
    } catch {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "payments"), {
        ...form,
        clientName: clients.find((c) => c.id === form.clientId)?.name || "",
        value: Number(form.value),
        status: "pendente",
        createdAt: serverTimestamp(),
      });
      setForm(empty);
      await load();
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }
  async function toggle(payment: Payment) {
    setSaving(true);
    setError("");
    try {
      await updateDoc(doc(db, "payments", payment.id), {
        status: payment.status === "pago" ? "pendente" : "pago",
        paidAt: payment.status === "pago" ? null : serverTimestamp(),
      });
      await load();
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }
  const filtered = useMemo(
    () =>
      payments.filter(
        (p) =>
          filter === "todos" ||
          (filter === "atrasado"
            ? p.status === "pendente" && p.dueDate < localDate()
            : p.status === filter),
      ),
    [payments, filter],
  );
  const total = (status: string) =>
    payments
      .filter((p) => p.status === status)
      .reduce((s, p) => s + p.value, 0);
  return (
    <>
      <div className="crumb">ADMIN / FINANCEIRO</div>
      <h1>Financeiro</h1>
      <p className="page-subtitle">
        Parcelas, vencimentos e recebimentos dos seus projetos.
      </p>
      <ErrorMessage message={error} />
      <div className="grid grid-3">
        <div className="card">
          <div className="stat-label">A receber</div>
          <div className="stat-value">{money(total("pendente"))}</div>
        </div>
        <div className="card">
          <div className="stat-label">Recebido</div>
          <div className="stat-value">{money(total("pago"))}</div>
        </div>
        <div className="card">
          <div className="stat-label">Em atraso</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>
            {money(
              payments
                .filter(
                  (p) => p.status === "pendente" && p.dueDate < localDate(),
                )
                .reduce((s, p) => s + p.value, 0),
            )}
          </div>
        </div>
      </div>
      <div
        className="grid grid-2"
        style={{ marginTop: 25, alignItems: "start" }}
      >
        <section className="card">
          <div className="list-toolbar">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrar recebimentos"
            >
              <option value="todos">Todos os lançamentos</option>
              <option value="pendente">A receber</option>
              <option value="pago">Recebidos</option>
              <option value="atrasado">Em atraso</option>
            </select>
            <span className="count-pill">{filtered.length} lançamentos</span>
          </div>
          {loading ? (
            <p role="status">Carregando lançamentos…</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.description}
                        <small
                          style={{
                            display: "block",
                            color: "var(--text-muted)",
                          }}
                        >
                          {p.clientName}
                        </small>
                      </td>
                      <td>{money(p.value)}</td>
                      <td>{p.dueDate.split("-").reverse().join("/")}</td>
                      <td>
                        <span
                          className={`badge ${p.status === "pago" ? "badge-success" : p.dueDate < localDate() ? "badge-danger" : ""}`}
                        >
                          {p.status === "pago"
                            ? "Recebido"
                            : p.dueDate < localDate()
                              ? "Atrasado"
                              : "Pendente"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="secondary"
                          disabled={saving}
                          onClick={() => toggle(p)}
                        >
                          {p.status === "pago" ? "Reabrir" : "Dar baixa"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={5}>Nenhum lançamento encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <form className="card" onSubmit={submit}>
          <h2>Novo lançamento</h2>
          <label htmlFor="payment-client">Cliente</label>
          <select
            id="payment-client"
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          >
            <option value="">Selecione</option>
            {clients.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label htmlFor="payment-description">Descrição / parcela</label>
          <input
            id="payment-description"
            required
            maxLength={180}
            placeholder="Site institucional · parcela 1 de 2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label htmlFor="payment-value">Valor (R$)</label>
          <input
            id="payment-value"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <label htmlFor="payment-due">Vencimento</label>
          <input
            id="payment-due"
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <button disabled={saving} style={{ marginTop: 24 }}>
            {saving ? "Salvando…" : "Criar lançamento"}
          </button>
        </form>
      </div>
    </>
  );
}
