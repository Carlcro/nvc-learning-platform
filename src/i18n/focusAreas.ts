import type { Locale } from '../../convex/lib/locale'

/**
 * Scenario focus areas are stored as codes ("boundary_setting"). These are the
 * codes the built-in library and the daily challenges use. A custom scenario
 * can carry any code, so one that is not here is only shown in English, where
 * the code itself reads as words.
 */
const FOCUS_AREAS: Record<Locale, Partial<Record<string, string>>> = {
  en: {},
  fr: {
    boundary_setting: 'poser une limite',
    conflict_resolution: 'résoudre un conflit',
    feedback_response: 'répondre à une critique',
    feedback_and_sensitivity: 'critique et sensibilité',
    appreciation: 'exprimer sa gratitude',
    apology: 'présenter des excuses',
    request_making: 'formuler une demande',
    empathy: 'empathie',
    emotional_intimacy: 'intimité émotionnelle',
    friendship_and_reliability: 'amitié et fiabilité',
    parental_independence: "autonomie face à ses parents",
    parenting_partnership: 'élever un enfant à deux',
    responsibility_and_fairness: 'responsabilité et équité',
    workplace_conflict: 'conflit au travail',
  },
  es: {
    boundary_setting: 'poner límites',
    conflict_resolution: 'resolver un conflicto',
    feedback_response: 'responder a una crítica',
    feedback_and_sensitivity: 'críticas y sensibilidad',
    appreciation: 'expresar gratitud',
    apology: 'pedir perdón',
    request_making: 'hacer peticiones',
    empathy: 'empatía',
    emotional_intimacy: 'intimidad emocional',
    friendship_and_reliability: 'amistad y confianza',
    parental_independence: 'autonomía frente a la familia',
    parenting_partnership: 'criar en equipo',
    responsibility_and_fairness: 'responsabilidad y equidad',
    workplace_conflict: 'conflicto en el trabajo',
  },
  sv: {
    boundary_setting: 'sätta gränser',
    conflict_resolution: 'lösa en konflikt',
    feedback_response: 'ta emot kritik',
    feedback_and_sensitivity: 'kritik och lyhördhet',
    appreciation: 'visa uppskattning',
    apology: 'be om ursäkt',
    request_making: 'uttrycka önskemål',
    empathy: 'empati',
    emotional_intimacy: 'känslomässig närhet',
    friendship_and_reliability: 'vänskap och pålitlighet',
    parental_independence: 'självständighet gentemot föräldrar',
    parenting_partnership: 'föräldraskap tillsammans',
    responsibility_and_fairness: 'ansvar och rättvisa',
    workplace_conflict: 'konflikt på jobbet',
  },
}

/** The focus area in words, or null when it has none in this language. */
export function focusAreaLabel(code: string, locale: Locale): string | null {
  if (locale === 'en') return code.replace(/_/g, ' ')
  return FOCUS_AREAS[locale][code] ?? null
}

/** A learning objective code ("feeling") as the component's name, if it is one. */
export function objectiveLabel(
  code: string,
  components: Record<'observation' | 'feeling' | 'need' | 'request', string>,
): string {
  return code in components
    ? components[code as keyof typeof components]
    : code
}
