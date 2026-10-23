import { money } from "../../lib/brand";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../../lib/firebaseClient";

type Quote = {
  id: string;
  clientName?: string;
  clientCompany?: string;
  service: string;
  items?: string[];
  value: number;
  deadlineDays: number;
  status: "pendente" | "aprovado" | "recusado";
};

export default function PropostaPublica() {
  const [error, setError] = useState("");
  const { slug } = useParams<{ slug: string }>();
  const [quote, setQuote] = useState<Quote | null | "not-found">(null);
  const [saving, setSaving] = useState(false);
  const [ajusteMsg, setAjusteMsg] = useState(false);

  async function load() {
    try {
      if (!slug) return;
      if (!hasFirebaseConfig) {
        setError(loadError);
        return;
      }
      const snap = await getDoc(doc(db, "publicQuotes", slug));
      if (!snap.exists()) {
        setQuote("not-found");
        return;
      }
      const d = snap;
      const data = d.data();
      setQuote({
        id: d.id,
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        service: data.service,
        items: data.items ?? [],
        value: data.value,
        deadlineDays: data.deadlineDays,
        status: data.status ?? "pendente",
      });
    } catch {
      setError(loadError);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  async function handleDecision(status: "aprovado" | "recusado") {
    try {
      if (!quote || quote === "not-found") return;
      setSaving(true);
      await updateDoc(doc(db, "publicQuotes", quote.id), {
        status,
        statusUpdatedAt: serverTimestamp(),
      });
      setQuote({ ...quote, status });
      setSaving(false);
      if (status === "recusado") setAjusteMsg(true);
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  if (error)
    return (
      <div className="container">
        <ErrorMessage message={error} />
        <button className="secondary" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );

  if (quote === null) {
    return (
      <div
        className="container mono"
        style={{ textAlign: "center", paddingTop: 80 }}
      >
        carregando…
      </div>
    );
  }

  if (quote === "not-found") {
    return (
      <div
        className="container"
        style={{ maxWidth: 480, textAlign: "center", paddingTop: 80 }}
      >
        <div className="crumb" style={{ justifyContent: "center" }}>
          home / proposta
        </div>
        <h1>Proposta não encontrada</h1>
        <p style={{ color: "var(--text-muted)" }}>
          O link pode estar incorreto ou a proposta foi removida. Fale com o
          Pedro pra receber um novo link.
        </p>
        <Link to="/">
          <button className="secondary" style={{ marginTop: 20 }}>
            Voltar pro site
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="system-brandbar">
        <Link to="/">Pedro Gomes · tech</Link>
        <span>Preparado para você</span>
      </div>
      <div className="crumb">home / proposta</div>

      <h1 style={{ marginBottom: 4 }}>Proposta Comercial</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
        Preparada para {quote.clientName}
        {quote.clientCompany ? ` — ${quote.clientCompany}` : ""}
      </p>

      <div className="card" style={{ marginTop: 20 }}>
        <div
          className="mono"
          style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}
        >
          serviço
        </div>
        <h2 style={{ margin: "0 0 12px" }}>{quote.service}</h2>

        {quote.items && quote.items.length > 0 && (
          <ul
            style={{ paddingLeft: 20, color: "var(--text)", lineHeight: 1.8 }}
          >
            {quote.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div className="grid grid-2" style={{ marginTop: 20 }}>
          <div>
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--text-muted)" }}
            >
              valor
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>
              {money(quote.value)}
            </div>
          </div>
          <div>
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--text-muted)" }}
            >
              prazo
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>
              {quote.deadlineDays} dias
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {quote.status === "pendente" && (
          <>
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              o que você decide?
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                disabled={saving}
                onClick={() => handleDecision("aprovado")}
              >
                {saving ? "salvando…" : "Aprovar proposta"}
              </button>
              <button
                className="secondary"
                disabled={saving}
                onClick={() => handleDecision("recusado")}
              >
                Solicitar ajustes
              </button>
            </div>
          </>
        )}

        {quote.status === "aprovado" && (
          <p style={{ margin: 0 }}>
            <span
              className="badge"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              ✓ aprovada
            </span>
            <br />
            <br />
            Proposta aprovada! A decisão foi registrada no painel do Pedro.
            Entre em contato para combinar os próximos passos (pagamento e
            briefing).
          </p>
        )}

        {quote.status === "recusado" && (
          <p style={{ margin: 0 }}>
            <span
              className="badge"
              style={{ borderColor: "#f87171", color: "#f87171" }}
            >
              ajustes solicitados
            </span>
            <br />
            <br />
            {ajusteMsg
              ? "Beleza — chama o Pedro no WhatsApp pra alinhar os ajustes que você precisa."
              : "Você pediu ajustes nessa proposta. Chama o Pedro no WhatsApp pra alinhar."}
          </p>
        )}
      </div>

      <p style={{ textAlign: "center", marginTop: 24 }}>
        <Link to="/" style={{ color: "var(--text-muted)", fontSize: 13 }}>
          ← voltar pro site
        </Link>
      </p>
    </div>
  );
}
