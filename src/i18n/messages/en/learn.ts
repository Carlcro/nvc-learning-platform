import { pluralFor } from '../../plural'

/**
 * English copy for the lessons area: the lessons hub, the six lesson pages
 * and the quiz at the end of each. The lesson text, examples and quiz
 * questions come from convex/lessons.ts and are not here.
 */

const plural = pluralFor('en')

export const learn = {
  meta: {
    hub: {
      title: 'Lessons',
      description:
        'Six foundational lessons on observations, feelings, needs and requests.',
    },
    introduction: {
      title: 'Introduction to Non-Violent Communication',
      description:
        'What compassionate communication is, and why it changes how conversations go.',
    },
    observation: {
      title: 'Observations Without Evaluation',
      description:
        'Describe what you see and hear without judgment, the first step of NVC.',
    },
    feeling: {
      title: 'Identifying and Expressing Feelings',
      description:
        'Tell real feelings apart from thoughts, and name your emotions honestly.',
    },
    need: {
      title: 'Connecting Feelings to Needs',
      description: 'Find the universal human need underneath a feeling.',
    },
    request: {
      title: 'Making Clear Requests',
      description:
        'Ask for something concrete and doable, without turning it into a demand.',
    },
    integration: {
      title: 'Putting It All Together',
      description:
        'Combine observation, feeling, need and request into one clear expression.',
    },
  },
  loading: {
    hub: 'Gathering your lessons...',
    lesson: 'Opening the lesson...',
  },
  hub: {
    title: 'Six short lessons, one skill.',
    intro: (totalMinutes: number) =>
      `Each lesson takes one piece of Non-Violent Communication, shows it in a few real examples, and ends with a short check. Together they take about ${totalMinutes} minutes, and you can stop anywhere.`,
    allFinished:
      'You have finished all six. Revisit any of them whenever you like.',
    finishedCount: (done: number, total: number) =>
      `${done} of ${total} finished`,
    // cardMeta and cardUpNext read as one line ("Lesson 2, 5 min, up next");
    // the second part is styled on its own.
    cardMeta: (order: number, minutes: number) =>
      `Lesson ${order}, ${minutes} min`,
    cardUpNext: ', up next',
    done: 'Done',
    start: 'Start',
    open: 'Open',
  },
  page: {
    notFound: 'This lesson could not be found.',
    backToLessons: 'Back to all lessons',
    allLessons: 'All lessons',
    lessonOf: (number: number, total: number) => `Lesson ${number} of ${total}`,
    duration: (minutes: number) =>
      plural(minutes, {
        one: `About ${minutes} minute`,
        other: `About ${minutes} minutes`,
      }),
    completed: 'Completed',
    pointsHeading: 'Four things to hold onto',
    takeawaysHeading: 'What to remember',
    nextLesson: (shortName: string) => `Next: ${shortName}`,
    tryPractice: 'Try a practice conversation',
    practice: 'Practice',
    navLabel: 'Lessons',
    foundations: {
      title: "You've finished the foundations.",
      text: 'All four pieces are yours now. They start to sound natural when you use them with someone who answers back, so a practice conversation is a good next step.',
    },
    examples: {
      counter: (index: number, total: number) => `Example ${index} of ${total}`,
      whyItMatters: 'Why it matters: ',
      previous: 'Previous example',
      next: 'Next example',
    },
  },
  quiz: {
    heading: 'Check your understanding',
    questionOf: (index: number, total: number) =>
      `Question ${index} of ${total}`,
    notQuite: 'Not quite this one.',
    // missedBefore + showAnswer (a button) + missedAfter form one sentence.
    missedBefore: 'Have another look at the other options, or ',
    showAnswer: 'show me the answer',
    missedAfter: '.',
    foundFirstTry: 'Yes, that one.',
    foundLater: 'That’s the one.',
    previousQuestion: 'Previous question',
    nextQuestion: 'Next question',
    finish: 'Finish',
    checkAnswer: 'Check my answer',
    finishedTitle: "You've finished this lesson.",
    firstLookSummary: (found: number, total: number) =>
      `You found ${found} of ${total} on the first look.`,
    secondLookNote:
      'The ones that took a second look are often the ones that stick.',
    tryAgain: 'Go through the questions again',
  },
  /** The copy that frames each lesson page, keyed by lesson id. */
  lessons: {
    introduction: {
      /** Short name used in navigation ("Next: Feelings"). */
      shortName: 'Introduction',
      /** Heading over the lesson's opening text. */
      heading: 'What is Non-Violent Communication?',
      /** One idea worth pausing on, shown beside the opening text. */
      aside: {
        label: 'Why a giraffe',
        text: 'Rosenberg chose the giraffe because it has the largest heart of any land animal, and a long neck that lets it see a situation from higher up.',
      },
      /** The four things the lesson asks you to hold onto. */
      points: [
        {
          title: 'Observation',
          text: 'What happened, without a verdict about it.',
        },
        { title: 'Feeling', text: 'The emotion you notice in yourself.' },
        { title: 'Need', text: 'What matters to you underneath that feeling.' },
        { title: 'Request', text: 'One concrete thing that would help.' },
      ],
      /** Labels for the side-by-side examples. */
      examples: {
        heading: 'The same moment, two ways',
        giraffe: 'Giraffe',
        jackal: 'Jackal',
      },
      takeaways: [
        'NVC is a way of speaking and listening that keeps both people in the conversation.',
        'It has four pieces: observation, feeling, need and request.',
        'Giraffe language looks for understanding. Jackal language judges, blames and demands.',
        'Everyone speaks jackal sometimes. The practice is noticing it and trying again.',
      ],
    },
    observation: {
      shortName: 'Observations',
      heading: 'Say what a camera would see',
      aside: {
        label: 'A quick test',
        text: 'Could a video recording show it? "You left the dishes in the sink" passes. "You never help" does not, because no camera can film "never".',
      },
      points: [
        {
          title: 'Describe, don’t judge',
          text: 'Name the action, not what kind of person it makes them.',
        },
        {
          title: 'Be specific',
          text: 'A time, a place or a number is easier to hear than a summary.',
        },
        {
          title: 'Drop always and never',
          text: 'Absolutes turn one moment into a verdict on someone’s character.',
        },
        {
          title: 'Keep it short',
          text: 'One clear sentence is enough to start from.',
        },
      ],
      examples: {
        heading: 'Observation or evaluation?',
        giraffe: 'Observation',
        jackal: 'Evaluation',
      },
      takeaways: [
        'An observation describes what happened, without a judgment about it.',
        'Specific details are easier to hear than generalizations.',
        'Words like always and never usually signal an evaluation.',
        'A clear observation gives the other three pieces something to stand on.',
      ],
    },
    feeling: {
      shortName: 'Feelings',
      heading: 'Name the emotion itself',
      aside: {
        label: 'Listen for "like" and "that"',
        text: '"I feel like..." and "I feel that..." are almost always followed by a thought. Try finishing the sentence with a single emotion word instead.',
      },
      points: [
        {
          title: 'Feelings',
          text: 'Emotions you notice in yourself: sad, anxious, relieved, glad.',
        },
        {
          title: 'Thoughts dressed as feelings',
          text: 'Words like ignored, rejected or betrayed describe what someone did to you.',
        },
        {
          title: 'Own it',
          text: '"I felt hurt" keeps the feeling yours. "You hurt me" hands it to them.',
        },
        {
          title: 'Use the feelings library',
          text: 'When the right word won’t come, browsing a list helps.',
        },
      ],
      examples: {
        heading: 'Feeling or thought?',
        giraffe: 'A feeling',
        jackal: 'A thought',
      },
      takeaways: [
        'A feeling is an emotion; a pseudo-feeling carries a judgment about someone else.',
        '"I feel like" and "I feel that" usually introduce a thought.',
        'Owning a feeling makes it easier for the other person to stay with you.',
        'If the word won’t come, the feelings library can help you find it.',
      ],
    },
    need: {
      shortName: 'Needs',
      heading: 'What matters underneath',
      aside: {
        label: 'Need or strategy?',
        text: 'If only one particular person could meet it, it is probably a strategy. "Help with the dishes" is a strategy; support and fairness are the needs it serves.',
      },
      points: [
        {
          title: 'Shared by everyone',
          text: 'Rest, safety, respect, connection, meaning: needs any person could have.',
        },
        {
          title: 'Not a strategy',
          text: '"Dinner together" or "call me" are ways of meeting a need, not the need.',
        },
        {
          title: 'Many ways forward',
          text: 'Once the need is named, more than one solution can meet it.',
        },
        {
          title: 'Theirs too',
          text: 'The other person has needs in the same moment. Wondering about them helps.',
        },
      ],
      examples: {
        heading: 'Naming the need',
        giraffe: 'Names the need',
        jackal: 'Insists on a strategy',
      },
      takeaways: [
        'Needs are shared by all people; strategies are particular ways of meeting them.',
        'Naming the need opens up more than one way forward.',
        'The same need can be met by many different strategies.',
        'The other person has needs too, and curiosity about them builds connection.',
      ],
    },
    request: {
      shortName: 'Requests',
      heading: 'Ask for one doable thing',
      aside: {
        label: 'Request or demand?',
        text: 'You find out by what happens after a no. If you can stay curious about their reasons, it was a request.',
      },
      points: [
        {
          title: 'Concrete',
          text: 'Something someone could actually do, today or this week.',
        },
        {
          title: 'Positive',
          text: 'Ask for what you want, not what you want them to stop.',
        },
        {
          title: 'Room for no',
          text: '"Would you be willing..." means the answer really is open.',
        },
        {
          title: 'A no is information',
          text: 'It tells you about their needs, and the conversation can continue.',
        },
      ],
      examples: {
        heading: 'Request or demand?',
        giraffe: 'A request',
        jackal: 'A demand',
      },
      takeaways: [
        'A request is concrete and doable, so the other person knows what you are asking.',
        'Ask for what you want rather than what you want to stop.',
        'A request leaves the other person free to say no.',
        'A no opens a conversation about both people’s needs.',
      ],
    },
    integration: {
      shortName: 'Putting it together',
      heading: 'One message, four pieces',
      aside: {
        label: 'The full shape',
        text: 'When I saw [observation], I felt [feeling], because I need [need]. Would you be willing to [request]?',
      },
      points: [
        {
          title: 'Observation',
          text: 'What happened, without a verdict about it.',
        },
        { title: 'Feeling', text: 'The emotion you noticed in yourself.' },
        { title: 'Need', text: 'What mattered to you underneath it.' },
        { title: 'Request', text: 'One concrete thing that would help.' },
      ],
      examples: {
        heading: 'The whole message',
        giraffe: 'All four pieces',
        jackal: 'Jackal',
      },
      takeaways: [
        'The four pieces together make one complete message.',
        'In real conversations they can arrive over several turns, and that is fine.',
        'Knowing the full shape helps you notice which piece is missing.',
        'Practice is where the shape starts to sound like you.',
      ],
    },
  },
}
