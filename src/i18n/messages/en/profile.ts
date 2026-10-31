import { pluralFor } from '../../plural'

/**
 * English copy for the profile page: the hero band, the four pieces, the
 * conversations and feelings summaries, achievements and settings.
 */

const plural = pluralFor('en')

/** "a", "a and b", "a, b and c" (no serial comma, as the page has always read). */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export const profile = {
  meta: {
    title: 'Your Profile',
    description:
      'Your level, streak, achievements and how your skills are growing.',
  },
  loading: 'Gathering your progress...',
  setupFailed: {
    title: 'Your progress is taking a moment',
    body: 'We could not load it just now. Your practice is safe, and trying again usually helps.',
    retry: 'Try again',
  },
  hero: {
    title: 'Your practice so far',
    startPracticing: 'Start practicing',
    continuePracticing: 'Continue practicing',
    /**
     * Level and points in words, plus the current streak when there is one.
     * One line, so the header never turns into a row of numbers.
     */
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
      let line = `Level ${level}, with ${plural(totalPoints, {
        one: `${totalPoints} point`,
        other: `${totalPoints} points`,
      })}`
      if (pointsToNextLevel > 0) {
        line += ` and ${pointsToNextLevel} more to reach level ${level + 1}`
      }
      line += '.'
      if (currentStreak > 1) {
        line += ` You have practiced ${currentStreak} days in a row.`
      } else if (currentStreak === 1) {
        line += ' Your practice streak has begun.'
      }
      return line
    },
    /** The guide's line, chosen by where the learner is on their journey. */
    mentor: {
      welcome:
        'Welcome. Every conversation you practice is a step toward connection.',
      compassion: 'Your words are landing with real compassion.',
      steady: 'You are growing steadily. Keep going.',
      finding:
        'You are finding your giraffe voice, one conversation at a time.',
      showingUp: 'You are showing up for this, and that is what matters most.',
    },
  },
  growth: {
    title: 'The four pieces',
    empty:
      'Observation, feeling, need and request. Once you finish a first conversation, this is where you will see which of them comes naturally to you and which one to explore next.',
    emptyLink: 'Start with the observations lesson',
    strongest: (name: string) => `Lately your strongest piece is ${name}.`,
    nextToExplore: (name: string) => ` Next to explore: ${name}.`,
    allLanding: ' All four are landing well in your conversations.',
    /** Per piece: the line when it has not been tried yet, and the link to its lesson. */
    focus: {
      observation: {
        untried:
          'You have not reached for observations in a conversation yet. ',
        visit: 'Visit the observations lesson',
      },
      feeling: {
        untried: 'You have not reached for feelings in a conversation yet. ',
        visit: 'Visit the feelings library',
      },
      need: {
        untried: 'You have not reached for needs in a conversation yet. ',
        visit: 'Visit the needs lesson',
      },
      request: {
        untried: 'You have not reached for requests in a conversation yet. ',
        visit: 'Visit the requests lesson',
      },
    },
    /** A plain word for where one piece is, never a grade. */
    words: {
      notTried: 'not tried yet',
      starting: 'just starting',
      growing: 'growing',
      steady: 'steady',
      strong: 'strong',
    },
  },
  conversations: {
    title: 'Your conversations',
    none: 'You have not finished a conversation yet. The first one is often the hardest, and a beginner scenario is a gentle place to begin.',
    summary: ({
      completed,
      threeStars,
      stars,
    }: {
      completed: number
      threeStars: number
      stars: number
    }) => {
      let sentence = `You have finished ${plural(completed, {
        one: `${completed} scenario`,
        other: `${completed} different scenarios`,
      })}`
      if (threeStars > 0) {
        sentence +=
          completed === 1
            ? ', with three stars'
            : `, ${threeStars} of them with three stars`
      }
      if (stars > 0) {
        sentence += `, gathering ${plural(stars, {
          one: `${stars} star`,
          other: `${stars} stars`,
        })} along the way`
      }
      return `${sentence}.`
    },
    createLink: 'Rehearse a real conversation of your own',
  },
  feelings: {
    title: 'Naming feelings',
    none: 'Nothing here yet. Naming what you feel is where the rest of the conversation gets easier.',
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
          `explored ${plural(totalFeelingsExplored, {
            one: `${totalFeelingsExplored} feeling`,
            other: `${totalFeelingsExplored} feelings`,
          })}`,
        )
      }
      if (totalCheckIns > 0) {
        parts.push(
          `checked in with yourself ${plural(totalCheckIns, {
            one: `${totalCheckIns} time`,
            other: `${totalCheckIns} times`,
          })}`,
        )
      }
      if (quizScore > 0) {
        parts.push(`reached level ${quizLevel} in the feelings quiz`)
      }
      let sentence = `You have ${andList(parts)}.`
      if (checkInStreak > 1) {
        sentence += ` That is ${checkInStreak} days of check-ins in a row.`
      }
      return `${sentence} This is the vocabulary underneath every honest conversation.`
    },
    keepExploring: 'Keep exploring feelings',
    openLibrary: 'Open the feelings library',
  },
  achievements: {
    title: 'Achievements',
    none: 'Your first one arrives with your first finished conversation.',
    progress: (earned: number, total: number) =>
      `${earned} of ${total} so far.`,
    earned: 'Earned',
    ahead: 'Still ahead',
    notYetEarned: ', not yet earned',
  },
  settings: {
    title: 'Settings',
  },
}
