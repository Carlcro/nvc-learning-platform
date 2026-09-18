import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexAuthProvider } from './providers/ConvexAuthProvider'
import { routeTree } from './routeTree.gen'
import { NotFoundPage, RouteErrorPage } from './components/layout/ErrorStates'

export function getRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

  if (!CONVEX_URL) {
    throw new Error(
      'Missing VITE_CONVEX_URL. Set it in .env.local for local development, or as a build variable on the hosting deployment.',
    )
  }

  // One Convex client for the whole app. React Query reads through
  // convexQueryClient, and the auth provider is handed the same underlying
  // client so that queries made either way carry the signed-in identity.
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5 * 60 * 1000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0, // Let React Query handle all caching
      defaultErrorComponent: RouteErrorPage,
      defaultNotFoundComponent: NotFoundPage,
      Wrap: ({ children }) => (
        <ConvexAuthProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexAuthProvider>
      ),
    }),
    queryClient,
  )

  return router
}
