import { pluralFor } from '../../plural'

const plural = pluralFor('en')

/**
 * English copy for the live conversation screen: the conversation itself,
 * the composer, the feedback panel, rewinding and starting over, and the
 * milestone celebrations.
 */
export const roleplay = {
  meta: {
    title: 'Conversation',
    description:
      'Practice compassionate communication turn by turn, with feedback as you go.',
  },

  /** Labels for the stations of the arc rail, keyed by station. */
  milestones: {
    start: 'Start',
    observe: 'Observe',
    feeling: 'Feeling',
    need: 'Need',
    request: 'Request',
    done: 'Done',
  },

  /** The one line that tells the person how a turn landed, by score band. */
  scoreMessages: {
    keepGoing: 'Keep going',
    gettingThere: 'Getting there',
    landingWell: 'Landing well',
    beautifullySaid: 'Beautifully said',
  },

  /** Shown above the conversation when an action fails without a server reason. */
  errors: {
    sendFailed:
      'Something went wrong sending your message. Your words are still below, give it another try.',
    completeFailed: 'We could not save your results. Please try again.',
    startFailed: 'We could not start a new conversation. Please try again.',
    rewindFailed: 'We could not rewind. Please try again.',
  },

  /** The short pop-in when a milestone is first reached. */
  celebrations: {
    /** Stands in for the character's name when it is missing. */
    characterFallback: 'They',
    observationMade: {
      title: 'Clear observation',
      message: (_name: string) =>
        'You described what happened without judging it.',
    },
    feelingExpressed: {
      title: 'Feeling named',
      message: (_name: string) => 'You put honest words to an emotion.',
    },
    needIdentified: {
      title: 'Need uncovered',
      message: (_name: string) => 'You connected your feeling to what matters.',
    },
    requestMade: {
      title: 'Clear request',
      message: (_name: string) =>
        'You asked for something concrete and doable.',
    },
    empathyShown: {
      title: 'You heard them',
      message: (name: string) =>
        `You tuned into what ${name} might be feeling.`,
    },
    resolutionReached: {
      title: 'Breakthrough',
      message: (name: string) => `${name} feels genuinely heard.`,
    },
  },

  page: {
    loadingScene: 'Setting the scene for your conversation…',
    loadingDefault: 'Getting things ready for you…',
    notFound: {
      title: 'We could not find this conversation',
      body: 'It may have been removed, or the link is no longer valid.',
      back: 'Back to Practice',
    },
    dismissError: 'Dismiss',
    archive: {
      title: 'Viewing Completed Conversation',
      body: 'This conversation has been completed. You can review it but cannot make changes.',
    },
    viewScenario: 'View Scenario',
    // before + the character's name in bold + after form one sentence.
    practicingWith: { before: 'Practicing with ', after: '' },
    wrapUpArc: 'Wrap up and see how it went',
    wrapUpEarly: 'Wrap up here and see how it went',
    turnLimitReached:
      'This is as far as this conversation goes. Wrap it up above to see how it went, and you can always start it again.',
    turnsRemaining: (n: number) =>
      plural(n, {
        one: 'One message left in this conversation.',
        other: `${n} messages left in this conversation.`,
      }),
    mobile: {
      openFeedback: 'Open the full feedback',
      tryNext: (text: string) => `Try next: ${text}`,
      firstMessageTips: 'Tips for your first message',
      liveFeedback: 'Live Feedback',
      closeFeedback: 'Close feedback panel',
    },
    continueConversation: 'Continue Conversation',
    context: {
      title: 'Scenario Context',
      close: 'Close scenario context',
      situation: 'Situation',
      whatYoullPractice: "What You'll Practice:",
      // tipLabel in bold, then tipBody, form one paragraph.
      tipLabel: 'Tip:',
      tipBody:
        ' A real conversation unfolds a piece at a time. An observation in one message, a feeling in the next, a request later on. You do not need to fit all four into every message.',
    },
  },

  conversation: {
    you: 'You',
    moodShift: {
      openedUp: (name: string) => `${name} opened up`,
      softened: (name: string) => `${name} softened a little`,
      moreGuarded: (name: string) => `${name} grew more guarded`,
      pulledBack: (name: string) => `${name} pulled back a little`,
    },
    jackalMarkTitle: 'This might land as judgment or blame',
    jackalNote: 'Underlined words may land as judgment or blame.',
  },

  input: {
    placeholder: 'What is the next true thing you want to say?',
    ariaLabel: 'Your message',
    emptyError: 'Please enter a message',
    tooLongError: (max: number) => `Message too long (max ${max} characters)`,
    sendFailed: 'Failed to send message. Please try again.',
    send: 'Send Response',
    hint: 'One piece at a time is plenty. Say the next true thing.',
  },

  rewind: {
    button: 'Rewind',
    title: 'Rewind Last Message?',
    body: 'Feeling stuck? This takes back your last message and the reply to it, and puts your words back in the box so you can reshape them and try a different approach.',
    remaining: 'Rewinds remaining:',
    note: 'A rewound message is taken out of the conversation, so it will not be part of your final reflection.',
    cancel: 'Cancel',
    confirm: 'Rewind',
    rewinding: 'Rewinding...',
  },

  startOver: {
    button: 'Start over',
    title: 'Start this conversation over?',
    body: 'Everything said so far will be set aside and the scenario begins again from the first line. This cannot be undone.',
    canWrapUp:
      'If you would rather keep what you have practiced, you can wrap up instead and see how it went.',
    suggestRewind:
      'If only your last message felt off, a rewind takes back just that one.',
    keepGoing: 'Keep going',
    confirm: 'Start over',
    starting: 'Starting over…',
  },

  feedback: {
    srHeading: 'Feedback',
    mood: {
      open: 'Open',
      warming: 'Warming',
      neutral: 'Neutral',
      guarded: 'Guarded',
      defensive: 'Defensive',
    },
    // before + the name in bold + after form one sentence.
    howFeels: (name: string | undefined) => ({
      before: 'How ',
      name: name || 'They',
      after: ' feels',
    }),
    moodAria: (name: string | undefined, label: string, opened: boolean) => {
      const who = name || 'They'
      return `How ${who} feels: ${label}${opened ? `. ${who} has opened up.` : ''}`
    },
    starHint: (name: string | undefined) =>
      `The star lights when ${name || 'they'} opens up. People open up when they feel heard.`,
    howLanded: 'How this message landed',
    arcTitle: 'Your arc',
    arcReached: (reached: number, total: number) =>
      `${reached} of ${total} reached`,
    pieceStatus: {
      reached: 'reached',
      next: 'next to reach',
      notYet: 'not yet',
    },
    pieceAria: (label: string, status: string, value: number) =>
      `${label}: ${status}${value > 0 ? `, ${value} of 25 in this message` : ''}`,
    pieceValueTitle: (value: number) => `This message: ${value} of 25`,
    empathyEarned: (name: string | undefined) =>
      `You heard them. You tuned into ${name ? `${name}'s` : 'their'} side.`,
    empathyInvite: (name: string | undefined) =>
      `Wondering what ${name || 'they'} might be feeling? Asking counts too.`,
    // The resource's invitation, then the link, then after, form one sentence.
    skillHintLink: (label: string) => `Open the ${label}`,
    skillHintAfter: ' in a new tab; this conversation will wait for you.',
    tryAgain: 'Try again',
    wordsComeBack: 'Your words come back to the box.',
    rewindsLeft: (n: number) =>
      plural(n, { one: 'One rewind left.', other: `${n} rewinds left.` }),
    tryNext: 'Try next',
    defaultNextStep: 'Try naming a feeling and the need underneath it.',
    statusLine: (message: string, total: number, feedback: string) =>
      `${message}. Your message scored ${total} out of 100. ${feedback}`,
    reading: 'Reading your message…',
    firstTurn: {
      intro:
        'Take your time. After each message I will tell you how it landed and suggest one next step.',
      focus: (components: string) => `Your focus this time: ${components}`,
      openingTitle: 'A good opening',
      openingBody:
        'Describe what happened, just the facts, with no verdict on it yet. One piece is plenty. Feelings, needs, and a request can each have their own message.',
      practices: 'What this conversation practices',
    },
  },

  /** A message in the annotated transcript. */
  annotated: {
    you: 'You',
    mood: {
      openWarm: 'Open & Warm',
      warmingUp: 'Warming up',
      neutral: 'Neutral',
      guarded: 'Guarded',
      defensive: 'Defensive',
    },
    breakdown: 'NVC Score Breakdown',
    notThisTurnAria: (label: string) => `${label}: not part of this message`,
    notThisTurn: '· not this turn',
    whatWentWell: 'What Went Well',
    nextStepSuggested: 'The next step suggested',
    phrasesToReconsider: 'Phrases to reconsider',
    quoted: (text: string) => `"${text}"`,
    couldAlsoSound: 'It could also sound like',
    characterMood: 'Character Mood:',
  },

  empathyMeter: {
    title: 'Empathy Meter',
    label: {
      excellent: 'Excellent',
      good: 'Good',
      partial: 'Partial',
      needsPractice: 'Needs Practice',
    },
    description: {
      excellent: 'Pure giraffe language',
      good: 'Minor improvements',
      partial: 'Mix of giraffe & jackal',
      needsPractice: 'Mostly jackal language',
    },
  },
}
