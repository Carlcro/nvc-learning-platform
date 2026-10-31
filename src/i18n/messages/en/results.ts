/**
 * English copy for the results screen after a conversation, the transcript
 * of a finished conversation, and the per-skill pointers (lesson links and
 * nudges) that the results screen and the coaching share.
 */
import { pluralFor } from '../../plural'
import type { NVCComponent } from '../../../lib/conversationInsights'

const plural = pluralFor('en')

/** How to talk about one component, and where to brush up on it. */
interface SkillCopy {
  /** The name of the page that teaches it. */
  label: string
  /** Why this skill is worth a refresher, as a gentle invitation. */
  invite: string
  /** The component as a plural noun, for running text. */
  plural: string
  /** A first move for someone about to practice this component. */
  nudge: string
}

const skills: Record<NVCComponent, SkillCopy> = {
  observation: {
    label: 'Observations lesson',
    invite:
      'Separating what happened from what we think about it is its own skill.',
    plural: 'observations',
    nudge:
      'Describe what happened the way a camera would have seen it, before saying what you make of it.',
  },
  feeling: {
    label: 'Feelings library',
    invite:
      'Finding the exact feeling word gets easier with a bigger vocabulary.',
    plural: 'feelings',
    nudge:
      'Look for the one word that names the emotion itself: worried, hurt, tired, hopeful.',
  },
  need: {
    label: 'Needs lesson',
    invite:
      'Connecting feelings to the universal needs beneath them takes practice.',
    plural: 'needs',
    nudge:
      'Ask yourself what matters to you underneath the feeling: trust, rest, respect, being included.',
  },
  request: {
    label: 'Requests lesson',
    invite: 'Shaping clear, doable requests is worth a short refresher.',
    plural: 'requests',
    nudge:
      'Ask for one concrete thing they could say yes or no to, and leave room for a no.',
  },
}

