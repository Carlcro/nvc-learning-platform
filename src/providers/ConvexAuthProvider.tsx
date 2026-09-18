import { ConvexProvider } from 'convex/react'
import { ConvexAuthProvider as AuthProvider } from '@convex-dev/auth/react'
import type { ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

interface ConvexAuthProviderProps {
  children: ReactNode
  client: ConvexReactClient
}

/**
 * Wires authentication onto the app's single Convex client. The client is
 * created once per router instance and passed in, so no client is constructed
 * during render.
 */
export function ConvexAuthProvider({
  children,
  client,
}: ConvexAuthProviderProps) {
  return (
    <ConvexProvider client={client}>
      <AuthProvider client={client}>{children}</AuthProvider>
    </ConvexProvider>
  )
}
