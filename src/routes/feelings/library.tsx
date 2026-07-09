import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { BackButton } from '~/components/ui/BackButton'

export const Route = createFileRoute('/feelings/library')({
  component: ProtectedLibrary,
})

function ProtectedLibrary() {
  return (
    <ProtectedRoute>
      <PersonalLibrary />
    </ProtectedRoute>
  )
}

function PersonalLibrary() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const [filterFamily, setFilterFamily] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const allFeelings = useQuery(api.feelings.getAll)
  const userProgress = useQuery(
    api.feelingsProgress.getUserProgress,
    currentUser ? {} : 'skip',
  )
  const families = useQuery(api.feelings.getFamilies)

  // Mutations
  const removeFeelingMutation = useMutation(
    api.feelings.removeFeelingFromLibrary,
  )

  // Get details of saved feelings
  const savedFeelings = useMemo(() => {
    if (!allFeelings || !userProgress) return []
    const savedSet = new Set(userProgress.feelingsSaved)
    return allFeelings.filter((f) => savedSet.has(f.word))
  }, [allFeelings, userProgress])

  // Filter saved feelings
  const filteredFeelings = useMemo(() => {
    return savedFeelings.filter((f) => {
      const familyMatch = filterFamily === 'all' || f.family === filterFamily
      const searchMatch =
        !searchTerm ||
        f.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.definition.toLowerCase().includes(searchTerm.toLowerCase())
      return familyMatch && searchMatch
    })
  }, [savedFeelings, filterFamily, searchTerm])

  const handleRemove = async (word: string) => {
    if (!currentUser) return
    await removeFeelingMutation({ feelingWord: word })
  }

  if (allFeelings === undefined || userProgress === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream flex items-center justify-center">
        <p className="text-brown-700">Loading library...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <BackButton to="/feelings" label="Feelings" />
        <div className="flex items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-brown-800 mb-2">
              My Feelings Library
            </h1>
            <p className="text-brown-700">
              Your personal collection of feelings to remember and practice
            </p>
          </div>
          <Link
            to="/feelings/wheel"
            className="px-4 py-2 bg-giraffe-400 text-brown-800 rounded-lg font-semibold hover:bg-giraffe-500 transition-colors shadow-sm whitespace-nowrap"
          >
            + Add More
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {savedFeelings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-giraffe-100 border-dashed">
            <div className="mb-4 flex justify-center">
              <div className="bg-giraffe-100 p-6 rounded-full">
                <svg className="w-12 h-12 text-giraffe-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-brown-800 mb-2">
              Your library is empty
            </h2>
            <p className="text-brown-700 mb-8 max-w-md mx-auto">
              Explore the Feelings Wheel and save feelings you want to add to
              your personal vocabulary.
            </p>
            <Link
              to="/feelings/wheel"
              className="px-6 py-3 bg-giraffe-400 text-brown-800 rounded-lg font-semibold hover:bg-giraffe-500 transition-colors"
            >
              Go to Feelings Wheel
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-giraffe-200 focus:border-giraffe-400 focus:ring-0"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setFilterFamily('all')}
                  className={`
                    px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                    ${
                      filterFamily === 'all'
                        ? 'bg-giraffe-400 text-brown-800 shadow-md'
                        : 'bg-white text-brown-700 border-2 border-giraffe-200 hover:bg-giraffe-50'
                    }
                  `}
                >
                  All Families
                </button>
                {families?.map((family) => (
                  <button
                    key={family}
                    onClick={() => setFilterFamily(family)}
                    className={`
                      px-4 py-2 rounded-lg font-medium whitespace-nowrap capitalize transition-all
                      ${
                        filterFamily === family
                          ? 'bg-giraffe-400 text-brown-800 shadow-md'
                          : 'bg-white text-brown-700 border-2 border-giraffe-200 hover:bg-giraffe-50'
                      }
                    `}
                  >
                    {family}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeelings.map((feeling) => (
                <div
                  key={feeling.word}
                  className="bg-white rounded-lg border-2 border-giraffe-100 p-6 hover:border-giraffe-200 transition-all shadow-sm hover:shadow-md group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-brown-800 capitalize">
                      {feeling.word}
                    </h3>
                    <button
                      onClick={() => handleRemove(feeling.word)}
                      className="text-brown-400 hover:text-empathy-low transition-colors p-1"
                      title="Remove from library"
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-giraffe-100 text-brown-700 rounded-full font-medium capitalize">
                      {feeling.family}
                    </span>
                    <span className="text-xs px-2 py-1 bg-giraffe-100 text-brown-800 rounded-full font-medium">
                      Intensity: {feeling.intensity}/5
                    </span>
                  </div>

                  <p className="text-brown-700 text-sm mb-4 line-clamp-3">
                    {feeling.definition}
                  </p>

                  {feeling.examples.length > 0 && (
                    <div className="text-xs text-brown-600 italic bg-giraffe-50 p-3 rounded-lg">
                      "{feeling.examples[0]}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFeelings.length === 0 && savedFeelings.length > 0 && (
              <div className="text-center py-12 text-brown-700">
                No feelings found matching your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
