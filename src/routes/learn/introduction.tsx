import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { BackButton } from '~/components/ui/BackButton'
import { QuizSection } from '~/components/features/QuizSection'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { CheckIcon } from '~/components/ui/Icons'

export const Route = createFileRoute('/learn/introduction')({
  component: IntroductionLesson,
})

function IntroductionLesson() {
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId: 'introduction' }),
  )

  const [selectedExample, setSelectedExample] = useState<number>(0)
  const { isLessonCompleted } = useLessonProgress()
  const lessonCompleted = isLessonCompleted('introduction')

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    )
  }

  const currentExample = lesson.examples[selectedExample]

  return (
    <main className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream">
      {/* Completion Banner */}
      {lessonCompleted && (
        <div className="bg-gradient-to-r from-giraffe-100 to-giraffe-50 border-b-2 border-giraffe-300 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div>
              <p className="font-bold text-brown-800">Lesson Completed!</p>
              <p className="text-sm text-brown-700">
                You achieved a perfect score on this lesson.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 text-white pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-8">
          {/* Left side - content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <div className="text-sm font-semibold text-giraffe-50">
                  Lesson 1
                </div>
                <h1 className="text-4xl font-bold">{lesson.title}</h1>
              </div>
            </div>
            <p className="text-lg text-giraffe-50 max-w-xl">
              {lesson.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-giraffe-50">
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
              <span className="text-sm">
                {lesson.estimatedDuration} minutes
              </span>
            </div>
          </div>

          {/* Right side - image */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center">
            <div className="bg-transparent w-full max-w-xs max-h-64">
              <img
                src="/lesson1.png"
                alt="Non-Violent Communication Introduction"
                className="w-auto h-auto max-h-64 object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-12">
          <CardBody className="prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold text-brown-800 mb-4">
              What is Non-Violent Communication?
            </h2>
            <p className="text-brown-700 text-lg leading-relaxed">
              {lesson.content}
            </p>
            <div className="mt-6 p-4 bg-giraffe-50 border-l-4 border-giraffe-600 rounded">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-brown-700 font-semibold">Did you know?</p>
              </div>
              <p className="text-brown-700">
                The giraffe is the symbol of NVC because it has the largest
                heart of any land animal and a long neck that allows it to see
                from a wider perspective—just like compassionate communication!
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Core Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">
            The 4 Components of NVC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComponentCard
              number={1}
              title="Observation"
              description="Describe what you see/hear without judgment"
              color="blue"
            />
            <ComponentCard
              number={2}
              title="Feeling"
              description="Express your emotions authentically"
              color="purple"
            />
            <ComponentCard
              number={3}
              title="Need"
              description="Connect your feelings to universal needs"
              color="red"
            />
            <ComponentCard
              number={4}
              title="Request"
              description="Ask for concrete, positive action"
              color="emerald"
            />
          </div>
        </div>

        {/* Giraffe vs Jackal Language */}
        <Card className="mb-12 border-2 border-giraffe-200">
          <CardHeader className="bg-gradient-to-r from-giraffe-100 to-giraffe-50 border-b-2 border-giraffe-200">
            <h2 className="text-2xl font-bold text-brown-800">
              Giraffe vs Jackal Language
            </h2>
            <p className="text-brown-600 mt-2">
              See how compassionate communication differs from judgmental
              language
            </p>
          </CardHeader>
          <CardBody>
            <div className="bg-white rounded-lg p-6">
              {/* Example Display */}
              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-brown-800 mb-2">
                    Scenario
                  </h3>
                  <p className="text-brown-700 italic">
                    {currentExample.scenario}
                  </p>
                </div>

                {/* Giraffe and Jackal Comparison with Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  {/* Giraffe Card */}
                  <div className="bg-white border-2 border-giraffe-300 rounded-lg overflow-hidden shadow-lg">
                    {/* Image Container */}
                    <div className="bg-giraffe-100 p-6 flex items-center justify-center h-48">
                      <img
                        src="/giraff.png"
                        alt="Giraffe - Compassionate Communication"
                        className="h-40 w-auto object-contain"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-brown-900 mb-3">
                        Giraffe Language
                      </h4>
                      <p className="text-brown-800 leading-relaxed">
                        {currentExample.giraffResponse}
                      </p>
                    </div>
                  </div>

                  {/* Jackal Card */}
                  <div className="bg-white border-2 border-empathy-low rounded-lg overflow-hidden shadow-lg">
                    {/* Image Container */}
                    <div className="bg-empathy-low p-6 flex items-center justify-center h-48">
                      <img
                        src="/jakyll.png"
                        alt="Jackal - Reactive Communication"
                        className="h-40 w-auto object-contain"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-empathy-low mb-3">
                        Jackal Language
                      </h4>
                      <p className="text-empathy-low leading-relaxed">
                        {currentExample.jackalResponse}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-giraffe-50 rounded-lg">
                  <h4 className="font-semibold text-brown-800 mb-2">
                    Why does this matter?
                  </h4>
                  <p className="text-brown-700">{currentExample.explanation}</p>
                </div>
              </div>

              {/* Example Navigation */}
              {lesson.examples.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <p className="text-sm text-brown-600 mr-4">
                    Example {selectedExample + 1} of {lesson.examples.length}
                  </p>
                  {lesson.examples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedExample(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === selectedExample
                          ? 'bg-giraffe-600 w-8'
                          : 'bg-brown-300'
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

        <QuizSection
          questions={lesson.quiz.questions}
          passingScore={lesson.quiz.passingScore}
          title="Review Your Learning"
          lessonId="introduction"
        />

        {/* Key Takeaways */}
        <Card className="mb-12 bg-gradient-to-br from-giraffe-50 to-giraffe-100 border-2 border-giraffe-200">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 mb-6">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  NVC is a framework for compassionate, empathetic communication
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  It combines 4 components: Observation, Feeling, Need, and
                  Request
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  Giraffe language focuses on understanding and connection
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-empathy-low" />
                <span className="text-brown-700">
                  Jackal language uses judgment, blame, and demands
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
              Now that you understand the basics of NVC, you're ready to dive
              deeper into each component. In the next lesson, we'll explore{' '}
              <strong>Observations Without Evaluation</strong> — the foundation
              of clear communication.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                Next Lesson: Observations
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}

interface ComponentCardProps {
  number: number
  title: string
  description: string
  color: 'blue' | 'purple' | 'red' | 'emerald'
}

const colorMap = {
  blue: 'from-blue-50 to-blue-100 border-giraffe-200',
  purple: 'from-purple-50 to-purple-100 border-giraffe-200',
  red: 'from-red-50 to-red-100 border-empathy-low',
  emerald: 'from-emerald-50 to-emerald-100 border-giraffe-200',
}

function ComponentCard({
  number,
  title,
  description,
  color,
}: ComponentCardProps) {
  // ComponentCard is a helper component for displaying lesson components
  return (
    <Card className={`bg-gradient-to-br ${colorMap[color]} border-2`}>
      <CardBody className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-semibold text-brown-600">
              Step {number}
            </div>
            <h3 className="text-lg font-bold text-brown-800">{title}</h3>
          </div>
        </div>
        <p className="text-brown-700">{description}</p>
      </CardBody>
    </Card>
  )
}
