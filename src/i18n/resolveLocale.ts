import { createIsomorphicFn } from '@tanstack/react-start'
import {
  getCookie,
  getRequestHeader,
  setCookie,
} from '@tanstack/react-start/server'
import {
  isLocale,
  matchLocale,
  parseAcceptLanguage,
} from '../../convex/lib/locale'
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  SELECTABLE_LOCALES,
  isSelectable,
} from './config'
import type { Locale } from '../../convex/lib/locale'

/**
 * The language to render in. The cookie wins; on a first visit the browser's
 * languages decide, and the server stores its guess in the cookie so the
 * client hydrates in the same language.
 */
export const resolveLocale = createIsomorphicFn()
  .server((): Locale => {
    const saved = getCookie(LOCALE_COOKIE)
    if (isLocale(saved) && isSelectable(saved)) return saved

    const detected = matchLocale(
      parseAcceptLanguage(getRequestHeader('accept-language')),
      SELECTABLE_LOCALES,
    )
    setCookie(LOCALE_COOKIE, detected, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return detected
  })
  .client((): Locale => {
    const saved = readLocaleCookie()
    if (saved && isSelectable(saved)) return saved
    return matchLocale(navigator.languages, SELECTABLE_LOCALES)
  })

function readLocaleCookie(): Locale | null {
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
  const value = entry?.slice(LOCALE_COOKIE.length + 1)
  return isLocale(value) ? value : null
}

export function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
}
