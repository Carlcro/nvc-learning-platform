import { LOCALE_ENGLISH_NAMES } from './locale'
import type { Locale } from './locale'

/**
 * What the model needs to know to coach and roleplay well in each language.
 *
 * The prompts themselves stay in English (the model follows them best that
 * way); these notes tell it which language to write in and point out the
 * language's own versions of the traps the coaching looks for, so a French
 * pseudo-feeling is caught as surely as an English one.
 */
interface LanguageGuide {
  /** "French", for "write in French". */
  name: string
  /** How this language disguises a thought or judgment as a feeling. */
  pseudoFeelings: string
  /** How this language puts a feeling on the other person. */
  blameFeelings: string
  /** How the coaching addresses the learner. */
  learnerAddress: string
  /** How the character addresses the learner. */
  characterAddress: string
  /** Punctuation and style notes beyond the shared no-dash rule. */
  style: string
  /** The words the app uses for the four components, so coaching matches it. */
  terms: string
}

const GUIDES: Record<Locale, LanguageGuide> = {
  en: {
    name: 'English',
    pseudoFeelings: '"I feel that...", "I feel like..."',
    blameFeelings: '"you make me feel"',
    learnerAddress: 'Speak to the learner as "you".',
    characterAddress: 'Use contractions and casual speech.',
    style: '',
    terms: 'observation, feeling, need, request (as against a demand)',
  },
  fr: {
    name: 'French',
    pseudoFeelings:
      '"j\'ai l\'impression que...", "je sens que...", "je trouve que...", "je me sens comme si..."',
    blameFeelings: '"tu me fais sentir", "tu me rends (triste, folle...)"',
    learnerAddress:
      'Address the learner as "tu", warmly. You do not know their gender: phrase things so no adjective or participle has to agree with them (for example "tu as ressenti de la gêne", not "tu t\'es senti gêné").',
    characterAddress:
      'Use "tu" or "vous" the way this relationship naturally would in France (tu between family, friends, partners and most colleagues). Speak the way people really talk, including everyday contractions where natural. You do not know the user\'s gender: avoid adjectives and participles that would have to agree with them.',
    style:
      'Never use dialogue dashes (tirets). Follow normal French punctuation.',
    terms:
      'observation, sentiment, besoin, demande (as against an exigence)',
  },
  es: {
    name: 'Spanish',
    pseudoFeelings:
      '"siento que...", "me siento como si...", "tengo la sensación de que..."',
    blameFeelings: '"me haces sentir", "me pones (triste, nervioso...)"',
    learnerAddress:
      'Address the learner as "tú", warmly. You do not know their gender: phrase things so no adjective or participle has to agree with them (for example "sentiste vergüenza", not "te sentiste avergonzado").',
    characterAddress:
      'Use "tú" unless "usted" is clearly what this relationship would use. Speak the way people really talk. You do not know the user\'s gender: avoid adjectives and participles that would have to agree with them.',
    style:
      'Write neutral Spanish that reads naturally in Spain and Latin America, without vosotros or strongly regional slang. Use the opening marks ¿ and ¡. Never use dialogue dashes (raya).',
    terms:
      'observación, sentimiento, necesidad, petición (as against an exigencia)',
  },
  sv: {
    name: 'Swedish',
    pseudoFeelings:
      '"jag känner att...", "det känns som att...", "jag känner mig som om..."',
    blameFeelings: '"du får mig att känna", "du gör mig (ledsen, arg...)"',
    learnerAddress: 'Address the learner as "du", warmly.',
    characterAddress:
      'Use "du", as everyone does in Sweden. Speak relaxed, everyday Swedish the way people really talk, without anglicisms.',
    style: 'Never use tankstreck (dashes). Quote with ”like this”.',
    terms: 'observation, känsla, behov, önskemål (as against a krav)',
  },
}

export function languageName(locale: Locale): string {
  return LOCALE_ENGLISH_NAMES[locale]
}

