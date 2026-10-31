import { pluralFor } from '../../plural'

/**
 * English copy for the daily challenge page and its card. The situation,
 * title and character come from the database and are not here.
 */

const plural = pluralFor('en')

/** "a", "a and b", "a, b and c" (no serial comma, as the page has always read). */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export const challenges = {
  meta: {
    title: 'Daily Challenge',
    description: 'A new practice situation each day, if you would like one.',
  },
  loading: "Finding today's challenge for you...",
  /**
   * The one vocabulary for daily challenge difficulty, matching the scenario
   * library. The data says easy, medium, hard; people always read these words.
   */
  difficulty: {
    easy: 'Beginner',
    medium: 'Intermediate',
    hard: 'Advanced',
  },
  /** The learning objectives as nouns for running text, keyed by component. */
  objectiveWords: {
    observation: 'observations',
    feeling: 'feelings',
    need: 'needs',
    request: 'requests',
  } as Record<string, string>,
  hero: {
    title: 'One conversation for today.',
    body: 'A new situation each day, if you would like one. It plays like any other practice conversation, and finishing it adds a few bonus points.',
  },
  pending: {
    title: "Today's situation is still on its way.",
    body: 'A new one is prepared every day. In the meantime, every practice scenario is open to you.',
    browse: 'Browse practice scenarios',
  },
  suggested: {
    title: 'Suggested for you',
    chosenFor: (level: number) => `Chosen for level ${level}.`,
    othersOpen: ' The others below are just as open to you.',
  },
  alternatives: {
    title: 'Or choose another',
    worth: (label: string, points: number) =>
      `${label}, worth ${points} bonus points.`,
    choose: 'Choose this one',
    /** Screen reader tail of the link, read right after `choose`. */
    chooseLabel: (label: string) => `: the ${label} challenge`,
  },
  card: {
    withCharacter: (name: string) => `with ${name}`,
    goodFor: (areas: ReadonlyArray<string>) =>
      `A good one for practicing ${andList(areas)}.`,
    finished: "You finished today's challenge.",
    /** Followed by the quiet "Try it again" link in the same line. */
    againWelcome: (nextTime: string | null) =>
      nextTime
        ? `You are welcome to go through it again, and a new one arrives at ${nextTime}.`
        : 'You are welcome to go through it again.',
    tryAgain: 'Try it again',
    worth: (points: number, nextTime: string | null) =>
      nextTime
        ? `Worth ${points} bonus points. New challenge at ${nextTime}.`
        : `Worth ${points} bonus points.`,
    start: 'Start this conversation',
  },
  stats: {
    title: 'Your practice so far',
    finished: (count: number) =>
      count === 0
        ? 'The daily challenges you finish will gather on your profile.'
        : plural(count, {
            one: 'You have finished one daily challenge so far.',
            other: `You have finished ${count} daily challenges so far.`,
          }),
    longestRun: (days: number) =>
      ` Your longest run of practice days is ${days}.`,
    seeProfile: 'See your profile',
  },
}
