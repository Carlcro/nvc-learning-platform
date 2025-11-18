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

export const Route = createFileRoute('/learn/integration')({
  component: IntegrationLesson,
})

function IntegrationLesson() {
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId: 'integration' }),
  )

  const [selectedExample, setSelectedExample] = useState<number>(0)
  const { isLessonCompleted } = useLessonProgress()
  const lessonCompleted = isLessonCompleted('integration')

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
                You achieved a perfect score on this lesson.
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
                  6 - Final Lesson
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
                src="/lesson6.png"
                alt="Integrating All Four Pillars of NVC"
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
              The Complete Expression
            </h2>
            <p className="text-brown-700 text-lg leading-relaxed">
              {lesson.content}
            </p>
            <div className="mt-6 p-4 bg-giraffe-50 border-l-4 border-giraffe-600 rounded">
              <p className="text-brown-700 font-semibold mb-2">
                The NVC Formula
              </p>
              <p className="text-brown-700 font-mono mb-2">
                When [Observation], I feel [Feeling] because [Need]. Would you
                be willing to [Request]?
              </p>
              <p className="text-brown-700 text-sm">
                This simple formula brings together everything you've learned
                into a powerful expression that transforms communication.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* The 4 Pillars */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">
            The 4 Pillars of NVC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PillarCard
              number={1}
              title="Observation"
              description="What you actually see and hear without judgment"
              color="blue"
            />
            <PillarCard
              number={2}
              title="Feeling"
              description="Your authentic emotional experience"
              color="purple"
            />
            <PillarCard
              number={3}
              title="Need"
              description="The universal human need behind your feeling"
              color="red"
            />
            <PillarCard
              number={4}
              title="Request"
              description="A concrete, doable action you're asking for"
              color="emerald"
            />
          </div>
        </div>

        {/* Complete Examples */}
        <Card className="mb-12 border-2 border-giraffe-200">
          <CardHeader className="bg-linear-to-r from-giraffe-100 to-giraffe-50 border-b-2 border-giraffe-200">
            <h2 className="text-2xl font-bold text-brown-800">
              Complete NVC Expressions
            </h2>
            <p className="text-brown-600 mt-2">
              See all 4 components working together in real-world scenarios
            </p>
          </CardHeader>
          <CardBody>
            <div className="bg-white rounded-lg p-6">
              {/* Example Display */}
              <div className="mb-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-brown-800 mb-2">
                    Scenario
                  </h3>
                  <p className="text-brown-700 italic">
                    {currentExample.scenario}
                  </p>
                </div>

                {/* Giraffe Response */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-giraffe-50 rounded-lg border-2 border-giraffe-200">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-lg font-bold text-brown-900">
                        Complete NVC Expression
                      </h4>
                    </div>
                    <p className="text-brown-800 leading-relaxed mb-4">
                      {currentExample.giraffResponse}
                    </p>

                    {/* Component Breakdown */}
                    <div className="text-sm space-y-2 pt-4 border-t border-giraffe-200">
                      <div>
                        <span className="font-semibold text-brown-900">
                          👀 Observation:
                        </span>
                        <p className="text-brown-800 text-xs">
                          The specific fact observed
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900">
                          💭 Feeling:
                        </span>
                        <p className="text-brown-800 text-xs">
                          The emotional response
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900">
                          ❤️ Need:
                        </span>
                        <p className="text-brown-800 text-xs">
                          The universal need at stake
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900">
                          🎯 Request:
                        </span>
                        <p className="text-brown-800 text-xs">
                          The concrete action being requested
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Jackal Response */}
                  <div className="p-4 bg-empathy-lowlow rounded-lg border-2 border-empathy-lowlow">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-lg font-bold text-empathy-lowlow">
                        Judgmental Response
                      </h4>
                    </div>
                    <p className="text-empathy-lowlow leading-relaxed mb-4">
                      {currentExample.jackalResponse}
                    </p>

                    {/* Problem Breakdown */}
                    <div className="text-sm space-y-2 pt-4 border-t border-empathy-lowlow">
                      <div>
                        <span className="font-semibold text-empathy-lowlow">
                          ❌ Issues:
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-empathy-lowlow text-xs space-y-1">
                        <li>Uses judgment and blame</li>
                        <li>No clear observation</li>
                        <li>No expressed need</li>
                        <li>Makes demands, not requests</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-giraffe-50 rounded-lg">
                  <h4 className="font-semibold text-giraffe-900 mb-2">
                    Why this works
                  </h4>
                  <p className="text-giraffe-800">
                    {currentExample.explanation}
                  </p>
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
          title="Master the Integration"
          lessonId="integration"
        />

        {/* Completion Celebration */}
        <Card className="mb-12 bg-linear-to-br from-giraffe-50 to-giraffe-100 border-2 border-giraffe-200">
          <CardBody className="text-center py-8">
            <h2 className="text-3xl font-bold text-brown-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-brown-700 mb-6 max-w-2xl mx-auto">
              You've completed the 6 foundational lessons of Non-Violent
              Communication. You now understand all four pillars: Observation,
              Feeling, Need, and Request. This is the foundation for
              compassionate, authentic communication.
            </p>
            <div className="bg-white rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-brown-800 mb-4">
                What You've Learned
              </h3>
              <ul className="space-y-3 text-left">
                <li className="flex gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                  <span className="text-brown-700">
                    How to make observations without judgment
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                  <span className="text-brown-700">
                    How to express feelings authentically
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                  <span className="text-brown-700">
                    How to identify universal human needs
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                  <span className="text-brown-700">
                    How to make clear, compassionate requests
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0 text-giraffe-600" />
                  <span className="text-brown-700">
                    How to bring it all together in complete expressions
                  </span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-giraffe-200 mb-12">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 mb-4">
              What's Next?
            </h2>
            <p className="text-brown-700 mb-6">
              You now have the foundation of NVC! The next step is to practice
              these skills in real conversations. Here are ways to continue your
              learning:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-giraffe-50 rounded-lg border border-giraffe-200">
                <h3 className="font-semibold text-brown-800 mb-2">
                  AI Roleplay Scenarios
                </h3>
                <p className="text-sm text-brown-700">
                  Practice NVC in realistic conversations with AI characters
                </p>
              </div>
              <div className="p-4 bg-giraffe-50 rounded-lg border border-giraffe-200">
                <h3 className="font-semibold text-brown-800 mb-2">
                  Daily Challenges
                </h3>
                <p className="text-sm text-brown-700">
                  Apply NVC to new scenarios every day to build fluency
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                Start AI Roleplay
              </Button>
              <Button variant="outline" size="lg">
                Back to Lessons
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}

interface PillarCardProps {
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

function PillarCard({ number, title, description, color }: PillarCardProps) {
  return (
    <Card className={`bg-linear-to-br ${colorMap[color]} border-2`}>
      <CardBody className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-semibold text-brown-600">
              Pillar {number}
            </div>
            <h3 className="text-lg font-bold text-brown-800">{title}</h3>
          </div>
        </div>
        <p className="text-brown-700">{description}</p>
      </CardBody>
    </Card>
  )
}
