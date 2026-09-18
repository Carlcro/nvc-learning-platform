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
import { NotFoundPage } from '~/components/layout/ErrorStates'
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
      // Fallbacks only. Each route supplies its own title and description via
      // pageMeta, and the route's values win where both are present.
      {
        title: 'NVC Learning App: Learn Compassionate Communication',
      },
      {
        name: 'description',
        content:
          'Practice the four steps of compassionate communication through guided lessons and lifelike roleplay conversations.',
      },
      { property: 'og:site_name', content: 'NVC Learning App' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
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
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: NotFoundPage,
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
  const { isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <html lang="en">
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <FloatingNav />
        <div>{children}</div>
        <Scripts />
      </body>
    </html>
  )
}
