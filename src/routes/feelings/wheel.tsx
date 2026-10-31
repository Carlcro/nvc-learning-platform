import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Messages } from '~/i18n/messages'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useLocale, useT } from '~/i18n/useT'
import { upperFirst } from '~/lib/text'
import { useFeelingLabels } from '~/hooks/useFeelingLabels'
import { userFacingMessage } from '~/lib/errorMessage'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import {
  FeelingsPage,
  fieldClass,
  focusRing,
  textLinkClass,
} from '~/components/features/feelings/FeelingsPage'
import { OptionButton } from '~/components/features/feelings/OptionButton'
import {
  CATEGORY_SWATCH,
  describeFeeling,
} from '~/components/features/feelings/feelingScale'

export const Route = createFileRoute('/feelings/wheel')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.feelings.wheel.meta) }
  },
  component: BrowseFeelings,
})

type Category = 'all' | 'pleasant' | 'unpleasant'

const CATEGORY_OPTIONS: ReadonlyArray<Category> = [
  'all',
  'pleasant',
  'unpleasant',
]

function categoryLabel(category: Category, t: Messages): string {
  return category === 'all'
    ? t.feelings.wheel.categoryAll
    : t.feelings.scale.category[category]
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function BrowseFeelings() {
  const t = useT()
  const copy = t.feelings.wheel
  const currentUser = useQuery(api.users.getCurrentUser)
  const [selectedFamily, setSelectedFamily] = useState('joyful')
  const [showCategory, setShowCategory] = useState<Category>('all')
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [libraryMessage, setLibraryMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)

  // Queries
  const families = useQuery(api.feelings.getFamilies)
  const locale = useLocale()
  const allFeelings = useQuery(api.feelings.getAll, { locale })
  const labelOf = useFeelingLabels()
  const userProgress = useQuery(
    api.feelingsProgress.getUserProgress,
    currentUser ? {} : 'skip',
  )

  // Mutations
  const markExploredMutation = useMutation(api.feelings.markFeelingExplored)
  const saveFeelingMutation = useMutation(api.feelings.saveFeelingToLibrary)
  const removeFeelingMutation = useMutation(
    api.feelings.removeFeelingFromLibrary,
  )

  const term = searchTerm.trim().toLowerCase()

  const filteredFeelings = useMemo(() => {
    if (!allFeelings) return []
    return allFeelings.filter((f) => {
      const familyMatch = term ? true : f.family === selectedFamily
      const categoryMatch =
        showCategory === 'all' || f.category === showCategory
      const searchMatch = term
        ? f.label.toLowerCase().includes(term) ||
          f.word.toLowerCase().includes(term) ||
          f.definition.toLowerCase().includes(term)
        : true
      return familyMatch && categoryMatch && searchMatch
    })
  }, [allFeelings, selectedFamily, showCategory, term])

  const selectedFeelingDetail = useMemo(
    () =>
      allFeelings
        ? (allFeelings.find((f) => f.word === selectedFeeling) ?? null)
        : null,
    [allFeelings, selectedFeeling],
  )

  const isSaved = Boolean(
    selectedFeeling && userProgress?.feelingsSaved.includes(selectedFeeling),
  )

  // On a phone the detail sits below the grid, out of view. Bring it in and
  // move focus to its heading, so keyboard and screen reader users land on it.
  useEffect(() => {
    if (!selectedFeeling) return
    const heading = detailHeadingRef.current
    if (!heading) return
    heading.focus({ preventScroll: true })
    heading.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [selectedFeeling])

  const handleChooseFeeling = (word: string) => {
    setSelectedFeeling(word)
    setLibraryMessage(null)
    if (currentUser) {
      void markExploredMutation({ feelingWord: word })
    }
  }

  const handleSave = async () => {
    if (!selectedFeeling || !currentUser) return
    setIsSaving(true)
    try {
      await saveFeelingMutation({ feelingWord: selectedFeeling })
      setLibraryMessage(copy.saved)
    } catch (err) {
      setLibraryMessage(userFacingMessage(err, copy.saveError, t.errors))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!selectedFeeling || !currentUser) return
    try {
      await removeFeelingMutation({ feelingWord: selectedFeeling })
      setLibraryMessage(copy.removed)
    } catch (err) {
      setLibraryMessage(userFacingMessage(err, copy.removeError, t.errors))
    }
  }

  if (families === undefined || allFeelings === undefined) {
    return <GiraffeLoader message={copy.loading} />
  }

  const gridHeading = term
    ? copy.gridHeadingSearch(searchTerm.trim())
    : copy.gridHeadingFamily(
        `${labelOf(selectedFamily).charAt(0).toUpperCase()}${labelOf(selectedFamily).slice(1)}`,
      )

  return (
    <FeelingsPage title={copy.title} intro={<p>{copy.intro}</p>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div>
              <label
                htmlFor="wheel-search"
                className="block text-sm font-semibold text-brown-700 mb-2"
              >
                {copy.searchLabel}
              </label>
              <input
                id="wheel-search"
                type="search"
                autoComplete="off"
                placeholder={copy.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <h2
                id="category-heading"
                className="text-sm font-semibold text-brown-700 mb-2"
              >
                {copy.showHeading}
              </h2>
              <div
                role="group"
                aria-labelledby="category-heading"
                className="flex flex-wrap gap-2"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <OptionButton
                    key={option}
                    pressed={showCategory === option}
                    onClick={() => setShowCategory(option)}
                  >
                    {categoryLabel(option, t)}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <h2
                id="family-heading"
                className="text-sm font-semibold text-brown-700 mb-2"
              >
                {copy.familiesHeading}
              </h2>
              <div
                role="group"
                aria-labelledby="family-heading"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2"
              >
                {families.map((family) => (
                  <OptionButton
                    key={family}
                    pressed={!term && selectedFamily === family}
                    onClick={() => {
                      setSelectedFamily(family)
                      setSearchTerm('')
                    }}
                   
                  >
                    {upperFirst(labelOf(family))}
                  </OptionButton>
                ))}
              </div>
            </div>

            <p className="text-sm text-brown-700 text-pretty">
              {copy.intensityPrompt}
              <Link to="/feelings/intensity" className={textLinkClass}>
                {copy.intensityLink}
              </Link>
            </p>
          </div>
        </div>

        {/* Feelings and the chosen one's detail */}
        <div className="lg:col-span-2 space-y-8">
          <section aria-labelledby="grid-heading">
            <h2
              id="grid-heading"
              className="text-xl font-bold text-brown-800 mb-4 text-balance"
            >
              {gridHeading}
            </h2>
            {filteredFeelings.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredFeelings.map((feeling) => (
                  <li key={feeling.word}>
                    <OptionButton
                      pressed={selectedFeeling === feeling.word}
                      onClick={() => handleChooseFeeling(feeling.word)}
                      className="w-full flex items-center gap-3 py-3"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-3 w-3 shrink-0 rounded-full ${CATEGORY_SWATCH[feeling.category]}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-brown-900">
                          {upperFirst(feeling.label)}
                        </span>
                        <span className="block text-sm font-normal text-brown-700">
                          {describeFeeling(feeling, t.feelings.scale)}
                        </span>
                      </span>
                    </OptionButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-brown-700 py-4">{copy.noMatches}</p>
            )}
          </section>

          {selectedFeelingDetail ? (
            <section
              aria-labelledby="detail-heading"
              className="rounded-lg border-2 border-giraffe-300 bg-white p-5 sm:p-7 scroll-mt-28"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2
                    id="detail-heading"
                    ref={detailHeadingRef}
                    tabIndex={-1}
                    className="text-2xl sm:text-3xl font-bold text-brown-800 scroll-mt-28 focus:outline-none"
                  >
                    {upperFirst(selectedFeelingDetail.label)}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-brown-700">
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-full ${CATEGORY_SWATCH[selectedFeelingDetail.category]}`}
                    />
                    {copy.detail(
                      describeFeeling(selectedFeelingDetail, t.feelings.scale),
                      selectedFeelingDetail.familyLabel,
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFeeling(null)}
                  aria-label={copy.close(selectedFeelingDetail.label)}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-brown-700 hover:text-brown-900 hover:bg-giraffe-50 cursor-pointer ${focusRing}`}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 max-w-prose">
                <div>
                  <h3 className="font-semibold text-brown-800 mb-1">
                    {copy.meaningHeading}
                  </h3>
                  <p className="text-brown-700 text-pretty">
                    {selectedFeelingDetail.definition}
                  </p>
                </div>

                {selectedFeelingDetail.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brown-800 mb-1">
                      {copy.sentenceHeading}
                    </h3>
                    <ul className="space-y-2">
                      {selectedFeelingDetail.examples.map((example) => (
                        <li
                          key={example}
                          className="flex gap-3 text-brown-700 text-pretty"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-giraffe-500"
                          />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedFeelingDetail.synonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brown-800 mb-1">
                      {copy.similarHeading}
                    </h3>
                    <p className="text-brown-700">
                      {selectedFeelingDetail.synonyms.join(', ')}
                    </p>
                  </div>
                )}

                {selectedFeelingDetail.relatedFeelings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brown-800 mb-1">
                      {copy.relatedHeading}
                    </h3>
                    <p className="text-brown-700">
                      {selectedFeelingDetail.relatedFeelings.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {currentUser && (
                <div className="mt-6 pt-6 border-t-2 border-brown-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  {isSaved ? (
                    <button
                      type="button"
                      onClick={() => void handleRemove()}
                      className={`self-start min-h-11 cursor-pointer ${textLinkClass}`}
                    >
                      {copy.remove}
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => void handleSave()}
                      isLoading={isSaving}
                      className={`min-h-11 px-6 ${focusRing}`}
                    >
                      {copy.save}
                    </Button>
                  )}
                  <p
                    role="status"
                    className="text-sm font-medium text-brown-800"
                  >
                    {libraryMessage ?? (isSaved ? copy.inLibrary : '')}
                  </p>
                </div>
              )}
            </section>
          ) : (
            <p className="rounded-lg border-2 border-giraffe-200 bg-giraffe-50 px-5 py-6 text-brown-700 text-pretty">
              {copy.choosePrompt}
            </p>
          )}
        </div>
      </div>
    </FeelingsPage>
  )
}
