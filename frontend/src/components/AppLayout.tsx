import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types'

const labels: Record<Role, string> = {
  admin: 'Administrateur', receptionniste: 'Reception', serveur: 'Service',
  cuisine: 'Cuisine', stock_manager: 'Gestion du stock',
}

const items = [
  { to: '/dashboard', icon: 'DB', label: 'Tableau de bord', roles: ['admin', 'receptionniste', 'serveur', 'cuisine', 'stock_manager'] },
  { to: '/tables', icon: 'TB', label: 'Tables', roles: ['admin', 'receptionniste', 'serveur'] },
  { to: '/reservations', icon: 'RS', label: 'Reservations', roles: ['admin', 'receptionniste'] },
  { to: '/clients', icon: 'CL', label: 'Clients', roles: ['admin', 'receptionniste'] },
  { to: '/menu', icon: 'MN', label: 'Menu', roles: ['admin', 'serveur', 'cuisine', 'stock_manager'] },
  { to: '/orders', icon: 'CM', label: 'Commandes', roles: ['admin', 'serveur'] },
  { to: '/kitchen', icon: 'CU', label: 'Cuisine', roles: ['admin', 'cuisine'] },
  { to: '/stock', icon: 'ST', label: 'Stock', roles: ['admin', 'stock_manager'] },
  { to: '/users', icon: 'US', label: 'Utilisateurs', roles: ['admin'] },
] as const

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const visible = items.filter((item) => user && (item.roles as readonly string[]).includes(user.role))

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">R</span><div><strong>RestoPilot</strong><small>Gestion restaurant</small></div></div>
        <nav>
          <p className="nav-label">ESPACE DE TRAVAIL</p>
          {visible.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar">{user?.name.slice(0, 2).toUpperCase()}</span>
          <div><strong>{user?.name}</strong><small>{user ? labels[user.role] : ''}</small></div>
          <button className="icon-button" onClick={() => void logout()} title="Se deconnecter">OUT</button>
        </div>
      </aside>
      {open && <button className="sidebar-overlay" onClick={() => setOpen(false)} aria-label="Fermer le menu" />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>MENU</button>
          <div><span className="live-dot" /> Systeme operationnel</div>
          <div className="topbar-date">{new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</div>
        </header>
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  )
}
