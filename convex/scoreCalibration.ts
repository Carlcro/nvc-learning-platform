'use node'

import { internalAction } from './_generated/server'
import { internal } from './_generated/api'
import { analyzeMessage, generateCharacterReply } from './ai'
import { LOCALES } from './lib/locale'
import { localizeScenario } from './lib/scenarioText'
import { BEGINNER_SCENARIOS } from './scenarios'
import type { Locale } from './lib/locale'
import type { ModelCallRecord } from './lib/modelUsage'

/**
 * Score the same messages in every language, so a change to the prompts can
 * be checked for one thing above all: a French or Swedish learner must earn
 * the same stars for the same message as an English one.
 *
 * Command line only, and it calls the model about twenty times:
 *   npx convex run scoreCalibration:run
 */

type Case = 'blame' | 'pseudoFeeling' | 'feelingAndNeed' | 'request'

const ARC: Record<Case, Parameters<typeof analyzeMessage>[0]['arcSoFar']> = {
  blame: arc(false, false, false),
  pseudoFeeling: arc(false, false, false),
  feelingAndNeed: arc(true, false, false),
  request: arc(true, true, true),
}

function arc(observation: boolean, feeling: boolean, need: boolean) {
  return {
    observationMade: observation,
    feelingExpressed: feeling,
    needIdentified: need,
    requestMade: false,
  }
}

/** One message, said the same way in each language. */
const SAMPLES: Record<Locale, Record<Case, string>> = {
  en: {
    blame:
      "You humiliated me in front of everyone. You always do this and you don't care how anyone feels.",
    pseudoFeeling: "I feel like you don't respect my work.",
    feelingAndNeed:
      'I felt embarrassed, because being treated with respect in front of the team matters a lot to me.',
    request:
      'Would you be willing to bring feedback like that to me one on one first?',
  },
  fr: {
    blame:
      "Tu m'as humilié devant tout le monde. Tu fais toujours ça et tu te fiches de ce que ressentent les autres.",
    pseudoFeeling: "J'ai l'impression que tu ne respectes pas mon travail.",
    feelingAndNeed:
      "J'ai ressenti de la gêne, parce que c'est important pour moi d'être traité avec respect devant l'équipe.",
    request:
      "Est-ce que tu serais d'accord pour me faire ce genre de retour en tête-à-tête d'abord ?",
  },
  es: {
    blame:
      'Me humillaste delante de todos. Siempre haces lo mismo y te da igual cómo se sientan los demás.',
    pseudoFeeling: 'Siento que no respetas mi trabajo.',
    feelingAndNeed:
      'Sentí vergüenza, porque para mí es muy importante que me traten con respeto delante del equipo.',
    request:
      '¿Estarías dispuesto a darme ese tipo de comentarios primero en privado?',
  },
  sv: {
    blame:
      'Du förödmjukade mig inför alla. Du gör alltid så och du bryr dig inte om hur andra mår.',
    pseudoFeeling: 'Jag känner att du inte respekterar mitt arbete.',
    feelingAndNeed:
      'Jag kände mig generad, eftersom det är viktigt för mig att bli behandlad med respekt inför gruppen.',
    request:
      'Skulle du vilja ta sådan feedback med mig på tu man hand först?',
  },
}

const CASES: Array<Case> = ['blame', 'pseudoFeeling', 'feelingAndNeed', 'request']

export const run = internalAction({
  args: {},
  handler: async (ctx) => {
    const calls: Array<ModelCallRecord> = []
    const onUsage = (call: ModelCallRecord) => calls.push(call)

    const scenarioFor = (locale: Locale) =>
      localizeScenario({ ...BEGINNER_SCENARIOS[0], orderIndex: 0 }, locale)

    const scoring = LOCALES.flatMap((locale) =>
      CASES.map(async (sample) => {
        const scenario = scenarioFor(locale)
        const analysis = await analyzeMessage({
          userMessage: SAMPLES[locale][sample],
          history: [{ role: 'assistant', content: scenario.aiOpeningMessage }],
          userLevel: 1,
          arcSoFar: ARC[sample],
          scenario,
          locale,
          onUsage,
        })
        return {
          locale,
          sample,
          total: analysis.total,
          components: [
            analysis.observation,
            analysis.feeling,
            analysis.need,
            analysis.request,
          ].join('/'),
          jackal: analysis.isJackalLanguage,
          feedback: analysis.feedback,
        }
      }),
    )

    // Someone writing English inside a French conversation should be invited
    // back to French, not marked down for it.
    const switched = (async () => {
      const scenario = scenarioFor('fr')
      const analysis = await analyzeMessage({
        userMessage: SAMPLES.en.feelingAndNeed,
        history: [{ role: 'assistant', content: scenario.aiOpeningMessage }],
        userLevel: 1,
        arcSoFar: ARC.feelingAndNeed,
        scenario,
        locale: 'fr',
        onUsage,
      })
      return {
        total: analysis.total,
        inLanguage: analysis.writtenInConversationLanguage,
        feedback: analysis.feedback,
      }
    })()

    const replies = LOCALES.map(async (locale) => {
      const scenario = scenarioFor(locale)
      const reply = await generateCharacterReply({
        userMessage: SAMPLES[locale].feelingAndNeed,
        history: [{ role: 'assistant', content: scenario.aiOpeningMessage }],
        userLevel: 1,
        arcSoFar: ARC.feelingAndNeed,
        scenario,
        locale,
        currentMood: scenario.characterInitialMood,
        onUsage,
      })
      return { locale, character: scenario.characterName, reply }
    })

    const results = {
      scores: await Promise.all(scoring),
      englishInFrench: await switched,
      replies: await Promise.all(replies),
    }

    try {
      await ctx.runMutation(internal.usage.recordModelCalls, { calls })
    } catch (error) {
      console.error('Failed to record model usage:', error)
    }

    return results
  },
})
