import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
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
  head: () => ({
    meta: pageMeta({
      title: 'Your saved feelings',
      description: 'The feelings you have explored and saved.',
    }),
  }),
  component: PersonalLibrary,
})

function PersonalLibrary() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const [filterFamily, setFilterFamily] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const allFeelings = useQuery(api.feelings.getAll)
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
        f.word.toLowerCase().includes(term) ||
        f.definition.toLowerCase().includes(term)
      return familyMatch && searchMatch
    })
  }, [savedFeelings, filterFamily, term])

  const handleRemove = async (word: string) => {
    if (!currentUser) return
    try {
      await removeFeelingMutation({ feelingWord: word })
      setStatusMessage(`Removed ${word} from your library.`)
    } catch (err) {
      setStatusMessage(
        userFacingMessage(err, `We could not remove ${word} just now.`),
      )
    }
  }

  if (allFeelings === undefined || userProgress === undefined) {
    return <GiraffeLoader message="Opening your library..." />
  }

  return (
    <FeelingsPage
      title="Your saved feelings"
      intro={
        <p>
          The words you have kept to come back to. Reading them now and then
          makes them easier to reach for when it matters.
        </p>
      }
    >
      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {savedFeelings.length === 0 ? (
        <p className="max-w-prose text-lg text-brown-700 text-pretty">
          Nothing saved yet. When a word fits something you have felt, save it
          while you{' '}
          <Link to="/feelings/wheel" className={textLinkClass}>
            browse feelings
          </Link>{' '}
          and it will wait for you here.
        </p>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="library-search"
                className="block text-sm font-semibold text-brown-700 mb-2"
              >
                Search your saved feelings
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
                Family
              </label>
              <select
                id="library-family"
                value={filterFamily}
                onChange={(e) => setFilterFamily(e.target.value)}
                className={`${fieldClass} capitalize cursor-pointer`}
              >
                <option value="all">All families</option>
                {families?.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-brown-700">
            <p>
              {filteredFeelings.length === savedFeelings.length
                ? `${savedFeelings.length} saved`
                : `Showing ${filteredFeelings.length} of ${savedFeelings.length}`}
            </p>
            <Link to="/feelings/wheel" className={textLinkClass}>
              Find more words
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
                      <h2 className="text-xl font-bold text-brown-800 capitalize">
                        {feeling.word}
                      </h2>
                      <p className="mt-0.5 flex items-center gap-2 text-sm text-brown-700">
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 shrink-0 rounded-full ${CATEGORY_SWATCH[feeling.category]}`}
                        />
                        {describeFeeling(feeling)}, {feeling.family}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRemove(feeling.word)}
                      aria-label={`Remove ${feeling.word}`}
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
                        In a sentence:{' '}
                      </span>
                      {feeling.examples[0]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown-700">
              None of your saved feelings match. Try another search or family.
            </p>
          )}
        </div>
      )}
    </FeelingsPage>
  )
}
