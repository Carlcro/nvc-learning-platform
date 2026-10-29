import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import type { LessonId } from '~/components/features/learn/lessonPages'
import { pageMeta } from '~/lib/seo'
import { useLessonProgress } from '~/hooks/useLessonProgress'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { CheckIcon } from '~/components/ui/Icons'
import { LESSON_PAGES } from '~/components/features/learn/lessonPages'

export const Route = createFileRoute('/learn/')({
  head: () => ({
    meta: pageMeta({
      title: 'Lessons',
      description:
        'Six foundational lessons on observations, feelings, needs and requests.',
    }),
  }),
  // Open to signed-out visitors, like the lesson pages themselves. Progress
  // falls back to this browser until they sign in, at which point it syncs.
  component: LearnHub,
  pendingComponent: () => <GiraffeLoader message="Gathering your lessons..." />,
})

function LearnHub() {
  const { data: lessons } = useSuspenseQuery(
    convexQuery(api.lessons.getAllLessons, {}),
  )
  const { isLessonCompleted } = useLessonProgress()

  const completedCount = lessons.filter((l) =>
    isLessonCompleted(l.lessonId),
  ).length
  // The first lesson not yet completed is "up next". With all six done there
  // is no next one, and nothing is marked.
  const upNextId =
    lessons.find((l) => !isLessonCompleted(l.lessonId))?.lessonId ?? null
  const totalMinutes = lessons.reduce((sum, l) => sum + l.estimatedDuration, 0)

  return (
    <main className="min-h-screen bg-paper">
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight">
            Six short lessons, one skill.
          </h1>
          <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
            Each lesson takes one piece of Non-Violent Communication, shows it
            in a few real examples, and ends with a short check. Together they
            take about {totalMinutes} minutes, and you can stop anywhere.
          </p>
          <p className="mt-5 text-sm font-semibold text-brown-800">
            {completedCount === lessons.length
              ? 'You have finished all six. Revisit any of them whenever you like.'
              : `${completedCount} of ${lessons.length} finished`}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <ol className="max-w-3xl mx-auto space-y-4">
          {lessons.map((lesson) => {
            const id = lesson.lessonId as LessonId
            const page = LESSON_PAGES[id]
            const done = isLessonCompleted(id)
            const upNext = id === upNextId
            return (
              <li key={id}>
                <Link
                  to={`/learn/${id}`}
                  className={`group flex items-center gap-4 sm:gap-6 rounded-lg border-2 bg-white p-4 sm:p-5 transition-colors duration-200 hover:border-giraffe-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-2 ${
                    upNext ? 'border-giraffe-400' : 'border-giraffe-100'
                  }`}
                >
                  <img
                    src={page.image}
                    alt=""
                    aria-hidden="true"
                    className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-lg object-contain bg-giraffe-50"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-brown-600">
                      Lesson {lesson.order}, {lesson.estimatedDuration} min
                      {upNext && (
                        <span className="font-semibold text-giraffe-800">
                          , up next
                        </span>
                      )}
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-brown-800 text-balance">
                      {lesson.title}
                    </h2>
                    <p
                      className="mt-1 text-sm text-brown-700 text-pretty line-clamp-2"
                    >
                      {lesson.description}
                    </p>
                  </div>
                  <span className="hidden sm:flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brown-800">
                    {done ? (
                      <>
                        <CheckIcon className="h-4 w-4 text-empathy-high" />
                        Done
                      </>
                    ) : (
                      <>
                        {upNext ? 'Start' : 'Open'}
                        <span
                          aria-hidden="true"
                          className="text-giraffe-700 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                        >
                          &rarr;
                        </span>
                      </>
                    )}
                  </span>
                  {done && (
                    <span className="sm:hidden shrink-0" aria-label="Done">
                      <CheckIcon className="h-5 w-5 text-empathy-high" />
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
