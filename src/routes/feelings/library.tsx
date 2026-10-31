import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useLocale, useT } from '~/i18n/useT'
import { upperFirst } from '~/lib/text'
import { useFeelingLabels } from '~/hooks/useFeelingLabels'
import { userFacingMessage } from '~/lib/errorMessage'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import {
  FeelingsPage,
  fieldClass,
  focusRing,
  textLinkClass,
} from '~/components/features/feelings/FeelingsPage'
import {
  CATEGORY_SWATCH,
  describeFeeling,
} from '~/components/features/feelings/feelingScale'

export const Route = createFileRoute('/feelings/library')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.feelings.library.meta) }
  },
  component: PersonalLibrary,
})

function PersonalLibrary() {
  const t = useT()
  const copy = t.feelings.library
  const currentUser = useQuery(api.users.getCurrentUser)
  const [filterFamily, setFilterFamily] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const locale = useLocale()
  const allFeelings = useQuery(api.feelings.getAll, { locale })
  const labelOf = useFeelingLabels()
  const userProgress = useQuery(
    api.feelingsProgress.getUserProgress,
    currentUser ? {} : 'skip',
  )
  const families = useQuery(api.feelings.getFamilies)

  const removeFeelingMutation = useMutation(
    api.feelings.removeFeelingFromLibrary,
  )

  const savedFeelings = useMemo(() => {
    if (!allFeelings || !userProgress) return []
    const savedSet = new Set(userProgress.feelingsSaved)
    return allFeelings.filter((f) => savedSet.has(f.word))
  }, [allFeelings, userProgress])

  const term = searchTerm.trim().toLowerCase()
  const filteredFeelings = useMemo(() => {
    return savedFeelings.filter((f) => {
      const familyMatch = filterFamily === 'all' || f.family === filterFamily
      const searchMatch =
        !term ||
        f.label.toLowerCase().includes(term) ||
        f.word.toLowerCase().includes(term) ||
        f.definition.toLowerCase().includes(term)
      return familyMatch && searchMatch
    })
  }, [savedFeelings, filterFamily, term])

  const handleRemove = async (word: string) => {
    if (!currentUser) return
    try {
      await removeFeelingMutation({ feelingWord: word })
      setStatusMessage(copy.removed(word))
    } catch (err) {
      setStatusMessage(userFacingMessage(err, copy.removeError(word), t.errors))
    }
  }

  if (allFeelings === undefined || userProgress === undefined) {
    return <GiraffeLoader message={copy.loading} />
  }

  return (
    <FeelingsPage title={copy.title} intro={<p>{copy.intro}</p>}>
      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {savedFeelings.length === 0 ? (
        <p className="max-w-prose text-lg text-brown-700 text-pretty">
          {copy.empty.before}
          <Link to="/feelings/wheel" className={textLinkClass}>
            {copy.empty.linkText}
          </Link>
          {copy.empty.after}
        </p>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="library-search"
                className="block text-sm font-semibold text-brown-700 mb-2"
              >
                {copy.searchLabel}
              </label>
              <input
                id="library-search"
                type="search"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="sm:w-56">
              <label
                htmlFor="library-family"
                className="block text-sm font-semibold text-brown-700 mb-2"
              >
                {copy.familyLabel}
              </label>
              <select
                id="library-family"
                value={filterFamily}
                onChange={(e) => setFilterFamily(e.target.value)}
                className={`${fieldClass} cursor-pointer`}
              >
                <option value="all">{copy.allFamilies}</option>
                {families?.map((family) => (
                  <option key={family} value={family}>
                    {upperFirst(labelOf(family))}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-brown-700">
            <p>
              {filteredFeelings.length === savedFeelings.length
                ? copy.savedCount(savedFeelings.length)
                : copy.showing(filteredFeelings.length, savedFeelings.length)}
            </p>
            <Link to="/feelings/wheel" className={textLinkClass}>
              {copy.findMore}
            </Link>
          </div>

          {filteredFeelings.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeelings.map((feeling) => (
                <li
                  key={feeling.word}
                  className="rounded-lg border-2 border-giraffe-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-brown-800">
                        {upperFirst(feeling.label)}
                      </h2>
                      <p className="mt-0.5 flex items-center gap-2 text-sm text-brown-700">
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 shrink-0 rounded-full ${CATEGORY_SWATCH[feeling.category]}`}
                        />
                        {copy.detail(
                          describeFeeling(feeling, t.feelings.scale),
                          feeling.familyLabel,
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRemove(feeling.word)}
                      aria-label={copy.remove(feeling.label)}
                      className={`-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-brown-700 hover:text-brown-900 hover:bg-giraffe-50 cursor-pointer ${focusRing}`}
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mt-3 text-brown-700 text-pretty">
                    {feeling.definition}
                  </p>

                  {feeling.examples.length > 0 && (
                    <p className="mt-3 text-sm text-brown-700 text-pretty">
                      <span className="font-semibold text-brown-800">
                        {t.feelings.page.inASentence}
                      </span>
                      {feeling.examples[0]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown-700">{copy.noMatches}</p>
          )}
        </div>
      )}
    </FeelingsPage>
  )
}
