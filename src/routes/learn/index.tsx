import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/learn/')({
  component: ProtectedLearnHub,
})

function ProtectedLearnHub() {
  return (
    <ProtectedRoute>
      <LearnHub />
    </ProtectedRoute>
  )
}

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

type ValidLessonId =
  | 'introduction'
  | 'observation'
  | 'feeling'
  | 'need'
  | 'request'
  | 'integration'

const lessonRoutes: Record<ValidLessonId, string> = {
  introduction: '/learn/introduction',
  observation: '/learn/observation',
  feeling: '/learn/feeling',
  need: '/learn/need',
  request: '/learn/request',
  integration: '/learn/integration',
}

function getLessonRoute(lessonId: ValidLessonId): string {
  return lessonRoutes[lessonId] || '/learn'
}

function getLessonImagePath(lessonOrder: number): string {
  return `/lesson${lessonOrder}.png`
}

function LearnHub() {
  const { data: lessons } = useSuspenseQuery(
    convexQuery(api.lessons.getAllLessons, {}),
  )

  const { isLessonCompleted } = useLessonProgress()

  // Find the current lesson (first incomplete, or first if all complete)
  const currentLessonIndex = lessons.findIndex(
    (lesson) => !isLessonCompleted(lesson.lessonId),
  )
  const currentLesson =
    currentLessonIndex >= 0 ? lessons[currentLessonIndex] : lessons[0]

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-20">
      {/* Header with Current Lesson */}
      <section className=" py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {
            <Link to={getLessonRoute(currentLesson.lessonId as ValidLessonId)}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-giraffe-300">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Content */}
                  <div className="flex-1 bg-linear-to-r from-giraffe-500 to-giraffe-400 text-white p-8">
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-giraffe-50 mb-2">
                        NEXT LESSON
                      </div>
                      <div className="text-sm font-semibold text-giraffe-50 mb-2">
                        Lesson {currentLesson.order}
                      </div>
                      <h2 className="text-4xl font-bold mb-4">
                        {currentLesson.title}
                      </h2>
                    </div>
                    <p className="text-lg text-giraffe-50 mb-6 max-w-xl">
                      {currentLesson.description}
                    </p>
                    <div className="flex items-center gap-2 text-giraffe-50">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{currentLesson.estimatedDuration} minutes</span>
                    </div>
                  </div>

                  {/* Right side - Image */}
                  <div className="flex flex-1 p-8 items-center justify-center bg-linear-to-b from-white to-giraffe-50">
                    <div className="bg-transparent w-full max-w-xs max-h-48 flex items-center justify-center">
                      <img
                        src={getLessonImagePath(currentLesson.order)}
                        alt={currentLesson.title}
                        className="w-auto h-auto max-h-48 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          }
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.lessonId} lesson={lesson} />
          ))}
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
  const imagePath = getLessonImagePath(lessonNumber)

  const href = getLessonRoute(lesson.lessonId as ValidLessonId)

  return (
    <Link to={href}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden flex flex-col">
        {/* Lesson Image Header */}
        <div className="relative bg-linear-to-r from-giraffe-600 to-giraffe-500 h-40 overflow-hidden flex items-center justify-center md:flex">
          <img
            src={imagePath}
            alt={lesson.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
          {/* Lesson Number Badge - Overlay */}
          <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md font-bold text-giraffe-600">
            {lessonNumber}
          </div>
        </div>

        {/* Content */}
        <CardBody className="flex flex-col gap-3 pt-4 flex-grow">
          <div>
            <div className="text-xs font-semibold text-brown-600 mb-1">
              Lesson {lessonNumber}
            </div>
            <h3 className="text-lg font-bold text-brown-800 group-hover:text-giraffe-600 transition-colors">
              {lesson.title}
            </h3>
          </div>

          <p className="text-brown-600 text-sm flex-grow">
            {lesson.description}
          </p>

          {/* Duration & Status */}
          <div className="pt-3 border-t border-giraffe-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-brown-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{lesson.estimatedDuration} min</span>
              </div>
              <div
                className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                  isCompleted
                    ? 'bg-empathy-high/20 text-brown-800 border border-empathy-high/40'
                    : 'bg-giraffe-100 text-giraffe-800'
                }`}
              >
                {isCompleted ? 'Completed' : 'Start'}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
