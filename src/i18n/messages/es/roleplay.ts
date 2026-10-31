import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('es')

/** The other person, when the character's name is missing. */
const OTHER = 'la otra persona'

function upperFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const roleplay: Messages['roleplay'] = {
  meta: {
    title: 'Conversación',
    description:
      'Practica la comunicación compasiva mensaje a mensaje, con comentarios sobre la marcha.',
  },

  milestones: {
    start: 'Inicio',
    observe: 'Observar',
    feeling: 'Sentimiento',
    need: 'Necesidad',
    request: 'Petición',
    done: 'Fin',
  },

  scoreMessages: {
    keepGoing: 'Sigue adelante',
    gettingThere: 'Vas por buen camino',
    landingWell: 'Está llegando bien',
    beautifullySaid: 'Muy bien dicho',
  },

  errors: {
    sendFailed:
      'Algo falló al enviar tu mensaje. Tus palabras siguen abajo, vuelve a intentarlo.',
    completeFailed:
      'No pudimos guardar tus resultados. Vuelve a intentarlo, por favor.',
    startFailed:
      'No pudimos empezar una conversación nueva. Vuelve a intentarlo, por favor.',
    rewindFailed: 'No pudimos retroceder. Vuelve a intentarlo, por favor.',
  },

  celebrations: {
    characterFallback: 'La otra persona',
    observationMade: {
      title: 'Observación clara',
      message: (_name: string) => 'Describiste lo que pasó sin juzgarlo.',
    },
    feelingExpressed: {
      title: 'Sentimiento nombrado',
      message: (_name: string) => 'Pusiste palabras sinceras a una emoción.',
    },
    needIdentified: {
      title: 'Necesidad descubierta',
      message: (_name: string) =>
        'Conectaste tu sentimiento con lo que te importa.',
    },
    requestMade: {
      title: 'Petición clara',
      message: (_name: string) => 'Pediste algo concreto y factible.',
    },
    empathyShown: {
      title: 'Escuchaste de verdad',
      message: (name: string) =>
        `Conectaste con lo que ${name} podría estar sintiendo.`,
    },
    resolutionReached: {
      title: 'Un gran paso',
      message: (name: string) => `${name} siente que de verdad se le escucha.`,
    },
  },

  page: {
    loadingScene: 'Preparando la escena para tu conversación…',
    loadingDefault: 'Preparando todo para ti…',
    notFound: {
      title: 'No encontramos esta conversación',
      body: 'Puede que se haya eliminado o que el enlace ya no sea válido.',
      back: 'Volver a practicar',
    },
    dismissError: 'Cerrar',
    archive: {
      title: 'Conversación completada',
      body: 'Esta conversación ya terminó. Puedes revisarla, pero no hacer cambios.',
    },
    viewScenario: 'Ver escenario',
    practicingWith: { before: 'Practicando con ', after: '' },
    wrapUpArc: 'Terminar y ver cómo fue',
    wrapUpEarly: 'Terminar aquí y ver cómo fue',
    turnLimitReached:
      'Esta conversación llega hasta aquí. Termínala arriba para ver cómo fue, y siempre puedes volver a empezarla.',
    turnsRemaining: (n: number) =>
      plural(n, {
        one: 'Queda un mensaje en esta conversación.',
        other: `Quedan ${n} mensajes en esta conversación.`,
      }),
    mobile: {
      openFeedback: 'Ver todos los comentarios',
      tryNext: (text: string) => `Prueba ahora: ${text}`,
      firstMessageTips: 'Ideas para tu primer mensaje',
      liveFeedback: 'Comentarios en directo',
      closeFeedback: 'Cerrar el panel de comentarios',
    },
    continueConversation: 'Continuar la conversación',
    context: {
      title: 'Contexto del escenario',
      close: 'Cerrar el contexto del escenario',
      situation: 'Situación',
      whatYoullPractice: 'Lo que vas a practicar:',
      tipLabel: 'Consejo:',
      tipBody:
        ' Una conversación real se despliega pieza a pieza. Una observación en un mensaje, un sentimiento en el siguiente, una petición más adelante. No hace falta meter las cuatro en cada mensaje.',
    },
  },

  conversation: {
    you: 'Tú',
    moodShift: {
      openedUp: (name: string) => `${name} se abrió`,
      softened: (name: string) => `${name} se ablandó un poco`,
      moreGuarded: (name: string) => `${name} se cerró un poco más`,
      pulledBack: (name: string) => `${name} tomó algo de distancia`,
    },
    jackalMarkTitle: 'Esto podría sonar a juicio o reproche',
    jackalNote: 'Las palabras subrayadas podrían sonar a juicio o reproche.',
  },

  input: {
    placeholder: '¿Qué es lo siguiente, sincero, que quieres decir?',
    ariaLabel: 'Tu mensaje',
    emptyError: 'Escribe un mensaje, por favor',
    tooLongError: (max: number) =>
      `Mensaje demasiado largo (máximo ${max} caracteres)`,
    sendFailed: 'No se pudo enviar el mensaje. Vuelve a intentarlo.',
    send: 'Enviar respuesta',
    hint: 'Con una pieza cada vez basta. Di lo siguiente que sea verdad para ti.',
  },

  rewind: {
    button: 'Retroceder',
    title: '¿Retroceder el último mensaje?',
    body: '¿Te has atascado? Esto retira tu último mensaje y la respuesta que recibió, y devuelve tus palabras al cuadro para que puedas darles otra forma y probar otro enfoque.',
    remaining: 'Retrocesos disponibles:',
    note: 'Un mensaje retirado sale de la conversación, así que no formará parte de tu reflexión final.',
    cancel: 'Cancelar',
    confirm: 'Retroceder',
    rewinding: 'Retrocediendo...',
  },

  startOver: {
    button: 'Volver a empezar',
    title: '¿Empezar esta conversación de nuevo?',
    body: 'Todo lo dicho hasta ahora quedará a un lado y el escenario empezará otra vez desde la primera frase. No se puede deshacer.',
    canWrapUp:
      'Si prefieres conservar lo que has practicado, puedes terminar y ver cómo fue.',
    suggestRewind:
      'Si solo tu último mensaje no te convence, retroceder retira solo ese.',
    keepGoing: 'Seguir',
    confirm: 'Volver a empezar',
    starting: 'Volviendo a empezar…',
  },

  feedback: {
    srHeading: 'Comentarios',
    mood: {
      open: 'Con apertura',
      warming: 'Acercándose',
      neutral: 'Neutral',
      guarded: 'Con reservas',
      defensive: 'A la defensiva',
    },
    howFeels: (name: string | undefined) => ({
      before: 'Cómo se siente ',
      name: name || OTHER,
      after: '',
    }),
    moodAria: (name: string | undefined, label: string, opened: boolean) => {
      const who = name || OTHER
      return `Cómo se siente ${who}: ${label}${opened ? `. ${upperFirst(who)} se ha abierto.` : ''}`
    },
    starHint: (name: string | undefined) =>
      `La estrella se enciende cuando ${name || OTHER} se abre. Las personas se abren cuando se sienten escuchadas.`,
    howLanded: 'Cómo llegó este mensaje',
    arcTitle: 'Tu recorrido',
    arcReached: (reached: number, total: number) =>
      `${reached} de ${total} alcanzadas`,
    pieceStatus: {
      reached: 'alcanzada',
      next: 'la siguiente',
      notYet: 'todavía no',
    },
    pieceAria: (label: string, status: string, value: number) =>
      `${label}: ${status}${value > 0 ? `, ${value} de 25 en este mensaje` : ''}`,
    pieceValueTitle: (value: number) => `Este mensaje: ${value} de 25`,
    empathyEarned: (name: string | undefined) =>
      `Escuchaste de verdad. Te pusiste en el lugar de ${name || OTHER}.`,
    empathyInvite: (name: string | undefined) =>
      `¿Te preguntas qué podría estar sintiendo ${name || OTHER}? Preguntarlo también cuenta.`,
    skillHintLink: (label: string) =>
      `Abre la ${label.charAt(0).toLowerCase()}${label.slice(1)}`,
    skillHintAfter: ' en otra pestaña. Esta conversación te esperará.',
    tryAgain: 'Intentarlo de nuevo',
    wordsComeBack: 'Tus palabras vuelven al cuadro.',
    rewindsLeft: (n: number) =>
      plural(n, {
        one: 'Te queda un retroceso.',
        other: `Te quedan ${n} retrocesos.`,
      }),
    tryNext: 'Prueba ahora',
    defaultNextStep:
      'Prueba a nombrar un sentimiento y la necesidad que hay debajo.',
    statusLine: (message: string, total: number, feedback: string) =>
      `${message}. Tu mensaje obtuvo ${total} de 100. ${feedback}`,
    reading: 'Leyendo tu mensaje…',
    firstTurn: {
      intro:
        'Tómate tu tiempo. Después de cada mensaje te contaré cómo llegó y te sugeriré un siguiente paso.',
      focus: (components: string) => `Tu enfoque esta vez: ${components}`,
      openingTitle: 'Un buen comienzo',
      openingBody:
        'Describe lo que pasó, solo los hechos, sin emitir todavía un veredicto. Con una pieza basta. Los sentimientos, las necesidades y la petición pueden tener cada uno su propio mensaje.',
      practices: 'Lo que practica esta conversación',
    },
  },

  annotated: {
    you: 'Tú',
    mood: {
      openWarm: 'Con apertura y calidez',
      warmingUp: 'Acercándose',
      neutral: 'Neutral',
      guarded: 'Con reservas',
      defensive: 'A la defensiva',
    },
    breakdown: 'Desglose de la puntuación CNV',
    notThisTurnAria: (label: string) =>
      `${label}: no forma parte de este mensaje`,
    notThisTurn: '· no en este turno',
    whatWentWell: 'Lo que salió bien',
    nextStepSuggested: 'El siguiente paso sugerido',
    phrasesToReconsider: 'Frases para repensar',
    quoted: (text: string) => `«${text}»`,
    couldAlsoSound: 'También podría sonar así',
    characterMood: 'Estado de ánimo del personaje:',
  },

  empathyMeter: {
    title: 'Medidor de empatía',
    label: {
      excellent: 'Excelente',
      good: 'Bien',
      partial: 'A medias',
      needsPractice: 'Para practicar',
    },
    description: {
      excellent: 'Lenguaje jirafa puro',
      good: 'Pequeñas mejoras',
      partial: 'Mezcla de jirafa y chacal',
      needsPractice: 'Sobre todo lenguaje chacal',
    },
  },
}
