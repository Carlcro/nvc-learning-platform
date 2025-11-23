import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/learn/feelings/wheel')({
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
      const familyMatch = f.family === selectedFamily
      const categoryMatch =
        showCategory === 'all' || f.category === showCategory
      return familyMatch && categoryMatch
    })
  }, [allFeelings, selectedFamily, showCategory])

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
        <p className="text-giraffe-800">Loading feelings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-giraffe-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-giraffe-900 mb-2">
            Feelings Wheel
          </h1>
          <p className="text-giraffe-800">
            Explore feelings organized by family. Click on any feeling to learn
            more.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Family Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 p-6 sticky top-4">
              <div className="space-y-4">
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
                            ? 'bg-giraffe-500 text-white shadow-md'
                            : 'bg-giraffe-50 text-giraffe-800 hover:bg-giraffe-100'
                        }
                      `}
                      >
                        {option === 'all'
                          ? 'All Feelings'
                          : option === 'pleasant'
                            ? 'Pleasant'
                            : 'Unpleasant'}
                      </button>
                    ),
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-giraffe-800 mb-3 uppercase tracking-wide">
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
                              ? 'bg-giraffe-100 text-giraffe-900 border-2 border-giraffe-400 shadow-sm'
                              : 'bg-white text-giraffe-800 border-2 border-giraffe-200 hover:border-giraffe-300 hover:bg-giraffe-50'
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
            <div className="bg-white rounded-lg border-2 border-giraffe-200 p-6">
              <h2 className="text-xl font-bold text-giraffe-900 mb-4 capitalize">
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
                            : 'border-slate-300 hover:bg-slate-100'
                        }
                        ${selectedFeeling === feeling.word ? 'ring-2 ring-giraffe-400 bg-giraffe-50' : ''}
                      `}
                      onClick={() => handleFeelingClick(feeling.word)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm capitalize text-slate-900">
                            {feeling.word}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className={`
                                text-xs px-2 py-0.5 rounded-full font-medium
                                ${
                                  feeling.intensity <= 2
                                    ? 'bg-blue-100 text-blue-900'
                                    : feeling.intensity === 3
                                      ? 'bg-purple-100 text-purple-900'
                                      : 'bg-red-100 text-red-900'
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
                <p className="text-center text-slate-500 py-8">
                  No feelings found with this combination of filters.
                </p>
              )}
            </div>

            {/* Feeling Detail */}
            {selectedFeelingDetail && (
              <div className="bg-white rounded-lg border-2 border-giraffe-300 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 capitalize">
                      {selectedFeelingDetail.word}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
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
                    className="text-slate-500 hover:text-slate-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Definition
                    </h3>
                    <p className="text-slate-700">
                      {selectedFeelingDetail.definition}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Examples
                    </h3>
                    <ul className="space-y-2">
                      {selectedFeelingDetail.examples.map((example, idx) => (
                        <li key={idx} className="text-slate-700 flex gap-3">
                          <span className="text-giraffe-600 font-semibold shrink-0">
                            •
                          </span>
                          <span className="italic">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Synonyms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeelingDetail.synonyms.map((synonym) => (
                        <span
                          key={synonym}
                          className="inline-block bg-giraffe-100 text-giraffe-900 px-3 py-1 rounded-full text-sm"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Related Feelings
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeelingDetail.relatedFeelings.map((related) => (
                        <span
                          key={related}
                          className="inline-block bg-slate-200 text-slate-900 px-3 py-1 rounded-full text-sm"
                        >
                          {related}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors"
                  >
                    Save to Library
                  </button>
                  <button
                    onClick={handleRemove}
                    className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {!selectedFeelingDetail && (
              <div className="bg-giraffe-50 border-2 border-giraffe-200 rounded-lg p-8 text-center">
                <p className="text-giraffe-800">
                  Click on a feeling above to see its definition, examples, and
                  related emotions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
