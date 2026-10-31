import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

/** "a", "a et b", "a, b et c". */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`
}

export const challenges: Messages['challenges'] = {
  meta: {
    title: 'Défi du jour',
    description:
      'Une nouvelle situation à pratiquer chaque jour, si tu en as envie.',
  },
  loading: 'On cherche le défi du jour...',
  difficulty: {
    easy: 'Débutant',
    medium: 'Intermédiaire',
    hard: 'Avancé',
  },
  objectiveWords: {
    observation: 'observations',
    feeling: 'sentiments',
    need: 'besoins',
    request: 'demandes',
  },
  hero: {
    title: "Une conversation pour aujourd'hui.",
    body: "Une nouvelle situation chaque jour, si tu en as envie. Elle se joue comme n'importe quelle conversation d'entraînement, et la terminer rapporte quelques points bonus.",
  },
  pending: {
    title: 'La situation du jour est encore en route.',
    body: 'Une nouvelle est préparée chaque jour. En attendant, tous les scénarios de pratique te sont ouverts.',
    browse: 'Parcourir les scénarios',
  },
  suggested: {
    title: 'Suggéré pour toi',
    chosenFor: (level: number) => `Choisi pour le niveau ${level}.`,
    othersOpen: ' Les autres, plus bas, te sont tout aussi ouverts.',
  },
  alternatives: {
    title: 'Ou choisis-en un autre',
    worth: (label: string, points: number) =>
      `${label}, ${points} points bonus à la clé.`,
    choose: 'Choisir celui-ci',
    chooseLabel: (label: string) => ` : le défi ${label.toLowerCase()}`,
  },
  card: {
    withCharacter: (name: string) => `avec ${name}`,
    goodFor: (areas: ReadonlyArray<string>) =>
      `Idéal pour travailler : ${andList(areas)}.`,
    finished: 'Tu as terminé le défi du jour.',
    againWelcome: (nextTime: string | null) =>
      nextTime
        ? `Tu peux le refaire si tu veux, et un nouveau défi arrive à ${nextTime}.`
        : 'Tu peux le refaire si tu veux.',
    tryAgain: 'Le refaire',
    worth: (points: number, nextTime: string | null) =>
      nextTime
        ? `${points} points bonus à la clé. Nouveau défi à ${nextTime}.`
        : `${points} points bonus à la clé.`,
    start: 'Commencer cette conversation',
  },
  stats: {
    title: "Ta pratique jusqu'ici",
    finished: (count: number) =>
      count === 0
        ? "Les défis du jour que tu termines s'afficheront sur ton profil."
        : plural(count, {
            one: "Tu as terminé un défi du jour jusqu'ici.",
            other: `Tu as terminé ${count} défis du jour jusqu'ici.`,
          }),
    longestRun: (days: number) =>
      ` Ta plus longue série de jours de pratique : ${plural(days, {
        one: `${days} jour`,
        other: `${days} jours`,
      })}.`,
    seeProfile: 'Voir ton profil',
  },
}
