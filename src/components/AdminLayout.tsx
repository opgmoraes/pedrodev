import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

function Icon({ path }: { path: string }) {
  return (
    <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

const ICONS = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  clientes: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7 4a4 4 0 0 0 0-8M20 21v-2a4 4 0 0 0-3-3.87',
  projetos: 'M20.25 14.15v4.25c0 1.09-.79 2.04-1.87 2.18-2.09.28-4.22.42-6.38.42s-4.29-.14-6.38-.42a2.18 2.18 0 0 1-1.87-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.66V8.7c0-1.08-.77-2.02-1.84-2.18a48 48 0 0 0-3.41-.38m4.5 8v0a24 24 0 0 1-16.5 0m0 0A2.18 2.18 0 0 1 3 12.49V8.7c0-1.08.77-2.02 1.84-2.18a48 48 0 0 1 3.41-.38m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.89a48 48 0 0 0-3.41.38',
  orcamentos: 'M9 14l2 2 4-4M3 7h18M3 7v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l2-4h14l2 4',
  contratos: 'M9 12h6M9 16h6M9 8h6M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
  formularios: 'M8 3v3M16 3v3M4 8h16M6 5h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM9 13l2 2 4-4',
}

const links = [
  { to: '/admin', label: 'dashboard', icon: ICONS.dashboard },
  { to: '/admin/clientes', label: 'clientes', icon: ICONS.clientes },
  { to: '/admin/projetos', label: 'projetos', icon: ICONS.projetos },
  { to: '/admin/orcamentos', label: 'orçamentos', icon: ICONS.orcamentos },
  { to: '/admin/contratos', label: 'contratos', icon: ICONS.contratos },
  { to: '/admin/formularios', label: 'formulários', icon: ICONS.formularios },
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
            <Icon path={l.icon} />
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
        <div className="workspace-card">
          <div className="workspace-avatar">PG</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pedro Gomes</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>painel interno</div>
          </div>
        </div>
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
