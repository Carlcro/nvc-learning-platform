import { pluralFor } from '../../plural'
import type { Messages } from '..'
import type { NVCComponent } from '../../../lib/conversationInsights'

const plural = pluralFor('es')

/** "a", "a y b", "a, b y c", with "e" before an i- sound. */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  const last = items[items.length - 1]
  const and = /^h?i(?![aeou])/i.test(last) ? 'e' : 'y'
  return `${items.slice(0, -1).join(', ')} ${and} ${last}`
}

/** "Lección de observaciones" becomes "lección de observaciones" mid-sentence. */
function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

const skills: Messages['results']['skills'] = {
  observation: {
    label: 'Lección de observaciones',
    invite:
      'Separar lo que pasó de lo que pensamos sobre ello es una habilidad en sí misma.',
    plural: 'observaciones',
    nudge:
      'Describe lo que pasó tal como lo habría grabado una cámara, antes de decir qué piensas de ello.',
  },
  feeling: {
    label: 'Biblioteca de sentimientos',
    invite:
      'Encontrar la palabra exacta para un sentimiento es más fácil con un vocabulario más amplio.',
    plural: 'sentimientos',
    nudge:
      'Busca la palabra que nombra la emoción en sí: preocupación, dolor, cansancio, esperanza.',
  },
  need: {
    label: 'Lección de necesidades',
    invite:
      'Conectar los sentimientos con las necesidades universales que hay debajo requiere práctica.',
    plural: 'necesidades',
    nudge:
      'Pregúntate qué es importante para ti debajo del sentimiento: confianza, descanso, respeto, sentirte parte.',
  },
  request: {
    label: 'Lección de peticiones',
    invite: 'Vale la pena repasar cómo formular peticiones claras y realizables.',
    plural: 'peticiones',
    nudge:
      'Pide algo concreto a lo que puedan decir que sí o que no, y deja espacio para un no.',
  },
}

