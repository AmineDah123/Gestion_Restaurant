import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiError } from '../lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@restaurant.com')
  const [password, setPassword] = useState('12345678')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await login(email, password) } catch (err) { setError(apiError(err)) } finally { setBusy(false) }
  }

  return <div className="login-page">
    <section className="login-story">
      <div className="brand light"><span className="brand-mark">R</span><strong>RestoPilot</strong></div>
      <div><p className="eyebrow">RESTAURANT OPERATIONS</p><h1>Chaque service.<br />Parfaitement orchestre.</h1><p>Tables, reservations, cuisine et stock reunis dans un espace pense pour vos equipes.</p></div>
      <div className="login-stats"><div><strong>360°</strong><span>Vision operationnelle</span></div><div><strong>5</strong><span>Roles coordonnes</span></div></div>
    </section>
    <section className="login-panel"><form onSubmit={submit}>
      <div className="mobile-brand brand"><span className="brand-mark">R</span><strong>RestoPilot</strong></div>
      <p className="eyebrow">BIENVENUE</p><h2>Connexion a votre espace</h2><p className="muted">Utilisez les identifiants attribues par votre administrateur.</p>
      {error && <div className="error-banner">{error}</div>}
      <label className="field wide"><span>Adresse e-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label className="field wide"><span>Mot de passe</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="button primary login-button" disabled={busy}>{busy ? 'Connexion...' : 'Se connecter'}</button>
      <p className="login-help">API attendue sur <code>localhost:8000</code></p>
    </form></section>
  </div>
}
