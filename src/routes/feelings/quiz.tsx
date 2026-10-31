import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { userFacingMessage } from '~/lib/errorMessage'
import { localDateString } from '~/lib/localDate'
import { pageMeta } from '~/lib/seo'
import { Button } from '~/components/ui/Button'
import {
  FeelingsPage,
  focusRing,
  textLinkClass,
} from '~/components/features/feelings/FeelingsPage'

export const Route = createFileRoute('/feelings/quiz')({
  head: () => ({
    meta: pageMeta({
      title: 'Feeling or thought',
      description:
        'Practice telling real feelings apart from thoughts about other people.',
    }),
  }),
  component: QuizGame,
})

type QuizState = 'level-select' | 'loading' | 'question' | 'feedback' | 'complete'

// Questions arrive without their answers; the server grades each answer and
// returns the explanation, so the solution is never in the client before the
// user commits.
interface QuizQuestion {
  _id: string
  sentence: string
  level: number
  category: string
}

interface AnswerResult {
  sentence: string
  correct: boolean
  /** Whether the sentence really expresses a feeling. */
  isFeeling: boolean
  explanation: string
  correctFeelings: Array<string>
  leveledUp: boolean
}

const LEVELS = [
  {
    level: 1,
    title: 'Level 1: clear cases',
    text: 'Thoughts that are easy to spot once you look for them.',
  },
  {
    level: 2,
    title: 'Level 2: judgments in disguise',
    text: 'Words like ignored or used, which sound like feelings but describe what someone did.',
  },
  {
    level: 3,
    title: 'Level 3: subtle cases',
    text: 'Sentences where the line is fine and worth slowing down for.',
  },
] as const

const answerButtonClass = `flex-1 min-h-14 px-5 py-3 rounded-lg border-2 border-giraffe-300 bg-white text-lg font-semibold text-brown-800 transition-colors duration-150 hover:border-brown-700 hover:bg-giraffe-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`

/** The calm one-line verdict for an answer. */
function verdict(result: AnswerResult): string {
  if (result.correct) {
    return result.isFeeling
      ? 'Yes, that one is a feeling.'
      : 'Yes, that one is a thought dressed as a feeling.'
  }
  return result.isFeeling
    ? 'That one is a feeling, after all.'
    : 'That one is a thought dressed as a feeling.'
}

