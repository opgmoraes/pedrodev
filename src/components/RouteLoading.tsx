export default function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-label="Carregando página">
      <div className="loading-brand">
        pg<span>.</span>
      </div>
      <p>Preparando seu espaço</p>
      <div className="loading-track">
        <span />
      </div>
      <div className="loading-skeleton" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
