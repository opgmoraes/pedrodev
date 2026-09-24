import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

const links = [
  { to: '/admin', label: 'admin / dashboard' },
  { to: '/admin/clientes', label: 'admin / clientes' },
  { to: '/admin/projetos', label: 'admin / projetos' },
  { to: '/admin/orcamentos', label: 'admin / orcamentos' },
  { to: '/admin/contratos', label: 'admin / contratos' },
  { to: '/admin/formularios', label: 'admin / formularios' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  async function logout() {
    await signOut(auth)
    navigate('/login')
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="mono" style={{ marginBottom: 20, color: 'var(--accent)' }}>pedro.tech</div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <button className="secondary" style={{ marginTop: 24, width: '100%' }} onClick={logout}>
          sair
        </button>
      </aside>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
