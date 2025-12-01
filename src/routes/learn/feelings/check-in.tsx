import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/learn/feelings/check-in')({
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
        <p className="text-giraffe-800">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-giraffe-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-giraffe-900 mb-2">
              Daily Check-In
            </h1>
            <p className="text-giraffe-800">
              Track your feelings to build emotional awareness
            </p>
          </div>
          {stats && (
            <div className="bg-giraffe-100 px-4 py-2 rounded-lg border border-giraffe-200 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-xs text-giraffe-600 font-bold uppercase">
                  Streak
                </div>
                <div className="text-xl font-bold text-giraffe-900">
                  {stats.currentStreak} Days
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Check-In Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border-2 border-giraffe-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-giraffe-900 mb-6">
                How are you feeling today?
              </h2>

              {/* Selected Feelings */}
              {selectedFeelings.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedFeelings.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-giraffe-500 text-white rounded-full font-medium shadow-sm animate-in fade-in zoom-in"
                    >
                      {word}
                      <button
                        onClick={() => handleToggleFeeling(word)}
                        className="hover:text-giraffe-200"
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
                        className="w-full text-left px-4 py-2 hover:bg-giraffe-50 text-giraffe-900"
                      >
                        {feeling.word}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Common Feelings Grid */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-giraffe-600 uppercase tracking-wide mb-3">
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
                            ? 'bg-giraffe-500 text-white shadow-md ring-2 ring-giraffe-300'
                            : 'bg-giraffe-50 text-giraffe-800 hover:bg-giraffe-100 border border-giraffe-200'
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
                <label className="block text-sm font-semibold text-giraffe-600 uppercase tracking-wide mb-2">
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
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-giraffe-500 text-white hover:bg-giraffe-600 shadow-md hover:shadow-lg'
                  }
                `}
              >
                {isSubmitting ? 'Saving...' : 'Save Check-In'}
              </button>

              {showSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                  Check-in saved successfully! 🦒
                </div>
              )}
            </div>
          </div>

          {/* Right: History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border-2 border-giraffe-200 p-6">
              <h3 className="text-lg font-bold text-giraffe-900 mb-4">
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
                      <div className="text-sm text-giraffe-500 font-medium mb-1">
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
                            className="text-xs px-2 py-0.5 bg-giraffe-50 text-giraffe-800 rounded-full border border-giraffe-100"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      {checkIn.note && (
                        <p className="text-sm text-gray-600 italic">
                          "{checkIn.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-giraffe-800 text-sm">
                  No check-ins yet. Start today!
                </p>
              )}
            </div>

            <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-100 p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-2">
                Did you know?
              </h3>
              <p className="text-purple-800 text-sm">
                Naming your feelings ("affect labeling") can reduce their
                intensity and help your brain process emotions more effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
