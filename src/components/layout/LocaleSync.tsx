import { useEffect, useRef } from 'react'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SELECTABLE_LOCALES, isSelectable } from '~/i18n/config'
import { useApplyLocale, useLocale } from '~/i18n/useT'

/**
 * Keep the page's language and the account's saved language in step, once
 * per sign-in: a saved choice wins (it follows the person between devices),
 * and an account with no choice yet keeps the language it was browsing in.
 */
export function LocaleSync() {
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : 'skip')
  const locale = useLocale()
  const applyLocale = useApplyLocale()
  const saveLocale = useMutation(api.users.setLocale)
  const syncedFor = useRef<string | null>(null)

  useEffect(() => {
    // Nothing to reconcile while English is the only language on offer.
    if (SELECTABLE_LOCALES.length < 2) return
    if (!user || syncedFor.current === user._id) return
    syncedFor.current = user._id

    const saved = user.preferredLocale
    if (saved && isSelectable(saved)) {
      if (saved !== locale) void applyLocale(saved)
    } else {
      void saveLocale({ locale }).catch(() => undefined)
    }
  }, [user, locale, applyLocale, saveLocale])

  return null
}
