import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import type { Messages } from '~/i18n/messages'
import { userFacingMessage } from '~/lib/errorMessage'
import { localDateString } from '~/lib/localDate'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useLocale, useT } from '~/i18n/useT'
import { Button } from '~/components/ui/Button'
import {
  FeelingsPage,
  focusRing,
  textLinkClass,
} from '~/components/features/feelings/FeelingsPage'

export const Route = createFileRoute('/feelings/quiz')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.feelings.quiz.meta) }
  },
  component: QuizGame,
})

type QuizState =
  | 'level-select'
  | 'loading'
  | 'question'
  | 'feedback'
  | 'complete'

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

// The wording for each level lives in the dictionary under `feelings.quiz.levels`.
const LEVELS = [
  { level: 1, key: 'clear' },
  { level: 2, key: 'disguised' },
  { level: 3, key: 'subtle' },
] as const

const answerButtonClass = `flex-1 min-h-14 px-5 py-3 rounded-lg border-2 border-giraffe-300 bg-white text-lg font-semibold text-brown-800 transition-colors duration-150 hover:border-brown-700 hover:bg-giraffe-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`

/** The calm one-line verdict for an answer. */
function verdict(
  result: AnswerResult,
  copy: Messages['feelings']['quiz']['verdict'],
): string {
  if (result.correct) {
    return result.isFeeling ? copy.correctFeeling : copy.correctThought
  }
  return result.isFeeling ? copy.wrongFeeling : copy.wrongThought
}

function QuizGame() {
  const t = useT()
  const locale = useLocale()
  const copy = t.feelings.quiz
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
      ? { level: selectedLevel, count: 10, seed, locale }
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
        locale,
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
      setError(userFacingMessage(err, copy.answerError, t.errors))
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
    <FeelingsPage title={copy.title} intro={<p>{copy.intro}</p>}>
      <div className="max-w-2xl">
        {quizState === 'level-select' && (
          <section aria-labelledby="levels-heading">
            <h2
              id="levels-heading"
              className="text-xl font-bold text-brown-800 mb-4"
            >
              {copy.levelsHeading}
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
                        {copy.levels[option.key].title}
                      </span>
                      <span className="block mt-0.5 text-brown-700 text-pretty">
                        {copy.levels[option.key].text}
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
            <p className="mt-4 text-sm text-brown-700">{copy.roundLength}</p>
          </section>
        )}

        {quizState === 'loading' && (
          <p role="status" className="text-brown-700">
            {copy.loading}
          </p>
        )}

        {quizState === 'question' && questions.length === 0 && (
          <section className="rounded-lg border-2 border-giraffe-200 bg-white p-6 sm:p-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-brown-800 mb-2 focus:outline-none"
            >
              {copy.emptyHeading}
            </h2>
            <p className="text-brown-700 mb-5">{copy.emptyText}</p>
            <button
              type="button"
              onClick={backToLevels}
              className={`min-h-11 cursor-pointer ${textLinkClass}`}
            >
              {copy.chooseAnotherLevel}
            </button>
          </section>
        )}

        {quizState === 'question' && currentQuestionData && (
          <section
            aria-labelledby="question-heading"
            className="rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-8"
          >
            <p className="text-sm font-semibold text-brown-700 tabular-nums">
              {copy.progress(currentQuestion + 1, questions.length)}
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
              {copy.questionHeading}
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
                {copy.answerFeeling}
              </button>
              <button
                type="button"
                onClick={() => void handleAnswer(false)}
                disabled={isAnswering}
                className={answerButtonClass}
              >
                {copy.answerThought}
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
              {copy.progress(currentQuestion + 1, questions.length)}
            </p>
            <h2
              id="feedback-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold text-brown-800 text-balance focus:outline-none"
            >
              {verdict(latest, copy.verdict)}
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
                  {copy.insteadLabel}
                </span>
                {latest.correctFeelings.join(', ')}
              </p>
            )}

            {latest.leveledUp && (
              <p className="mt-4 text-sm font-medium text-brown-800">
                {copy.leveledUp}
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
                  ? copy.next
                  : copy.finish}
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
              {copy.summary(sortedCount, results.length)}
            </h2>

            {missed.length > 0 ? (
              <>
                <p className="mt-2 text-brown-700 text-pretty">
                  {copy.missedIntro}
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
                          ? copy.missedFeeling
                          : copy.missedThought}
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
                {copy.allCorrect}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => startLevel(selectedLevel)}
                className={`px-8 ${focusRing}`}
              >
                {copy.playAgain}
              </Button>
              <button
                type="button"
                onClick={backToLevels}
                className={`self-start sm:self-auto min-h-11 cursor-pointer ${textLinkClass}`}
              >
                {copy.chooseAnotherLevel}
              </button>
              <Link
                to="/feelings"
                className={`self-start sm:self-auto inline-flex items-center min-h-11 ${textLinkClass}`}
              >
                {copy.backToFeelings}
              </Link>
            </div>
          </section>
        )}
      </div>
    </FeelingsPage>
  )
}
