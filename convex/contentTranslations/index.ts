import { lessonsEs } from './lessons.es'
import { lessonsFr } from './lessons.fr'
import { lessonsSv } from './lessons.sv'
import { feelingsEs } from './feelings.es'
import { feelingsFr } from './feelings.fr'
import { feelingsSv } from './feelings.sv'
import type { Locale } from '../lib/locale'
import type {
  FeelingsTranslation,
  LessonTranslationTable,
} from '../lib/contentText'

/**
 * Lessons and the feelings library in each language other than English, which
 * stays in convex/lessons.ts and convex/feelings/seed.ts. Tests check that
 * every lesson, feeling and quiz sentence is covered with the same shape.
 */
export const LESSON_TRANSLATIONS: Record<
  Exclude<Locale, 'en'>,
  Partial<LessonTranslationTable>
> = { fr: lessonsFr, es: lessonsEs, sv: lessonsSv }

export const FEELINGS_TRANSLATIONS: Record<
  Exclude<Locale, 'en'>,
  FeelingsTranslation
> = { fr: feelingsFr, es: feelingsEs, sv: feelingsSv }