export const results = {
  skills,

  screen: {
    scoreLabel: {
      excellent: 'Excellent',
      good: 'Good',
      gettingThere: 'Getting there',
      keepPracticing: 'Keep practicing',
    },
    comparison: {
      firstRun:
        'Your first finished run of this scenario. Now there is something to build on.',
      newBest: (previousBest: number) =>
        `Up from ${previousBest} last time. That is your new best here.`,
      levelWithBest: (previousBest: number) =>
        `Level with your best of ${previousBest}. Steady is a skill too.`,
      belowBest: (previousBest: number) =>
        `Your best here is still ${previousBest}. Every run teaches something different.`,
    },

    /** How the conversation ended, for the last station of the trail. */
    ending: {
      connected: {
        headline: 'Look how far you came',
        label: (name: string) => `You connected with ${name}`,
        sub: 'You expressed yourself and were heard.',
      },
      listening: {
        headline: 'A real step forward',
        label: (name: string) => `${name} was starting to listen`,
        sub: (didManage: string, nextPiece: string) =>
          `Not fully open yet. ${didManage} ${nextPiece}`,
      },
      guarded: {
        headline: 'That was a hard one, and you stayed with it',
        label: (name: string) => `${name} was still guarded at the end`,
        sub: (didManage: string, nextPiece: string) =>
          `That happens in real conversations too. ${didManage} ${nextPiece}`,
      },
      /** The pieces the user brought, as noun phrases for `didManage`. */
      managed: {
        observation: 'a clear observation',
        feeling: 'a feeling',
        need: 'a need',
        request: 'a request',
      } satisfies Record<NVCComponent, string>,
      /** Takes the phrases from `managed`, already in arc order. */
      didManage: (pieces: Array<string>) =>
        `You brought ${pieces.join(' and ')}, which is the hard part.`,
      didManageNothing:
        'You stayed in a hard conversation, which is where it starts.',
      nextPiece: {
        observation:
          'Describing what happened, with no verdict on it, is the piece to try next time.',
        feeling: 'Naming a feeling is the piece to try next time.',
        need: 'The need beneath the feeling is the piece to try next time.',
        request: 'A clear request is the piece to try next time.',
      } satisfies Record<NVCComponent, string>,
      nextPieceEmpathy: (name: string) =>
        `Wondering aloud what ${name} was feeling is the piece to try next time.`,
      nextPieceTime: 'A little more time might have been all it needed.',
    },

    stations: {
      opened: 'You opened the conversation',
      observation: 'You described what happened',
      feeling: 'You named what you felt',
      need: 'You uncovered the need beneath it',
      request: 'You made a clear request',
      notYet: ' (not yet)',
    },

    starsAria: (stars: number) => `${stars} of 3 stars`,
    /**
     * The score line under the trail. `empathy` precedes the bold score and
     * `afterScore` follows it; together they form one line.
     */
    scoreLine: {
      empathy: 'Empathy',
      afterScore: (label: string, messages: number) =>
        `· ${label} · ${plural(messages, { one: `${messages} message`, other: `${messages} messages` })}`,
    },

    earned: {
      points: (points: number) => `+${points}`,
      pointsLabel: 'points',
      levelLabel: 'level',
      newLevelLabel: 'new level',
      streakLabel: (_days: number) => 'day streak',
      reachedLevel: (level: number) => `You reached Level ${level}. `,
      toNextLevel: (points: number, level: number) =>
        `${points} points to Level ${level}. `,
      noPoints:
        'Points come from new stars on a scenario, so beating your best here is what earns more.',
      challengeBonus: (bonus: number) =>
        `That includes ${bonus} for today's challenge.`,
      streakExtended: 'Today now counts toward your streak.',
    },

    takeaway: {
      title: 'What to take with you',
      bestMessage: 'Your message that landed best',
      /** `strongest` is bold and `strongestAfter` follows it, as one sentence pair. */
      strongest: (skillPlural: string) =>
        `Your ${skillPlural} were the strongest part.`,
      strongestAfter: 'That is a skill you can lean on now.',
      stillToTry: (skillPlural: string) => `Still to try: ${skillPlural}`,
      worthAttention: (skillPlural: string) =>
        `Worth a little attention: ${skillPlural}`,
      openResource: (label: string) => `Open the ${label}`,
    },

    reflection: {
      title: 'One message, another way',
      youSaid: 'You said',
      couldSound: 'It could also sound like',
    },

    hiddenNeeds: {
      title: (name: string) => `What ${name} needed underneath`,
      reachedConnected: (name: string) =>
        `You reached toward this during the conversation. That is what helped ${name} open up.`,
      reachedNotConnected:
        'You reached toward this during the conversation. Keep doing that. It is what opens people up, even when it takes longer than one talk.',
      nextTime: (name: string) =>
        `Next time, try wondering out loud what ${name} might be feeling or needing. Guessing at this is what opens people up.`,
    },

    badges: (count: number) =>
      plural(count, { one: 'New badge', other: 'New badges' }),

    encouragement:
      'Growth, not perfection. Every conversation like this one makes the real ones a little easier.',

    actions: {
      practiceAgain: 'Practice again',
      practiceAgainFocus: (skillPlural: string) =>
        `Practice again, with an eye on ${skillPlural}`,
      nextUp: (title: string) => `Next up: ${title}`,
      backToScenarios: 'Back to all scenarios',
      reviewTranscript: 'Review it turn by turn',
      tryAnother: 'Try another',
    },
  },

  transcript: {
    meta: {
      title: 'Conversation Transcript',
      description: 'Review how the conversation went, turn by turn.',
    },
    loading: 'Finding your conversation…',
    notFound: {
      title: 'We could not find this conversation',
      body: 'It may have been removed, or the link is no longer valid.',
    },
    backToPractice: 'Back to Practice',
    backToResults: 'Back to results',
    copied: 'Copied!',
    copy: 'Copy Transcript',
    title: 'Conversation Transcript',
    finalScore: 'Final Score',
    scoreOutOf: (score: number) => `${score}/100`,
    mood: {
      title: 'Mood Journey',
      startPoint: 'Start',
      response: (n: number) => `Response ${n}`,
      start: 'Conversation Start',
      end: 'Conversation End',
    },
    stats: {
      finalScore: 'Final Score',
      yourMessages: 'Your Messages',
      ofTotal: (total: number) => ` of ${total}`,
      freeOfBlame: 'Free of Blame',
      bestTurn: 'Best Single Turn',
      averagesTitle: 'Average Component Scores',
      averagesHint:
        'Out of 25, across the messages where you used each one. A dot means it was not part of this conversation.',
    },
    fullConversation: 'Full Conversation',
    /** The plain-text copy placed on the clipboard. */
    export: {
      heading: 'CONVERSATION TRANSCRIPT',
      underline: '=======================',
      scenario: (title: string) => `Scenario: ${title}`,
      finalScore: (score: number) => `Final Score: ${score}/100`,
      date: (date: string) => `Date: ${date}`,
      you: 'You',
      score: (total: number) => ` [Score: ${total}/100]`,
    },
  },
}