export const results: Messages['results'] = {
  skills,

  screen: {
    scoreLabel: {
      excellent: 'Excelente',
      good: 'Bien',
      gettingThere: 'Vas por buen camino',
      keepPracticing: 'Sigue practicando',
    },
    comparison: {
      firstRun:
        'Tu primera vez completando este escenario. Ahora tienes algo sobre lo que construir.',
      newBest: (previousBest: number) =>
        `Subiste desde ${previousBest} la última vez. Es tu nuevo récord aquí.`,
      levelWithBest: (previousBest: number) =>
        `Igualaste tu récord de ${previousBest}. Mantenerse también es una habilidad.`,
      belowBest: (previousBest: number) =>
        `Tu récord aquí sigue siendo ${previousBest}. Cada intento enseña algo distinto.`,
    },

    ending: {
      connected: {
        headline: 'Mira todo lo que avanzaste',
        label: (name: string) => `Conectaste con ${name}`,
        sub: 'Te expresaste y te escucharon.',
      },
      listening: {
        headline: 'Un paso real hacia delante',
        label: (name: string) => `${name} empezaba a escucharte`,
        sub: (didManage: string, nextPiece: string) =>
          `Todavía sin abrirse del todo. ${didManage} ${nextPiece}`,
      },
      guarded: {
        headline: 'Fue una conversación difícil, y la sostuviste',
        label: (name: string) => `${name} seguía a la defensiva al final`,
        sub: (didManage: string, nextPiece: string) =>
          `Eso también pasa en las conversaciones reales. ${didManage} ${nextPiece}`,
      },
      managed: {
        observation: 'una observación clara',
        feeling: 'un sentimiento',
        need: 'una necesidad',
        request: 'una petición',
      } satisfies Record<NVCComponent, string>,
      didManage: (pieces: Array<string>) =>
        `Aportaste ${andList(pieces)}, y eso es lo difícil.`,
      didManageNothing:
        'Te quedaste en una conversación difícil, y ahí es donde empieza todo.',
      nextPiece: {
        observation:
          'Describir lo que pasó, sin juzgarlo, es la pieza que puedes probar la próxima vez.',
        feeling: 'Nombrar un sentimiento es la pieza que puedes probar la próxima vez.',
        need: 'La necesidad que hay debajo del sentimiento es la pieza que puedes probar la próxima vez.',
        request: 'Una petición clara es la pieza que puedes probar la próxima vez.',
      } satisfies Record<NVCComponent, string>,
      nextPieceEmpathy: (name: string) =>
        `Preguntarte en voz alta qué estaba sintiendo ${name} es la pieza que puedes probar la próxima vez.`,
      nextPieceTime: 'Quizá solo hacía falta un poco más de tiempo.',
    },

    stations: {
      opened: 'Abriste la conversación',
      observation: 'Describiste lo que pasó',
      feeling: 'Nombraste lo que sentías',
      need: 'Descubriste la necesidad de fondo',
      request: 'Hiciste una petición clara',
      notYet: ' (todavía no)',
    },

    starsAria: (stars: number) => `${stars} de 3 estrellas`,
    scoreLine: {
      empathy: 'Empatía',
      afterScore: (label: string, messages: number) =>
        `· ${label} · ${plural(messages, { one: `${messages} mensaje`, other: `${messages} mensajes` })}`,
    },

    earned: {
      points: (points: number) => `+${points}`,
      pointsLabel: 'puntos',
      levelLabel: 'nivel',
      newLevelLabel: 'nuevo nivel',
      streakLabel: (days: number) =>
        days === 1 ? 'día de racha' : 'días de racha',
      reachedLevel: (level: number) => `Llegaste al nivel ${level}. `,
      toNextLevel: (points: number, level: number) =>
        `${points} puntos para el nivel ${level}. `,
      noPoints:
        'Los puntos llegan con estrellas nuevas en un escenario, así que superar tu récord aquí es lo que suma más.',
      challengeBonus: (bonus: number) =>
        `Eso incluye ${bonus} por el reto de hoy.`,
      streakExtended: 'Hoy ya cuenta para tu racha.',
    },

    takeaway: {
      title: 'Lo que te llevas',
      bestMessage: 'Tu mensaje que mejor llegó',
      strongest: (skillPlural: string) =>
        `Lo más sólido fueron tus ${skillPlural}.`,
      strongestAfter: 'Es una habilidad en la que ya puedes apoyarte.',
      stillToTry: (skillPlural: string) => `Aún por probar: ${skillPlural}`,
      worthAttention: (skillPlural: string) =>
        `Merecen un poco de atención: tus ${skillPlural}`,
      openResource: (label: string) => `Abrir la ${lowerFirst(label)}`,
    },

    reflection: {
      title: 'Un mensaje, dicho de otra forma',
      youSaid: 'Dijiste',
      couldSound: 'También podría sonar así',
    },

    hiddenNeeds: {
      title: (name: string) => `Lo que ${name} necesitaba en el fondo`,
      reachedConnected: (name: string) =>
        `Te acercaste a esto durante la conversación. Eso es lo que ayudó a ${name} a abrirse.`,
      reachedNotConnected:
        'Te acercaste a esto durante la conversación. Sigue haciéndolo. Es lo que ayuda a la gente a abrirse, aunque lleve más de una conversación.',
      nextTime: (name: string) =>
        `La próxima vez, prueba a preguntarte en voz alta qué podría estar sintiendo o necesitando ${name}. Intentar adivinarlo es lo que ayuda a la gente a abrirse.`,
    },

    badges: (count: number) =>
      plural(count, { one: 'Nueva insignia', other: 'Nuevas insignias' }),

    encouragement:
      'Crecimiento, no perfección. Cada conversación como esta hace que las reales sean un poco más fáciles.',

    actions: {
      practiceAgain: 'Practicar de nuevo',
      practiceAgainFocus: (skillPlural: string) =>
        `Practicar de nuevo, con atención a tus ${skillPlural}`,
      nextUp: (title: string) => `Lo siguiente: ${title}`,
      backToScenarios: 'Volver a todos los escenarios',
      reviewTranscript: 'Revisarla turno a turno',
      tryAnother: 'Probar otro',
    },
  },

  transcript: {
    meta: {
      title: 'Transcripción de la conversación',
      description: 'Repasa cómo fue la conversación, turno a turno.',
    },
    loading: 'Buscando tu conversación…',
    notFound: {
      title: 'No encontramos esta conversación',
      body: 'Puede que se haya eliminado, o que el enlace ya no sea válido.',
    },
    backToPractice: 'Volver a Práctica',
    backToResults: 'Volver a los resultados',
    copied: '¡Copiada!',
    copy: 'Copiar transcripción',
    title: 'Transcripción de la conversación',
    finalScore: 'Puntuación final',
    scoreOutOf: (score: number) => `${score}/100`,
    mood: {
      title: 'Evolución del ánimo',
      startPoint: 'Inicio',
      response: (n: number) => `Respuesta ${n}`,
      start: 'Inicio de la conversación',
      end: 'Final de la conversación',
    },
    stats: {
      finalScore: 'Puntuación final',
      yourMessages: 'Tus mensajes',
      ofTotal: (total: number) => ` de ${total}`,
      freeOfBlame: 'Sin culpa',
      bestTurn: 'Mejor turno',
      averagesTitle: 'Media por pieza',
      averagesHint:
        'Sobre 25, en los mensajes donde usaste cada una. Un punto significa que no formó parte de esta conversación.',
    },
    fullConversation: 'Conversación completa',
    export: {
      heading: 'TRANSCRIPCIÓN DE LA CONVERSACIÓN',
      underline: '================================',
      scenario: (title: string) => `Escenario: ${title}`,
      finalScore: (score: number) => `Puntuación final: ${score}/100`,
      date: (date: string) => `Fecha: ${date}`,
      you: 'Tú',
      score: (total: number) => ` [Puntuación: ${total}/100]`,
    },
  },
}
