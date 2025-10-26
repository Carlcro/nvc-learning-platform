import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { QuizSection } from '~/components/features/QuizSection'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { useState } from 'react'

export const Route = createFileRoute('/learn/observation')({
  component: ObservationLesson,
})

function ObservationLesson() {
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId: 'observation' })
  )

  const [selectedExample, setSelectedExample] = useState<number>(0)
  const { isLessonCompleted } = useLessonProgress()
  const lessonCompleted = isLessonCompleted('observation')

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    )
  }

  const currentExample = lesson.examples[selectedExample]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Completion Banner */}
      {lessonCompleted && (
        <div className="bg-gradient-to-r from-yellow-100 to-emerald-100 dark:from-yellow-900 dark:to-emerald-900 border-b-2 border-giraffe-300 dark:border-giraffe-600 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="text-2xl">🎓✨</span>
            <div>
              <p className="font-bold text-giraffe-900 dark:text-giraffe-100">Lesson Completed!</p>
              <p className="text-sm text-giraffe-800 dark:text-giraffe-200">You achieved a perfect score on this lesson.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{lesson.icon}</span>
            <div>
              <div className="text-sm font-semibold text-giraffe-100">Lesson 2</div>
              <h1 className="text-4xl font-bold">{lesson.title}</h1>
            </div>
          </div>
          <p className="text-lg text-giraffe-100 max-w-2xl">{lesson.description}</p>
          <div className="mt-4 flex items-center gap-4 text-giraffe-100">
            <span className="text-sm">⏱️ {lesson.estimatedDuration} minutes</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-12">
          <CardBody className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-4">
              The Foundation of Clear Communication
            </h2>
            <p className="text-brown-700 dark:text-brown-400 text-lg leading-relaxed">
              {lesson.content}
            </p>
            <div className="mt-6 p-4 bg-giraffe-50 dark:bg-giraffe-900 border-l-4 border-giraffe-600 rounded">
              <p className="text-brown-700 dark:text-brown-300 font-semibold mb-2">
                💡 Key Point
              </p>
              <p className="text-brown-700 dark:text-brown-400">
                Observations are like photographs—they capture what is actually there without filters, interpretations, or judgments. When you describe observable facts, you create the foundation for understanding and connection.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Core Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-6">
            How to Make Pure Observations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConceptCard
              icon="👁️"
              title="See What's There"
              description="Describe what you actually see or hear without interpretation"
              color="blue"
            />
            <ConceptCard
              icon="❌"
              title="Avoid Judgment"
              description="Don't label, evaluate, or interpret what you observe"
              color="red"
            />
            <ConceptCard
              icon="📍"
              title="Be Specific"
              description="Include times, dates, or quantities when relevant"
              color="emerald"
            />
            <ConceptCard
              icon="⚠️"
              title="Skip Generalizations"
              description="Avoid 'always,' 'never,' 'constantly,' and other absolutes"
              color="amber"
            />
          </div>
        </div>

        {/* Giraffe vs Jackal Language */}
        <Card className="mb-12 border-2 border-giraffe-200 dark:border-brown-800">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900 dark:to-blue-900 border-b-2 border-giraffe-200 dark:border-brown-800">
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white">
              Observation Examples
            </h2>
            <p className="text-brown-600 dark:text-brown-400 mt-2">
              See how pure observations differ from judgmental language
            </p>
          </CardHeader>
          <CardBody>
            <div className="bg-white dark:bg-brown-800 rounded-lg p-6">
              {/* Example Display */}
              <div className="mb-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-brown-800 dark:text-white mb-2">
                    Scenario
                  </h3>
                  <p className="text-brown-700 dark:text-brown-400 italic">
                    {currentExample?.scenario}
                  </p>
                </div>

                {/* Giraffe Response */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-giraffe-50 dark:bg-brown-900 rounded-lg border-2 border-giraffe-200 dark:border-giraffe-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">🦒</span>
                      <h4 className="text-lg font-bold text-brown-900 dark:text-giraffe-100">
                        Pure Observation
                      </h4>
                    </div>
                    <p className="text-brown-800 dark:text-giraffe-200 leading-relaxed">
                      {currentExample?.giraffResponse}
                    </p>
                  </div>

                  {/* Jackal Response */}
                  <div className="p-4 bg-empathy-low dark:bg-empathy-low rounded-lg border-2 border-empathy-low dark:border-empathy-low">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">🐺</span>
                      <h4 className="text-lg font-bold text-empathy-low dark:text-empathy-low">
                        Judgment-Filled
                      </h4>
                    </div>
                    <p className="text-empathy-low dark:text-empathy-low leading-relaxed">
                      {currentExample?.jackalResponse}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-giraffe-50 dark:bg-giraffe-900 rounded-lg">
                  <h4 className="font-semibold text-giraffe-900 dark:text-giraffe-100 mb-2">
                    What's the difference?
                  </h4>
                  <p className="text-giraffe-800 dark:text-giraffe-200">
                    {currentExample?.explanation}
                  </p>
                </div>
              </div>

              {/* Example Navigation */}
              {lesson.examples && lesson.examples.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <p className="text-sm text-brown-600 dark:text-brown-400 mr-4">
                    Example {selectedExample + 1} of {lesson.examples.length}
                  </p>
                  {lesson.examples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedExample(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === selectedExample
                          ? 'bg-giraffe-600 w-8'
                          : 'bg-brown-300 dark:bg-brown-600'
                      }`}
                      aria-label={`Go to example ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Quiz Section */}
        {lesson.quiz && (
          <QuizSection
            questions={lesson.quiz.questions}
            passingScore={lesson.quiz.passingScore}
            title="Review Your Learning"
            lessonId="observation"
          />
        )}

        {/* Key Takeaways */}
        <Card className="mb-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-giraffe-200 dark:border-giraffe-700">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-6">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-xl flex-shrink-0">✓</span>
                <span className="text-brown-700 dark:text-brown-400">
                  Observations describe facts without evaluation or judgment
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl flex-shrink-0">✓</span>
                <span className="text-brown-700 dark:text-brown-400">
                  Pure observations are specific and avoid generalizations like "always" or "never"
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl flex-shrink-0">✓</span>
                <span className="text-brown-700 dark:text-brown-400">
                  Base observations on what you actually see, hear, or experience
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl flex-shrink-0">✓</span>
                <span className="text-brown-700 dark:text-brown-400">
                  Observations create the foundation for all other NVC components
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-giraffe-200 dark:border-brown-800 mb-12">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-4">
              What's Next?
            </h2>
            <p className="text-brown-700 dark:text-brown-400 mb-6">
              Now that you understand how to make pure observations, we'll move to the second component: identifying and expressing your <strong>feelings</strong> authentically. This emotional awareness is crucial for compassionate communication.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                Next Lesson: Feelings
              </Button>
              <Button variant="outline" size="lg">
                Review Content
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}

interface ConceptCardProps {
  icon: string
  title: string
  description: string
  color: 'blue' | 'red' | 'emerald' | 'amber'
}

const colorMap = {
  blue: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-giraffe-200 dark:border-giraffe-700',
  red: 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-empathy-low dark:border-empathy-low',
  emerald:
    'from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-giraffe-200 dark:border-giraffe-700',
  amber:
    'from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-amber-200 dark:border-amber-700',
}

function ConceptCard({
  icon,
  title,
  description,
  color,
}: ConceptCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${colorMap[color]} border-2`}>
      <CardBody className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-bold text-brown-800 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-brown-700 dark:text-brown-400">{description}</p>
      </CardBody>
    </Card>
  )
}
