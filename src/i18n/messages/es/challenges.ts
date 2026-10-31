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

/** "a las 18:00", but "a la 1:00" for one o'clock. */
function atTime(time: string): string {
  return /^0?1(?!\d)/.test(time) ? `a la ${time}` : `a las ${time}`
}

export const challenges: Messages['challenges'] = {
  meta: {
    title: 'Reto diario',
    description: 'Una nueva situación para practicar cada día, si te apetece.',
  },
  loading: 'Buscando el reto de hoy para ti...',
  difficulty: {
    easy: 'Principiante',
    medium: 'Intermedio',
    hard: 'Avanzado',
  },
  objectiveWords: {
    observation: 'observaciones',
    feeling: 'sentimientos',
    need: 'necesidades',
    request: 'peticiones',
  } as Record<string, string>,
  hero: {
    title: 'Una conversación para hoy.',
    body: 'Una situación nueva cada día, si te apetece. Funciona como cualquier otra conversación de práctica, y al terminarla sumas unos puntos extra.',
  },
  pending: {
    title: 'La situación de hoy todavía está en camino.',
    body: 'Cada día se prepara una nueva. Mientras tanto, todos los escenarios de práctica están abiertos para ti.',
    browse: 'Ver los escenarios de práctica',
  },
  suggested: {
    title: 'Sugerido para ti',
    chosenFor: (level: number) => `Elegido para el nivel ${level}.`,
    othersOpen: ' Los demás, más abajo, también están abiertos para ti.',
  },
  alternatives: {
    title: 'O elige otro',
    worth: (label: string, points: number) =>
      `${label}, con ${points} puntos extra.`,
    choose: 'Elegir este',
    chooseLabel: (label: string) => `: el reto de nivel ${label.toLowerCase()}`,
  },
  card: {
    withCharacter: (name: string) => `con ${name}`,
    goodFor: (areas: ReadonlyArray<string>) =>
      `Ideal para practicar ${andList(areas)}.`,
    finished: 'Terminaste el reto de hoy.',
    againWelcome: (nextTime: string | null) =>
      nextTime
        ? `Puedes repetirlo cuando quieras, y llega uno nuevo ${atTime(nextTime)}.`
        : 'Puedes repetirlo cuando quieras.',
    tryAgain: 'Repetirlo',
    worth: (points: number, nextTime: string | null) =>
      nextTime
        ? `Vale ${points} puntos extra. Nuevo reto ${atTime(nextTime)}.`
        : `Vale ${points} puntos extra.`,
    start: 'Empezar esta conversación',
  },
  stats: {
    title: 'Tu práctica hasta ahora',
    finished: (count: number) =>
      count === 0
        ? 'Los retos diarios que termines se irán reuniendo en tu perfil.'
        : plural(count, {
            one: 'Hasta ahora has terminado un reto diario.',
            other: `Hasta ahora has terminado ${count} retos diarios.`,
          }),
    longestRun: (days: number) =>
      plural(days, {
        one: ` Tu racha más larga de práctica es de ${days} día.`,
        other: ` Tu racha más larga de práctica es de ${days} días.`,
      }),
    seeProfile: 'Ver tu perfil',
  },
}
