import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { BackButton } from '~/components/ui/BackButton'

export const Route = createFileRoute('/feelings/wheel')({
  component: ProtectedFeelingsWheel,
})

type Category = 'all' | 'pleasant' | 'unpleasant'

function ProtectedFeelingsWheel() {
  return (
    <ProtectedRoute>
      <FeelingsWheel />
    </ProtectedRoute>
  )
}

function FeelingsWheel() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const [selectedFamily, setSelectedFamily] = useState('joyful')
  const [showCategory, setShowCategory] = useState<Category>('all')
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const families = useQuery(api.feelings.getFamilies)

  const allFeelings = useQuery(api.feelings.getAll)

  // Mutations
  const markExploredMutation = useMutation(api.feelings.markFeelingExplored)

  const saveFeelingMutation = useMutation(api.feelings.saveFeelingToLibrary)

  const removeFeelingMutation = useMutation(
    api.feelings.removeFeelingFromLibrary,
  )

  // Filter feelings based on selected family and category
  const filteredFeelings = useMemo(() => {
    if (!allFeelings) return []
    return allFeelings.filter((f) => {
      const familyMatch = searchTerm ? true : f.family === selectedFamily
      const categoryMatch =
        showCategory === 'all' || f.category === showCategory
      const searchMatch = searchTerm
        ? f.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.definition.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      return familyMatch && categoryMatch && searchMatch
    })
  }, [allFeelings, selectedFamily, showCategory, searchTerm])

  // Get detail of selected feeling
  const selectedFeelingDetail = useMemo(
    () =>
      allFeelings
        ? allFeelings.find((f) => f.word === selectedFeeling) || null
        : null,
    [allFeelings, selectedFeeling],
  )

  const handleFeelingClick = (word: string) => {
    setSelectedFeeling(word)
    if (currentUser) {
      markExploredMutation({
        userId: currentUser._id,
        feelingWord: word,
      })
    }
  }

  const handleSave = () => {
    if (selectedFeeling && currentUser) {
      saveFeelingMutation({
        userId: currentUser._id,
        feelingWord: selectedFeeling,
      })
    }
  }

  const handleRemove = () => {
    if (selectedFeeling && currentUser) {
      removeFeelingMutation({
        userId: currentUser._id,
        feelingWord: selectedFeeling,
      })
    }
  }

  // Handle loading state
  if (families === undefined || allFeelings === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream flex items-center justify-center">
        <p className="text-brown-700">Loading feelings...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <BackButton to="/feelings" label="Feelings" />
        <h1 className="text-3xl font-bold text-brown-800 mb-2 mt-2">
          Feelings Wheel
        </h1>
        <p className="text-brown-700">
          Explore feelings organized by family. Click on any feeling to learn
          more.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Family Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4 border-b border-giraffe-200 pb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search feelings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-giraffe-200 focus:border-giraffe-400 focus:ring-0"
                    />
                  </div>
                  <Link
                    to="/feelings/intensity"
                    className="px-4 py-2 bg-giraffe-400 text-brown-800 rounded-lg font-semibold hover:bg-giraffe-500 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Intensity Explorer
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 pb-4 border-b border-giraffe-200">
                  {(['all', 'pleasant', 'unpleasant'] as const).map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => setShowCategory(option)}
                        className={`
                        px-4 py-2 rounded-lg font-medium transition-all
                        ${
                          showCategory === option
                            ? 'bg-giraffe-400 text-brown-800 shadow-sm'
                            : 'bg-giraffe-50 text-brown-700 hover:bg-giraffe-100'
                        }
                      `}
                      >
                        {option === 'all'
                          ? 'All'
                          : option === 'pleasant'
                            ? 'Pleasant'
                            : 'Unpleasant'}
                      </button>
                    ),
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-brown-700 mb-3">
                    Feeling Families
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                    {families.map((family) => (
                      <button
                        key={family}
                        onClick={() => setSelectedFamily(family)}
                        className={`
                          px-4 py-3 rounded-lg font-medium capitalize transition-all
                          ${
                            selectedFamily === family
                              ? 'bg-giraffe-100 text-brown-800 border-2 border-giraffe-400 shadow-sm'
                              : 'bg-white text-brown-700 border-2 border-giraffe-200 hover:border-giraffe-300 hover:bg-giraffe-50'
                          }
                        `}
                      >
                        {family}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle/Right: Feelings Grid and Detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feelings Grid */}
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6">
              <h2 className="text-xl font-bold text-brown-800 mb-4 capitalize">
                {selectedFamily} Feelings
              </h2>
              {filteredFeelings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredFeelings.map((feeling) => (
                    <div
                      key={feeling.word}
                      className={`
                        p-3 rounded-lg border-2 transition-all cursor-pointer
                        ${
                          feeling.category === 'pleasant'
                            ? 'border-giraffe-200 hover:bg-giraffe-50'
                            : 'border-empathy-low/30 hover:bg-empathy-low/10'
                        }
                        ${selectedFeeling === feeling.word ? 'ring-2 ring-giraffe-400 bg-giraffe-50' : ''}
                      `}
                      onClick={() => handleFeelingClick(feeling.word)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm capitalize text-brown-800">
                            {feeling.word}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className={`
                                text-xs px-2 py-0.5 rounded-full font-medium
                                ${
                                  feeling.intensity <= 2
                                    ? 'bg-giraffe-100 text-brown-800'
                                    : feeling.intensity === 3
                                      ? 'bg-giraffe-300 text-brown-900'
                                      : 'bg-empathy-low/25 text-brown-900'
                                }
                              `}
                            >
                              {feeling.intensity === 1 && 'Mild'}
                              {feeling.intensity === 2 && 'Light'}
                              {feeling.intensity === 3 && 'Moderate'}
                              {feeling.intensity === 4 && 'Strong'}
                              {feeling.intensity === 5 && 'Intense'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-brown-600 py-8">
                  No feelings found with this combination of filters.
                </p>
              )}
            </div>

            {/* Feeling Detail */}
            {selectedFeelingDetail && (
              <div className="bg-white rounded-lg border-2 border-giraffe-300 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brown-800 capitalize">
                      {selectedFeelingDetail.word}
                    </h2>
                    <p className="text-sm text-brown-600 mt-1">
                      {
                        ['', 'Mild', 'Light', 'Moderate', 'Strong', 'Intense'][
                          selectedFeelingDetail.intensity
                        ]
                      }{' '}
                      intensity -{' '}
                      <span className="capitalize">
                        {selectedFeelingDetail.category}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFeeling(null)}
                    className="text-brown-600 hover:text-brown-900 text-xl font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-brown-800 mb-2">
                      Definition
                    </h3>
                    <p className="text-brown-700">
                      {selectedFeelingDetail.definition}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-brown-800 mb-2">
                      Examples
                    </h3>
                    <ul className="space-y-2">
                      {selectedFeelingDetail.examples.map((example, idx) => (
                        <li key={idx} className="text-brown-700 flex gap-3">
                          <span className="text-brown-700 font-semibold shrink-0">
                            •
                          </span>
                          <span className="italic">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-brown-800 mb-2">
                      Synonyms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeelingDetail.synonyms.map((synonym) => (
                        <span
                          key={synonym}
                          className="inline-block bg-giraffe-100 text-brown-800 px-3 py-1 rounded-full text-sm"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-brown-800 mb-2">
                      Related Feelings
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeelingDetail.relatedFeelings.map((related) => (
                        <span
                          key={related}
                          className="inline-block bg-brown-100 text-brown-800 px-3 py-1 rounded-full text-sm"
                        >
                          {related}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-giraffe-100">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-giraffe-400 text-brown-800 rounded-lg font-semibold hover:bg-giraffe-500 transition-colors"
                  >
                    Save to Library
                  </button>
                  <button
                    onClick={handleRemove}
                    className="flex-1 px-4 py-2 bg-empathy-low/20 text-brown-800 rounded-lg font-semibold hover:bg-empathy-low/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {!selectedFeelingDetail && (
              <div className="bg-giraffe-50 border-2 border-giraffe-200 rounded-lg p-8 text-center">
                <p className="text-brown-700">
                  Click on a feeling above to see its definition, examples, and
                  related emotions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
