/**
 * Page copy for the six lessons. The lesson text, examples and quiz live in
 * convex/lessons.ts (the server grades the quiz from there); this file holds
 * only what frames them on the page, so one LessonPage renders all six.
 */

export type LessonId =
  | 'introduction'
  | 'observation'
  | 'feeling'
  | 'need'
  | 'request'
  | 'integration'

export const LESSON_ORDER: ReadonlyArray<LessonId> = [
  'introduction',
  'observation',
  'feeling',
  'need',
  'request',
  'integration',
]

export interface LessonPageCopy {
  /** Short name used in navigation ("Next: Feelings"). */
  shortName: string
  image: string
  /** Heading over the lesson's opening text. */
  heading: string
  /** One idea worth pausing on, shown beside the opening text. */
  aside: { label: string; text: string }
  /** The four things the lesson asks you to hold onto. */
  points: ReadonlyArray<{ title: string; text: string }>
  /** Labels for the side-by-side examples. */
  examples: { heading: string; giraffe: string; jackal: string }
  takeaways: ReadonlyArray<string>
}

export const LESSON_PAGES: Record<LessonId, LessonPageCopy> = {
  introduction: {
    shortName: 'Introduction',
    image: '/lesson1.webp',
    heading: 'What is Non-Violent Communication?',
    aside: {
      label: 'Why a giraffe',
      text: 'Rosenberg chose the giraffe because it has the largest heart of any land animal, and a long neck that lets it see a situation from higher up.',
    },
    points: [
      { title: 'Observation', text: 'What happened, without a verdict about it.' },
      { title: 'Feeling', text: 'The emotion you notice in yourself.' },
      { title: 'Need', text: 'What matters to you underneath that feeling.' },
      { title: 'Request', text: 'One concrete thing that would help.' },
    ],
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
    image: '/lesson2.webp',
    heading: 'Say what a camera would see',
    aside: {
      label: 'A quick test',
      text: 'Could a video recording show it? "You left the dishes in the sink" passes. "You never help" does not, because no camera can film "never".',
    },
    points: [
      { title: 'Describe, don’t judge', text: 'Name the action, not what kind of person it makes them.' },
      { title: 'Be specific', text: 'A time, a place or a number is easier to hear than a summary.' },
      { title: 'Drop always and never', text: 'Absolutes turn one moment into a verdict on someone’s character.' },
      { title: 'Keep it short', text: 'One clear sentence is enough to start from.' },
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
    image: '/lesson3.webp',
    heading: 'Name the emotion itself',
    aside: {
      label: 'Listen for "like" and "that"',
      text: '"I feel like..." and "I feel that..." are almost always followed by a thought. Try finishing the sentence with a single emotion word instead.',
    },
    points: [
      { title: 'Feelings', text: 'Emotions you notice in yourself: sad, anxious, relieved, glad.' },
      { title: 'Thoughts dressed as feelings', text: 'Words like ignored, rejected or betrayed describe what someone did to you.' },
      { title: 'Own it', text: '"I felt hurt" keeps the feeling yours. "You hurt me" hands it to them.' },
      { title: 'Use the feelings library', text: 'When the right word won’t come, browsing a list helps.' },
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
    image: '/lesson4.webp',
    heading: 'What matters underneath',
    aside: {
      label: 'Need or strategy?',
      text: 'If only one particular person could meet it, it is probably a strategy. "Help with the dishes" is a strategy; support and fairness are the needs it serves.',
    },
    points: [
      { title: 'Shared by everyone', text: 'Rest, safety, respect, connection, meaning: needs any person could have.' },
      { title: 'Not a strategy', text: '"Dinner together" or "call me" are ways of meeting a need, not the need.' },
      { title: 'Many ways forward', text: 'Once the need is named, more than one solution can meet it.' },
      { title: 'Theirs too', text: 'The other person has needs in the same moment. Wondering about them helps.' },
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
    image: '/lesson5.webp',
    heading: 'Ask for one doable thing',
    aside: {
      label: 'Request or demand?',
      text: 'You find out by what happens after a no. If you can stay curious about their reasons, it was a request.',
    },
    points: [
      { title: 'Concrete', text: 'Something someone could actually do, today or this week.' },
      { title: 'Positive', text: 'Ask for what you want, not what you want them to stop.' },
      { title: 'Room for no', text: '"Would you be willing..." means the answer really is open.' },
      { title: 'A no is information', text: 'It tells you about their needs, and the conversation can continue.' },
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
    image: '/lesson6.webp',
    heading: 'One message, four pieces',
    aside: {
      label: 'The full shape',
      text: 'When I saw [observation], I felt [feeling], because I need [need]. Would you be willing to [request]?',
    },
    points: [
      { title: 'Observation', text: 'What happened, without a verdict about it.' },
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
}

export function lessonNumber(id: LessonId): number {
  return LESSON_ORDER.indexOf(id) + 1
}

export function nextLessonId(id: LessonId): LessonId | null {
  const index = LESSON_ORDER.indexOf(id)
  return index < LESSON_ORDER.length - 1 ? LESSON_ORDER[index + 1] : null
}

export function previousLessonId(id: LessonId): LessonId | null {
  const index = LESSON_ORDER.indexOf(id)
  return index > 0 ? LESSON_ORDER[index - 1] : null
}
