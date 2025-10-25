import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

export const Route = createFileRoute('/learn/')({
  component: LearnHub,
})

interface Lesson {
  lessonId: string
  title: string
  description: string
  component: string
  order: number
  estimatedDuration: number
  icon: string
  content: string
  examples: Array<{
    title: string
    scenario: string
    giraffResponse: string
    jackalResponse: string
    explanation: string
  }>
  quiz: {
    questions: Array<{
      question: string
      options: string[]
      correctAnswer: number
      explanation: string
    }>
    passingScore: number
  }
}

function LearnHub() {
  const { data: lessons } = useSuspenseQuery(
    convexQuery(api.lessons.getAllLessons, {})
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎓</span>
            <h1 className="text-4xl font-bold">Learning Center</h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            Master the 4 components of Non-Violent Communication through bite-sized lessons.
            Each lesson takes just 7-10 minutes and includes real-world examples.
          </p>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Your Learning Path
          </h2>
          <p className="text-blue-800 dark:text-blue-300">
            Complete these 6 foundational lessons to build your NVC skills. You'll progress from
            basics to real-world application, and then move on to practical roleplay scenarios.
          </p>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson: Lesson) => (
            <LessonCard key={lesson.lessonId} lesson={lesson} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900 dark:to-blue-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Practice?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
            After completing the lessons, you'll practice NVC in real conversations with AI characters.
          </p>
          <Button size="lg" variant="primary" disabled className="opacity-50 cursor-not-allowed">
            Roleplay Scenarios (Coming Soon)
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Complete lessons to unlock scenario practice
          </p>
        </div>
      </section>
    </main>
  )
}

interface LessonCardProps {
  lesson: Lesson
}

function LessonCard({ lesson }: LessonCardProps) {
  // Determine lesson status styling
  const isCompleted = false // TODO: Check user progress
  const lessonNumber = lesson.order

  const href = `/learn/${lesson.lessonId}` as '/learn/introduction' | '/learn/observation' | '/learn/feeling' | '/learn/need' | '/learn/request' | '/learn/integration'

  return (
    <Link to={href}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
        {/* Lesson Number Badge */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-blue-100">
                Lesson {lessonNumber}
              </div>
              <div className="text-4xl mt-2">{lesson.icon}</div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 text-white font-bold">
              {lessonNumber}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardBody className="flex flex-col gap-4 pt-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {lesson.title}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-400 flex-grow">
            {lesson.description}
          </p>

          {/* Duration & Status */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg">⏱️</span>
                <span>{lesson.estimatedDuration} minutes</span>
              </div>
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  isCompleted
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}
              >
                {isCompleted ? '✓ Completed' : 'Start'}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
