import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('sv')

/** "a", "a och b", "a, b och c" (Swedish uses no comma before och). */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} och ${items[items.length - 1]}`
}

export const challenges: Messages['challenges'] = {
  meta: {
    title: 'Dagens utmaning',
    description: 'En ny övningssituation varje dag, om du vill ha en.',
  },
  loading: 'Letar fram dagens utmaning åt dig...',
  difficulty: {
    easy: 'Nybörjare',
    medium: 'Medel',
    hard: 'Avancerad',
  },
  objectiveWords: {
    observation: 'observationer',
    feeling: 'känslor',
    need: 'behov',
    request: 'önskemål',
  },
  hero: {
    title: 'Ett samtal för i dag.',
    body: 'En ny situation varje dag, om du vill ha en. Den fungerar som vilket övningssamtal som helst, och när du klarar den får du några bonuspoäng.',
  },
  pending: {
    title: 'Dagens situation är fortfarande på väg.',
    body: 'En ny förbereds varje dag. Under tiden är alla övningsscenarier öppna för dig.',
    browse: 'Bläddra bland scenarierna',
  },
  suggested: {
    title: 'Förslag till dig',
    chosenFor: (level: number) => `Vald för nivå ${level}.`,
    othersOpen: ' De andra nedan är lika öppna för dig.',
  },
  alternatives: {
    title: 'Eller välj en annan',
    worth: (label: string, points: number) =>
      `${label}, ger ${points} bonuspoäng.`,
    choose: 'Välj den här',
    chooseLabel: (label: string) =>
      `: utmaningen på nivån ${label.toLowerCase()}`,
  },
  card: {
    withCharacter: (name: string) => `med ${name}`,
    goodFor: (areas: ReadonlyArray<string>) =>
      `Passar bra för att öva på ${andList(areas)}.`,
    finished: 'Du har klarat dagens utmaning.',
    againWelcome: (nextTime: string | null) =>
      nextTime
        ? `Du får gärna göra den igen, och en ny kommer klockan ${nextTime}.`
        : 'Du får gärna göra den igen.',
    tryAgain: 'Prova igen',
    worth: (points: number, nextTime: string | null) =>
      nextTime
        ? `Ger ${points} bonuspoäng. Ny utmaning klockan ${nextTime}.`
        : `Ger ${points} bonuspoäng.`,
    start: 'Starta samtalet',
  },
  stats: {
    title: 'Din övning hittills',
    finished: (count: number) =>
      count === 0
        ? 'De dagliga utmaningar du klarar samlas på din profil.'
        : plural(count, {
            one: 'Du har klarat en daglig utmaning hittills.',
            other: `Du har klarat ${count} dagliga utmaningar hittills.`,
          }),
    longestRun: (days: number) =>
      ` Din längsta svit av övningsdagar är ${days}.`,
    seeProfile: 'Se din profil',
  },
}