function QuizGame() {
  const [quizState, setQuizState] = useState<QuizState>('level-select')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [results, setResults] = useState<Array<AnswerResult>>([])
  const [error, setError] = useState<string | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [questions, setQuestions] = useState<Array<QuizQuestion>>([])
  const headingRef = useRef<HTMLHeadingElement>(null)

  const quizBatch = useQuery(
    api.feelingsQuiz.getQuizBatch,
    quizState === 'loading'
      ? { level: selectedLevel, count: 10, seed }
      : 'skip',
  )

  useEffect(() => {
    if (quizState === 'loading' && quizBatch !== undefined) {
      setQuestions(quizBatch as Array<QuizQuestion>)
      setQuizState('question')
    }
  }, [quizBatch, quizState])

  // Each new step moves focus to its heading, so keyboard and screen reader
  // users hear the question, the feedback or the summary straight away.
  useEffect(() => {
    if (quizState === 'level-select' || quizState === 'loading') return
    headingRef.current?.focus()
  }, [quizState, currentQuestion])

  const submitAnswer = useMutation(api.feelingsQuiz.submitAnswer)

  const currentQuestionData =
    questions.length > 0 && currentQuestion < questions.length
      ? questions[currentQuestion]
      : null
  const latest = results.length > 0 ? results[results.length - 1] : null

  const startLevel = (level: number) => {
    setSelectedLevel(level)
    setSeed(Math.floor(Math.random() * 1e9))
    setCurrentQuestion(0)
    setResults([])
    setQuestions([])
    setError(null)
    setQuizState('loading')
  }

  const handleAnswer = async (answeredRealFeeling: boolean) => {
    if (!currentQuestionData || isAnswering) return
    setIsAnswering(true)
    try {
      const result = await submitAnswer({
        questionId: currentQuestionData._id as Id<'feelingsQuizQuestions'>,
        answeredRealFeeling,
        localDate: localDateString(),
      })
      setResults((prev) => [
        ...prev,
        {
          sentence: currentQuestionData.sentence,
          correct: result.correct,
          isFeeling: result.correct
            ? answeredRealFeeling
            : !answeredRealFeeling,
          explanation: result.explanation,
          correctFeelings: result.correctFeelings,
          leveledUp: result.leveledUp,
        },
      ])
      setError(null)
      setQuizState('feedback')
    } catch (err) {
      setError(
        userFacingMessage(
          err,
          'We could not record that answer just now. Please try again.',
        ),
      )
    } finally {
      setIsAnswering(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setQuizState('question')
    } else {
      setQuizState('complete')
    }
  }

  const backToLevels = () => {
    setError(null)
    setQuizState('level-select')
  }

  const sortedCount = results.filter((r) => r.correct).length
  const missed = results.filter((r) => !r.correct)

  return (
    <FeelingsPage
      title="Feeling or thought?"
      intro={
        <p>
          A feeling describes what is going on inside you. A thought dressed as
          a feeling, like &ldquo;I feel ignored&rdquo;, describes what you think
          someone else did. Read each sentence and sort it.
        </p>
      }
    >
      <div className="max-w-2xl">
        {quizState === 'level-select' && (
          <section aria-labelledby="levels-heading">
            <h2
              id="levels-heading"
              className="text-xl font-bold text-brown-800 mb-4"
            >
              Choose where to start
            </h2>
            <ul className="border-t-2 border-brown-100">
              {LEVELS.map((option) => (
                <li key={option.level} className="border-b-2 border-brown-100">
                  <button
                    type="button"
                    onClick={() => startLevel(option.level)}
                    className={`group w-full flex items-center gap-4 py-4 px-1 text-left rounded-sm cursor-pointer ${focusRing}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-brown-800 group-hover:underline decoration-giraffe-400 decoration-2 underline-offset-4">
                        {option.title}
                      </span>
                      <span className="block mt-0.5 text-brown-700 text-pretty">
                        {option.text}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-brown-700"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-brown-700">
              Each round is ten sentences.
            </p>
          </section>
        )}

        {quizState === 'loading' && (
          <p role="status" className="text-brown-700">
            Gathering sentences...
          </p>
        )}

        {quizState === 'question' && questions.length === 0 && (
          <section className="rounded-lg border-2 border-giraffe-200 bg-white p-6 sm:p-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-brown-800 mb-2 focus:outline-none"
            >
              No sentences here yet
            </h2>
            <p className="text-brown-700 mb-5">
              This level has no questions for now. Another level may have some.
            </p>
            <button
              type="button"
              onClick={backToLevels}
              className={`min-h-11 cursor-pointer ${textLinkClass}`}
            >
              Choose another level
            </button>
          </section>
        )}

        {quizState === 'question' && currentQuestionData && (
          <section
            aria-labelledby="question-heading"
            className="rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-8"
          >
            <p className="text-sm font-semibold text-brown-700 tabular-nums">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div aria-hidden="true" className="mt-2 mb-6 flex gap-1">
              {questions.map((q, idx) => (
                <span
                  key={q._id}
                  className={`h-1.5 flex-1 rounded-full ${
                    idx < currentQuestion
                      ? 'bg-brown-700'
                      : idx === currentQuestion
                        ? 'bg-giraffe-500'
                        : 'bg-brown-100'
                  }`}
                />
              ))}
            </div>

            <h2
              id="question-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-brown-800 mb-4 focus:outline-none"
            >
              Is this a feeling, or a thought?
            </h2>
            <blockquote className="rounded-lg bg-giraffe-50 border-2 border-giraffe-100 px-5 py-4 text-lg text-brown-900 leading-relaxed text-pretty mb-6">
              {currentQuestionData.sentence}
            </blockquote>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => void handleAnswer(true)}
                disabled={isAnswering}
                className={answerButtonClass}
              >
                A feeling
              </button>
              <button
                type="button"
                onClick={() => void handleAnswer(false)}
                disabled={isAnswering}
                className={answerButtonClass}
              >
                A thought
              </button>
            </div>
          </section>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border-2 border-brown-200 bg-brown-50 px-4 py-3"
          >
            <p className="text-brown-800 font-medium">{error}</p>
          </div>
        )}

        {quizState === 'feedback' && latest && (
          <section
            aria-labelledby="feedback-heading"
            className="rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-8"
          >
            <p className="text-sm font-semibold text-brown-700 tabular-nums mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h2
              id="feedback-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-brown-800 text-balance focus:outline-none"
            >
              {verdict(latest)}
            </h2>
            <blockquote className="mt-3 text-brown-700 text-pretty border-l-2 border-giraffe-300 pl-4">
              {latest.sentence}
            </blockquote>
            <p className="mt-4 text-brown-700 leading-relaxed text-pretty">
              {latest.explanation}
            </p>

            {latest.correctFeelings.length > 0 && (
              <p className="mt-4 text-brown-700 text-pretty">
                <span className="font-semibold text-brown-800">
                  Feelings you could name instead:{' '}
                </span>
                {latest.correctFeelings.join(', ')}
              </p>
            )}

            {latest.leveledUp && (
              <p className="mt-4 text-sm font-medium text-brown-800">
                You have moved up a quiz level.
              </p>
            )}

            <div className="mt-6 pt-6 border-t-2 border-brown-100">
              <Button
                variant="primary"
                size="lg"
                onClick={handleNextQuestion}
                className={`w-full sm:w-auto px-8 ${focusRing}`}
              >
                {currentQuestion < questions.length - 1
                  ? 'Next sentence'
                  : 'See how it went'}
              </Button>
            </div>
          </section>
        )}

        {quizState === 'complete' && questions.length > 0 && (
          <section
            aria-labelledby="summary-heading"
            className="rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-8"
          >
            <h2
              id="summary-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-bold text-brown-800 text-balance focus:outline-none"
            >
              You sorted {sortedCount} of {results.length}.
            </h2>

            {missed.length > 0 ? (
              <>
                <p className="mt-2 text-brown-700 text-pretty">
                  The ones worth a second look are below. They are often the
                  ones that stick.
                </p>
                <ul className="mt-6 space-y-5">
                  {missed.map((item) => (
                    <li
                      key={item.sentence}
                      className="border-l-2 border-giraffe-300 pl-4"
                    >
                      <p className="text-brown-900 text-pretty">
                        {item.sentence}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-brown-800">
                        {item.isFeeling
                          ? 'This one is a feeling.'
                          : 'This one is a thought dressed as a feeling.'}
                      </p>
                      <p className="mt-1 text-sm text-brown-700 text-pretty">
                        {item.explanation}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-brown-700 text-pretty">
                Every sentence landed where it belongs. The next level is there
                whenever you feel ready.
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => startLevel(selectedLevel)}
                className={`px-8 ${focusRing}`}
              >
                Play again
              </Button>
              <button
                type="button"
                onClick={backToLevels}
                className={`self-start sm:self-auto min-h-11 cursor-pointer ${textLinkClass}`}
              >
                Choose another level
              </button>
              <Link
                to="/feelings"
                className={`self-start sm:self-auto inline-flex items-center min-h-11 ${textLinkClass}`}
              >
                Back to feelings
              </Link>
            </div>
          </section>
        )}
      </div>
    </FeelingsPage>
  )
}
