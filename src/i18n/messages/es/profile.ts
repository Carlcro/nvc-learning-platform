import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('es')

/** "a", "a y b", "a, b y c", with "e" before an i- sound. */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  const last = items[items.length - 1]
  const and = /^h?i(?![aeou])/i.test(last) ? 'e' : 'y'
  return `${items.slice(0, -1).join(', ')} ${and} ${last}`
}

/** The component name with its article: "la observación", "el sentimiento". */
function withArticle(name: string): string {
  const lower = name.toLowerCase()
  return lower === 'sentimiento' ? `el ${lower}` : `la ${lower}`
}

export const profile: Messages['profile'] = {
  meta: {
    title: 'Tu perfil',
    description:
      'Tu nivel, tu racha, tus logros y cómo crecen tus habilidades.',
  },
  loading: 'Reuniendo tu progreso...',
  setupFailed: {
    title: 'Tu progreso está tardando un poco',
    body: 'No pudimos cargarlo ahora mismo. Tu práctica está a salvo, y volver a intentarlo suele funcionar.',
    retry: 'Intentar de nuevo',
  },
  hero: {
    title: 'Tu práctica hasta ahora',
    startPracticing: 'Empezar a practicar',
    continuePracticing: 'Seguir practicando',
    statLine: ({
      level,
      totalPoints,
      pointsToNextLevel,
      currentStreak,
    }: {
      level: number
      totalPoints: number
      pointsToNextLevel: number
      currentStreak: number
    }) => {
      let line = `Nivel ${level}, con ${plural(totalPoints, {
        one: `${totalPoints} punto`,
        other: `${totalPoints} puntos`,
      })}`
      if (pointsToNextLevel > 0) {
        line += ` y ${pointsToNextLevel} más para llegar al nivel ${level + 1}`
      }
      line += '.'
      if (currentStreak > 1) {
        line += ` Llevas ${currentStreak} días seguidos practicando.`
      } else if (currentStreak === 1) {
        line += ' Tu racha de práctica ha comenzado.'
      }
      return line
    },
    mentor: {
      welcome:
        'Te damos la bienvenida. Cada conversación que practicas es un paso hacia la conexión.',
      compassion: 'Tus palabras están llegando con verdadera compasión.',
      steady: 'Estás creciendo de forma constante. Sigue así.',
      finding:
        'Estás encontrando tu voz de jirafa, una conversación a la vez.',
      showingUp: 'Estás aquí, dándole tiempo a esto, y eso es lo que más importa.',
    },
  },
  growth: {
    title: 'Las cuatro piezas',
    empty:
      'Observación, sentimiento, necesidad y petición. Cuando termines tu primera conversación, aquí verás cuál te sale de forma natural y cuál explorar a continuación.',
    emptyLink: 'Empieza con la lección de observaciones',
    strongest: (name: string) =>
      `Últimamente, tu pieza más sólida es ${withArticle(name)}.`,
    nextToExplore: (name: string) =>
      ` Lo siguiente por explorar: ${withArticle(name)}.`,
    allLanding: ' Las cuatro están llegando bien en tus conversaciones.',
    focus: {
      observation: {
        untried: 'Todavía no has usado observaciones en una conversación. ',
        visit: 'Ir a la lección de observaciones',
      },
      feeling: {
        untried: 'Todavía no has usado sentimientos en una conversación. ',
        visit: 'Ir a la biblioteca de sentimientos',
      },
      need: {
        untried: 'Todavía no has usado necesidades en una conversación. ',
        visit: 'Ir a la lección de necesidades',
      },
      request: {
        untried: 'Todavía no has usado peticiones en una conversación. ',
        visit: 'Ir a la lección de peticiones',
      },
    },
    words: {
      notTried: 'sin probar todavía',
      starting: 'empezando',
      growing: 'creciendo',
      steady: 'constante',
      strong: 'fuerte',
    },
  },
  conversations: {
    title: 'Tus conversaciones',
    none: 'Todavía no has terminado ninguna conversación. La primera suele ser la más difícil, y un escenario de principiante es un buen lugar para empezar.',
    summary: ({
      completed,
      threeStars,
      stars,
    }: {
      completed: number
      threeStars: number
      stars: number
    }) => {
      let sentence = `Has terminado ${plural(completed, {
        one: `${completed} escenario`,
        other: `${completed} escenarios distintos`,
      })}`
      if (threeStars > 0) {
        sentence +=
          completed === 1
            ? ', con tres estrellas'
            : `, ${threeStars} de ellos con tres estrellas`
      }
      if (stars > 0) {
        sentence += `, y has reunido ${plural(stars, {
          one: `${stars} estrella`,
          other: `${stars} estrellas`,
        })} por el camino`
      }
      return `${sentence}.`
    },
    createLink: 'Ensaya una conversación real de tu vida',
  },
  feelings: {
    title: 'Nombrar sentimientos',
    none: 'Todavía no hay nada aquí. Nombrar lo que sientes es lo que hace más fácil el resto de la conversación.',
    summary: ({
      totalFeelingsExplored,
      totalCheckIns,
      checkInStreak,
      quizScore,
      quizLevel,
    }: {
      totalFeelingsExplored: number
      totalCheckIns: number
      checkInStreak: number
      quizScore: number
      quizLevel: number
    }) => {
      const parts: Array<string> = []
      if (totalFeelingsExplored > 0) {
        parts.push(
          `explorado ${plural(totalFeelingsExplored, {
            one: `${totalFeelingsExplored} sentimiento`,
            other: `${totalFeelingsExplored} sentimientos`,
          })}`,
        )
      }
      if (totalCheckIns > 0) {
        parts.push(
          `registrado cómo te sientes ${plural(totalCheckIns, {
            one: `${totalCheckIns} vez`,
            other: `${totalCheckIns} veces`,
          })}`,
        )
      }
      if (quizScore > 0) {
        parts.push(
          `alcanzado el nivel ${quizLevel} en el cuestionario de sentimientos`,
        )
      }
      let sentence = `Has ${andList(parts)}.`
      if (checkInStreak > 1) {
        sentence += ` Llevas ${checkInStreak} días seguidos registrando cómo te sientes.`
      }
      return `${sentence} Este es el vocabulario que sostiene toda conversación honesta.`
    },
    keepExploring: 'Sigue explorando sentimientos',
    openLibrary: 'Abrir la biblioteca de sentimientos',
  },
  achievements: {
    title: 'Logros',
    none: 'El primero llega con tu primera conversación terminada.',
    progress: (earned: number, total: number) =>
      `${earned} de ${total} por ahora.`,
    earned: 'Conseguidos',
    ahead: 'Por delante',
    notYetEarned: ', todavía sin conseguir',
  },
  settings: {
    title: 'Ajustes',
  },
}
