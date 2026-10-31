import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import {
  LESSON_IMAGES,
  LESSON_ORDER,
  lessonNumber,
  nextLessonId,
  previousLessonId,
} from './lessonPages'
import type { LessonId } from './lessonPages'
import { QuizSection } from '~/components/features/QuizSection'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { CheckIcon } from '~/components/ui/Icons'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { useLocale, useT } from '~/i18n/useT'

interface Example {
  scenario: string
  giraffResponse: string
  jackalResponse: string
  explanation: string
}

const linkClass =
  'font-semibold text-brown-800 underline decoration-giraffe-400 decoration-2 underline-offset-4 hover:decoration-brown-700'

/** The loader each lesson route shows while its lesson loads. */
export function LessonLoader() {
  const t = useT()
  return <GiraffeLoader message={t.learn.loading.lesson} />
}

/**
 * One lesson, read top to bottom: what it is, the four things to hold onto,
 * examples side by side, what to remember, then a short check. The copy that
 * frames each lesson lives in the `learn.lessons` dictionary; the lesson
 * itself in Convex.
 */
export function LessonPage({ lessonId }: { lessonId: LessonId }) {
  const t = useT()
  const locale = useLocale()
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.getLessonById, { lessonId, locale }),
  )
  const { isLessonCompleted, getCompletedLessonIds } = useLessonProgress()

  if (!lesson) {
    return (
      <main className="min-h-screen pt-32 px-4 text-center">
        <p className="text-brown-700 mb-4">{t.learn.page.notFound}</p>
        <Link to="/learn" className={linkClass}>
          {t.learn.page.backToLessons}
        </Link>
      </main>
    )
  }

  const lessons = t.learn.lessons
  const page = lessons[lessonId]
  const number = lessonNumber(lessonId)
  const completed = isLessonCompleted(lessonId)
  const nextId = nextLessonId(lessonId)
  const previousId = previousLessonId(lessonId)
  const isLastLesson = nextId === null
  const allComplete = LESSON_ORDER.every((id) =>
    getCompletedLessonIds().includes(id),
  )

  const next = nextId
    ? {
        to: `/learn/${nextId}`,
        label: t.learn.page.nextLesson(lessons[nextId].shortName),
      }
    : { to: '/practice', label: t.learn.page.tryPractice }

  return (
    <main className="min-h-screen bg-paper">
      {/* Header */}
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <Link
              to="/learn"
              className="inline-block mb-5 text-sm font-semibold text-brown-700 hover:text-brown-900"
            >
              <span aria-hidden="true">&larr; </span>
              {t.learn.page.allLessons}
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight leading-[1.1]">
              {lesson.title}
            </h1>
            <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
              {lesson.description}
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brown-700">
              <span>{t.learn.page.lessonOf(number, LESSON_ORDER.length)}</span>
              <span>{t.learn.page.duration(lesson.estimatedDuration)}</span>
              {completed && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-brown-800">
                  <CheckIcon className="h-4 w-4 text-empathy-high" />
                  {t.learn.page.completed}
                </span>
              )}
            </p>
          </div>
          <img
            src={LESSON_IMAGES[lessonId]}
            alt=""
            aria-hidden="true"
            className="h-44 sm:h-56 md:h-64 w-auto object-contain mx-auto"
          />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-14 md:space-y-16">
        {/* Opening */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-brown-800 mb-4 text-balance tracking-tight">
            {page.heading}
          </h2>
          <p className="text-lg text-brown-700 leading-relaxed max-w-prose text-pretty">
            {lesson.content}
          </p>
          <aside className="mt-6 rounded-lg border-2 border-giraffe-200 bg-white px-5 py-4 max-w-prose">
            <p className="text-sm font-semibold text-giraffe-800">
              {page.aside.label}
            </p>
            <p className="text-brown-800 text-pretty">{page.aside.text}</p>
          </aside>
        </section>

        {/* Four things to hold onto */}
        <section>
          <h2 className="text-xl font-bold text-brown-800 mb-5">
            {t.learn.page.pointsHeading}
          </h2>
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6 border-t-2 border-brown-100 pt-6">
            {page.points.map((point) => (
              <div key={point.title}>
                <dt className="font-bold text-brown-900">{point.title}</dt>
                <dd className="mt-1 text-brown-700 text-pretty">
                  {point.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Examples */}
        <ExampleViewer
          heading={page.examples.heading}
          giraffeLabel={page.examples.giraffe}
          jackalLabel={page.examples.jackal}
          examples={lesson.examples}
        />

        {/* What to remember, before the check so it can help */}
        <section>
          <h2 className="text-xl font-bold text-brown-800 mb-4">
            {t.learn.page.takeawaysHeading}
          </h2>
          <ul className="space-y-3 max-w-prose">
            {page.takeaways.map((line) => (
              <li key={line} className="flex gap-3 text-brown-700 text-pretty">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-giraffe-500"
                />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <QuizSection
          questions={lesson.quiz.questions}
          passingScore={lesson.quiz.passingScore}
          lessonId={lessonId}
          next={next}
        />

        {/* After the last lesson, and only once all six are done */}
        {isLastLesson && allComplete && (
          <section className="rounded-lg bg-brown-800 px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-bold text-cream text-balance">
              {t.learn.page.foundations.title}
            </h2>
            <p className="mt-3 text-giraffe-100 max-w-prose text-pretty">
              {t.learn.page.foundations.text}
            </p>
            <Link to="/practice" className="inline-block mt-6">
              <Button variant="primary" size="lg" className="px-8">
                {t.learn.page.tryPractice}
              </Button>
            </Link>
          </section>
        )}

        {/* Quiet lesson-to-lesson navigation, for anyone skipping the check */}
        <nav
          aria-label={t.learn.page.navLabel}
          className="flex flex-wrap justify-between gap-4 border-t-2 border-brown-100 pt-6 text-sm"
        >
          {previousId ? (
            <Link to={`/learn/${previousId}`} className={linkClass}>
              <span aria-hidden="true">&larr; </span>
              {lessons[previousId].shortName}
            </Link>
          ) : (
            <Link to="/learn" className={linkClass}>
              {t.learn.page.allLessons}
            </Link>
          )}
          <Link to={next.to} className={linkClass}>
            {nextId ? lessons[nextId].shortName : t.learn.page.practice}
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </nav>
      </div>
    </main>
  )
}

/**
 * The lesson's examples, jackal first and giraffe second, so each reads as a
 * rewrite. Plain previous and next buttons replace the old tiny dots.
 */
function ExampleViewer({
  heading,
  giraffeLabel,
  jackalLabel,
  examples,
}: {
  heading: string
  giraffeLabel: string
  jackalLabel: string
  examples: ReadonlyArray<Example>
}) {
  const t = useT()
  const [index, setIndex] = useState(0)
  const example = examples[index]
  const count = examples.length

  return (
    <section aria-labelledby="examples-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
        <h2 id="examples-heading" className="text-xl font-bold text-brown-800">
          {heading}
        </h2>
        {count > 1 && (
          <p className="text-sm text-brown-600 tabular-nums" aria-live="polite">
            {t.learn.page.examples.counter(index + 1, count)}
          </p>
        )}
      </div>

      <p className="text-brown-700 italic max-w-prose text-pretty mb-5">
        {example.scenario}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <figure className="rounded-lg border-2 border-brown-100 bg-brown-50 p-5">
          <figcaption className="flex items-center gap-3 mb-3">
            <img
              src="/jakyll.webp"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 rounded-full object-cover object-top bg-brown-100"
            />
            <span className="text-sm font-semibold text-brown-700">
              {jackalLabel}
            </span>
          </figcaption>
          <blockquote className="text-lg text-brown-700 text-pretty">
            {example.jackalResponse}
          </blockquote>
        </figure>
        <figure className="rounded-lg border-2 border-giraffe-300 bg-white p-5">
          <figcaption className="flex items-center gap-3 mb-3">
            <img
              src="/giraff.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 rounded-full object-cover object-top bg-giraffe-100"
            />
            <span className="text-sm font-semibold text-giraffe-800">
              {giraffeLabel}
            </span>
          </figcaption>
          <blockquote className="text-lg font-semibold text-brown-900 text-pretty">
            {example.giraffResponse}
          </blockquote>
        </figure>
      </div>

      <p className="mt-5 text-brown-700 max-w-prose text-pretty">
        <span className="font-semibold text-brown-800">
          {t.learn.page.examples.whyItMatters}
        </span>
        {example.explanation}
      </p>

      {count > 1 && (
        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="min-h-11"
          >
            {t.learn.page.examples.previous}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIndex((i) => i + 1)}
            disabled={index === count - 1}
            className="min-h-11"
          >
            {t.learn.page.examples.next}
          </Button>
        </div>
      )}
    </section>
  )
}
