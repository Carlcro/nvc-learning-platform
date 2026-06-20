import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { BackButton } from '~/components/ui/BackButton'

export const Route = createFileRoute('/feelings/check-in')({
  component: ProtectedDailyCheckIn,
})

function ProtectedDailyCheckIn() {
  return (
    <ProtectedRoute>
      <DailyCheckIn />
    </ProtectedRoute>
  )
}

function DailyCheckIn() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const [selectedFeelings, setSelectedFeelings] = useState<Array<string>>([])
  const [note, setNote] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Queries
  const allFeelings = useQuery(api.feelings.getAll)
  const todayCheckIn = useQuery(
    api.feelingsProgress.getTodayCheckIn,
    currentUser ? { userId: currentUser._id } : 'skip',
  )
  const stats = useQuery(
    api.feelingsProgress.getStats,
    currentUser ? { userId: currentUser._id } : 'skip',
  )
  const history = useQuery(
    api.feelingsProgress.getCheckInHistory,
    currentUser ? { userId: currentUser._id, limit: 7 } : 'skip',
  )
  const weeklyPatterns = useQuery(
    api.feelingsProgress.getWeeklyPatterns,
    currentUser ? { userId: currentUser._id } : 'skip',
  )

  // Mutations
  const recordCheckInMutation = useMutation(api.feelingsProgress.recordCheckIn)

  // Initialize state from today's check-in if it exists
  useMemo(() => {
    if (todayCheckIn && selectedFeelings.length === 0 && !note) {
      setSelectedFeelings(todayCheckIn.feelings)
      setNote(todayCheckIn.note || '')
    }
  }, [todayCheckIn])

  // Hardcoded list of common feelings since isCommon is not in schema yet
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

  // Filter feelings
  const commonFeelings = useMemo(() => {
    if (!allFeelings) return []
    // Return feelings that match the common list, preserving the order of the common list
    return COMMON_FEELINGS_LIST.map((word) =>
      allFeelings.find((f) => f.word.toLowerCase() === word),
    ).filter((f) => f !== undefined)
  }, [allFeelings])

  const searchResults = useMemo(() => {
    if (!allFeelings || !searchTerm) return []
    return allFeelings.filter(
      (f) =>
        f.word.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !COMMON_FEELINGS_LIST.includes(f.word.toLowerCase()) && // Don't show if already in common list
        !selectedFeelings.includes(f.word), // Don't show if already selected
    )
  }, [allFeelings, searchTerm, selectedFeelings])

  const handleToggleFeeling = (word: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(word) ? prev.filter((f) => f !== word) : [...prev, word],
    )
    setSearchTerm('') // Clear search after selection
  }

  const handleSubmit = async () => {
    if (!currentUser || selectedFeelings.length === 0) return

    setIsSubmitting(true)
    try {
      await recordCheckInMutation({
        userId: currentUser._id,
        feelings: selectedFeelings,
        note: note,
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to check in:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (allFeelings === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream flex items-center justify-center">
        <p className="text-brown-700">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <BackButton to="/feelings" label="Feelings" />
        <div className="flex items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-brown-800 mb-2">
              Daily Check-In
            </h1>
            <p className="text-brown-700">
              Track your feelings to build emotional awareness
            </p>
          </div>
          {stats && (
            <div className="bg-giraffe-100 px-4 py-2 rounded-lg border border-giraffe-200 flex items-center gap-2">
              <div className="bg-giraffe-200 p-2 rounded-full">
                <svg className="w-5 h-5 text-giraffe-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-brown-700 font-bold">
                  Streak
                </div>
                <div className="text-xl font-bold text-brown-800">
                  {stats.currentStreak} Days
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Check-In Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brown-800 mb-6">
                How are you feeling today?
              </h2>

              {/* Selected Feelings */}
              {selectedFeelings.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedFeelings.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-giraffe-400 text-brown-800 rounded-full font-medium shadow-sm animate-in fade-in zoom-in"
                    >
                      {word}
                      <button
                        onClick={() => handleToggleFeeling(word)}
                        className="hover:text-brown-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search for a specific feeling..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-giraffe-200 focus:border-giraffe-400 focus:ring-0"
                />
                {searchTerm && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-giraffe-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((feeling) => (
                      <button
                        key={feeling.word}
                        onClick={() => handleToggleFeeling(feeling.word)}
                        className="w-full text-left px-4 py-2 hover:bg-giraffe-50 text-brown-800"
                      >
                        {feeling.word}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Common Feelings Grid */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-brown-700 mb-3">
                  Common Feelings
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {commonFeelings.map((feeling) => (
                    <button
                      key={feeling.word}
                      onClick={() => handleToggleFeeling(feeling.word)}
                      className={`
                        px-3 py-2 rounded-lg font-medium transition-all text-sm
                        ${
                          selectedFeelings.includes(feeling.word)
                            ? "bg-giraffe-400 text-brown-800 shadow-sm ring-2 ring-giraffe-300"
                            : 'bg-giraffe-50 text-brown-700 hover:bg-giraffe-100 border border-giraffe-200'
                        }
                      `}
                    >
                      {feeling.word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-brown-700 mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's happening? (e.g., 'Big presentation at work today')"
                  className="w-full px-4 py-3 rounded-lg border-2 border-giraffe-200 focus:border-giraffe-400 focus:ring-0 min-h-[100px]"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={selectedFeelings.length === 0 || isSubmitting}
                className={`
                  w-full py-4 rounded-lg font-bold text-lg transition-all
                  ${
                    selectedFeelings.length === 0
                      ? 'bg-giraffe-100 text-brown-400 cursor-not-allowed'
                      : 'bg-giraffe-400 text-brown-800 hover:bg-giraffe-500 shadow-sm hover:shadow-md'
                  }
                `}
              >
                {isSubmitting ? 'Saving...' : 'Save Check-In'}
              </button>

              {showSuccess && (
                <div className="mt-4 p-4 bg-empathy-high/20 text-brown-800 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                  Check-in saved successfully!
                </div>
              )}
            </div>
          </div>

          {/* Right: History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6">
              <h3 className="text-lg font-bold text-brown-800 mb-4">
                Recent History
              </h3>
              {history && history.length > 0 ? (
                <div className="space-y-6">
                  {history.map((checkIn, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-giraffe-200"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-giraffe-200 border-2 border-white" />
                      <div className="text-sm text-brown-600 font-medium mb-1">
                        {new Date(checkIn.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {checkIn.feelings.map((f) => (
                          <span
                            key={f}
                            className="text-xs px-2 py-0.5 bg-giraffe-50 text-brown-700 rounded-full border border-giraffe-100"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      {checkIn.note && (
                        <p className="text-sm text-brown-600 italic">
                          "{checkIn.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brown-700 text-sm">
                  No check-ins yet. Start today!
                </p>
              )}
            </div>

            {/* Weekly Patterns Insights */}
            {weeklyPatterns &&
              weeklyPatterns.frequentFeelings.length > 0 && (
                <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6">
                  <h3 className="text-lg font-bold text-brown-800 mb-4">
                    Weekly Patterns
                  </h3>
                  <div className="space-y-4">
                    {weeklyPatterns.frequentFeelings.map((insight) => (
                      <div
                        key={insight.feeling}
                        className="bg-giraffe-50 border border-giraffe-200 rounded-lg px-4 py-3"
                      >
                        <p className="text-brown-800 font-medium">
                          You've felt{' '}
                          <span className="font-bold">{insight.feeling}</span>{' '}
                          {insight.count} times this week.
                        </p>
                        <p className="text-sm text-giraffe-700 mt-1">
                          This often connects to needs for:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {insight.relatedNeeds.map((need) => (
                            <span
                              key={need}
                              className="text-xs px-2 py-1 bg-giraffe-50 text-brown-700 rounded-full border border-giraffe-200 capitalize"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Pleasant vs Unpleasant ratio */}
                    <div className="pt-4 border-t border-giraffe-100">
                      <p className="text-sm text-giraffe-700 mb-2">
                        Emotional balance this week:
                      </p>
                      <div className="flex h-3 rounded-full overflow-hidden bg-giraffe-100">
                        <div
                          className="bg-empathy-high transition-all"
                          style={{
                            width: `${weeklyPatterns.pleasantPercent}%`,
                          }}
                        />
                        <div
                          className="bg-empathy-low transition-all"
                          style={{
                            width: `${weeklyPatterns.unpleasantPercent}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-brown-700 mt-1">
                        <span>Pleasant {weeklyPatterns.pleasantPercent}%</span>
                        <span>
                          Unpleasant {weeklyPatterns.unpleasantPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="bg-giraffe-50 rounded-lg border-2 border-giraffe-100 p-6">
              <h3 className="text-lg font-bold text-brown-800 mb-2">
                Did you know?
              </h3>
              <p className="text-brown-700 text-sm">
                Naming your feelings ("affect labeling") can reduce their
                intensity and help your brain process emotions more effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
