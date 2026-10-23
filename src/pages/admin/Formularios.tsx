import { generateBriefingPdf } from "../../lib/pdf";
import { BRIEFING_LABELS } from "../../lib/documentContent";
import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";

type Submission = {
  id: string;
  clientName?: string;
  clientCompany?: string;
  clientSlug: string;
  answers: Record<string, string>;
};

export default function Formularios() {
  const [error, setError] = useState("");
  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(
          query(
            collection(db, "formSubmissions"),
            orderBy("createdAt", "desc"),
          ),
        );
        const clients = await getDocs(collection(db, "clients"));
        const bySlug = new Map(clients.docs.map(c => [c.data().slug, c.data()]));
        setSubs(snap.docs.map(d => ({ id: d.id, ...d.data(), clientName: bySlug.get(d.data().clientSlug)?.name, clientCompany: bySlug.get(d.data().clientSlug)?.company }) as Submission));
      } catch {
        setError(loadError);
      }
    }
    load();
  }, []);

  return (
    <div>
      <ErrorMessage message={error} />
      <div className="crumb">admin / formularios</div>
      <h1>Briefings recebidos</h1>
      <div className="grid" style={{ marginTop: 20 }}>
        {subs.map((s) => (
          <div key={s.id} className="card">
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 10,
              }}
            >
              cliente: {s.clientName || s.clientSlug}
            </div>
            <button className="secondary" style={{ marginBottom: 20 }} onClick={() => generateBriefingPdf({ clientName: s.clientName || 'Cliente', company: s.clientCompany, answers: s.answers, reference: s.id })}>Baixar briefing em PDF</button>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(s.answers).map(([question, answer]) => (
                <div
                  key={BRIEFING_LABELS[question] || question}
                  style={{
                    borderTop: "1px solid var(--border-soft)",
                    paddingTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    {BRIEFING_LABELS[question] || question}
                  </div>
                  <div style={{ fontSize: 14 }}>{answer || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {subs.length === 0 && <p>nenhum briefing enviado ainda</p>}
      </div>
    </div>
  );
}
