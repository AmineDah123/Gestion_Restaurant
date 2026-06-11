import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types'
import {
  IconCalendar,
  IconDashboard,
  IconKitchen,
  IconLogout,
  IconMenu,
  IconMenuToggle,
  IconOrders,
  IconStock,
  IconTables,
  IconUserCog,
  IconUsers,
} from './icons'

const labels: Record<Role, string> = {
  admin: 'Administrateur',
  receptionniste: 'Réception',
  serveur: 'Service',
  cuisine: 'Cuisine',
  stock_manager: 'Gestion du stock',
}

const navGroups = [
  {
    label: 'Vue',
    items: [
      { to: '/dashboard', Icon: IconDashboard, label: 'Tableau de bord', roles: ['admin', 'receptionniste', 'serveur', 'cuisine', 'stock_manager'] },
    ],
  },
  {
    label: 'Salle',
    items: [
      { to: '/tables', Icon: IconTables, label: 'Tables', roles: ['admin', 'receptionniste', 'serveur'] },
      { to: '/reservations', Icon: IconCalendar, label: 'Réservations', roles: ['admin', 'receptionniste'] },
      { to: '/clients', Icon: IconUsers, label: 'Clients', roles: ['admin', 'receptionniste'] },
    ],
  },
  {
    label: 'Service',
    items: [
      { to: '/menu', Icon: IconMenu, label: 'Menu', roles: ['admin', 'serveur', 'cuisine', 'stock_manager'] },
      { to: '/orders', Icon: IconOrders, label: 'Commandes', roles: ['admin', 'serveur'] },
    ],
  },
  {
    label: 'Back-office',
    items: [
      { to: '/kitchen', Icon: IconKitchen, label: 'Cuisine', roles: ['admin', 'cuisine'] },
      { to: '/stock', Icon: IconStock, label: 'Stock', roles: ['admin', 'stock_manager'] },
      { to: '/users', Icon: IconUserCog, label: 'Utilisateurs', roles: ['admin'] },
    ],
  },
] as const

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => user && (item.roles as readonly string[]).includes(user.role)),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-row">
          <div className="header-brand">
            <span className="brand-mark">R</span>
            <div>
              <strong>RestoFlow</strong>
              <small>Gestion restaurant</small>
            </div>
          </div>

          <nav className="header-nav" aria-label="Navigation principale">
            {visibleGroups.map((group, index) => (
              <div key={group.label} className="nav-group">
                {index > 0 && <span className="nav-divider" aria-hidden="true" />}
                <span className="nav-group-label">{group.label}</span>
                <div className="nav-group-links">
                  {group.items.map(({ to, Icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}
                      title={label}
                    >
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <time className="header-date" dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>
            <div className="header-user">
              <span className="avatar">{user?.name.slice(0, 2).toUpperCase()}</span>
              <div className="header-user-info">
                <strong>{user?.name}</strong>
                <small>{user ? labels[user.role] : ''}</small>
              </div>
              <button className="icon-button" onClick={() => void logout()} title="Se déconnecter">
                <IconLogout />
              </button>
            </div>
            <button
              className="header-menu-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
            >
              <IconMenuToggle />
            </button>
          </div>
        </div>

        <div className={`mobile-nav ${open ? 'open' : ''}`}>
          {visibleGroups.map((group) => (
            <div key={group.label} className="mobile-nav-group">
              <p className="mobile-nav-label">{group.label}</p>
              {group.items.map(({ to, Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                >
                  <Icon />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </header>

      {open && (
        <button className="nav-overlay" onClick={() => setOpen(false)} aria-label="Fermer le menu" />
      )}

      <main className="app-main">
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  )
}
