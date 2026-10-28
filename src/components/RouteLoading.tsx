import './route-loading.css';

export default function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-label="Carregando página">
      <div className="loading-emblem"><span className="loading-orbit" aria-hidden="true" /><div className="loading-brand">
        pg<span>.</span>
      </div></div>
      <p>Carregando página<span className="loading-ellipsis" aria-hidden="true">…</span></p>
      <div className="loading-track" aria-hidden="true">
        <span />
      </div>
      <small className="loading-signature">Pedro Gomes · Desenvolvimento web</small>
    </div>
  );
}
