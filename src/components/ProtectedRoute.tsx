import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { PageLoading } from './PageLoading'
import { supabase } from '../lib/supabase'

/**
 * Layout route that guards all nested child routes.
 * Add new protected pages under the matching group in router.tsx — this file stays the same.
 */
export function ProtectedRoute() {
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

  return <Outlet />
}
