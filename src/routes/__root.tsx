import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { useConvexAuth } from 'convex/react'
import appCss from '~/styles/app.css?url'
import { Header, HeaderNav, HeaderBrand, HeaderMenu } from '~/components/layout/Header'
import { UserMenu } from '~/components/layout/UserMenu'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'NVC Learning App - Learn Compassionate Communication',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (isLoading) {
    return (
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="flex items-center justify-center min-h-screen bg-giraffe-50">
            <div className="text-center">
              <p className="text-lg text-brown-700">Loading your learning journey...</p>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    )
  }

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {isAuthenticated && (
          <Header sticky>
            <HeaderNav className="py-4 flex items-center justify-between">
              <Link to="/">
                <HeaderBrand>
                  Giraffe Communication
                </HeaderBrand>
              </Link>
              <HeaderMenu>
                <UserMenu />
              </HeaderMenu>
            </HeaderNav>
          </Header>
        )}
        {children}
        <Scripts />
      </body>
    </html>
  )
}
