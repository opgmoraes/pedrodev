import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebaseClient'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<'loading' | 'in' | 'out'>('loading')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? 'in' : 'out')
    })
    return unsub
  }, [])

  if (status === 'loading') return <div className="container mono">carregando…</div>
  if (status === 'out') return <Navigate to="/login" replace />
  return children
}
