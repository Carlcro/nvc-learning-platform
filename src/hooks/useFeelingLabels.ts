import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useLocale } from '~/i18n/useT'

/**
 * Feelings are stored by their English word, the key every saved library and
 * check-in refers to. This turns a stored word (or a family, which is a
 * feeling word too) into the word to show in the current language.
 *
 * Shares its subscription with any other `feelings.getAll` for the same
 * language on the page.
 */
export function useFeelingLabels(): (word: string) => string {
  const locale = useLocale()
  const feelings = useQuery(api.feelings.getAll, { locale })
  return useMemo(() => {
    const labels = new Map(feelings?.map((f) => [f.word, f.label]))
    return (word: string) => labels.get(word) ?? word
  }, [feelings])
}
