import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SpeechBubble } from '~/components/ui/SpeechBubble'

export const Route = createFileRoute('/feelings/')({
  component: FeelingHub,
})

function FeelingHub() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const stats = useQuery(
    api.feelingsProgress.getStats,
    currentUser ? { userId: currentUser._id } : 'skip',
  )

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header with Giraffe Speaking */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-6">
            {/* Left side - Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-5xl font-bold text-brown-800 mb-3 text-balance tracking-tight">
                Learn to Identify{' '}
                <span className="text-giraffe-700">
                  Feelings
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brown-700 mb-4 leading-relaxed max-w-prose mx-auto md:mx-0">
                Expand your emotional vocabulary and learn to distinguish real
                feelings from pseudo-feelings. Understanding your emotions is
                the foundation of compassionate communication.
              </p>
            </div>

            {/* Right side - Giraffe guide (decorative; desktop only) */}
            <div className="hidden md:flex flex-col items-center">
              <SpeechBubble className="mb-6 max-w-sm">
                <p className="text-base lg:text-lg text-brown-800 text-center font-medium text-pretty">
                  Naming what you feel is where compassion begins. Take your
                  time here — there are no wrong answers.
                </p>
              </SpeechBubble>
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="object-contain h-52 lg:h-64 w-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Stats */}
      {stats && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <h2 className="text-sm font-semibold text-brown-800 mb-3">
            Your Progress
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-giraffe-200">
              <svg
                className="w-4 h-4 text-giraffe-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
              <span className="text-sm font-semibold text-brown-700">
                {stats.currentStreak} Day Streak
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-giraffe-200">
              <svg
                className="w-4 h-4 text-giraffe-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="text-sm font-semibold text-brown-700">
                {stats.totalFeelingsExplored} Feelings Learned
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-giraffe-200">
              <svg
                className="w-4 h-4 text-giraffe-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-semibold text-brown-700">
                Quiz Level {stats.quizLevel}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-giraffe-200">
              <svg
                className="w-4 h-4 text-giraffe-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="text-sm font-semibold text-brown-700">
                {stats.totalCheckIns} Check-Ins
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Main Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Feelings Wheel Card */}
          <Link to="/feelings/wheel">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 shadow-sm hover:border-giraffe-200 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="bg-giraffe-100 p-3 rounded-full shrink-0">
                  <svg
                    className="w-6 h-6 text-giraffe-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brown-800 mb-2">
                    Feelings Wheel
                  </h3>
                  <p className="text-brown-700 text-sm leading-relaxed">
                    Browse feelings organized by family. Learn definitions,
                    examples, and related emotions to expand your vocabulary.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Quiz Game Card */}
          <Link to="/feelings/quiz">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 shadow-sm hover:border-giraffe-200 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="bg-giraffe-100 p-3 rounded-full shrink-0">
                  <svg
                    className="w-6 h-6 text-giraffe-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brown-800 mb-2">
                    Quiz Game
                  </h3>
                  <p className="text-brown-700 text-sm leading-relaxed">
                    Test your skills in identifying real feelings vs
                    pseudo-feelings. Three difficulty levels to challenge
                    yourself.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Daily Check-In Card */}
          <Link to="/feelings/check-in">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 shadow-sm hover:border-giraffe-200 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="bg-giraffe-100 p-3 rounded-full shrink-0">
                  <svg
                    className="w-6 h-6 text-giraffe-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brown-800 mb-2">
                    Daily Check-In
                  </h3>
                  <p className="text-brown-700 text-sm leading-relaxed">
                    Track your feelings daily. Build streaks and gain insights
                    into your emotional patterns.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Personal Library Card */}
          <Link to="/feelings/library">
            <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6 shadow-sm hover:border-giraffe-200 hover:shadow-md transition-all cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="bg-giraffe-100 p-3 rounded-full shrink-0">
                  <svg
                    className="w-6 h-6 text-giraffe-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brown-800 mb-2">
                    My Library
                  </h3>
                  <p className="text-brown-700 text-sm leading-relaxed">
                    View and manage all the feelings you've saved. Create your
                    personal emotional vocabulary.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-linear-to-b from-cream to-giraffe-50 py-8 px-4 sm:px-6 lg:px-8 border-t border-giraffe-200 mt-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-brown-800">
            Why Learn Feelings?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">
                Express Yourself
              </p>
              <p className="text-xs text-brown-600 mt-1">
                More words for emotions means clearer communication
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">
                Avoid Pseudo-Feelings
              </p>
              <p className="text-xs text-brown-600 mt-1">
                Distinguish real feelings from thoughts
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">
                Practice NVC
              </p>
              <p className="text-xs text-brown-600 mt-1">
                Feelings are key to the OFNR framework
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">
                Self-Awareness
              </p>
              <p className="text-xs text-brown-600 mt-1">
                Recognize and understand your emotions deeply
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
