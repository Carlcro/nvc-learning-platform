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
import { SITE_NAME } from '~/lib/seo'
import { LocaleSync } from '~/components/layout/LocaleSync'
import { OnboardingRedirect } from '~/components/layout/OnboardingRedirect'
import { getMessages } from '~/i18n/messages'
import { resolveLocale } from '~/i18n/resolveLocale'
import { useLocale, useT } from '~/i18n/useT'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  // Runs on the server for the first render and in the browser after that,
  // so every route below can read the language from its context.
  beforeLoad: () => ({ locale: resolveLocale() }),
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return {
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
      { title: t.common.defaultMeta.title },
      { name: 'description', content: t.common.defaultMeta.description },
      { property: 'og:site_name', content: SITE_NAME },
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
    }
  },
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
  const locale = useLocale()
  const t = useT()

  if (isLoading) {
    return (
      <html lang={locale}>
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50">
            <div className="flex flex-col items-center gap-8">
              {/* Speech Bubble */}
              <SpeechBubble className="max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium">
                  {t.common.appLoading}
                </p>
              </SpeechBubble>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt={t.common.giraffeAlt}
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
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <LocaleSync />
        <OnboardingRedirect />
        <FloatingNav />
        <div>{children}</div>
        <Scripts />
      </body>
    </html>
  )
}
