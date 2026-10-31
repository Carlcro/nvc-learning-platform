import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { userFacingMessage } from '~/lib/errorMessage'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useFormat, useLocale, useT } from '~/i18n/useT'
import { upperFirst } from '~/lib/text'
import { useFeelingLabels } from '~/hooks/useFeelingLabels'
import { localDateString } from '~/lib/localDate'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import {
  FeelingsPage,
  fieldClass,
  focusRing,
} from '~/components/features/feelings/FeelingsPage'
import { OptionButton } from '~/components/features/feelings/OptionButton'
import { CATEGORY_FILL } from '~/components/features/feelings/feelingScale'

export const Route = createFileRoute('/feelings/check-in')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.feelings.checkIn.meta) }
  },
  component: DailyCheckIn,
})

// A short starting list, in this order. The search finds every other word.
const COMMON_FEELINGS_LIST = [
  'happy',
  'sad',
  'angry',
  'scared',
  'excited',
  'tired',
  'grateful',
  'frustrated',
  'anxious',
  'content',
  'confused',
  'hopeful',
]

const MAX_SEARCH_RESULTS = 8

function DailyCheckIn() {
  const t = useT()
  const copy = t.feelings.checkIn
  const format = useFormat()
  const currentUser = useQuery(api.users.getCurrentUser)
  const [selectedFeelings, setSelectedFeelings] = useState<Array<string>>([])
  const [note, setNote] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Queries
  const locale = useLocale()
  const allFeelings = useQuery(api.feelings.getAll, { locale })
  const labelOf = useFeelingLabels()
  const todayCheckIn = useQuery(
    api.feelingsProgress.getTodayCheckIn,
    currentUser ? { localDate: localDateString() } : 'skip',
  )
  const history = useQuery(
    api.feelingsProgress.getCheckInHistory,
    currentUser ? { limit: 7 } : 'skip',
  )
  const weeklyPatterns = useQuery(
    api.feelingsProgress.getWeeklyPatterns,
    currentUser ? { locale } : 'skip',
  )

  const recordCheckInMutation = useMutation(api.feelingsProgress.recordCheckIn)

  // Start from today's check-in once, if there is one, without overwriting
  // anything the person has already begun to choose.
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current || todayCheckIn === undefined) return
    initialized.current = true
    if (todayCheckIn) {
      setSelectedFeelings((prev) =>
        prev.length === 0 ? todayCheckIn.feelings : prev,
      )
      setNote((prev) => (prev ? prev : todayCheckIn.note || ''))
    }
  }, [todayCheckIn])

  const commonFeelings = useMemo(() => {
    if (!allFeelings) return []
    return COMMON_FEELINGS_LIST.map((word) =>
      allFeelings.find((f) => f.word.toLowerCase() === word),
    ).filter((f) => f !== undefined)
  }, [allFeelings])

  // Every word matches, common ones included, so searching for "sad" finds it.
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!allFeelings || !term) return []
    return allFeelings
      .filter(
        (f) =>
          (f.label.toLowerCase().includes(term) ||
            f.word.toLowerCase().includes(term)) &&
          !selectedFeelings.includes(f.word),
      )
      .slice(0, MAX_SEARCH_RESULTS)
  }, [allFeelings, searchTerm, selectedFeelings])

  const handleToggleFeeling = (word: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(word) ? prev.filter((f) => f !== word) : [...prev, word],
    )
    setSearchTerm('')
    setSaved(false)
  }

  const handleSubmit = async () => {
    if (!currentUser || selectedFeelings.length === 0) return

    setIsSubmitting(true)
    setError(null)
    try {
      // Points and the streak are still recorded on the server; this page
      // does not mention them, so a check-in never feels like a score.
      await recordCheckInMutation({
        feelings: selectedFeelings,
        note: note,
        localDate: localDateString(),
      })
      setSaved(true)
    } catch (err) {
      setError(userFacingMessage(err, copy.saveError, t.errors))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (allFeelings === undefined) {
    return <GiraffeLoader message={copy.loading} />
  }

  return (
    <FeelingsPage title={copy.title} intro={<p>{copy.intro}</p>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Check-in form */}
        <section
          aria-labelledby="checkin-heading"
          className="lg:col-span-2 rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-7"
        >
          <h2
            id="checkin-heading"
            className="text-xl font-bold text-brown-800 mb-5"
          >
            {copy.formHeading}
          </h2>

          {selectedFeelings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-brown-700 mb-2">
                {copy.selectedHeading}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {selectedFeelings.map((word) => (
                  <li
                    key={word}
                    className="inline-flex items-center rounded-lg border-2 border-brown-700 bg-giraffe-100 pl-3 text-brown-900 font-medium"
                  >
                    {upperFirst(labelOf(word))}
                    <button
                      type="button"
                      onClick={() => handleToggleFeeling(word)}
                      aria-label={copy.remove(labelOf(word))}
                      className={`ml-1 grid h-11 w-11 place-items-center rounded-md text-brown-700 hover:text-brown-900 cursor-pointer ${focusRing}`}
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8">
            <h3
              id="common-heading"
              className="text-sm font-semibold text-brown-700 mb-3"
            >
              {copy.commonHeading}
            </h3>
            <div
              role="group"
              aria-labelledby="common-heading"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            >
              {commonFeelings.map((feeling) => (
                <OptionButton
                  key={feeling.word}
                  pressed={selectedFeelings.includes(feeling.word)}
                  onClick={() => handleToggleFeeling(feeling.word)}
                 
                >
                  {upperFirst(feeling.label)}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label
              htmlFor="checkin-search"
              className="block text-sm font-semibold text-brown-700 mb-2"
            >
              {copy.searchLabel}
            </label>
            <input
              id="checkin-search"
              type="search"
              autoComplete="off"
              placeholder={copy.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-describedby="checkin-search-count"
              className={fieldClass}
            />
            <p id="checkin-search-count" aria-live="polite" className="sr-only">
              {searchTerm.trim() ? copy.matches(searchResults.length) : ''}
            </p>
            {searchTerm.trim() && (
              <div className="mt-2">
                {searchResults.length > 0 ? (
                  <ul className="rounded-lg border-2 border-giraffe-200 bg-white divide-y divide-giraffe-100 overflow-hidden">
                    {searchResults.map((feeling) => (
                      <li key={feeling.word}>
                        <button
                          type="button"
                          onClick={() => handleToggleFeeling(feeling.word)}
                          className="w-full min-h-11 px-4 py-2 text-left text-brown-800 hover:bg-giraffe-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-giraffe-400"
                        >
                          {upperFirst(feeling.label)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-brown-700">{copy.noMatches}</p>
                )}
              </div>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="checkin-note"
              className="block text-sm font-semibold text-brown-700 mb-2"
            >
              {copy.noteLabel}
            </label>
            <textarea
              id="checkin-note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                setSaved(false)
              }}
              aria-describedby="checkin-note-privacy"
              placeholder={copy.notePlaceholder}
              className={`${fieldClass} min-h-28`}
            />
            <p
              id="checkin-note-privacy"
              className="mt-2 text-sm text-brown-700"
            >
              {copy.notePrivacy}
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => void handleSubmit()}
            disabled={selectedFeelings.length === 0}
            isLoading={isSubmitting}
            className={`w-full sm:w-auto px-8 min-h-12 ${focusRing}`}
          >
            {isSubmitting
              ? copy.saving
              : todayCheckIn
                ? copy.update
                : copy.save}
          </Button>
          {selectedFeelings.length === 0 && (
            <p className="mt-2 text-sm text-brown-700">{copy.chooseOne}</p>
          )}

          <div role="status" className="empty:hidden mt-4">
            {saved && (
              <p className="rounded-lg border-2 border-giraffe-200 bg-giraffe-50 px-4 py-3 text-brown-800 font-medium text-pretty">
                {copy.saved}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border-2 border-brown-200 bg-brown-50 px-4 py-3"
            >
              <p className="text-brown-800 font-medium">{error}</p>
            </div>
          )}
        </section>

        {/* Looking back */}
        <div className="space-y-8">
          <section aria-labelledby="history-heading">
            <h2
              id="history-heading"
              className="text-lg font-bold text-brown-800 mb-4"
            >
              {copy.historyHeading}
            </h2>
            {history && history.length > 0 ? (
              <ol className="space-y-5 border-l-2 border-giraffe-200 pl-5">
                {history.map((checkIn) => (
                  <li key={checkIn.date}>
                    <p className="text-sm font-semibold text-brown-700">
                      {format.date(checkIn.date, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-brown-900">
                      {checkIn.feelings
                        .map((word) => upperFirst(labelOf(word)))
                        .join(', ')}
                    </p>
                    {checkIn.note && (
                      <p className="mt-1 text-sm text-brown-700 text-pretty">
                        {checkIn.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-brown-700 text-sm text-pretty">
                {copy.historyEmpty}
              </p>
            )}
          </section>

          {weeklyPatterns && weeklyPatterns.frequentFeelings.length > 0 && (
            <section aria-labelledby="week-heading">
              <h2
                id="week-heading"
                className="text-lg font-bold text-brown-800 mb-4"
              >
                {copy.weekHeading}
              </h2>
              <ul className="space-y-4">
                {weeklyPatterns.frequentFeelings.map((insight) => {
                  const cameUp = copy.cameUp(insight.count)
                  return (
                    <li key={insight.feeling} className="text-brown-800">
                      <p className="text-pretty">
                        {cameUp.before}
                        <span className="font-semibold">
                          {upperFirst(insight.label)}
                        </span>
                        {cameUp.after}
                      </p>
                      {insight.relatedNeeds.length > 0 && (
                        <p className="mt-1 text-sm text-brown-700 text-pretty">
                          {copy.pointsToNeeds(
                            insight.relatedNeeds.map((n) => n.toLowerCase()),
                          )}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 pt-4 border-t-2 border-brown-100">
                <p className="text-sm text-brown-700 mb-2">
                  {copy.balanceLabel}
                </p>
                <div
                  aria-hidden="true"
                  className="flex h-3 rounded-full overflow-hidden bg-brown-100"
                >
                  <div
                    className={CATEGORY_FILL.pleasant}
                    style={{ width: `${weeklyPatterns.pleasantPercent}%` }}
                  />
                  <div
                    className={CATEGORY_FILL.unpleasant}
                    style={{ width: `${weeklyPatterns.unpleasantPercent}%` }}
                  />
                </div>
                <div className="flex justify-between gap-4 text-sm text-brown-700 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${CATEGORY_FILL.pleasant}`}
                    />
                    {copy.pleasantPercent(weeklyPatterns.pleasantPercent)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${CATEGORY_FILL.unpleasant}`}
                    />
                    {copy.unpleasantPercent(weeklyPatterns.unpleasantPercent)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-brown-700 text-pretty">
                  {copy.balanceNote}
                </p>
              </div>
            </section>
          )}

          <aside className="border-t-2 border-brown-100 pt-6">
            <h2 className="font-bold text-brown-800 mb-1">
              {copy.didYouKnowHeading}
            </h2>
            <p className="text-brown-700 text-sm text-pretty">
              {copy.didYouKnowText}
            </p>
          </aside>
        </div>
      </div>
    </FeelingsPage>
  )
}
