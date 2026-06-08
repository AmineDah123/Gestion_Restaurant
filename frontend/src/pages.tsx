import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAuth } from './auth/AuthContext'
import { ConfirmButton, EmptyState, ErrorBanner, Field, FormModal, Loading, PageHeader, StatusBadge } from './components/ui'
import { api, apiError } from './lib/api'
import type { Category, Client, Dish, Ingredient, Order, OrderStatus, Reservation, RestaurantTable, Role, StockMovement, User } from './types'

function useApiData<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(Boolean(path))
  const [error, setError] = useState('')
  const reload = useCallback(async () => {
    if (!path) return
    setLoading(true); setError('')
    try { setData((await api.get<T>(path)).data) } catch (err) { setError(apiError(err)) } finally { setLoading(false) }
  }, [path])
  useEffect(() => { void reload() }, [reload])
  return { data, loading, error, reload }
}

function useMutation(reload: () => Promise<void>) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const run = async (request: () => Promise<unknown>, done?: () => void) => {
    setBusy(true); setError('')
    try { await request(); await reload(); done?.() } catch (err) { setError(apiError(err)) } finally { setBusy(false) }
  }
  return { busy, error, run }
}

const money = (value: string | number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(Number(value))
const date = (value: string) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export function DashboardPage() {
  const { user } = useAuth()
  const canTables = ['admin', 'receptionniste', 'serveur'].includes(user!.role)
  const canReservations = ['admin', 'receptionniste'].includes(user!.role)
  const canOrders = ['admin', 'serveur', 'cuisine'].includes(user!.role)
  const canStock = ['admin', 'stock_manager'].includes(user!.role)
  const tables = useApiData<RestaurantTable[]>(canTables ? '/tables' : null)
  const reservations = useApiData<Reservation[]>(canReservations ? '/reservations' : null)
  const orders = useApiData<Order[]>(canOrders ? '/orders' : null)
  const ingredients = useApiData<Ingredient[]>(canStock ? '/ingredients' : null)
  const today = new Date().toISOString().slice(0, 10)
  const todaysReservations = reservations.data?.filter((r) => r.reservation_date === today) || []
  const activeOrders = orders.data?.filter((o) => !['paid', 'cancelled'].includes(o.status)) || []
  const revenue = orders.data?.filter((o) => o.status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0) || 0
  const lowStock = ingredients.data?.filter((i) => Number(i.quantity_available) <= Number(i.alert_threshold)) || []
  const anyLoading = tables.loading || reservations.loading || orders.loading || ingredients.loading

  return <>
    <PageHeader eyebrow="VUE D'ENSEMBLE" title={`Bonjour, ${user?.name.split(' ')[0]}`} />
    <p className="page-intro">Voici l'activite du restaurant en temps reel.</p>
    {anyLoading ? <Loading /> : <>
      <section className="stats-grid">
        {canTables && <div className="stat-card"><span className="stat-icon teal">TB</span><div><p>Tables disponibles</p><strong>{tables.data?.filter((t) => t.status === 'free').length || 0}</strong><small>sur {tables.data?.length || 0} tables</small></div></div>}
        {canReservations && <div className="stat-card"><span className="stat-icon amber">RS</span><div><p>Reservations aujourd'hui</p><strong>{todaysReservations.length}</strong><small>{todaysReservations.filter((r) => r.status === 'confirmed').length} confirmees</small></div></div>}
        {canOrders && <div className="stat-card"><span className="stat-icon coral">CM</span><div><p>Commandes actives</p><strong>{activeOrders.length}</strong><small>{activeOrders.filter((o) => o.status === 'ready').length} pretes a servir</small></div></div>}
        {canOrders && <div className="stat-card"><span className="stat-icon green">CA</span><div><p>Chiffre encaisse</p><strong className="money-stat">{money(revenue)}</strong><small>commandes payees</small></div></div>}
        {canStock && <div className="stat-card"><span className="stat-icon red">ST</span><div><p>Alertes de stock</p><strong>{lowStock.length}</strong><small>a reapprovisionner</small></div></div>}
      </section>
      <section className="dashboard-grid">
        {canOrders && <div className="panel"><div className="panel-header"><div><p className="eyebrow">SERVICE</p><h2>Commandes recentes</h2></div></div>
          {orders.data?.length ? <div className="activity-list">{orders.data.slice(-6).reverse().map((order) => <div key={order.id} className="activity-row"><span className="round-icon">#{order.id}</span><div><strong>Table {order.table?.number || order.table_id}</strong><small>{order.order_items?.length || 0} article(s)</small></div><strong>{money(order.total_price)}</strong><StatusBadge value={order.status} /></div>)}</div> : <EmptyState text="Les nouvelles commandes apparaitront ici." />}
        </div>}
        {canReservations && <div className="panel"><div className="panel-header"><div><p className="eyebrow">AUJOURD'HUI</p><h2>Prochaines reservations</h2></div></div>
          {todaysReservations.length ? <div className="activity-list">{todaysReservations.map((r) => <div key={r.id} className="activity-row"><span className="time-chip">{r.reservation_time.slice(0, 5)}</span><div><strong>{r.client?.name}</strong><small>{r.guests_count} personnes, table {r.table?.number || 'a attribuer'}</small></div><StatusBadge value={r.status} /></div>)}</div> : <EmptyState text="Aucune reservation prevue aujourd'hui." />}
        </div>}
        {canStock && <div className="panel"><div className="panel-header"><div><p className="eyebrow">VIGILANCE</p><h2>Stock faible</h2></div></div>
          {lowStock.length ? <div className="activity-list">{lowStock.slice(0, 6).map((item) => <div key={item.id} className="activity-row"><span className="round-icon red">!</span><div><strong>{item.name}</strong><small>Seuil: {item.alert_threshold} {item.unit}</small></div><strong>{item.quantity_available} {item.unit}</strong></div>)}</div> : <EmptyState text="Tous les niveaux de stock sont satisfaisants." />}
        </div>}
      </section>
    </>}
  </>
}

export function TablesPage() {
  const { user } = useAuth()
  const source = useApiData<RestaurantTable[]>('/tables')
  const mutation = useMutation(source.reload)
  const [editing, setEditing] = useState<Partial<RestaurantTable> | null>(null)
  const canEdit = ['admin', 'receptionniste'].includes(user!.role)
  const save = (e: FormEvent) => {
    e.preventDefault()
    const payload = { number: Number(editing?.number), capacity: Number(editing?.capacity), status: editing?.status }
    void mutation.run(() => editing?.id ? api.put(`/tables/${editing.id}`, payload) : api.post('/tables', payload), () => setEditing(null))
  }
  return <>
    <PageHeader eyebrow="SALLE" title="Plan des tables" action={canEdit && <button className="button primary" onClick={() => setEditing({ status: 'free', capacity: 2 })}>+ Nouvelle table</button>} />
    <ErrorBanner message={source.error || mutation.error} />
    {source.loading ? <Loading /> : <div className="table-cards">{source.data?.map((table) => <article className={`table-card table-${table.status}`} key={table.id}>
      <header><span>TABLE</span><StatusBadge value={table.status} /></header><strong>{String(table.number).padStart(2, '0')}</strong><p>{table.capacity} places</p>
      {canEdit && <footer><button className="text-button" onClick={() => setEditing(table)}>Modifier</button><ConfirmButton onConfirm={() => void mutation.run(() => api.delete(`/tables/${table.id}`))} /></footer>}
    </article>)}</div>}
    {editing && <FormModal title={editing.id ? 'Modifier la table' : 'Ajouter une table'} onClose={() => setEditing(null)} onSubmit={save} busy={mutation.busy}>
      <Field label="Numero"><input type="number" min="1" value={editing.number || ''} onChange={(e) => setEditing({ ...editing, number: Number(e.target.value) })} required /></Field>
      <Field label="Capacite"><input type="number" min="1" value={editing.capacity || ''} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} required /></Field>
      <Field label="Statut" wide><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as RestaurantTable['status'] })}><option value="free">Libre</option><option value="reserved">Reservee</option><option value="occupied">Occupee</option><option value="cleaning">Nettoyage</option></select></Field>
    </FormModal>}
  </>
}

export function ClientsPage() {
  const source = useApiData<Client[]>('/clients')
  const mutation = useMutation(source.reload)
  const [editing, setEditing] = useState<Partial<Client> | null>(null)
  const save = (e: FormEvent) => {
    e.preventDefault()
    void mutation.run(() => editing?.id ? api.put(`/clients/${editing.id}`, editing) : api.post('/clients', editing), () => setEditing(null))
  }
  return <>
    <PageHeader eyebrow="RELATION CLIENT" title="Clients" action={<button className="button primary" onClick={() => setEditing({})}>+ Nouveau client</button>} />
    <ErrorBanner message={source.error || mutation.error} />
    {source.loading ? <Loading /> : <div className="panel data-panel">{source.data?.length ? <table><thead><tr><th>Client</th><th>Telephone</th><th>E-mail</th><th /></tr></thead><tbody>{source.data.map((client) => <tr key={client.id}><td><strong>{client.name}</strong></td><td>{client.phone}</td><td>{client.email}</td><td className="actions"><button className="text-button" onClick={() => setEditing(client)}>Modifier</button><ConfirmButton onConfirm={() => void mutation.run(() => api.delete(`/clients/${client.id}`))} /></td></tr>)}</tbody></table> : <EmptyState text="Ajoutez votre premier client." />}</div>}
    {editing && <FormModal title={editing.id ? 'Modifier le client' : 'Ajouter un client'} onClose={() => setEditing(null)} onSubmit={save} busy={mutation.busy}>
      <Field label="Nom complet" wide><input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></Field>
      <Field label="Telephone"><input value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} required /></Field>
      <Field label="E-mail"><input type="email" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required /></Field>
    </FormModal>}
  </>
}

