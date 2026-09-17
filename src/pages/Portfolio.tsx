export default function Portfolio() {
  return (
    <div className="container">
      <div className="crumb">home / dev</div>
      <h1>Modo desenvolvimento</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>
        Esta tela só existe aqui no <code>npm run dev</code>. Em produção, a
        rota "/" é servida direto pelo portfólio real em{' '}
        <code>public-site/</code> — não passa pelo React. Pra testar o
        portfólio real localmente, abra o arquivo{' '}
        <code>public-site/index.html</code> direto no navegador, ou use{' '}
        <code>npx serve public-site</code>.
      </p>
      <p style={{ color: 'var(--text-muted)', maxWidth: 560, marginTop: 16 }}>
        Pra testar o sistema, navegue direto pra{' '}
        <a href="/login" style={{ color: 'var(--accent)' }}>/login</a>.
      </p>
    </div>
  )
}
