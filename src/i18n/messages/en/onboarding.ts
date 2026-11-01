/**
 * The welcome tour a new account sees once after signing up: choosing a
 * language, a look at each part of the app, how a practice conversation
 * works, and where to begin.
 */
export const onboarding = {
  meta: {
    title: 'Welcome',
    description:
      'Choose your language and take a quick look around before you start practicing.',
  },
  loading: 'Getting your welcome ready...',
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  back: 'Back',
  next: 'Next',
  skip: 'Skip the tour',
  language: {
    bubble:
      'Hello, and welcome! I am your giraffe guide. First, which language feels most like home?',
    title: 'Choose your language',
    subtitle:
      'Lessons, practice conversations and feedback will all be in the language you pick.',
    changeLater: 'You can change this anytime from the menu under your name.',
  },
  areas: {
    bubble: 'Here is a quick look around, so you know where everything lives.',
    title: 'Your places to grow',
    subtitle: 'You will find each of these in the menu at the top of the page.',
    lessons: {
      title: 'Lessons',
      body: 'Short lessons walk you through the four parts of NVC: observation, feeling, need and request. Each one ends with a little quiz.',
    },
    practice: {
      title: 'Practice',
      body: 'Talk with characters in everyday situations and get gentle feedback on every message. You can also turn a situation from your own life into a practice conversation.',
    },
    daily: {
      title: 'Daily challenge',
      body: 'A fresh situation every day, matched to your level, with bonus points for taking it on.',
    },
    feelings: {
      title: 'Feelings',
      body: 'Explore the feelings wheel, check in with how you are today, and grow your words for what is going on inside.',
    },
    profile: {
      title: 'Profile',
      body: 'See your level, points, streak and achievements, and how each part of NVC is coming along.',
    },
  },
  practice: {
    bubble: 'Practice is where it all comes together. Here is how a conversation works.',
    title: 'How a practice conversation works',
    subtitle: 'There are no wrong answers here, only practice.',
    brief: {
      title: 'Read the brief',
      body: 'Each conversation starts with who you are talking to and what is going on between you.',
    },
    oneStep: {
      title: 'One piece at a time',
      body: 'You do not need to say everything at once. An observation in one message, a feeling in the next. The path at the top shows how far you have come.',
    },
    hints: {
      title: 'Gentle feedback',
      body: 'After each message you see how it landed and a hint for what to try next.',
    },
    rewind: {
      title: 'Rewind',
      body: 'Wish you had said something differently? Take your last message back and reshape your words.',
    },
    wrapUp: {
      title: 'Wrap up when you are ready',
      body: 'After a few messages you can finish and see what went well, plus one thing to try next time.',
    },
  },
  start: {
    bubble: 'That is everything. Where would you like to begin?',
    title: 'Where would you like to start?',
    subtitle: 'Everything stays open, so you can explore in any order you like.',
    lessons: {
      title: 'Start with the first lesson',
      body: 'A good place to begin if NVC is new to you.',
      tag: 'Recommended',
    },
    practice: {
      title: 'Jump into practice',
      body: 'Already know the basics? Pick a conversation and give it a go.',
    },
  },
}
