import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

const links = [
  { to: '/admin', label: 'dashboard' },
  { to: '/admin/clientes', label: 'clientes' },
  { to: '/admin/projetos', label: 'projetos' },
  { to: '/admin/orcamentos', label: 'orcamentos' },
  { to: '/admin/contratos', label: 'contratos' },
  { to: '/admin/formularios', label: 'formularios' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  async function logout() {
    await signOut(auth)
    navigate('/login')
  }

  function SidebarLinks() {
    return (
      <>
        <div className="sidebar-section-label">navegação</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </>
    )
  }

  return (
    <div className="admin-shell">
      {/* Barra superior — só aparece em telas estreitas */}
      <div className="admin-topbar">
        <button
          className="ghost admin-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span className={`admin-menu-icon ${menuOpen ? 'is-open' : ''}`} aria-hidden />
        </button>
        <div className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>pedro.tech</div>
        <button className="ghost" onClick={logout} style={{ fontSize: 12 }}>sair</button>
      </div>

      {menuOpen && (
        <div className="admin-drawer-backdrop" onClick={() => setMenuOpen(false)} aria-hidden />
      )}

      <aside className={`sidebar admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="mono" style={{ marginBottom: 20, color: 'var(--accent)' }}>pedro.tech</div>
        <SidebarLinks />
        <button className="secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={logout}>
          sair
        </button>
      </aside>

      <main className="container admin-main" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  )
}
