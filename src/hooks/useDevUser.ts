/**
 * Development Hook: useDevUser
 *
 * DEPRECATED: This hook is no longer used with Convex Auth.
 * Authentication is now handled via ConvexAuthProvider and @convex-dev/auth.
 *
 * Use useQuery(api.users.getCurrentUser) instead for the current authenticated user.
 */

import { useState } from 'react'

export function useDevUser() {
  const [userId] = useState<string | null>(null)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  console.warn('useDevUser is deprecated. Use useQuery(api.users.getCurrentUser) instead.')

  return { userId, isLoading, error }
}
