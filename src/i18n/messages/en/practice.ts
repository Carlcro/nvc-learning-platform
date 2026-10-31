import { pluralFor } from '../../plural'

const plural = pluralFor('en')

/**
 * English copy for the practice hub, the scenario brief, the scenario card
 * and the custom scenario builder. `categories` and `difficulties` label the
 * scenario enums by value and are shared with other areas.
 */
export const practice = {
  /**
   * Scenario focus areas by their stored code. A custom scenario can carry
   * a code that is not here; it is then shown only in English, as words.
   */
  focusAreas: {
      boundary_setting: 'setting a boundary',
      conflict_resolution: 'resolving a conflict',
      feedback_response: 'responding to feedback',
      feedback_and_sensitivity: 'feedback and sensitivity',
      appreciation: 'expressing appreciation',
      apology: 'apologizing',
      request_making: 'making requests',
      empathy: 'empathy',
      emotional_intimacy: 'emotional intimacy',
      friendship_and_reliability: 'friendship and reliability',
      parental_independence: 'independence from parents',
      parenting_partnership: 'parenting together',
      responsibility_and_fairness: 'responsibility and fairness',
      workplace_conflict: 'conflict at work',
  },
  meta: {
    hub: {
      title: 'Practice',
      description:
        'Rehearse a difficult conversation with a practice partner who answers in character.',
    },
    brief: {
      title: 'Scenario Brief',
      description:
        'Read the situation and meet the person you are about to talk with.',
    },
    create: {
      title: 'Build a Scenario',
      description:
        'Shape a scenario from a real situation in your life, then rehearse it.',
    },
  },

  categories: {
    workplace: 'Workplace',
    family: 'Family',
    friendship: 'Friendship',
    self_expression: 'Self-Expression',
  },

  difficulties: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },

  /** Shared retry message when a start or delete does not go through. */
  tryAgainError: "That didn't go through. Take a breath and try again.",
  readyWhenYouAre: 'Ready when you are. Take your time.',
  starsLabel: (stars: number) => `${stars} of 3 stars`,
  aboutCharacter: (name: string) => `About ${name}`,
  situation: 'Situation',
  personality: 'Personality',
  background: 'Background',
  whatYoullPractice: "What you'll practice",

  hub: {
    title: 'Who would you like to practice with?',
    intro:
      'Every scenario is open. Pick someone whose situation feels close to yours, or start with the suggestion below.',
    levelNote: (level: number, pointsToNext?: number) =>
      pointsToNext !== undefined && pointsToNext > 0
        ? `Level ${level}, ${pointsToNext} points to the next`
        : `Level ${level}`,
    suggestion: {
      waitingEyebrow: 'Pick up where you left off',
      waitingNote: (name: string) =>
        `Your conversation with ${name} is waiting for you.`,
      firstEyebrow: 'A good place to start',
      nextEyebrow: 'Suggested next',
      continue: 'Continue',
      tryAgain: 'Try it again',
      start: 'Start',
    },
    rehearse: {
      title: 'Rehearse a real conversation',
      body: 'Have something difficult coming up? Shape it into a practice space and try what you want to say, gently, before the real thing.',
      action: 'Start shaping it',
    },
    yourScenarios: 'Your own scenarios',
    library: 'Scenario library',
    allCategories: 'All topics',
    allDifficulties: 'All Levels',
    filterByCategory: 'Filter scenarios by category',
    filterByDifficulty: 'Filter scenarios by difficulty',
    loading: 'Loading scenarios',
    noMatches: 'No scenarios match these filters.',
    clearFilters: 'Clear filters',
    empty:
      'No scenarios are here yet. You can still rehearse one of your own above.',
    onePiece: {
      title: 'One piece at a time',
      body: 'A real conversation unfolds gradually. Say what you saw, then how you felt, what matters to you, and what you would like. One of these per message is plenty, and the others can wait for their turn.',
    },
    deleteDialog: {
      title: 'Delete this scenario?',
      // `before`, the scenario title in bold, then `after` form one sentence.
      descriptionBefore: '',
      descriptionAfter: ' and its practice history will be removed for good.',
      keep: 'Keep it',
      delete: 'Delete',
      deleting: 'Deleting…',
    },
  },

  card: {
    categoryAndDifficulty: (category: string, difficulty: string) =>
      `${category}, ${difficulty.toLowerCase()}`,
    deleteLabel: (title: string) => `Delete ${title}`,
    deleteTitle: 'Delete',
    withCharacter: (name: string) => `with ${name}`,
    aboveLevel: (minLevel: number) =>
      `Usually tried from level ${minLevel}. Open to you now if you want a stretch.`,
    status: {
      in_progress: 'In progress',
      attempted: 'Tried once',
      completed: 'Completed',
    },
    suggestedNext: 'Suggested next',
    viewBest: 'View your best',
    actions: {
      continue: 'Continue',
      improve: 'Improve',
      tryAgain: 'Try again',
      start: 'Start',
    },
  },

  brief: {
    loading: 'Setting the scene for your conversation…',
    notFound: {
      title: 'We could not find this scenario',
      body: 'It may have been removed, or the link is no longer valid.',
    },
    back: 'Back to scenarios',
    focus: 'Focus:',
    onePiece: {
      // The bold lead and the body read as one paragraph.
      lead: 'One piece at a time.',
      body: 'A real conversation unfolds gradually: an observation in one message, a feeling in the next, a request later on. You never need to fit everything into one message.',
    },
    tipsTitle: 'The four pieces, for reference',
    tips: {
      observation:
        'Observation: describe what you saw or heard, without judgment.',
      feeling: 'Feeling: name the emotion itself, not a thought or blame.',
      need: 'Need: say what matters to you underneath the feeling.',
      request:
        'Request: ask for one specific, doable thing, and leave room for a no.',
    },
    stayCurious: (name: string) =>
      `Stay curious about ${name}'s perspective and needs, too.`,
    best: (score: number) => `Your best: ${score}/100`,
    attempts: (n: number) =>
      plural(n, { one: `· ${n} attempt`, other: `· ${n} attempts` }),
    waiting: (name: string, turns: number) =>
      plural(turns, {
        one: `Your conversation with ${name} is waiting, one message in.`,
        other: `Your conversation with ${name} is waiting, ${turns} messages in.`,
      }),
    startFresh: 'Start fresh',
    starting: 'Starting...',
    continue: 'Continue your conversation',
    start: 'Start Conversation',
  },

  create: {
    generateError:
      "We couldn't shape this just now. Take a breath and try again.",
    loading: 'Shaping your practice space…',
    themFallback: 'them',
    guideAlt: 'Your guide',
    progressLabel: 'Your progress',
    stages: [
      'The situation',
      'The other person',
      'What you hope for',
      'Your space',
    ],
    bubble: {
      situation:
        "Let's start with what's on your mind. Share only what you'd like, and keep it simple.",
      person: (name: string) =>
        `A little about ${name}, so they feel real to talk to.`,
      you: "Now the part that's about you, and what you're hoping for.",
      refine: (name: string) =>
        `A couple of things, so this feels true to your situation with ${name}.`,
      review:
        "Here's your space. Make it yours, and adjust anything that doesn't fit.",
    },
    backToPractice: 'Back to practice',
    backAStep: 'Back a step',
    continue: 'Continue',
    optional: '(optional)',

    situationStep: {
      title: 'The situation',
      who: 'Who is this conversation with?',
      whoHint: "A name or how you'll refer to them",
      whoPlaceholder: 'e.g. Sam',
      relationship: "What's your relationship?",
      whatsGoingOn: "In a sentence or two, what's going on?",
      whatsGoingOnPlaceholder: "What's the situation you want to rehearse?",
      whatHappened: 'What happened, specifically?',
      whatHappenedPlaceholder: 'A specific thing that was said or done',
      incompleteHint: "Add who it's with and what's going on to continue.",
    },

    personStep: {
      title: (name: string) => `About ${name}`,
      reactions: 'How do they usually react when things get tense?',
      chooseAny: 'Choose any that fit',
      whatMatters: 'What do you think matters most to them here?',
      whatMattersHint: 'For example: being respected, being heard, fairness',
      whatMattersPlaceholder: "What's underneath their reaction?",
      openness: 'How open do you expect them to be at the start?',
      history: 'Anything else about them or your history?',
      historyPlaceholder: 'Only if it helps picture the conversation',
    },

    youStep: {
      title: "What you're hoping for",
      feelings: 'How does this leave you feeling?',
      feelingsHint: 'Choose any that fit, or none',
      goodOutcome: 'What would feel like a good outcome for you?',
      goodOutcomePlaceholder: "What you'd love to feel or hear by the end",
      practice: 'What do you most want to practice?',
      chooseAny: 'Choose any that fit',
      challenge: 'How challenging should they be?',
      incompleteHint: 'Share what a good outcome would look like to continue.',
    },

    relationships: {
      partner: 'Partner',
      familyMember: 'Family member',
      friend: 'Friend',
      manager: 'Manager',
      coworker: 'Coworker',
      roommate: 'Roommate',
      other: 'Other',
    },
    reactions: {
      defensive: 'Gets defensive',
      shutsDown: 'Shuts down or goes quiet',
      louder: 'Gets louder',
      humor: 'Deflects with humor',
      calm: 'Stays calm',
      apologizes: 'Apologizes quickly',
      past: 'Brings up the past',
      notSure: 'Not sure yet',
    },
    openness: {
      guarded: 'Pretty guarded',
      mixed: 'Guarded but willing',
      open: 'Fairly open',
    },
    // Common feelings in a hard conversation, written in lower case: they are
    // shown with a capital first letter and sent to the builder as written.
    feelings: {
      frustrated: 'frustrated',
      angry: 'angry',
      irritated: 'irritated',
      upset: 'upset',
      sad: 'sad',
      disappointed: 'disappointed',
      lonely: 'lonely',
      discouraged: 'discouraged',
      anxious: 'anxious',
      worried: 'worried',
      overwhelmed: 'overwhelmed',
      resentful: 'resentful',
    },
    practiceFocus: {
      observation: 'Stating what I observed without blame',
      feelings: 'Naming my feelings',
      needs: 'Connecting to what I need',
      request: 'Making a clear request',
      grounded: 'Staying grounded if it gets heated',
    },
    challenge: {
      gentle: 'Gentle',
      true: 'True to life',
      tougher: 'Tougher than usual',
    },
    // Fallbacks used in the answers handed to the scenario builder.
    otherPersonFallback: 'the other person',
    relationshipFallback: 'someone in my life',

    retry: {
      title: "Let's try that again",
      body: "We couldn't shape this just now. Your answers are safe.",
      tryAgain: 'Try again',
      backToEditing: 'Back to editing',
    },

    refine: {
      title: 'A few details',
      thinking: 'One moment',
      placeholder: 'Share what comes to mind…',
      send: 'Send',
      skip: 'Skip and continue',
    },

    review: {
      titleLabel: 'Title',
      standIn: (name: string) =>
        `${name}'s responses here are a practice stand-in, so you can try things out gently before the real conversation.`,
      keepEditing: 'Keep editing',
      starting: 'Starting…',
      start: 'Start the conversation',
    },
  },
}
