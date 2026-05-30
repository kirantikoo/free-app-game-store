import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { RequireAdmin, RequireAuth } from './components/auth/RouteGuards'

const Apps = lazy(() => import('./pages/Apps'))
const Games = lazy(() => import('./pages/Games'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Publish = lazy(() => import('./pages/publish'))
const Admin = lazy(() => import('./pages/Admin'))

function RouteFallback() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6 text-[color:var(--text-primary)]">
      <div className="glass-panel-strong rounded-[2rem] px-6 py-5 text-sm text-[color:var(--text-secondary)]">
        Loading premium experience...
      </div>
    </main>
  )
}

function App() {
  return (
    /* App.tsx now owns routing only so page-level UI stays isolated and scalable. */
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/games" element={<Games />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
