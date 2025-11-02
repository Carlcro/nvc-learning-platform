import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider as AuthProvider } from '@convex-dev/auth/react'
import type { ReactNode } from 'react'

interface ConvexAuthProviderProps {
  children: ReactNode
}

/**
 * Wrapper component that sets up Convex with authentication
 * Combines ConvexProvider with ConvexAuthProvider
 */
export function ConvexAuthProvider({ children }: ConvexAuthProviderProps) {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!

  if (!CONVEX_URL) {
    throw new Error('VITE_CONVEX_URL environment variable is not set')
  }

  const convex = new ConvexReactClient(CONVEX_URL)

  return (
    <ConvexProvider client={convex}>
      <AuthProvider client={convex}>{children}</AuthProvider>
    </ConvexProvider>
  )
}
