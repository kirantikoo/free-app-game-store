import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { User } from 'firebase/auth'
import type { UserRole } from '../../services/firebase'

interface AccessState {
  user: User | null
  role: UserRole
  loading: boolean
}

function useAccessState() {
  const [state, setState] = useState<AccessState>({ user: null, role: 'user', loading: true })

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    const attachListener = async () => {
      const [{ onAuthStateChanged }, { doc, getDoc }, { auth, firestoreCollections }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        import('../../services/firebase'),
      ])

      if (cancelled) return

      unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        if (!nextUser) {
          if (!cancelled) setState({ user: null, role: 'user', loading: false })
          return
        }

        const snapshot = await getDoc(doc(firestoreCollections.users, nextUser.uid))
        if (!cancelled) {
          setState({
            user: nextUser,
            role: (snapshot.data()?.role as UserRole | undefined) ?? 'user',
            loading: false,
          })
        }
      })
    }

    attachListener().catch(() => setState({ user: null, role: 'user', loading: false }))

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return state
}

function GateShell({ label }: { label: string }) {
  return (
    <main className="flex min-h-[70svh] items-center justify-center px-6 text-[color:var(--text-primary)]">
      <div className="glass-panel-strong max-w-md rounded-[2rem] px-6 py-5 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]/80">Security</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{label}</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">We are checking your account and role before showing the destination screen.</p>
      </div>
    </main>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAccessState()
  const location = useLocation()

  if (loading) return <GateShell label="Checking sign-in state" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAccessState()

  if (loading) return <GateShell label="Checking admin access" />
  if (!user) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}