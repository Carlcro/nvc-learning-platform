import type { Locale } from '../../convex/lib/locale'

/** The plural forms the app's languages need. All four use only these two. */
export interface PluralForms {
  one: string
  other: string
}

/**
 * A plural chooser bound to one language, for use inside a dictionary:
 *
 *   const plural = pluralFor('en')
 *   minutes: (n: number) => plural(n, { one: `${n} minute`, other: `${n} minutes` })
 */
export function pluralFor(locale: Locale) {
  const rules = new Intl.PluralRules(locale)
  return (count: number, forms: PluralForms): string =>
    rules.select(count) === 'one' ? forms.one : forms.other
}
