import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  hasFirebaseConfig,
} from "../lib/firebaseClient";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.58-5.17 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.07.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.35a7.2 7.2 0 0 1 0-4.7V6.56H1.3a12 12 0 0 0 0 10.88l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.56l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  async function authorize() {
    const user = auth.currentUser;
    if (!user || !(await getDoc(doc(db, "admins", user.uid))).exists()) {
      await signOut(auth);
      throw new Error("unauthorized");
    }
    navigate("/admin");
  }
  async function resetPassword() {
    if (!email) {
      setError("Preencha seu e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await sendPasswordResetEmail(auth, email);
      setNotice(
        "Se houver uma conta para esse e-mail, você receberá as instruções de recuperação.",
      );
    } catch {
      setError(
        "Não foi possível solicitar a recuperação. Confira o e-mail e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await authorize();
    } catch (err: any) {
      setError(
        err?.message === "unauthorized"
          ? "Esta conta não tem acesso ao painel."
          : "Não foi possível entrar. Confira e-mail, senha e conexão.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      await authorize();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(
          err?.message === "unauthorized"
            ? "Esta conta não tem acesso ao painel."
            : "Não foi possível entrar com o Google. Tente novamente.",
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="login-shell">
      {/* Painel do formulário */}
      <div className="login-form">
        <div style={{ width: "100%", maxWidth: 360 }}>
          <Link to="/" className="login-home">
            ← Voltar ao site
          </Link>
          <div
            className="mono"
            style={{ color: "var(--accent)", fontSize: 16, marginTop: 30 }}
          >
            Pedro Gomes · tech
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Bem-vindo de volta</h1>
          <p className="page-subtitle">
            Entra pra ver clientes, projetos e orçamentos.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading || !hasFirebaseConfig}
            className="secondary"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 4,
            }}
          >
            <GoogleIcon />
            {googleLoading ? "entrando…" : "Entrar com Google"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--text-faint)" }}
            >
              ou com e-mail
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <>
            {!hasFirebaseConfig && (
              <div className="system-alert" role="status">
                O acesso será liberado após configurar o Firebase. Consulte o
                README do projeto.
              </div>
            )}
          </>
          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
            />
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
            />
            {error && (
              <p
                role="alert"
                style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}
              >
                {error}
              </p>
            )}
            <button
              style={{ marginTop: 20, width: "100%" }}
              disabled={loading || googleLoading || !hasFirebaseConfig}
            >
              {loading ? "entrando…" : "entrar"}
            </button>
          </form>
          <button
            type="button"
            className="ghost"
            onClick={resetPassword}
            disabled={loading || googleLoading || !hasFirebaseConfig}
            style={{ marginTop: 15 }}
          >
            Esqueci minha senha
          </button>
          {notice && (
            <p className="form-feedback" role="status">
              {notice}
            </p>
          )}
        </div>
      </div>

      <div className="login-visual">
        <div>
          <img src="/assets/perfil/pedro-moletom.webp" alt="Pedro Gomes" />
          <p style={{ marginTop: 20, fontSize: 10, letterSpacing: ".15em" }}>
            SEU ESPAÇO DE TRABALHO
          </p>
          <h2>
            Do primeiro
            <br />
            contato à<br />
            <em style={{ color: "#8db9ff", fontFamily: "Georgia" }}>
              próxima entrega.
            </em>
          </h2>
          <p>
            Clientes, projetos e decisões no mesmo lugar. Mais clareza para
            cuidar de cada detalhe.
          </p>
        </div>
      </div>
    </div>
  );
}
