import { useCallback, useMemo } from 'react'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getMessages } from './messages'
import { writeLocaleCookie } from './resolveLocale'
import type { Locale } from '../../convex/lib/locale'
import type { Messages } from './messages'

/** The language the page is rendering in. */
export function useLocale(): Locale {
  return useRouteContext({ from: '__root__', select: (c) => c.locale })
}

/**
 * The dictionary for the current language. Read strings as properties
 * (`t.nav.signIn`) and call the ones that take values (`t.nav.level(3)`).
 */
export function useT(): Messages {
  return getMessages(useLocale())
}

/**
 * Switch the page to another language without a reload. The router re-reads
 * the cookie, so every route's copy and page title follow.
 */
export function useApplyLocale() {
  const router = useRouter()
  return useCallback(
    async (locale: Locale) => {
      writeLocaleCookie(locale)
      document.documentElement.lang = locale
      await router.invalidate()
    },
    [router],
  )
}

/** Switch language and, when signed in, remember the choice on the account. */
export function useSetLocale() {
  const applyLocale = useApplyLocale()
  const saveLocale = useMutation(api.users.setLocale)
  const { isAuthenticated } = useConvexAuth()

  return useCallback(
    async (locale: Locale) => {
      await applyLocale(locale)
      if (isAuthenticated) {
        // The page has already switched; a failed save only means the next
        // device starts from its own guess.
        await saveLocale({ locale }).catch(() => undefined)
      }
    },
    [applyLocale, saveLocale, isAuthenticated],
  )
}

/** Number and date formatting in the current language. */
export function useFormat() {
  const locale = useLocale()
  return useMemo(() => formatters(locale), [locale])
}

export function formatters(locale: Locale) {
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      value.toLocaleString(locale, options),
    date: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) =>
      new Date(value).toLocaleDateString(locale, options),
    time: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) =>
      new Date(value).toLocaleTimeString(locale, options),
    list: (items: ReadonlyArray<string>, type: Intl.ListFormatType = 'conjunction') =>
      new Intl.ListFormat(locale, { style: 'long', type }).format(items),
  }
}
