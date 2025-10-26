import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { QuizSection } from '~/components/features/QuizSection'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { useState } from 'react'

export const Route = createFileRoute('/learn/integration')({
  component: IntegrationLesson,
})

function IntegrationLesson() {
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId: 'integration' })
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
      <section className="bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 dark:from-blue-700 dark:via-emerald-700 dark:to-teal-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{lesson.icon}</span>
            <div>
              <div className="text-sm font-semibold text-giraffe-100">Lesson 6 - Final Lesson</div>
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
              The Complete Expression
            </h2>
            <p className="text-brown-700 dark:text-brown-400 text-lg leading-relaxed">
              {lesson.content}
            </p>
            <div className="mt-6 p-4 bg-giraffe-50 dark:bg-giraffe-900 border-l-4 border-giraffe-600 rounded">
              <p className="text-brown-700 dark:text-brown-300 font-semibold mb-2">
                🦒 The NVC Formula
              </p>
              <p className="text-brown-700 dark:text-brown-400 font-mono mb-2">
                When [Observation], I feel [Feeling] because [Need]. Would you be willing to [Request]?
              </p>
              <p className="text-brown-700 dark:text-brown-400 text-sm">
                This simple formula brings together everything you've learned into a powerful expression that transforms communication.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* The 4 Pillars */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-6">
            The 4 Pillars of NVC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PillarCard
              number={1}
              icon="👀"
              title="Observation"
              description="What you actually see and hear without judgment"
              color="blue"
            />
            <PillarCard
              number={2}
              icon="💭"
              title="Feeling"
              description="Your authentic emotional experience"
              color="purple"
            />
            <PillarCard
              number={3}
              icon="❤️"
              title="Need"
              description="The universal human need behind your feeling"
              color="red"
            />
            <PillarCard
              number={4}
              icon="🎯"
              title="Request"
              description="A concrete, doable action you're asking for"
              color="emerald"
            />
          </div>
        </div>

        {/* Complete Examples */}
        <Card className="mb-12 border-2 border-giraffe-200 dark:border-brown-800">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900 dark:to-blue-900 border-b-2 border-giraffe-200 dark:border-brown-800">
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white">
              Complete NVC Expressions
            </h2>
            <p className="text-brown-600 dark:text-brown-400 mt-2">
              See all 4 components working together in real-world scenarios
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-giraffe-50 dark:bg-brown-900 rounded-lg border-2 border-giraffe-200 dark:border-giraffe-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">🦒</span>
                      <h4 className="text-lg font-bold text-brown-900 dark:text-giraffe-100">
                        Complete NVC Expression
                      </h4>
                    </div>
                    <p className="text-brown-800 dark:text-giraffe-200 leading-relaxed mb-4">
                      {currentExample?.giraffResponse}
                    </p>

                    {/* Component Breakdown */}
                    <div className="text-sm space-y-2 pt-4 border-t border-giraffe-200 dark:border-giraffe-700">
                      <div>
                        <span className="font-semibold text-brown-900 dark:text-giraffe-100">👀 Observation:</span>
                        <p className="text-brown-800 dark:text-giraffe-200 text-xs">The specific fact observed</p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900 dark:text-giraffe-100">💭 Feeling:</span>
                        <p className="text-brown-800 dark:text-giraffe-200 text-xs">The emotional response</p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900 dark:text-giraffe-100">❤️ Need:</span>
                        <p className="text-brown-800 dark:text-giraffe-200 text-xs">The universal need at stake</p>
                      </div>
                      <div>
                        <span className="font-semibold text-brown-900 dark:text-giraffe-100">🎯 Request:</span>
                        <p className="text-brown-800 dark:text-giraffe-200 text-xs">The concrete action being requested</p>
                      </div>
                    </div>
                  </div>

                  {/* Jackal Response */}
                  <div className="p-4 bg-empathy-low dark:bg-empathy-low rounded-lg border-2 border-empathy-low dark:border-empathy-low">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">🐺</span>
                      <h4 className="text-lg font-bold text-empathy-low dark:text-empathy-low">
                        Judgmental Response
                      </h4>
                    </div>
                    <p className="text-empathy-low dark:text-empathy-low leading-relaxed mb-4">
                      {currentExample?.jackalResponse}
                    </p>

                    {/* Problem Breakdown */}
                    <div className="text-sm space-y-2 pt-4 border-t border-empathy-low dark:border-empathy-low">
                      <div>
                        <span className="font-semibold text-empathy-low dark:text-empathy-low">❌ Issues:</span>
                      </div>
                      <ul className="list-disc list-inside text-empathy-low dark:text-empathy-low text-xs space-y-1">
                        <li>Uses judgment and blame</li>
                        <li>No clear observation</li>
                        <li>No expressed need</li>
                        <li>Makes demands, not requests</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-6 p-4 bg-giraffe-50 dark:bg-giraffe-900 rounded-lg">
                  <h4 className="font-semibold text-giraffe-900 dark:text-giraffe-100 mb-2">
                    Why this works
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
            title="Master the Integration"
            lessonId="integration"
          />
        )}

        {/* Completion Celebration */}
        <Card className="mb-12 bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 dark:from-blue-900 dark:via-emerald-900 dark:to-teal-900 border-2 border-giraffe-200 dark:border-giraffe-700">
          <CardBody className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-brown-800 dark:text-white mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-brown-700 dark:text-brown-400 mb-6 max-w-2xl mx-auto">
              You've completed the 6 foundational lessons of Non-Violent Communication. You now understand all four pillars: Observation, Feeling, Need, and Request. This is the foundation for compassionate, authentic communication.
            </p>
            <div className="bg-white dark:bg-brown-800 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-brown-800 dark:text-white mb-4">
                What You've Learned
              </h3>
              <ul className="space-y-3 text-left">
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-brown-700 dark:text-brown-400">How to make observations without judgment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-brown-700 dark:text-brown-400">How to express feelings authentically</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-brown-700 dark:text-brown-400">How to identify universal human needs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-brown-700 dark:text-brown-400">How to make clear, compassionate requests</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-brown-700 dark:text-brown-400">How to bring it all together in complete expressions</span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-giraffe-200 dark:border-brown-800 mb-12">
          <CardBody>
            <h2 className="text-2xl font-bold text-brown-800 dark:text-white mb-4">
              What's Next?
            </h2>
            <p className="text-brown-700 dark:text-brown-400 mb-6">
              You now have the foundation of NVC! The next step is to practice these skills in real conversations. Here are ways to continue your learning:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-giraffe-50 dark:bg-giraffe-900 rounded-lg border border-giraffe-200 dark:border-giraffe-700">
                <div className="text-2xl mb-2">🎭</div>
                <h3 className="font-semibold text-brown-800 dark:text-white mb-2">AI Roleplay Scenarios</h3>
                <p className="text-sm text-brown-700 dark:text-brown-400">
                  Practice NVC in realistic conversations with AI characters
                </p>
              </div>
              <div className="p-4 bg-giraffe-50 dark:bg-brown-900 rounded-lg border border-giraffe-200 dark:border-giraffe-700">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-brown-800 dark:text-white mb-2">Daily Challenges</h3>
                <p className="text-sm text-brown-700 dark:text-brown-400">
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
  icon: string
  title: string
  description: string
  color: 'blue' | 'purple' | 'red' | 'emerald'
}

const colorMap = {
  blue: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-giraffe-200 dark:border-giraffe-700',
  purple:
    'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-giraffe-200 dark:border-giraffe-700',
  red: 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-empathy-low dark:border-empathy-low',
  emerald:
    'from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-giraffe-200 dark:border-giraffe-700',
}

function PillarCard({
  number,
  icon,
  title,
  description,
  color,
}: PillarCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${colorMap[color]} border-2`}>
      <CardBody className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="text-sm font-semibold text-brown-600 dark:text-brown-400">
              Pillar {number}
            </div>
            <h3 className="text-lg font-bold text-brown-800 dark:text-white">
              {title}
            </h3>
          </div>
        </div>
        <p className="text-brown-700 dark:text-brown-400">{description}</p>
      </CardBody>
    </Card>
  )
}