export function ReservationsPage() {
  const source = useApiData<Reservation[]>('/reservations')
  const clients = useApiData<Client[]>('/clients')
  const tables = useApiData<RestaurantTable[]>('/tables')
  const mutation = useMutation(source.reload)
  const [editing, setEditing] = useState<Partial<Reservation> | null>(null)
  const save = (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...editing, client_id: Number(editing?.client_id), table_id: editing?.table_id ? Number(editing.table_id) : null, guests_count: Number(editing?.guests_count) }
    void mutation.run(() => editing?.id ? api.put(`/reservations/${editing.id}`, payload) : api.post('/reservations', payload), () => setEditing(null))
  }
  return <>
    <PageHeader eyebrow="ACCUEIL" title="Reservations" action={<button className="button primary" onClick={() => setEditing({ status: 'pending', reservation_date: new Date().toISOString().slice(0, 10), reservation_time: '19:00' })}>+ Nouvelle reservation</button>} />
    <ErrorBanner message={source.error || mutation.error} />
    {source.loading ? <Loading /> : <div className="panel data-panel">{source.data?.length ? <table><thead><tr><th>Date et heure</th><th>Client</th><th>Table</th><th>Couverts</th><th>Statut</th><th /></tr></thead><tbody>{source.data.map((r) => <tr key={r.id}><td><strong>{date(r.reservation_date)}</strong><small>{r.reservation_time.slice(0, 5)}</small></td><td>{r.client?.name}</td><td>{r.table ? `Table ${r.table.number}` : 'A attribuer'}</td><td>{r.guests_count}</td><td><StatusBadge value={r.status} /></td><td className="actions"><button className="text-button" onClick={() => setEditing(r)}>Modifier</button><ConfirmButton onConfirm={() => void mutation.run(() => api.delete(`/reservations/${r.id}`))} /></td></tr>)}</tbody></table> : <EmptyState text="Aucune reservation enregistree." />}</div>}
    {editing && <FormModal title={editing.id ? 'Modifier la reservation' : 'Nouvelle reservation'} onClose={() => setEditing(null)} onSubmit={save} busy={mutation.busy}>
      <Field label="Client"><select value={editing.client_id || ''} onChange={(e) => setEditing({ ...editing, client_id: Number(e.target.value) })} required><option value="">Selectionner</option>{clients.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <Field label="Table"><select value={editing.table_id || ''} onChange={(e) => setEditing({ ...editing, table_id: e.target.value ? Number(e.target.value) : null })}><option value="">A attribuer</option>{tables.data?.map((t) => <option key={t.id} value={t.id}>Table {t.number} ({t.capacity} places)</option>)}</select></Field>
      <Field label="Date"><input type="date" value={editing.reservation_date || ''} onChange={(e) => setEditing({ ...editing, reservation_date: e.target.value })} required /></Field>
      <Field label="Heure"><input type="time" value={editing.reservation_time?.slice(0, 5) || ''} onChange={(e) => setEditing({ ...editing, reservation_time: e.target.value })} required /></Field>
      <Field label="Nombre de personnes"><input type="number" min="1" value={editing.guests_count || ''} onChange={(e) => setEditing({ ...editing, guests_count: Number(e.target.value) })} required /></Field>
      <Field label="Statut"><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Reservation['status'] })}><option value="pending">En attente</option><option value="confirmed">Confirmee</option><option value="cancelled">Annulee</option><option value="completed">Terminee</option></select></Field>
    </FormModal>}
  </>
}

