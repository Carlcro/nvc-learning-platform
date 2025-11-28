import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/learn/feelings/')({
  component: FeelingHub,
})

function FeelingHub() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const stats = useQuery(
    api.feelingsProgress.getStats,
    currentUser ? { userId: currentUser._id } : 'skip',
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-giraffe-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-giraffe-900 mb-2">
            Learn to Identify Feelings
          </h1>
          <p className="text-lg text-giraffe-800">
            Expand your emotional vocabulary and distinguish real feelings from
            pseudo-feelings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Stats Banner */}
        {stats && (
          <div className="bg-white rounded-xl border-2 border-giraffe-200 p-6 mb-12 shadow-sm flex flex-wrap gap-8 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-giraffe-100 p-3 rounded-full text-2xl">🔥</div>
              <div>
                <div className="text-sm text-giraffe-600 font-bold uppercase tracking-wide">
                  Current Streak
                </div>
                <div className="text-2xl font-bold text-giraffe-900">
                  {stats.currentStreak} Days
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-2xl">🧠</div>
              <div>
                <div className="text-sm text-blue-600 font-bold uppercase tracking-wide">
                  Feelings Learned
                </div>
                <div className="text-2xl font-bold text-giraffe-900">
                  {stats.totalFeelingsExplored}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-2xl">🎯</div>
              <div>
                <div className="text-sm text-purple-600 font-bold uppercase tracking-wide">
                  Quiz Level
                </div>
                <div className="text-2xl font-bold text-giraffe-900">
                  {stats.quizLevel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-2xl">📝</div>
              <div>
                <div className="text-sm text-green-600 font-bold uppercase tracking-wide">
                  Total Check-Ins
                </div>
                <div className="text-2xl font-bold text-giraffe-900">
                  {stats.totalCheckIns}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Feelings Wheel Card */}
          <Link to="/learn/feelings/wheel">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 shadow-md hover:shadow-lg hover:border-giraffe-400 transition-all overflow-hidden h-full cursor-pointer group">
              <div className="bg-gradient-to-br from-giraffe-50 to-giraffe-100 p-8 text-center group-hover:from-giraffe-100 group-hover:to-giraffe-200 transition-colors">
                <div className="text-5xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-giraffe-900 mb-3">
                  Feelings Wheel
                </h2>
                <p className="text-giraffe-800 leading-relaxed">
                  Browse feelings organized by family. Learn definitions,
                  examples, and related emotions to expand your vocabulary.
                </p>
              </div>
              <div className="p-6 bg-white">
                <button className="w-full py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors">
                  Explore Feelings
                </button>
              </div>
            </div>
          </Link>

          {/* Quiz Game Card */}
          <Link to="/learn/feelings/quiz">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 shadow-md hover:shadow-lg hover:border-giraffe-400 transition-all overflow-hidden h-full cursor-pointer group">
              <div className="bg-gradient-to-br from-giraffe-50 to-giraffe-100 p-8 text-center group-hover:from-giraffe-100 group-hover:to-giraffe-200 transition-colors">
                <div className="text-5xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-giraffe-900 mb-3">
                  Quiz Game
                </h2>
                <p className="text-giraffe-800 leading-relaxed">
                  Test your skills in identifying real feelings vs
                  pseudo-feelings. Three difficulty levels to challenge
                  yourself.
                </p>
              </div>
              <div className="p-6 bg-white">
                <button className="w-full py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors">
                  Start Quiz
                </button>
              </div>
            </div>
          </Link>

          {/* Daily Check-In Card */}
          <Link to="/learn/feelings/check-in">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 shadow-md hover:shadow-lg hover:border-giraffe-400 transition-all overflow-hidden h-full cursor-pointer group">
              <div className="bg-gradient-to-br from-giraffe-50 to-giraffe-100 p-8 text-center group-hover:from-giraffe-100 group-hover:to-giraffe-200 transition-colors">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-2xl font-bold text-giraffe-900 mb-3">
                  Daily Check-In
                </h2>
                <p className="text-giraffe-800 leading-relaxed">
                  Track your feelings daily. Build streaks and gain insights
                  into your emotional patterns.
                </p>
              </div>
              <div className="p-6 bg-white">
                <button className="w-full py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors">
                  Check In Today
                </button>
              </div>
            </div>
          </Link>

          {/* Personal Library Card */}
          <Link to="/learn/feelings/library">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 shadow-md hover:shadow-lg hover:border-giraffe-400 transition-all overflow-hidden h-full cursor-pointer group">
              <div className="bg-gradient-to-br from-giraffe-50 to-giraffe-100 p-8 text-center group-hover:from-giraffe-100 group-hover:to-giraffe-200 transition-colors">
                <div className="text-5xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-giraffe-900 mb-3">
                  My Library
                </h2>
                <p className="text-giraffe-800 leading-relaxed">
                  View and manage all the feelings you've saved. Create your
                  personal emotional vocabulary.
                </p>
              </div>
              <div className="p-6 bg-white">
                <button className="w-full py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors">
                  View Library
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Tips Section */}
        <div className="bg-giraffe-50 border-l-4 border-giraffe-500 rounded-lg p-8">
          <h3 className="text-xl font-bold text-giraffe-900 mb-4">
            Why Learn Feelings?
          </h3>
          <ul className="space-y-3 text-giraffe-800">
            <li className="flex gap-3">
              <span className="text-giraffe-600 font-bold flex-shrink-0">
                1.
              </span>
              <span>
                <strong>Express yourself better:</strong> Having more words for
                emotions helps you communicate your inner world more clearly.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-giraffe-600 font-bold flex-shrink-0">
                2.
              </span>
              <span>
                <strong>Avoid pseudo-feelings:</strong> Learn the difference
                between real feelings and thoughts disguised as feelings.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-giraffe-600 font-bold flex-shrink-0">
                3.
              </span>
              <span>
                <strong>Practice NVC:</strong> Understanding feelings is key to
                using the Observation-Feeling-Need-Request framework.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-giraffe-600 font-bold flex-shrink-0">
                4.
              </span>
              <span>
                <strong>Emotional awareness:</strong> Building a vocabulary
                helps you recognize and understand your emotions more deeply.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
