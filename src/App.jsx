import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import { useAuth } from './hooks/useAuth'

const queryClient = new QueryClient()

function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function PublicRoute({ isAuthed, children }) {
  if (isAuthed) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  const auth = useAuth()
  const { user, loading } = auth

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4">
        <LoadingSpinner label="Semak status akaun..." />
      </main>
    )
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthed={Boolean(user)}>
                  <Dashboard auth={auth} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <PublicRoute isAuthed={Boolean(user)}>
                  <AuthPage auth={auth} />
                </PublicRoute>
              }
            />
            <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
