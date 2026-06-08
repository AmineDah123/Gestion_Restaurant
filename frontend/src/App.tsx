import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { AppLayout } from './components/AppLayout'
import {
  ClientsPage,
  DashboardPage,
  KitchenPage,
  MenuPage,
  OrdersPage,
  ReservationsPage,
  StockPage,
  TablesPage,
  UsersPage,
} from './pages'
import { LoginPage } from './pages/LoginPage'

function ProtectedApp() {
  const { user, loading } = useAuth()

  if (loading) return <div className="app-loader"><span className="spinner" />Chargement de votre espace...</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <AppLayout>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="kitchen" element={<KitchenPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  )
}
