import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { ReactNode } from 'react'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { NotFoundPage } from '~/components/layout/ErrorStates'

/**
 * Only admins get past this. Everyone else sees the ordinary "page not found"
 * screen, so the panel does not announce itself to people who cannot use it.
 *
 * This is a courtesy, not the lock: every admin query checks access again on
 * the server and refuses on its own.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  )
}

function AdminOnly({ children }: { children: ReactNode }) {
  const isAdmin = useQuery(api.admin.amIAdmin)

  if (isAdmin === undefined) return <AdminLoading />
  if (!isAdmin) return <NotFoundPage />
  return <>{children}</>
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24" role="status">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-giraffe-600" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
