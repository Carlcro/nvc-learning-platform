import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { useLessonProgress } from '~/hooks/useLessonProgress'

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
      options: Array<string>
      correctAnswer: number
      explanation: string
    }>
    passingScore: number
  }
}

function LearnHub() {
  const { data: lessons } = useSuspenseQuery(
    convexQuery(api.lessons.getAllLessons, {}),
  )

  const { getProgressPercentage } = useLessonProgress()

  // Filter to ensure we have only valid lesson types
  const validLessons =
    lessons?.filter((lesson) =>
      [
        'observation',
        'feeling',
        'need',
        'request',
        'introduction',
        'integration',
      ].includes(lesson.component),
    ) || []

  const progressPercentage = getProgressPercentage(validLessons.length)

  return (
    <main className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream dark:from-brown-800 dark:to-brown-900">
      {/* Header with Giraffe */}
      <section className="bg-gradient-to-b from-giraffe-100 to-giraffe-50 dark:from-brown-800 dark:to-brown-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text Content */}
            <div>
              {/* Giraffe Greeting */}
              <div className="mb-8 bg-white dark:bg-brown-700 rounded-2xl p-6 shadow-lg border-2 border-giraffe-200 dark:border-giraffe-600 relative max-w-lg">
                <p className="text-lg text-brown-800 dark:text-giraffe-100 font-medium">
                  Welcome to your learning journey! I'm so excited to guide you
                  through mastering compassionate communication. Let's start
                  with the first lesson!
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-brown-700"></div>
              </div>
            </div>

            {/* Right side - Giraffe Image */}
            <div className="flex justify-center">
              <div className="bg-transparent p-4">
                <img
                  src="/giraff.png"
                  alt="Giraffe - Your Learning Guide"
                  className="mx-auto object-contain h-64 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-giraffe-50rounded-lg p-6">
          <h2 className="text-lg font-semibold text-giraffe-900 dark:text-giraffe-200 mb-2">
            Your Learning Path
          </h2>
          <p className="text-giraffe-800 dark:text-giraffe-300 mb-4">
            Complete these 6 foundational lessons to build your NVC skills.
            You'll progress from basics to real-world application, and then move
            on to practical roleplay scenarios.
          </p>
          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-giraffe-200 dark:bg-giraffe-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-giraffe-500 dark:bg-giraffe-400 h-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-giraffe-900 dark:text-giraffe-200 whitespace-nowrap">
              {progressPercentage}% Complete
            </span>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validLessons.map((lesson) => (
            <LessonCard key={lesson.lessonId} lesson={lesson} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 dark:from-giraffe-700 dark:to-giraffe-600 py-12 px-4 sm:px-6 lg:px-8 border-t border-giraffe-200 dark:border-giraffe-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Practice?
          </h2>
          <p className="text-giraffe-50 mb-8 text-lg">
            After completing the lessons, you'll practice NVC in real
            conversations with AI characters.
          </p>
          <Button
            size="lg"
            variant="primary"
            disabled
            className="opacity-50 cursor-not-allowed bg-white text-giraffe-600"
          >
            Roleplay Scenarios (Coming Soon)
          </Button>
          <p className="text-sm text-giraffe-100 mt-4">
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
  const { isLessonCompleted } = useLessonProgress()
  const isCompleted = isLessonCompleted(lesson.lessonId)
  const lessonNumber = lesson.order

  // Type-safe routing - map valid lesson IDs to their routes
  type ValidLessonId =
    | 'introduction'
    | 'observation'
    | 'feeling'
    | 'need'
    | 'request'
    | 'integration'
  const lessonRoutes: Record<ValidLessonId, any> = {
    introduction: '/learn/introduction',
    observation: '/learn/observation',
    feeling: '/learn/feeling',
    need: '/learn/need',
    request: '/learn/request',
    integration: '/learn/integration',
  }

  const href = lessonRoutes[lesson.lessonId as ValidLessonId] || '/learn'

  return (
    <Link to={href}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
        {/* Lesson Number Badge */}
        <div className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 dark:from-giraffe-700 dark:to-giraffe-600 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-giraffe-50">
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
            <h3 className="text-xl font-bold text-brown-800 dark:text-white group-hover:text-giraffe-600 dark:group-hover:text-giraffe-400 transition-colors">
              {lesson.title}
            </h3>
          </div>

          <p className="text-brown-600 dark:text-brown-400 flex-grow">
            {lesson.description}
          </p>

          {/* Duration & Status */}
          <div className="pt-4 border-t border-giraffe-100 dark:border-brown-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-brown-600 dark:text-brown-400">
                <span className="text-lg">⏱️</span>
                <span>{lesson.estimatedDuration} minutes</span>
              </div>
              <div
                className={`text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-empathy-high dark:from-emerald-900 dark:to-green-900 dark:text-empathy-high border border-empathy-high dark:border-empathy-high'
                    : 'bg-giraffe-100 text-giraffe-800 dark:bg-giraffe-900 dark:text-giraffe-200'
                }`}
              >
                {isCompleted ? (
                  <>
                    <span>🎓</span>
                    <span>Completed</span>
                  </>
                ) : (
                  'Start'
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