export function MenuPage() {
  const { user } = useAuth()
  const dishes = useApiData<Dish[]>('/dishes')
  const categories = useApiData<Category[]>('/categories')
  const mutation = useMutation(dishes.reload)
  const [editing, setEditing] = useState<Partial<Dish> | null>(null)
  const [filter, setFilter] = useState<number | 'all'>('all')
  const canEdit = user?.role === 'admin'
  const shown = dishes.data?.filter((d) => filter === 'all' || d.category_id === filter)
  const save = (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...editing, category_id: Number(editing?.category_id), price: Number(editing?.price), available: Boolean(editing?.available) }
    void mutation.run(() => editing?.id ? api.put(`/dishes/${editing.id}`, payload) : api.post('/dishes', payload), () => setEditing(null))
  }
  return <>
    <PageHeader eyebrow="CARTE" title="Menu du restaurant" action={canEdit && <button className="button primary" onClick={() => setEditing({ available: true })}>+ Nouveau plat</button>} />
    <div className="filter-tabs"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tous</button>{categories.data?.map((c) => <button key={c.id} className={filter === c.id ? 'active' : ''} onClick={() => setFilter(c.id)}>{c.name}</button>)}</div>
    <ErrorBanner message={dishes.error || mutation.error} />
    {dishes.loading ? <Loading /> : <div className="dish-grid">{shown?.map((dish) => <article className="dish-card" key={dish.id}><div className="dish-art">{dish.name.slice(0, 2).toUpperCase()}</div><div className="dish-body"><div><span className="category-tag">{dish.category?.name}</span>{!dish.available && <span className="unavailable">Indisponible</span>}</div><h3>{dish.name}</h3><p>{dish.description || 'Une creation de la maison.'}</p><footer><strong>{money(dish.price)}</strong>{canEdit && <span><button className="text-button" onClick={() => setEditing(dish)}>Modifier</button><ConfirmButton onConfirm={() => void mutation.run(() => api.delete(`/dishes/${dish.id}`))} /></span>}</footer></div></article>)}</div>}
    {editing && <FormModal title={editing.id ? 'Modifier le plat' : 'Ajouter un plat'} onClose={() => setEditing(null)} onSubmit={save} busy={mutation.busy}>
      <Field label="Nom"><input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></Field>
      <Field label="Categorie"><select value={editing.category_id || ''} onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })} required><option value="">Selectionner</option>{categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <Field label="Prix (MAD)"><input type="number" min="0" step=".01" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: e.target.value })} required /></Field>
      <Field label="Disponibilite"><select value={editing.available ? '1' : '0'} onChange={(e) => setEditing({ ...editing, available: e.target.value === '1' })}><option value="1">Disponible</option><option value="0">Indisponible</option></select></Field>
      <Field label="Description" wide><textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
    </FormModal>}
  </>
}

