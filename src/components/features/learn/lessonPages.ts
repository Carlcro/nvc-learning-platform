import type { Messages } from '~/i18n/messages'

/**
 * The structure of the six lessons: their order and illustrations. The lesson
 * text, examples and quiz live in convex/lessons.ts (the server grades the
 * quiz from there), and the copy that frames them on the page lives in the
 * `learn.lessons` dictionary, so one LessonPage renders all six.
 */

export type LessonId =
  | 'introduction'
  | 'observation'
  | 'feeling'
  | 'need'
  | 'request'
  | 'integration'

export const LESSON_ORDER: ReadonlyArray<LessonId> = [
  'introduction',
  'observation',
  'feeling',
  'need',
  'request',
  'integration',
]

/**
 * The words that frame one lesson page (short name, heading, aside, points,
 * example labels, takeaways). They live in the `learn.lessons` dictionary so
 * they can be translated; read them with `t.learn.lessons[lessonId]`.
 */
export type LessonPageCopy = Messages['learn']['lessons'][LessonId]

/** The illustration for each lesson, on its page and in the lessons hub. */
export const LESSON_IMAGES: Record<LessonId, string> = {
  introduction: '/lesson1.webp',
  observation: '/lesson2.webp',
  feeling: '/lesson3.webp',
  need: '/lesson4.webp',
  request: '/lesson5.webp',
  integration: '/lesson6.webp',
}

export function lessonNumber(id: LessonId): number {
  return LESSON_ORDER.indexOf(id) + 1
}

export function nextLessonId(id: LessonId): LessonId | null {
  const index = LESSON_ORDER.indexOf(id)
  return index < LESSON_ORDER.length - 1 ? LESSON_ORDER[index + 1] : null
}

export function previousLessonId(id: LessonId): LessonId | null {
  const index = LESSON_ORDER.indexOf(id)
  return index > 0 ? LESSON_ORDER[index - 1] : null
}
