import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/Button'
import { CheckIcon } from '~/components/ui/Icons'
import { useLessonProgress } from '~/hooks/useLessonProgress'

export interface Question {
  question: string
  options: Array<string>
  correctAnswer: number
  explanation: string
}

export interface QuizSectionProps {
  questions: Array<Question>
  passingScore: number
  lessonId?: string // Optional lesson ID for progress tracking
  /** Where to go after finishing, shown as the main action. */
  next?: { to: string; label: string }
}

/** Where the learner is on the current question. */
type Step = 'choosing' | 'missed' | 'found'

/**
 * A short check of the lesson, one question at a time. Checking an answer is
 * how you learn: a miss invites another look instead of locking the choice,
 * and the explanation appears once the fitting answer is found. The server
 * re-grades the final answers and owns the recorded result.
 */
export function QuizSection({
  questions,
  passingScore,
  lessonId,
  next,
}: QuizSectionProps) {
  const { submitQuiz } = useLessonProgress()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    Array(questions.length).fill(null),
  )
  const [step, setStep] = useState<Step>('choosing')
  // Whether each question was found on the first check, for one quiet line
  // at the end. Never shown as a grade.
  const [firstTry, setFirstTry] = useState<Array<boolean | null>>(() =>
    Array(questions.length).fill(null),
  )
  const [finished, setFinished] = useState(false)

  const question = questions[current]
  const chosen = answers[current]
  const isLast = current === questions.length - 1

  const choose = (option: number) => {
    if (step === 'found') return
    setAnswers((prev) => prev.map((a, i) => (i === current ? option : a)))
    setStep('choosing')
  }

  const check = () => {
    if (chosen === null) return
    const right = chosen === question.correctAnswer
    setFirstTry((prev) =>
      prev.map((v, i) => (i === current && v === null ? right : v)),
    )
    setStep(right ? 'found' : 'missed')
  }

  const showAnswer = () => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === current ? question.correctAnswer : a)),
    )
    setFirstTry((prev) => prev.map((v, i) => (i === current ? false : v)))
    setStep('found')
  }

  const goNext = () => {
    if (!isLast) {
      setCurrent((c) => c + 1)
      setStep('choosing')
      return
    }
    const correct = answers.filter(
      (a, i) => a === questions[i].correctAnswer,
    ).length
    const score = Math.round((correct / questions.length) * 100)
    if (lessonId && score >= passingScore) {
      submitQuiz(lessonId, answers, score)
    }
    setFinished(true)
  }

  const restart = () => {
    setCurrent(0)
    setAnswers(Array(questions.length).fill(null))
    setFirstTry(Array(questions.length).fill(null))
    setStep('choosing')
    setFinished(false)
  }

  if (finished) {
    const firstTryCount = firstTry.filter(Boolean).length
    return (
      <section
        aria-labelledby="quiz-heading"
        className="rounded-lg border-2 border-brown-100 bg-white p-6 sm:p-8"
      >
        <h2
          id="quiz-heading"
          className="text-2xl font-bold text-brown-800 text-balance"
        >
          You've finished this lesson.
        </h2>
        <p className="mt-2 text-brown-700 text-pretty max-w-prose">
          You found {firstTryCount} of {questions.length} on the first look.
          {firstTryCount < questions.length &&
            ' The ones that took a second look are often the ones that stick.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          {next && (
            <Link to={next.to}>
              <Button variant="primary" size="lg" className="px-8">
                {next.label}
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={restart}
            className="self-start sm:self-auto font-semibold text-brown-700 underline decoration-giraffe-400 decoration-2 underline-offset-4 hover:text-brown-900 cursor-pointer"
          >
            Go through the questions again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="quiz-heading"
      className="rounded-lg border-2 border-brown-100 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
        <h2 id="quiz-heading" className="text-2xl font-bold text-brown-800">
          Check your understanding
        </h2>
        <p className="text-sm text-brown-600 tabular-nums">
          Question {current + 1} of {questions.length}
        </p>
      </div>

      <fieldset>
        <legend className="text-lg font-semibold text-brown-900 mb-4 text-pretty">
          {question.question}
        </legend>

        <div role="radiogroup" className="space-y-3">
          {question.options.map((option, index) => {
            const isChosen = chosen === index
            const isFound = step === 'found' && index === question.correctAnswer
            const isMiss = step === 'missed' && isChosen
            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={isChosen}
                onClick={() => choose(index)}
                disabled={step === 'found' && !isFound}
                className={`w-full min-h-12 text-left px-4 py-3 rounded-lg border-2 flex items-start gap-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-2 ${
                  isFound
                    ? 'border-empathy-high bg-[color-mix(in_srgb,var(--color-empathy-high)_14%,white)] text-brown-900'
                    : isMiss
                      ? 'border-brown-200 bg-brown-50 text-brown-600'
                      : isChosen
                        ? 'border-brown-700 bg-giraffe-50 text-brown-900'
                        : step === 'found'
                          ? 'border-transparent bg-paper text-brown-500'
                          : 'border-transparent bg-paper text-brown-800 hover:border-brown-200 hover:bg-giraffe-50 cursor-pointer'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 grid place-items-center ${
                    isFound
                      ? 'border-empathy-high bg-empathy-high'
                      : isChosen
                        ? 'border-brown-700 bg-white'
                        : 'border-brown-300 bg-white'
                  }`}
                >
                  {isFound ? (
                    <CheckIcon className="h-3 w-3 text-brown-900" />
                  ) : (
                    isChosen && (
                      <span className="h-2.5 w-2.5 rounded-full bg-brown-700" />
                    )
                  )}
                </span>
                <span className="text-pretty">{option}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-5 empty:hidden">
        {step === 'missed' && (
          <div className="rounded-lg bg-paper border-2 border-brown-100 px-4 py-3">
            <p className="font-semibold text-brown-800">
              Not quite this one.
            </p>
            <p className="text-sm text-brown-700 text-pretty">
              Have another look at the other options, or{' '}
              <button
                type="button"
                onClick={showAnswer}
                className="font-semibold underline decoration-giraffe-400 decoration-2 underline-offset-4 hover:text-brown-900 cursor-pointer"
              >
                show me the answer
              </button>
              .
            </p>
          </div>
        )}
        {step === 'found' && (
          <div className="rounded-lg bg-[color-mix(in_srgb,var(--color-empathy-high)_12%,white)] border-2 border-empathy-high/40 px-4 py-3">
            <p className="font-semibold text-brown-900">
              {firstTry[current] ? 'Yes, that one.' : 'That’s the one.'}
            </p>
            <p className="text-sm text-brown-800 text-pretty">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {current > 0 ? (
          <button
            type="button"
            onClick={() => {
              setCurrent((c) => c - 1)
              setStep(
                answers[current - 1] === questions[current - 1].correctAnswer
                  ? 'found'
                  : 'choosing',
              )
            }}
            className="min-h-11 px-1 font-semibold text-brown-700 hover:text-brown-900 cursor-pointer"
          >
            Previous question
          </button>
        ) : (
          <span />
        )}
        {step === 'found' ? (
          <Button variant="primary" onClick={goNext}>
            {isLast ? 'Finish' : 'Next question'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={check}
            disabled={chosen === null}
            className="disabled:opacity-100 disabled:bg-brown-100 disabled:text-brown-500 disabled:shadow-none"
          >
            Check my answer
          </Button>
        )}
      </div>
    </section>
  )
}
