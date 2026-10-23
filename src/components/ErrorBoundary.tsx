import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Falha ao abrir a página", error, info.componentStack);
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container" style={{ maxWidth: 600, paddingTop: 80 }}>
          <h1>Não foi possível abrir esta página</h1>
          <p>
            Recarregue para tentar novamente. Se o problema continuar, entre em
            contato.
          </p>
          <button onClick={() => window.location.reload()}>
            Recarregar página
          </button>{" "}
          <a href="/">Voltar ao início</a>
        </main>
      );
    return this.props.children;
  }
}
