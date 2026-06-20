import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import { useConvexAuth } from 'convex/react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'
import { FloatingNav } from '~/components/layout/FloatingNav'
import { SpeechBubble } from '~/components/ui/SpeechBubble'

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
          <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50">
            <div className="flex flex-col items-center gap-8">
              {/* Speech Bubble */}
              <SpeechBubble className="max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium">
                  Getting ready to help you discover your authentic voice...
                </p>
              </SpeechBubble>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="h-64 w-auto object-contain"
              />
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
        {isAuthenticated && <FloatingNav />}
        <div>{children}</div>
        <Scripts />
      </body>
    </html>
  )
}
