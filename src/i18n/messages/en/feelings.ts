import { pluralFor } from '../../plural'

/**
 * English copy for the feelings area: the hub, the daily check-in, browsing,
 * intensity, the saved library and the feeling or thought quiz. Feeling
 * words, definitions, families and quiz sentences come from the database and
 * are not here.
 */

const plural = pluralFor('en')

/** "rest, connection or support" */
function joinWithOr(words: ReadonlyArray<string>): string {
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} or ${words[words.length - 1]}`
}

/** "once", "twice", "a few times": how often a feeling came up, in words. */
function howOften(count: number): string {
  if (count <= 1) return 'once'
  if (count === 2) return 'twice'
  if (count <= 4) return 'a few times'
  return 'often'
}

export const feelings = {
  /** Shared by every feelings page. */
  page: {
    back: 'Feelings',
    inASentence: 'In a sentence: ',
  },

  /** The words for a feeling's strength and tone, shared across pages. */
  scale: {
    intensity: {
      faint: 'Faint',
      mild: 'Mild',
      moderate: 'Moderate',
      strong: 'Strong',
      intense: 'Intense',
    },
    category: {
      pleasant: 'Pleasant',
      unpleasant: 'Unpleasant',
    },
    /** One short description, for example "Moderate, unpleasant". */
    describe: (intensity: string, category: string) =>
      `${intensity}, ${category.toLowerCase()}`,
  },

  hub: {
    meta: {
      title: 'Feelings',
      description: 'Build the vocabulary to name what you feel precisely.',
    },
    title: 'Find the words for what you feel.',
    intro:
      'Feelings are the second piece of a compassionate message. The more words you have for them, the easier it is to say what is really going on, and to tell a feeling apart from a thought about someone else.',
    guide:
      'Naming what you feel is where compassion begins. Take your time here. There are no wrong answers.',
    today: {
      doneHeading: 'You have checked in today.',
      notDoneHeading: 'How are you today?',
      doneText:
        'You can look back at what you noticed, or change it if the day has moved on.',
      notDoneText:
        'Pause for a minute and pick the words that fit. A short note is welcome, and only you can see it.',
      doneAction: 'Open today’s check-in',
      notDoneAction: 'Check in for today',
    },
    toolsHeading: 'Other ways to explore',
    tools: {
      wheel: {
        title: 'Browse feelings',
        text: 'Feelings grouped by family, each with a definition, examples and close relatives.',
      },
      intensity: {
        title: 'How strong is it',
        text: 'See how one feeling shifts as it grows softer or stronger, so you can name how much.',
      },
      library: {
        title: 'Your saved feelings',
        text: 'The words you have kept to come back to.',
      },
      quiz: {
        title: 'Feeling or thought',
        text: 'Short sentences to sort: is this a feeling, or a thought about someone else?',
      },
    },
    whyItHelps:
      'Why it helps: a feeling named precisely is easier to share without blame, and easier for the other person to hear. Words like “ignored” or “judged” describe what you think someone did. The feelings underneath, perhaps lonely or hurt, are yours to share.',
  },

  checkIn: {
    meta: {
      title: 'Daily check in',
      description: 'Notice and name how you are feeling today.',
    },
    loading: 'Gathering words for feelings...',
    title: 'How are you today?',
    intro:
      'Take a moment to notice what is here, and pick the words that fit. There is no right answer, and you can change it later in the day.',
    formHeading: 'What are you feeling?',
    selectedHeading: 'Your words for today',
    remove: (word: string) => `Remove ${word}`,
    commonHeading: 'Some common feelings',
    searchLabel: 'Find another word',
    searchPlaceholder: 'For example, restless',
    matches: (n: number) =>
      plural(n, { one: `${n} match`, other: `${n} matches` }),
    noMatches: 'No word matches that yet. Try a shorter part of it.',
    noteLabel: 'Add a note, if you like',
    notePlaceholder: 'What is happening today?',
    notePrivacy: 'Only you can see your check-ins.',
    saving: 'Saving...',
    update: 'Update check-in',
    save: 'Save check-in',
    chooseOne: 'Choose at least one word to save.',
    saved: 'Saved. Thank you for pausing to notice how you are.',
    saveError: 'We could not save your check-in just now. Please try again.',
    historyHeading: 'Recent days',
    historyEmpty: 'Your check-ins will gather here, one line per day.',
    weekHeading: 'This week',
    /** One sentence in parts; the feeling word sits in bold between them. */
    cameUp: (count: number) => ({
      before: '',
      after: ` came up ${howOften(count)} this week.`,
    }),
    pointsToNeeds: (needs: ReadonlyArray<string>) =>
      `It often points to a need for ${joinWithOr(needs)}.`,
    balanceLabel: 'Pleasant and unpleasant feelings this week',
    pleasantPercent: (percent: number) => `Pleasant ${percent}%`,
    unpleasantPercent: (percent: number) => `Unpleasant ${percent}%`,
    balanceNote:
      'Both kinds are welcome. Each one points to something that matters to you.',
    didYouKnowHeading: 'Did you know',
    didYouKnowText:
      'Putting a feeling into words can soften it a little and help you think more clearly about what you need.',
  },

  intensity: {
    meta: {
      title: 'Feeling intensity',
      description: 'See how a feeling shifts as its intensity rises and falls.',
    },
    loading: 'Gathering feelings...',
    title: 'How strong is it?',
    intro:
      'The same feeling can be faint or intense. Choose a family, then move along the scale to find the word that matches how much you feel.',
    familiesHeading: 'Families',
    scaleHeading: (family: string) => `${family}, from faint to intense`,
    sliderLabel: 'How strong',
    sliderValue: (level: string, word: string) => `${level}: ${word}`,
    noWordAtLevel: (level: string) =>
      `No word in this family sits at ${level.toLowerCase()} yet. Try a step softer or stronger.`,
    spectrumHeading: 'Every word in this family, softest first',
    spectrumItem: (word: string, level: string) =>
      `${word}, ${level.toLowerCase()}`,
  },

  library: {
    meta: {
      title: 'Your saved feelings',
      description: 'The feelings you have explored and saved.',
    },
    loading: 'Opening your library...',
    title: 'Your saved feelings',
    intro:
      'The words you have kept to come back to. Reading them now and then makes them easier to reach for when it matters.',
    removed: (word: string) => `Removed ${word} from your library.`,
    removeError: (word: string) => `We could not remove ${word} just now.`,
    /** These three form one sentence around a link to the browse page. */
    empty: {
      before:
        'Nothing saved yet. When a word fits something you have felt, save it while you ',
      linkText: 'browse feelings',
      after: ' and it will wait for you here.',
    },
    searchLabel: 'Search your saved feelings',
    familyLabel: 'Family',
    allFamilies: 'All families',
    savedCount: (n: number) => `${n} saved`,
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    findMore: 'Find more words',
    /** "Moderate, unpleasant, angry" */
    detail: (description: string, family: string) =>
      `${description}, ${family}`,
    remove: (word: string) => `Remove ${word}`,
    noMatches:
      'None of your saved feelings match. Try another search or family.',
  },

  wheel: {
    meta: {
      title: 'Browse feelings',
      description:
        'Explore feelings by family, with definitions, examples and related words.',
    },
    loading: 'Gathering feelings...',
    title: 'Browse feelings',
    intro:
      'Feelings grouped into families. Choose any word to see what it means, how it sounds in a sentence, and the words close to it.',
    searchLabel: 'Search all feelings',
    searchPlaceholder: 'For example, calm',
    showHeading: 'Show',
    categoryAll: 'All',
    familiesHeading: 'Families',
    /** One sentence followed by a link to the intensity page. */
    intensityPrompt: 'Want to see one feeling grow stronger? ',
    intensityLink: 'Explore intensity',
    gridHeadingSearch: (term: string) => `Feelings matching “${term}”`,
    gridHeadingFamily: (family: string) => `${family} feelings`,
    noMatches:
      'No feelings match these choices. Try another family, or show all feelings.',
    /** "Moderate, unpleasant, in the angry family" */
    detail: (description: string, family: string) =>
      `${description}, in the ${family} family`,
    close: (word: string) => `Close ${word}`,
    meaningHeading: 'What it means',
    sentenceHeading: 'In a sentence',
    similarHeading: 'Similar words',
    relatedHeading: 'Related feelings',
    remove: 'Remove from your library',
    save: 'Save to your library',
    saved: 'Saved to your library.',
    removed: 'Removed from your library.',
    saveError: 'We could not save this word just now.',
    removeError: 'We could not remove this word just now.',
    inLibrary: 'This word is in your library.',
    choosePrompt:
      'Choose a feeling to see its meaning, an example, and related words.',
  },

  quiz: {
    meta: {
      title: 'Feeling or thought',
      description:
        'Practice telling real feelings apart from thoughts about other people.',
    },
    title: 'Feeling or thought?',
    intro:
      'A feeling describes what is going on inside you. A thought dressed as a feeling, like “I feel ignored”, describes what you think someone else did. Read each sentence and sort it.',
    levelsHeading: 'Choose where to start',
    levels: {
      clear: {
        title: 'Level 1: clear cases',
        text: 'Thoughts that are easy to spot once you look for them.',
      },
      disguised: {
        title: 'Level 2: judgments in disguise',
        text: 'Words like ignored or used, which sound like feelings but describe what someone did.',
      },
      subtle: {
        title: 'Level 3: subtle cases',
        text: 'Sentences where the line is fine and worth slowing down for.',
      },
    },
    roundLength: 'Each round is ten sentences.',
    loading: 'Gathering sentences...',
    emptyHeading: 'No sentences here yet',
    emptyText:
      'This level has no questions for now. Another level may have some.',
    chooseAnotherLevel: 'Choose another level',
    progress: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    questionHeading: 'Is this a feeling, or a thought?',
    answerFeeling: 'A feeling',
    answerThought: 'A thought',
    answerError: 'We could not record that answer just now. Please try again.',
    verdict: {
      correctFeeling: 'Yes, that one is a feeling.',
      correctThought: 'Yes, that one is a thought dressed as a feeling.',
      wrongFeeling: 'That one is a feeling, after all.',
      wrongThought: 'That one is a thought dressed as a feeling.',
    },
    insteadLabel: 'Feelings you could name instead: ',
    leveledUp: 'You have moved up a quiz level.',
    next: 'Next sentence',
    finish: 'See how it went',
    summary: (sorted: number, total: number) =>
      `You sorted ${sorted} of ${total}.`,
    missedIntro:
      'The ones worth a second look are below. They are often the ones that stick.',
    missedFeeling: 'This one is a feeling.',
    missedThought: 'This one is a thought dressed as a feeling.',
    allCorrect:
      'Every sentence landed where it belongs. The next level is there whenever you feel ready.',
    playAgain: 'Play again',
    backToFeelings: 'Back to feelings',
  },
}
