import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Buses from './pages/Buses'
import TransportCompanies from './pages/TransportCompanies'
import Maintenance from './pages/Maintenance'
import Users from './pages/Users'
import Cost from './pages/Cost'
import StubPage from './pages/StubPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--navy-700)', fontFamily: 'var(--font-sans)' }}>กำลังโหลด...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--navy-700)', fontFamily: 'var(--font-sans)' }}>กำลังโหลด...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="driver" element={<Drivers />} />
        <Route path="bus" element={<Buses />} />
        <Route path="companies" element={<TransportCompanies />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="cost" element={<Cost />} />
        <Route path="fuel" element={<StubPage page="fuel" />} />
        <Route path="training" element={<StubPage page="training" />} />
        <Route path="license" element={<StubPage page="license" />} />
        <Route path="complaint" element={<StubPage page="complaint" />} />
        <Route path="safety" element={<StubPage page="safety" />} />
        <Route path="purchase" element={<StubPage page="purchase" />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
