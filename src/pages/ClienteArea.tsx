import ArrowIcon from "../components/ArrowIcon";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../lib/firebaseClient";
import { PROJECT_STEPS, statusStep } from "../lib/projectStatus";
import { ErrorMessage, loadError, saveError } from "../components/Feedback";
import { contactLink } from "../lib/brand";
type Project = { name: string; status: string; deadline?: string };
type Client = { name: string; projects: Project[] };
const questions = [
  ["negocio", "Conte sobre o seu negócio", 4000],
  ["publico", "Quem você quer alcançar?", 4000],
  ["objetivo", "O que o projeto precisa resolver?", 4000],
  ["cores", "Cores e preferências visuais", 1000],
  ["referencias", "Links de referência", 2000],
] as const;
export default function ClienteArea() {
  const { slug } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({
    negocio: "",
    publico: "",
    objetivo: "",
    cores: "",
    referencias: "",
  });
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setClient(null);
    setSent(false);
    async function load() {
      try {
        if (!hasFirebaseConfig) throw new Error("configuration");
        const snap = await getDoc(doc(db, "publicClients", slug!));
        if (active) setClient(snap.exists() ? (snap.data() as Client) : null);
      } catch {
        if (active) setError(loadError);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);
  async function sendBriefing(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "formSubmissions"), {
        clientSlug: slug,
        answers,
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="portal-shell">
      <div className="system-brandbar">
        <Link to="/">Pedro Gomes · tech</Link>
        <a href={contactLink()} target="_blank" rel="noopener noreferrer">
          Precisa de ajuda? <ArrowIcon />
        </a>
      </div>
      {loading ? (
        <p role="status" className="system-status">
          Carregando seu projeto…
        </p>
      ) : !client ? (
        <div className="card">
          <h1>
            {error ? "Não foi possível abrir sua área" : "Link não encontrado"}
          </h1>
          <p>Confira o endereço ou fale com Pedro para receber um novo link.</p>
          <ErrorMessage message={error} />
        </div>
      ) : (
        <>
          <div className="crumb">ESPAÇO DO CLIENTE</div>
          <h1
            style={{
              fontSize: 38,
              letterSpacing: "-.04em",
              margin: "0 0 10px",
            }}
          >
            Olá, {client.name}.
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
            Seu projeto, do início à entrega. Acompanhe por aqui.
          </p>
          {client.projects.length ? (
            client.projects.map((project, i) => (
              <section
                className="card"
                key={`${project.name}-${i}`}
                style={{ marginBottom: 20 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <h2>{project.name}</h2>
                  <span className="badge badge-accent">{project.status}</span>
                </div>
                <ol className="portal-steps">
                  {PROJECT_STEPS.map((step, index) => (
                    <li
                      key={step}
                      className={
                        index <= statusStep(project.status) ? "done" : ""
                      }
                      aria-current={
                        index === statusStep(project.status)
                          ? "step"
                          : undefined
                      }
                    >
                      <span>
                        {index < statusStep(project.status)
                          ? "✓ Concluído"
                          : `0${index + 1}`}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            ))
          ) : (
            <div className="card" style={{ marginBottom: 20 }}>
              <h2>Vamos começar</h2>
              <p>
                Seu projeto aparecerá aqui assim que for cadastrado. Enquanto
                isso, preencha o briefing abaixo.
              </p>
            </div>
          )}
          <section className="card">
            <h2>Conte mais sobre sua ideia</h2>
            <p>
              Essas respostas ajudam a definir o conteúdo e a direção do
              projeto.
            </p>
            <ErrorMessage message={error} />
            {sent ? (
              <div className="form-feedback" role="status">
                ✓ Briefing enviado. Obrigado! Pedro poderá consultar suas
                respostas no painel.
              </div>
            ) : (
              <form onSubmit={sendBriefing}>
                {questions.map(([key, label, max]) => (
                  <div key={key}>
                    <label htmlFor={key}>
                      {label}
                      {key === "negocio" || key === "objetivo" ? " *" : ""}
                    </label>
                    <textarea
                      id={key}
                      rows={key === "cores" || key === "referencias" ? 2 : 3}
                      maxLength={max}
                      required={key === "negocio" || key === "objetivo"}
                      value={answers[key]}
                      onChange={(e) =>
                        setAnswers({ ...answers, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <button disabled={saving} style={{ marginTop: 24 }}>
                  {saving ? "Enviando…" : <>Enviar briefing <ArrowIcon /></>}
                </button>
              </form>
            )}
          </section>
        </>
      )}
    </div>
  );
}