export function OrdersPage() {
  const { user } = useAuth()
  const orders = useApiData<Order[]>('/orders')
  const tables = useApiData<RestaurantTable[]>('/tables')
  const dishes = useApiData<Dish[]>('/dishes')
  const mutation = useMutation(orders.reload)
  const [creating, setCreating] = useState(false)
  const [tableId, setTableId] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const create = (e: FormEvent) => {
    e.preventDefault()
    const selected = dishes.data?.filter((d) => cart[d.id]) || []
    const total = selected.reduce((sum, d) => sum + Number(d.price) * cart[d.id], 0)
    void mutation.run(async () => {
      const { data: order } = await api.post<Order>('/orders', { table_id: Number(tableId), user_id: user!.id, status: 'pending', total_price: total })
      await Promise.all(selected.map((d) => api.post('/order-items', { order_id: order.id, dish_id: d.id, quantity: cart[d.id] })))
    }, () => { setCreating(false); setCart({}); setTableId('') })
  }
  const updateStatus = (order: Order, status: OrderStatus) => void mutation.run(() => api.put(`/orders/${order.id}`, { status }))
  return <>
    <PageHeader eyebrow="SERVICE" title="Commandes" action={<button className="button primary" onClick={() => setCreating(true)}>+ Nouvelle commande</button>} />
    <ErrorBanner message={orders.error || mutation.error} />
    {orders.loading ? <Loading /> : <div className="orders-board">{orders.data?.map((order) => <article className="order-card" key={order.id}><header><div><span>COMMANDE #{order.id}</span><h3>Table {order.table?.number || order.table_id}</h3></div><StatusBadge value={order.status} /></header><div className="order-lines">{order.order_items?.map((item) => <div key={item.id}><span>{item.quantity} x {item.dish?.name}</span><strong>{money(item.subtotal)}</strong></div>)}{!order.order_items?.length && <small>Aucun article</small>}</div><footer><div><small>Total</small><strong>{money(order.total_price)}</strong></div><select disabled={order.status === 'paid'} value={order.status} onChange={(e) => updateStatus(order, e.target.value as OrderStatus)}><option value="pending">En attente</option><option value="preparing">Preparation</option><option value="ready">Prete</option><option value="served">Servie</option><option value="paid">Encaisser</option><option value="cancelled">Annuler</option></select></footer></article>)}</div>}
    {creating && <FormModal title="Nouvelle commande" onClose={() => setCreating(false)} onSubmit={create} busy={mutation.busy}>
      <Field label="Table" wide><select value={tableId} onChange={(e) => setTableId(e.target.value)} required><option value="">Selectionner une table</option>{tables.data?.map((t) => <option key={t.id} value={t.id}>Table {t.number} - {t.capacity} places</option>)}</select></Field>
      <div className="wide menu-picker">{dishes.data?.filter((d) => d.available).map((dish) => <div key={dish.id}><div><strong>{dish.name}</strong><small>{money(dish.price)}</small></div><input aria-label={`Quantite ${dish.name}`} type="number" min="0" value={cart[dish.id] || 0} onChange={(e) => setCart({ ...cart, [dish.id]: Number(e.target.value) })} /></div>)}</div>
    </FormModal>}
  </>
}

export function KitchenPage() {
  const orders = useApiData<Order[]>('/orders')
  const mutation = useMutation(orders.reload)
  const active = orders.data?.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)) || []
  const next = (order: Order) => {
    const status: OrderStatus = order.status === 'pending' ? 'preparing' : order.status === 'preparing' ? 'ready' : 'served'
    void mutation.run(() => api.put(`/orders/${order.id}`, { status }))
  }
  return <>
    <PageHeader eyebrow="PRODUCTION" title="Ecran cuisine" />
    <ErrorBanner message={orders.error || mutation.error} />
    {orders.loading ? <Loading /> : active.length ? <div className="kitchen-board">{active.map((order) => <article className={`kitchen-ticket ticket-${order.status}`} key={order.id}><header><div><span>#{order.id}</span><h3>Table {order.table?.number || order.table_id}</h3></div><StatusBadge value={order.status} /></header><div>{order.order_items?.map((item) => <p key={item.id}><strong>{item.quantity}x</strong> {item.dish?.name}</p>)}</div><button className="button primary" onClick={() => next(order)} disabled={mutation.busy}>{order.status === 'pending' ? 'Commencer la preparation' : order.status === 'preparing' ? 'Marquer comme prete' : 'Commande servie'}</button></article>)}</div> : <EmptyState text="Aucune commande en attente en cuisine." />}
  </>
}

export function StockPage() {
  const { user } = useAuth()
  const ingredients = useApiData<Ingredient[]>('/ingredients')
  const movements = useApiData<StockMovement[]>('/stock-movements')
  const mutation = useMutation(async () => { await ingredients.reload(); await movements.reload() })
  const [editing, setEditing] = useState<Partial<Ingredient> | null>(null)
  const [movement, setMovement] = useState<Partial<StockMovement> | null>(null)
  const saveIngredient = (e: FormEvent) => {
    e.preventDefault()
    void mutation.run(() => editing?.id ? api.put(`/ingredients/${editing.id}`, editing) : api.post('/ingredients', editing), () => setEditing(null))
  }
  const saveMovement = (e: FormEvent) => {
    e.preventDefault()
    void mutation.run(() => api.post('/stock-movements', { ...movement, ingredient_id: Number(movement?.ingredient_id), user_id: user!.id, quantity: Number(movement?.quantity) }), () => setMovement(null))
  }
  return <>
    <PageHeader eyebrow="APPROVISIONNEMENT" title="Gestion du stock" action={<div className="button-row"><button className="button secondary" onClick={() => setMovement({ type: 'in' })}>+ Mouvement</button><button className="button primary" onClick={() => setEditing({ quantity_available: 0, alert_threshold: 10 })}>+ Ingredient</button></div>} />
    <ErrorBanner message={ingredients.error || movements.error || mutation.error} />
    {ingredients.loading ? <Loading /> : <><div className="stock-grid">{ingredients.data?.map((item) => {
      const percent = Math.min(100, Number(item.quantity_available) / Math.max(Number(item.alert_threshold) * 2, 1) * 100)
      const low = Number(item.quantity_available) <= Number(item.alert_threshold)
      return <article className="stock-card" key={item.id}><header><div><h3>{item.name}</h3><small>Seuil: {item.alert_threshold} {item.unit}</small></div>{low && <span className="alert-label">Stock faible</span>}</header><strong>{item.quantity_available} <small>{item.unit}</small></strong><div className="stock-bar"><i className={low ? 'low' : ''} style={{ width: `${percent}%` }} /></div><button className="text-button" onClick={() => setEditing(item)}>Modifier la fiche</button></article>
    })}</div><div className="panel data-panel"><div className="panel-header"><h2>Derniers mouvements</h2></div>{movements.data?.length ? <table><thead><tr><th>Ingredient</th><th>Type</th><th>Quantite</th><th>Motif</th><th>Date</th></tr></thead><tbody>{movements.data.slice(-8).reverse().map((m) => <tr key={m.id}><td><strong>{m.ingredient?.name}</strong></td><td><StatusBadge value={m.type} /></td><td>{m.quantity} {m.ingredient?.unit}</td><td>{m.reason || '-'}</td><td>{m.user?.name || 'Systeme'}</td></tr>)}</tbody></table> : <EmptyState text="Aucun mouvement de stock." />}</div></>}
    {editing && <FormModal title={editing.id ? "Modifier l'ingredient" : 'Ajouter un ingredient'} onClose={() => setEditing(null)} onSubmit={saveIngredient} busy={mutation.busy}>
      <Field label="Nom"><input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></Field><Field label="Unite"><input placeholder="kg, L, piece..." value={editing.unit || ''} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} required /></Field>
      <Field label="Quantite disponible"><input type="number" min="0" step=".01" value={editing.quantity_available ?? ''} onChange={(e) => setEditing({ ...editing, quantity_available: e.target.value })} required /></Field><Field label="Seuil d'alerte"><input type="number" min="0" step=".01" value={editing.alert_threshold ?? ''} onChange={(e) => setEditing({ ...editing, alert_threshold: e.target.value })} required /></Field>
    </FormModal>}
    {movement && <FormModal title="Nouveau mouvement" onClose={() => setMovement(null)} onSubmit={saveMovement} busy={mutation.busy}>
      <Field label="Ingredient"><select value={movement.ingredient_id || ''} onChange={(e) => setMovement({ ...movement, ingredient_id: Number(e.target.value) })} required><option value="">Selectionner</option>{ingredients.data?.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></Field>
      <Field label="Type"><select value={movement.type} onChange={(e) => setMovement({ ...movement, type: e.target.value as 'in' | 'out' })}><option value="in">Entree</option><option value="out">Sortie</option></select></Field>
      <Field label="Quantite"><input type="number" min=".01" step=".01" value={movement.quantity || ''} onChange={(e) => setMovement({ ...movement, quantity: e.target.value })} required /></Field>
      <Field label="Motif"><input value={movement.reason || ''} onChange={(e) => setMovement({ ...movement, reason: e.target.value })} /></Field>
    </FormModal>}
  </>
}

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const users = useApiData<User[]>('/users')
  const mutation = useMutation(users.reload)
  const [editing, setEditing] = useState<(Partial<User> & { password?: string }) | null>(null)
  const roles: Record<Role, string> = { admin: 'Administrateur', receptionniste: 'Receptionniste', serveur: 'Serveur', cuisine: 'Cuisine', stock_manager: 'Gestionnaire de stock' }
  const save = (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...editing, password: editing?.password || undefined }
    void mutation.run(() => editing?.id ? api.put(`/users/${editing.id}`, payload) : api.post('/users', payload), () => setEditing(null))
  }
  return <>
    <PageHeader eyebrow="ADMINISTRATION" title="Utilisateurs" action={<button className="button primary" onClick={() => setEditing({ role: 'serveur' })}>+ Nouvel utilisateur</button>} />
    <ErrorBanner message={users.error || mutation.error} />
    {users.loading ? <Loading /> : <div className="panel data-panel">{users.data?.length ? <table><thead><tr><th>Utilisateur</th><th>E-mail</th><th>Role</th><th /></tr></thead><tbody>{users.data.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{roles[user.role]}</td><td className="actions"><button className="text-button" onClick={() => setEditing(user)}>Modifier</button>{currentUser?.id !== user.id && <ConfirmButton onConfirm={() => void mutation.run(() => api.delete(`/users/${user.id}`))} />}</td></tr>)}</tbody></table> : <EmptyState text="Aucun utilisateur." />}</div>}
    {editing && <FormModal title={editing.id ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'} onClose={() => setEditing(null)} onSubmit={save} busy={mutation.busy}>
      <Field label="Nom complet"><input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></Field>
      <Field label="E-mail"><input type="email" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required /></Field>
      <Field label={editing.id ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}><input type="password" minLength={8} value={editing.password || ''} onChange={(e) => setEditing({ ...editing, password: e.target.value })} required={!editing.id} /></Field>
      <Field label="Role"><select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Role })}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
    </FormModal>}
  </>
}
