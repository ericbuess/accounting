import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import Accounts from './pages/Accounts'
import JournalEntries from './pages/JournalEntries'
import Reports from './pages/Reports'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="journal" element={<JournalEntries />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App