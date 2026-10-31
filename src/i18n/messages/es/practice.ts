import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('es')

export const practice: Messages['practice'] = {
  meta: {
    hub: {
      title: 'Practicar',
      description:
        'Ensaya una conversación difícil con alguien que responde sin salirse de su papel.',
    },
    brief: {
      title: 'Presentación del escenario',
      description:
        'Lee la situación y conoce a la persona con quien vas a hablar.',
    },
    create: {
      title: 'Crea un escenario',
      description:
        'Convierte una situación real de tu vida en un escenario y ensáyala.',
    },
  },

  categories: {
    workplace: 'Trabajo',
    family: 'Familia',
    friendship: 'Amistad',
    self_expression: 'Expresión personal',
  },

  difficulties: {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  },

  tryAgainError: 'No se pudo completar. Respira hondo y vuelve a intentarlo.',
  readyWhenYouAre: 'Cuando quieras. Tómate tu tiempo.',
  starsLabel: (stars: number) => `${stars} de 3 estrellas`,
  aboutCharacter: (name: string) => `Sobre ${name}`,
  situation: 'Situación',
  personality: 'Personalidad',
  background: 'Contexto',
  whatYoullPractice: 'Lo que vas a practicar',

  hub: {
    title: '¿Con quién te gustaría practicar?',
    intro:
      'Todos los escenarios están abiertos. Elige a alguien cuya situación se parezca a la tuya, o empieza con la sugerencia de abajo.',
    levelNote: (level: number, pointsToNext?: number) =>
      pointsToNext !== undefined && pointsToNext > 0
        ? `Nivel ${level}, ${pointsToNext} puntos para el siguiente`
        : `Nivel ${level}`,
    suggestion: {
      waitingEyebrow: 'Retoma donde lo dejaste',
      waitingNote: (name: string) =>
        `Tu conversación con ${name} te está esperando.`,
      firstEyebrow: 'Un buen punto de partida',
      nextEyebrow: 'Sugerencia',
      continue: 'Continuar',
      tryAgain: 'Intentarlo de nuevo',
      start: 'Empezar',
    },
    rehearse: {
      title: 'Ensaya una conversación real',
      body: '¿Se acerca algo difícil? Conviértelo en un espacio de práctica y prueba con calma lo que quieres decir, antes del momento real.',
      action: 'Empezar a prepararlo',
    },
    yourScenarios: 'Tus propios escenarios',
    library: 'Biblioteca de escenarios',
    allCategories: 'Todos los temas',
    allDifficulties: 'Todos los niveles',
    filterByCategory: 'Filtrar escenarios por tema',
    filterByDifficulty: 'Filtrar escenarios por nivel',
    loading: 'Cargando escenarios',
    noMatches: 'Ningún escenario coincide con estos filtros.',
    clearFilters: 'Quitar filtros',
    empty:
      'Todavía no hay escenarios aquí. Igualmente puedes ensayar uno propio, más arriba.',
    onePiece: {
      title: 'Una pieza cada vez',
      body: 'Una conversación real se despliega poco a poco. Di lo que viste, luego cómo te sentiste, qué es importante para ti y qué te gustaría. Con una de estas piezas por mensaje basta, y las demás pueden esperar su turno.',
    },
    deleteDialog: {
      title: '¿Eliminar este escenario?',
      descriptionBefore: 'Se eliminarán para siempre ',
      descriptionAfter: ' y su historial de práctica.',
      keep: 'Conservarlo',
      delete: 'Eliminar',
      deleting: 'Eliminando…',
    },
  },

  card: {
    categoryAndDifficulty: (category: string, difficulty: string) =>
      `${category}, nivel ${difficulty.toLowerCase()}`,
    deleteLabel: (title: string) => `Eliminar ${title}`,
    deleteTitle: 'Eliminar',
    withCharacter: (name: string) => `con ${name}`,
    aboveLevel: (minLevel: number) =>
      `Se suele probar a partir del nivel ${minLevel}. Ya está abierto para ti si te apetece un reto.`,
    status: {
      in_progress: 'En curso',
      attempted: 'Probado una vez',
      completed: 'Completado',
    },
    suggestedNext: 'Sugerencia',
    viewBest: 'Ver tu mejor intento',
    actions: {
      continue: 'Continuar',
      improve: 'Mejorar',
      tryAgain: 'Repetir',
      start: 'Empezar',
    },
  },

  brief: {
    loading: 'Preparando la escena para tu conversación…',
    notFound: {
      title: 'No encontramos este escenario',
      body: 'Puede que se haya eliminado o que el enlace ya no sea válido.',
    },
    back: 'Volver a los escenarios',
    focus: 'Enfoque:',
    onePiece: {
      lead: 'Una pieza cada vez.',
      body: 'Una conversación real se despliega poco a poco: una observación en un mensaje, un sentimiento en el siguiente, una petición más adelante. Nunca hace falta meterlo todo en un solo mensaje.',
    },
    tipsTitle: 'Las cuatro piezas, como referencia',
    tips: {
      observation: 'Observación: describe lo que viste u oíste, sin juzgarlo.',
      feeling:
        'Sentimiento: nombra la emoción en sí, no un pensamiento ni un reproche.',
      need: 'Necesidad: di qué es importante para ti debajo de ese sentimiento.',
      request:
        'Petición: pide una sola cosa concreta y factible, y deja espacio para un no.',
    },
    stayCurious: (name: string) =>
      `Mantén también la curiosidad por la perspectiva y las necesidades de ${name}.`,
    best: (score: number) => `Tu mejor resultado: ${score}/100`,
    attempts: (n: number) =>
      plural(n, { one: `· ${n} intento`, other: `· ${n} intentos` }),
    waiting: (name: string, turns: number) =>
      plural(turns, {
        one: `Tu conversación con ${name} te espera, con un mensaje enviado.`,
        other: `Tu conversación con ${name} te espera, con ${turns} mensajes enviados.`,
      }),
    startFresh: 'Empezar de cero',
    starting: 'Empezando...',
    continue: 'Continuar tu conversación',
    start: 'Empezar la conversación',
  },

  create: {
    generateError:
      'No pudimos prepararlo en este momento. Respira hondo y vuelve a intentarlo.',
    loading: 'Preparando tu espacio de práctica…',
    themFallback: 'esa persona',
    guideAlt: 'Tu guía',
    progressLabel: 'Tu progreso',
    stages: ['La situación', 'La otra persona', 'Lo que esperas', 'Tu espacio'],
    bubble: {
      situation:
        'Empecemos por lo que tienes en mente. Comparte solo lo que quieras, y de forma sencilla.',
      person: (name: string) =>
        `Un poco sobre ${name}, para que hablar con esta persona se sienta real.`,
      you: 'Ahora la parte que va sobre ti y lo que esperas.',
      refine: (name: string) =>
        `Un par de cosas, para que esto se parezca de verdad a tu situación con ${name}.`,
      review: 'Aquí tienes tu espacio. Hazlo tuyo y ajusta lo que no encaje.',
    },
    backToPractice: 'Volver a practicar',
    backAStep: 'Un paso atrás',
    continue: 'Continuar',
    optional: '(opcional)',

    situationStep: {
      title: 'La situación',
      who: '¿Con quién es esta conversación?',
      whoHint: 'Un nombre o como prefieras llamar a esta persona',
      whoPlaceholder: 'p. ej., Sam',
      relationship: '¿Quién es para ti?',
      whatsGoingOn: 'En una o dos frases, ¿qué está pasando?',
      whatsGoingOnPlaceholder: '¿Qué situación quieres ensayar?',
      whatHappened: '¿Qué pasó, en concreto?',
      whatHappenedPlaceholder: 'Algo concreto que se dijo o se hizo',
      incompleteHint: 'Para continuar, añade con quién es y qué está pasando.',
    },

    personStep: {
      title: (name: string) => `Sobre ${name}`,
      reactions: '¿Cómo suele reaccionar cuando las cosas se ponen tensas?',
      chooseAny: 'Elige las que encajen',
      whatMatters:
        '¿Qué crees que es lo más importante para esta persona aquí?',
      whatMattersHint: 'Por ejemplo: el respeto, que la escuchen, la justicia',
      whatMattersPlaceholder: '¿Qué hay debajo de su reacción?',
      openness: '¿Cuánta apertura esperas al principio?',
      history: '¿Algo más sobre esta persona o sobre su historia en común?',
      historyPlaceholder: 'Solo si ayuda a imaginar la conversación',
    },

    youStep: {
      title: 'Lo que esperas',
      feelings: '¿Qué sientes con todo esto?',
      feelingsHint: 'Elige los que encajen, o ninguno',
      goodOutcome: '¿Qué sería para ti un buen resultado?',
      goodOutcomePlaceholder: 'Lo que te encantaría sentir u oír al final',
      practice: '¿Qué es lo que más quieres practicar?',
      chooseAny: 'Elige las que encajen',
      challenge: '¿Cuánto reto quieres que te ponga?',
      incompleteHint: 'Para continuar, cuenta cómo sería un buen resultado.',
    },

    relationships: {
      partner: 'Pareja',
      familyMember: 'Familiar',
      friend: 'Amistad',
      manager: 'Superior',
      coworker: 'Colega',
      roommate: 'Alguien con quien vivo',
      other: 'Otra relación',
    },
    reactions: {
      defensive: 'Se pone a la defensiva',
      shutsDown: 'Se cierra o se queda en silencio',
      louder: 'Levanta la voz',
      humor: 'Lo desvía con humor',
      calm: 'Mantiene la calma',
      apologizes: 'Se disculpa enseguida',
      past: 'Saca temas del pasado',
      notSure: 'Aún no lo sé',
    },
    openness: {
      guarded: 'Con muchas reservas',
      mixed: 'Con reservas, pero con disposición',
      open: 'Con bastante apertura',
    },
    // Written as nouns in lower case, so no word has to agree with the
    // reader's gender. Shown with a capital first letter.
    feelings: {
      frustrated: 'frustración',
      angry: 'enojo',
      irritated: 'irritación',
      upset: 'malestar',
      sad: 'tristeza',
      disappointed: 'decepción',
      lonely: 'soledad',
      discouraged: 'desánimo',
      anxious: 'ansiedad',
      worried: 'preocupación',
      overwhelmed: 'agobio',
      resentful: 'resentimiento',
    },
    practiceFocus: {
      observation: 'Decir lo que observé sin culpar',
      feelings: 'Nombrar mis sentimientos',
      needs: 'Conectar con lo que necesito',
      request: 'Hacer una petición clara',
      grounded: 'Mantener la calma si la cosa se calienta',
    },
    challenge: {
      gentle: 'Suave',
      true: 'Como en la vida real',
      tougher: 'Más difícil de lo habitual',
    },
    otherPersonFallback: 'la otra persona',
    relationshipFallback: 'alguien de mi vida',

    retry: {
      title: 'Probemos otra vez',
      body: 'No pudimos prepararlo en este momento. Tus respuestas están a salvo.',
      tryAgain: 'Intentarlo de nuevo',
      backToEditing: 'Volver a editar',
    },

    refine: {
      title: 'Algunos detalles',
      thinking: 'Un momento',
      placeholder: 'Comparte lo que te venga a la mente…',
      send: 'Enviar',
      skip: 'Saltar y continuar',
    },

    review: {
      titleLabel: 'Título',
      standIn: (name: string) =>
        `Aquí ${name} responde como en un ensayo, para que puedas probar con calma antes de la conversación real.`,
      keepEditing: 'Seguir editando',
      starting: 'Empezando…',
      start: 'Empezar la conversación',
    },
  },
}
