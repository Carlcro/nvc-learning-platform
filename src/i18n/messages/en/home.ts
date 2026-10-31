/**
 * English copy for the landing page: the hero, the practice preview, the
 * jackal and giraffe comparison, today's challenge teaser and the footer.
 */
export const home = {
  meta: {
    title: 'Learn Compassionate Communication',
    description:
      'Practice the four steps of compassionate communication through guided lessons and lifelike roleplay conversations.',
  },
  hero: {
    title: 'Rehearse the hard conversation before you have it.',
    intro:
      'Learn the four parts of Non-Violent Communication, then try them out loud with someone who answers back. When the real talk comes, the words will already feel like yours.',
    primaryAction: 'Try a practice conversation',
    secondaryAction: 'Or start with a short lesson',
    bubble: "Had a talk go sideways? Let's try it again, slowly.",
  },
  showcase: {
    title: 'Say it, see how it lands, try again.',
    partners:
      'Each practice partner has a history and a mood. Blame makes them guarded. Honesty about what you saw and felt helps them soften.',
    hints:
      'After every message you get a hint, never a script, and the arc fills in as you bring each piece into the conversation. One piece per message is plenty.',
  },
  voices: {
    title: 'Every hard moment has two voices.',
    intro:
      'Marshall Rosenberg called them the jackal and the giraffe. The jackal judges, blames and demands, and people defend themselves against it. The giraffe, the land animal with the largest heart, says what happened, how it felt, what mattered, and what would help.',
    jackal: {
      name: 'The jackal',
      tagline: 'Judges, blames and demands',
      outcome: 'Sam hears an attack, and starts defending.',
      /**
       * One message said the jackal way, line by line. Each line sits beside
       * the giraffe line at the same position that replaces it.
       */
      lines: [
        { move: 'Judgment', line: 'You always ignore me.' },
        { move: 'Mind reading', line: "I feel like you don't care." },
        { move: 'Criticism', line: 'I need you to be better at this.' },
        { move: 'Demand', line: 'Just text me next time.' },
      ],
    },
    giraffe: {
      name: 'The giraffe',
      tagline: 'Says what happened and what would help',
      outcome: 'Sam hears that you were worried, and softens.',
      /** The same message said the giraffe way, one piece per line. */
      lines: [
        {
          move: 'Observation',
          line: "When I didn't hear from you last night,",
        },
        { move: 'Feeling', line: 'I felt worried,' },
        { move: 'Need', line: "because knowing you're safe matters to me." },
        {
          move: 'Request',
          line: "Would you be willing to send a quick text if you're out late?",
        },
      ],
    },
    lessonsNote:
      "Nobody speaks all four at once in real life, and you don't have to either. The lessons take each piece in turn, with a short quiz at the end of each.",
    seeLessons: 'See the lessons',
  },
  closing: {
    title: "Bring the conversation you're dreading.",
    body: 'Pick a ready-made scenario, or describe a situation from your own life and rehearse it there. Your practice conversations are private to you.',
    action: 'Start practicing',
  },
  footer: {
    // creditBefore, creditLink and creditAfter form one sentence; the middle
    // part is a link to the Center for Nonviolent Communication.
    creditBefore:
      'Practice NVC. Based on the work of Marshall Rosenberg and the ',
    creditLink: 'Center for Nonviolent Communication',
    creditAfter: '.',
    navLabel: 'Footer',
    lessons: 'Lessons',
    practice: 'Practice',
    feelings: 'Feelings',
  },
  /** The still frame of a practice exchange with Sam. */
  preview: {
    label: 'An example practice conversation with Sam',
    talkingWith: 'Talking with Sam',
    situation: 'A friend who went quiet',
    // firstAttempt and firstAttemptBlame form one message; the second part
    // is underlined as the piece that landed as blame.
    firstAttempt: 'You never text me back.',
    firstAttemptBlame: "Clearly I'm not a priority.",
    samReplyGuarded: "Wow. So I'm the bad guy because I was busy?",
    hintLabel: 'A hint',
    hint: 'That landed as blame. What did you actually see happen, and how did it feel?',
    secondAttempt:
      "When I didn't hear from you after ten last night, I felt worried, because knowing you're safe matters to me.",
    samReplyOpen:
      "Oh. I didn't think of that. My phone died and I just went to bed.",
    youAvatar: 'You',
    samAvatar: 'S',
    youSpeaker: 'You: ',
    samSpeaker: 'Sam: ',
    arcSummary: 'Three of four pieces reached. A request can come next turn.',
    arc: {
      observation: 'Observe',
      feeling: 'Feeling',
      need: 'Need',
      request: 'Request',
    },
  },
  /** Today's challenge block on the landing page. */
  dailyTeaser: {
    title: "Today's practice",
    pending:
      "Today's situation is still on its way. In the meantime, every practice scenario is open to you.",
    browseScenarios: 'Browse practice scenarios',
    finished: "You finished today's challenge.",
    nextArrives: (time: string) => `A new one arrives at ${time}.`,
    seeChallenges: "See today's challenges",
    details: (
      difficulty: string,
      bonusPoints: number,
      nextTime: string | null,
    ) =>
      `${difficulty}, worth ${bonusPoints} bonus points${
        nextTime ? `. New challenge at ${nextTime}.` : '.'
      }`,
    start: "Start today's practice",
  },
}
