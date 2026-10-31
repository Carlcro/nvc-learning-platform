import { LOCALE_NAMES, isLocale } from '../../../convex/lib/locale'
import { SELECTABLE_LOCALES } from '~/i18n/config'
import { useLocale, useSetLocale, useT } from '~/i18n/useT'

interface LanguagePickerProps {
  className?: string
  /** 'dark' for use on a dark background, such as the landing footer. */
  tone?: 'light' | 'dark'
}

/**
 * A plain select of the languages on offer, each named in its own language.
 * Renders nothing while there is only one.
 */
export function LanguagePicker({
  className = '',
  tone = 'light',
}: LanguagePickerProps) {
  const t = useT()
  const locale = useLocale()
  const setLocale = useSetLocale()

  if (SELECTABLE_LOCALES.length < 2) return null

  return (
    <label className={`flex items-center justify-between gap-3 text-sm ${className}`}>
      <span
        className={`font-medium ${tone === 'dark' ? 'text-brown-200' : 'text-brown-700'}`}
      >
        {t.common.language}
      </span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value
          if (isLocale(next)) void setLocale(next)
        }}
        className="rounded-lg border border-giraffe-200 bg-white px-2 py-1 text-brown-800 focus:outline-none focus:ring-2 focus:ring-giraffe-400"
      >
        {SELECTABLE_LOCALES.map((code) => (
          <option key={code} value={code} lang={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
    </label>
  )
}
