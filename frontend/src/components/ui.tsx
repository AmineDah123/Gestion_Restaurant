import type { FormEvent, ReactNode } from 'react'

export function PageHeader({ title, eyebrow, action }: { title: string; eyebrow: string; action?: ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</div>
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={(e) => e.stopPropagation()}>
    <header><h2>{title}</h2><button className="icon-button" onClick={onClose}>X</button></header>{children}
  </section></div>
}

export function FormModal({ title, children, onClose, onSubmit, busy }: {
  title: string; children: ReactNode; onClose: () => void; onSubmit: (event: FormEvent) => void; busy?: boolean
}) {
  return <Modal title={title} onClose={onClose}><form onSubmit={onSubmit}><div className="form-grid">{children}</div>
    <footer className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Annuler</button><button className="button primary" disabled={busy}>{busy ? 'Enregistrement...' : 'Enregistrer'}</button></footer>
  </form></Modal>
}

export function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? 'field wide' : 'field'}><span>{label}</span>{children}</label>
}

export function StatusBadge({ value }: { value: string }) {
  const label: Record<string, string> = {
    free: 'Libre', reserved: 'Reservee', occupied: 'Occupee', cleaning: 'Nettoyage',
    pending: 'En attente', confirmed: 'Confirmee', cancelled: 'Annulee', completed: 'Terminee',
    preparing: 'En preparation', ready: 'Prete', served: 'Servie', paid: 'Payee',
    in: 'Entree', out: 'Sortie',
  }
  return <span className={`status status-${value}`}>{label[value] || value}</span>
}

export function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><strong>Aucune donnee</strong><p>{text}</p></div>
}

export function Loading() {
  return <div className="loading-panel"><span className="spinner" /> Chargement...</div>
}

export function ErrorBanner({ message }: { message: string }) {
  return message ? <div className="error-banner">{message}</div> : null
}

export function ConfirmButton({ onConfirm, children = 'Supprimer' }: { onConfirm: () => void; children?: ReactNode }) {
  return <button className="text-button danger" onClick={() => { if (window.confirm('Confirmer cette action ?')) onConfirm() }}>{children}</button>
}
