import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { PageLoading } from './PageLoading'
import { supabase } from '../lib/supabase'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return <PageLoading message="Loading..." size="sm" />
  }

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  return children
}
