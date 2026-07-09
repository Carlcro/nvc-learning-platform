import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { QuizSection } from '~/components/features/QuizSection'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { CheckIcon } from '~/components/ui/Icons'

export const Route = createFileRoute('/learn/request')({
  component: RequestLesson,
})

function RequestLesson() {
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId: 'request' }),
  )

  const [selectedExample, setSelectedExample] = useState<number>(0)
  const { isLessonCompleted } = useLessonProgress()
  const lessonCompleted = isLessonCompleted('request')

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    )
  }

  const currentExample = lesson.examples[selectedExample]

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream">
      {/* Completion Banner */}
      {lessonCompleted && (
        <div className="bg-linear-to-r from-giraffe-100 to-giraffe-50 border-b-2 border-giraffe-300 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex gap-1 text-giraffe-600">
              <CheckIcon className="w-6 h-6" />
              <CheckIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-brown-800">Lesson Completed!</p>
              <p className="text-sm text-brown-700">
                You passed the quiz and completed this lesson.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-linear-to-r from-giraffe-600 to-giraffe-500 text-white pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-8">
          {/* Left side - content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <div className="text-sm font-semibold text-giraffe-50">
                  Lesson 5
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
                src="/lesson5.webp"
                alt="Making Clear and Compassionate Requests"
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
              Asking for What You Need
            </h2>
            <p className="text-brown-700 text-lg leading-relaxed">
              {lesson.content}
            </p>
            <div className="mt-6 p-4 bg-giraffe-50 border border-giraffe-300 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-brown-700 font-semibold">Key Point</p>
              </div>
              <p className="text-brown-700">
                A true request is distinguishable from a demand: it's concrete,
                specific, and leaves the other person free to say no. When
                requests are met with refusal, it's a chance for dialogue, not a
                breakdown in communication.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Core Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">
            Requests vs. Demands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConceptCard
              title="Clear Requests"
              description="Specific, concrete, doable actions phrased positively"
              color="emerald"
            />
            <ConceptCard
              title="Leave Room for No"
              description="'Would you be willing...' respects the other person's freedom"
              color="blue"
            />
            <ConceptCard
              title="Positive Language"
              description="Ask for what you want, not what you don't want"
              color="amber"
            />
            <ConceptCard
              title="Mutual Dialogue"
              description="Refusal opens conversation, not conflict"
              color="purple"
            />
          </div>
        </div>

        {/* Giraffe vs Jackal Language */}
        <Card className="mb-12 border-2 border-giraffe-200">
          <CardHeader className="bg-linear-to-r from-giraffe-100 to-giraffe-50 border-b-2 border-giraffe-200">
            <h2 className="text-2xl font-bold text-brown-800">
              Making Clear Requests
            </h2>
            <p className="text-brown-600 mt-2">
              See how to ask for what you need in a way that respects both
              parties
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
                        Clear Request
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
                        src="/jakyll.webp"
                        alt="Jackal - Reactive Communication"
                        className="h-40 w-auto object-contain"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-brown-900 mb-3">
                        Demand
                      </h4>
                      <p className="text-brown-800 leading-relaxed">
                        {currentExample.jackalResponse}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-giraffe-50 rounded-lg">
                  <h4 className="font-semibold text-brown-800 mb-2">
                    What's the difference?
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
        {
          <QuizSection
            questions={lesson.quiz.questions}
            passingScore={lesson.quiz.passingScore}
            title="Review Your Learning"
            lessonId="request"
          />
        }

        {/* Key Takeaways */}
        <Card className="mb-12 bg-linear-to-br from-giraffe-50 to-giraffe-100 border-2 border-giraffe-200">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 mb-6">
              Key Takeaways
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  Requests are concrete and doable; they tell people exactly
                  what you want
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  Use positive language to ask for what you DO want, not what
                  you DON'T want
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  A true request leaves the other person free to say no
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                <span className="text-brown-700">
                  When requests are refused, it opens dialogue to understand
                  both people's needs
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-giraffe-200 mb-12">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 mb-4">
              What's Next?
            </h2>
            <p className="text-brown-700 mb-6">
              You've now learned all four pillars of NVC: Observations,
              Feelings, Needs, and Requests. In the final lesson, we'll bring
              them all together to create complete, compassionate expressions
              that transform communication.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                Next Lesson: Integration
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}

interface ConceptCardProps {
  title: string
  description: string
  color: 'emerald' | 'blue' | 'amber' | 'purple'
}

const colorMap = {
  emerald: 'from-empathy-high/15 to-empathy-high/25 border-empathy-high/40',
  blue: 'from-giraffe-50 to-giraffe-100 border-giraffe-200',
  amber: 'from-giraffe-100 to-giraffe-200 border-giraffe-300',
  purple: 'from-cream to-giraffe-50 border-giraffe-200',
}

function ConceptCard({ title, description, color }: ConceptCardProps) {
  return (
    <Card className={`bg-linear-to-br ${colorMap[color]} border-2`}>
      <CardBody className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-brown-800">{title}</h3>
        </div>
        <p className="text-brown-700">{description}</p>
      </CardBody>
    </Card>
  )
}
