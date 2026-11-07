// Conta fictícia, criada exclusivamente em endpoints locais. Não usa credenciais remotas.
const email = 'admin@pedrodev.test';
const password = 'Pedrodev-local-123!';
const base = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:';
async function account(action) {
  const response = await fetch(`${base}${action}?key=demo-pedrodev-key`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  return response.json();
}
let user = await account('signUp');
if (user.error?.message === 'EMAIL_EXISTS') user = await account('signInWithPassword');
if (!user.localId) throw new Error(`Não foi possível criar a conta local: ${user.error?.message}`);
const response = await fetch(`http://127.0.0.1:8080/v1/projects/demo-pedrodev/databases/(default)/documents/admins/${user.localId}`, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
  body: JSON.stringify({ fields: { name: { stringValue: 'Administrador local' } } }),
});
if (!response.ok) throw new Error(`Não foi possível cadastrar o administrador local: ${response.status}`);
console.log(`Administrador fictício disponível apenas nos emuladores.\nE-mail: ${email}\nSenha: ${password}`);
