import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiError } from '../lib/api'

const features = [
  'Gestion des tables en temps réel',
  'Réservations et file d\'attente',
  'Suivi cuisine et commandes',
  'Contrôle des stocks et alertes',
]

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@restaurant.com')
  const [password, setPassword] = useState('12345678')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(apiError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>RestoFlow</strong>
            <small>Gestion restaurant</small>
          </div>
        </div>
      </header>

      <main className="login-center">
        <div className="login-card">
          <aside className="login-card-info">
            <p className="eyebrow">Espace professionnel</p>
            <h1>Votre restaurant, un seul tableau de bord.</h1>
            <p className="login-card-desc">
              Coordonnez salle, cuisine et réception depuis une interface conçue pour le rythme du service.
            </p>
            <ul className="login-features">
              {features.map((text) => (
                <li key={text}>
                  <span className="login-check" aria-hidden="true">✓</span>
                  {text}
                </li>
              ))}
            </ul>
          </aside>

          <div className="login-card-form">
            <form onSubmit={submit}>
              <p className="eyebrow">Connexion</p>
              <h2>Bienvenue</h2>
              <p className="muted">Identifiez-vous pour accéder à votre espace.</p>
              {error && <div className="error-banner">{error}</div>}
              <div className="fields-group">
                <label className="field wide">
                  <span>Adresse e-mail</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </label>
                <label className="field wide">
                  <span>Mot de passe</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </label>
              </div>
              <button className="button primary login-button" disabled={busy}>
                {busy ? 'Connexion…' : 'Entrer dans l\'espace'}
              </button>
              <p className="login-help">
                API attendue sur <code>localhost:8000</code>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <div className="login-footer-stat">
          <strong>5</strong>
          <span>Rôles métier</span>
        </div>
        <div className="login-footer-stat">
          <strong>360°</strong>
          <span>Vision opérationnelle</span>
        </div>
        <div className="login-footer-stat">
          <strong>24/7</strong>
          <span>Disponibilité</span>
        </div>
      </footer>
    </div>
  )
}
