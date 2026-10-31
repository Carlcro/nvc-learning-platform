import type { Messages } from '..'

/** "a las 18:00", but "a la 1:00" for one o'clock. */
function atTime(time: string): string {
  return /^0?1(?!\d)/.test(time) ? `a la ${time}` : `a las ${time}`
}

export const home: Messages['home'] = {
  meta: {
    title: 'Aprende comunicación compasiva',
    description:
      'Practica los cuatro pasos de la comunicación compasiva con lecciones guiadas y conversaciones de práctica que se sienten reales.',
  },
  hero: {
    title: 'Ensaya la conversación difícil antes de tenerla.',
    intro:
      'Aprende las cuatro piezas de la comunicación no violenta y pruébalas en voz alta con alguien que te responde. Cuando llegue la conversación de verdad, las palabras ya se sentirán tuyas.',
    primaryAction: 'Prueba una conversación de práctica',
    secondaryAction: 'O empieza con una lección corta',
    bubble: '¿Una conversación se torció? Probemos otra vez, con calma.',
  },
  showcase: {
    title: 'Dilo, mira cómo llega, vuelve a intentarlo.',
    partners:
      'Cada persona con la que practicas tiene una historia y un estado de ánimo. La culpa hace que se cierre. La honestidad sobre lo que viste y sentiste la ayuda a abrirse.',
    hints:
      'Después de cada mensaje recibes una pista, nunca un guion, y el arco se va completando a medida que traes cada pieza a la conversación. Una pieza por mensaje es más que suficiente.',
  },
  voices: {
    title: 'Cada momento difícil tiene dos voces.',
    intro:
      'Marshall Rosenberg las llamó el chacal y la jirafa. El chacal juzga, culpa y exige, y la gente se defiende de él. La jirafa, el animal terrestre con el corazón más grande, dice lo que pasó, cómo se sintió, qué era importante y qué ayudaría.',
    jackal: {
      name: 'El chacal',
      tagline: 'Juzga, culpa y exige',
      outcome: 'Sam oye un ataque y empieza a defenderse.',
      lines: [
        { move: 'Juicio', line: 'Siempre me ignoras.' },
        { move: 'Leer la mente', line: 'Siento que no te importo.' },
        { move: 'Crítica', line: 'Necesito que hagas esto mejor.' },
        { move: 'Exigencia', line: 'La próxima vez mándame un mensaje y ya.' },
      ],
    },
    giraffe: {
      name: 'La jirafa',
      tagline: 'Dice lo que pasó y qué ayudaría',
      outcome: 'Sam oye que te preocupaste, y se suaviza.',
      lines: [
        {
          move: 'Observación',
          line: 'Cuando anoche no supe nada de ti,',
        },
        { move: 'Sentimiento', line: 'me preocupé,' },
        {
          move: 'Necesidad',
          line: 'porque para mí es importante saber que estás bien.',
        },
        {
          move: 'Petición',
          line: '¿Te parecería bien mandarme un mensaje rápido cuando salgas hasta tarde?',
        },
      ],
    },
    lessonsNote:
      'En la vida real nadie dice las cuatro piezas de una vez, y tú tampoco tienes que hacerlo. Las lecciones recorren cada pieza por separado, con un breve cuestionario al final de cada una.',
    seeLessons: 'Ver las lecciones',
  },
  closing: {
    title: 'Trae esa conversación que te da miedo.',
    body: 'Elige un escenario ya preparado, o describe una situación de tu vida y ensáyala ahí. Tus conversaciones de práctica son solo tuyas.',
    action: 'Empezar a practicar',
  },
  footer: {
    creditBefore:
      'Practice NVC. Basado en el trabajo de Marshall Rosenberg y del ',
    creditLink: 'Center for Nonviolent Communication',
    creditAfter: '.',
    navLabel: 'Pie de página',
    lessons: 'Lecciones',
    practice: 'Práctica',
    feelings: 'Sentimientos',
  },
  preview: {
    label: 'Un ejemplo de conversación de práctica con Sam',
    talkingWith: 'Hablando con Sam',
    situation: 'Una amistad que dejó de responder',
    firstAttempt: 'Nunca me contestas los mensajes.',
    firstAttemptBlame: 'Está claro que no soy tu prioridad.',
    samReplyGuarded: 'Vaya. ¿Así que la culpa es mía porque tenía cosas que hacer?',
    hintLabel: 'Una pista',
    hint: 'Eso sonó a culpa. ¿Qué viste pasar en realidad, y cómo te sentiste?',
    secondAttempt:
      'Cuando anoche, después de las diez, no supe nada de ti, me preocupé, porque para mí es importante saber que estás bien.',
    samReplyOpen:
      'Ah. No lo había pensado. Me quedé sin batería y me fui a dormir.',
    youAvatar: 'Tú',
    samAvatar: 'S',
    youSpeaker: 'Tú: ',
    samSpeaker: 'Sam: ',
    arcSummary:
      'Tres de cuatro piezas logradas. La petición puede llegar en el próximo turno.',
    arc: {
      observation: 'Observar',
      feeling: 'Sentimiento',
      need: 'Necesidad',
      request: 'Petición',
    },
  },
  dailyTeaser: {
    title: 'La práctica de hoy',
    pending:
      'La situación de hoy todavía está en camino. Mientras tanto, todos los escenarios de práctica están abiertos para ti.',
    browseScenarios: 'Ver los escenarios de práctica',
    finished: 'Terminaste el reto de hoy.',
    nextArrives: (time: string) => `Llega uno nuevo ${atTime(time)}.`,
    seeChallenges: 'Ver los retos de hoy',
    details: (
      difficulty: string,
      bonusPoints: number,
      nextTime: string | null,
    ) =>
      `${difficulty}, con ${bonusPoints} puntos extra${
        nextTime ? `. Nuevo reto ${atTime(nextTime)}.` : '.'
      }`,
    start: 'Empezar la práctica de hoy',
  },
}