/**
 * The shared rule for every text the model writes for people: which language,
 * and the house style (no markdown, no dashes).
 */
export function writingRules(locale: Locale): string {
  const guide = GUIDES[locale]
  return [
    `Write every text field in plain, warm, spoken ${guide.name}.`,
    'Do NOT use markdown, asterisks, bold, headings, or bullet characters.',
    'Never use em dashes or en dashes; use a comma or a period instead.',
    guide.style,
  ]
    .filter(Boolean)
    .join(' ')
}

/** Language notes for the NVC coach: what to watch for in this language. */
export function coachLanguageNotes(locale: Locale): string {
  const guide = GUIDES[locale]
  const other =
    locale === 'en'
      ? ''
      : `\nThe four components work the same way in ${guide.name}. Judge the message in ${guide.name}, as a fluent speaker would.`
  return `### Language
This conversation is held in ${guide.name}.${other}
- Pseudo-feelings in ${guide.name} include ${guide.pseudoFeelings}: these introduce a thought or a judgment, not a feeling.
- Blame phrasing in ${guide.name} includes ${guide.blameFeelings}.
- ${guide.learnerAddress}
- When the feedback names a component, use the app's words for them: ${guide.terms}.
- writtenInConversationLanguage: true unless the message is mostly written in a language other than ${guide.name}. A message in another language is scored on its NVC merits exactly as if it were in ${guide.name}: never lower a score for the language it is written in.`
}

/** Language notes for the roleplay character. */
export function characterLanguageNotes(locale: Locale): string {
  const guide = GUIDES[locale]
  return `LANGUAGE:
- Always reply in natural, everyday spoken ${guide.name}, even if the user writes in another language. Do not comment on the language they use.
- ${guide.characterAddress}${guide.style ? `\n- ${guide.style}` : ''}`
}

/** Language notes for scenario writing (custom scenarios). */
export function scenarioLanguageNotes(locale: Locale): string {
  const guide = GUIDES[locale]
  return `- Write every text field in ${guide.name}, whatever language the person used to describe their situation. If they named the other person, keep that name; otherwise choose a first name that is natural for a ${guide.name} speaker.
- In "description" and "situation", ${guide.learnerAddress.replace('Address', 'address')} In "aiOpeningMessage": ${guide.characterAddress}${guide.style ? `\n- ${guide.style}` : ''}`
}

/**
 * Guidance for adapting a finished scenario into another language: an
 * adaptation that reads as if it were written there, not a literal rendering.
 */
export function adaptationNotes(locale: Locale): string {
  const guide = GUIDES[locale]
  return `Adapt the scenarios into ${guide.name}. Do not translate word for word: it should read as if first written in ${guide.name}.
- Give each character a first name that is common among ${guide.name} speakers for someone of that apparent age and role, and use it everywhere it appears (characterName, situation, background, quoted speech). Keep pronouns and agreement consistent across all fields.
- In "description" and "situation", ${guide.learnerAddress.replace('Address', 'address')} In "aiOpeningMessage": ${guide.characterAddress}
- characterHiddenNeeds are universal human needs; use the usual NVC vocabulary for needs in ${guide.name}.
- Keep "situation" free of judgment, describing only observable events, and keep its paragraph breaks.
- Never use emojis. Never use em dashes or en dashes. ${guide.style}`.trim()
}

/**
 * Shown instead of the usual coaching when someone writes in another language
 * than the conversation's. Fixed rather than generated, so it is always this
 * gentle and always in the conversation's language.
 */
export function languageNudge(locale: Locale, characterName: string): string {
  switch (locale) {
    case 'fr':
      return `Si tu peux, continue en français, pour que ${characterName} puisse bien te suivre.`
    case 'es':
      return `Si puedes, sigue en español, para que ${characterName} pueda seguirte bien.`
    case 'sv':
      return `Om du kan, fortsätt gärna på svenska, så att ${characterName} hänger med.`
    case 'en':
      return `If you can, keep going in English, so ${characterName} can follow you.`
  }
}
