import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

/** "repos, lien ou soutien" */
function joinWithOr(words: ReadonlyArray<string>): string {
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} ou ${words[words.length - 1]}`
}

/** "une fois", "deux fois", "plusieurs fois": how often a feeling came up. */
function howOften(count: number): string {
  if (count <= 1) return 'une fois'
  if (count === 2) return 'deux fois'
  if (count <= 4) return 'plusieurs fois'
  return 'souvent'
}

export const feelings: Messages['feelings'] = {
  page: {
    back: 'Sentiments',
    inASentence: 'En une phrase : ',
  },

  scale: {
    intensity: {
      faint: 'Très léger',
      mild: 'Léger',
      moderate: 'Modéré',
      strong: 'Fort',
      intense: 'Intense',
    },
    category: {
      pleasant: 'Agréable',
      unpleasant: 'Désagréable',
    },
    describe: (intensity: string, category: string) =>
      `${intensity}, ${category.toLowerCase()}`,
  },

  hub: {
    meta: {
      title: 'Sentiments',
      description:
        'Enrichis ton vocabulaire pour nommer précisément ce que tu ressens.',
    },
    title: 'Trouve les mots pour ce que tu ressens.',
    intro:
      "Les sentiments sont la deuxième étape d'un message bienveillant. Plus tu as de mots pour les dire, plus il est facile d'exprimer ce qui se passe vraiment, et de distinguer un sentiment d'une pensée sur quelqu'un d'autre.",
    guide:
      "Nommer ce que tu ressens, c'est là que commence la bienveillance. Prends ton temps. Il n'y a pas de mauvaise réponse.",
    today: {
      doneHeading: 'Tu as fait ton point du jour.',
      notDoneHeading: "Comment vas-tu aujourd'hui ?",
      doneText:
        'Tu peux revoir ce que tu as noté, ou le modifier si ta journée a évolué.',
      notDoneText:
        "Prends une minute et choisis les mots qui conviennent. Une petite note est la bienvenue, et personne d'autre que toi ne la verra.",
      doneAction: 'Ouvrir le point du jour',
      notDoneAction: 'Faire le point du jour',
    },
    toolsHeading: "D'autres façons d'explorer",
    tools: {
      wheel: {
        title: 'Parcourir les sentiments',
        text: 'Les sentiments classés par famille, chacun avec une définition, des exemples et des mots proches.',
      },
      intensity: {
        title: 'Quelle intensité',
        text: "Vois comment un sentiment évolue en s'adoucissant ou en s'intensifiant, pour dire à quel point.",
      },
      library: {
        title: 'Tes sentiments enregistrés',
        text: 'Les mots que tu as gardés pour y revenir.',
      },
      quiz: {
        title: 'Sentiment ou pensée',
        text: "De courtes phrases à trier : est-ce un sentiment, ou une pensée sur quelqu'un d'autre ?",
      },
    },
    whyItHelps:
      "Pourquoi ça aide : un sentiment nommé avec précision se partage plus facilement sans reproche, et l'autre l'entend plus facilement. Des mots comme « ignoré » ou « jugé » décrivent ce que tu penses que quelqu'un a fait. Les sentiments en dessous, peut-être la solitude ou la peine, t'appartiennent et sont à partager.",
  },

  checkIn: {
    meta: {
      title: 'Point du jour',
      description: "Remarque et nomme ce que tu ressens aujourd'hui.",
    },
    loading: 'On rassemble les mots des sentiments...',
    title: "Comment vas-tu aujourd'hui ?",
    intro:
      "Prends un moment pour remarquer ce qui est là, et choisis les mots qui conviennent. Il n'y a pas de bonne réponse, et tu pourras la modifier plus tard dans la journée.",
    formHeading: 'Que ressens-tu ?',
    selectedHeading: "Tes mots d'aujourd'hui",
    remove: (word: string) => `Retirer ${word}`,
    commonHeading: 'Quelques sentiments courants',
    searchLabel: 'Chercher un autre mot',
    searchPlaceholder: 'Par exemple : agitation',
    matches: (n: number) =>
      plural(n, { one: `${n} résultat`, other: `${n} résultats` }),
    noMatches:
      'Aucun mot ne correspond pour le moment. Essaie avec un bout plus court.',
    noteLabel: 'Ajoute une note, si tu veux',
    notePlaceholder: "Que se passe-t-il aujourd'hui ?",
    notePrivacy: 'Tes points du jour ne sont visibles que par toi.',
    saving: 'Enregistrement...',
    update: 'Mettre à jour',
    save: 'Enregistrer',
    chooseOne: 'Choisis au moins un mot pour enregistrer.',
    saved:
      "C'est enregistré. Merci d'avoir pris le temps de remarquer comment tu vas.",
    saveError:
      "Impossible d'enregistrer ton point du jour pour le moment. Réessaie, s'il te plaît.",
    historyHeading: 'Les derniers jours',
    historyEmpty:
      "Tes points du jour viendront s'ajouter ici, une ligne par jour.",
    weekHeading: 'Cette semaine',
    cameUp: (count: number) => ({
      before: '',
      after: ` est revenu ${howOften(count)} cette semaine.`,
    }),
    pointsToNeeds: (needs: ReadonlyArray<string>) =>
      `Ce sentiment renvoie souvent à un besoin : ${joinWithOr(needs)}.`,
    balanceLabel: 'Sentiments agréables et désagréables cette semaine',
    pleasantPercent: (percent: number) => `Agréables ${percent} %`,
    unpleasantPercent: (percent: number) => `Désagréables ${percent} %`,
    balanceNote:
      'Les deux sont les bienvenus. Chacun renvoie à quelque chose qui compte pour toi.',
    didYouKnowHeading: 'Le savais-tu ?',
    didYouKnowText:
      "Mettre un sentiment en mots peut l'apaiser un peu et t'aider à voir plus clairement ce dont tu as besoin.",
  },

  intensity: {
    meta: {
      title: 'Intensité des sentiments',
      description:
        'Vois comment un sentiment évolue quand son intensité monte ou descend.',
    },
    loading: 'On rassemble les sentiments...',
    title: 'Quelle intensité ?',
    intro:
      "Un même sentiment peut être très léger ou intense. Choisis une famille, puis déplace-toi sur l'échelle pour trouver le mot qui correspond à ce que tu ressens.",
    familiesHeading: 'Familles',
    scaleHeading: (family: string) =>
      `${family}, du plus léger au plus intense`,
    sliderLabel: 'Intensité',
    sliderValue: (level: string, word: string) => `${level} : ${word}`,
    noWordAtLevel: (level: string) =>
      `Aucun mot de cette famille n'est encore au niveau « ${level.toLowerCase()} ». Essaie un cran plus doux ou plus fort.`,
    spectrumHeading:
      'Tous les mots de cette famille, du plus doux au plus fort',
    spectrumItem: (word: string, level: string) =>
      `${word}, ${level.toLowerCase()}`,
  },

  library: {
    meta: {
      title: 'Tes sentiments enregistrés',
      description: 'Les sentiments que tu as explorés et enregistrés.',
    },
    loading: 'Ouverture de ta bibliothèque...',
    title: 'Tes sentiments enregistrés',
    intro:
      'Les mots que tu as gardés pour y revenir. Les relire de temps en temps les rend plus faciles à trouver quand ça compte.',
    removed: (word: string) => `${word} a été retiré de ta bibliothèque.`,
    removeError: (word: string) =>
      `Impossible de retirer ${word} pour le moment.`,
    empty: {
      before:
        "Rien d'enregistré pour l'instant. Quand un mot correspond à quelque chose que tu as ressenti, enregistre-le en allant ",
      linkText: 'parcourir les sentiments',
      after: ", et il t'attendra ici.",
    },
    searchLabel: 'Chercher dans tes sentiments enregistrés',
    familyLabel: 'Famille',
    allFamilies: 'Toutes les familles',
    savedCount: (n: number) =>
      plural(n, { one: `${n} enregistré`, other: `${n} enregistrés` }),
    showing: (shown: number, total: number) => `${shown} sur ${total}`,
    findMore: "Trouver d'autres mots",
    detail: (description: string, family: string) =>
      `${description}, famille « ${family} »`,
    remove: (word: string) => `Retirer ${word}`,
    noMatches:
      'Aucun de tes sentiments enregistrés ne correspond. Essaie une autre recherche ou une autre famille.',
  },

  wheel: {
    meta: {
      title: 'Parcourir les sentiments',
      description:
        'Explore les sentiments par famille, avec des définitions, des exemples et des mots proches.',
    },
    loading: 'On rassemble les sentiments...',
    title: 'Parcourir les sentiments',
    intro:
      "Les sentiments regroupés en familles. Choisis un mot pour voir ce qu'il veut dire, comment il sonne dans une phrase, et les mots qui en sont proches.",
    searchLabel: 'Chercher parmi tous les sentiments',
    searchPlaceholder: 'Par exemple : calme',
    showHeading: 'Afficher',
    categoryAll: 'Tous',
    familiesHeading: 'Familles',
    intensityPrompt: 'Envie de voir un sentiment gagner en intensité ? ',
    intensityLink: "Explorer l'intensité",
    gridHeadingSearch: (term: string) =>
      `Sentiments correspondant à « ${term} »`,
    gridHeadingFamily: (family: string) => `Famille : ${family}`,
    noMatches:
      'Aucun sentiment ne correspond à ces choix. Essaie une autre famille, ou affiche tous les sentiments.',
    detail: (description: string, family: string) =>
      `${description}, famille « ${family} »`,
    close: (word: string) => `Fermer ${word}`,
    meaningHeading: 'Ce que ça veut dire',
    sentenceHeading: 'Dans une phrase',
    similarHeading: 'Mots proches',
    relatedHeading: 'Sentiments liés',
    remove: 'Retirer de ta bibliothèque',
    save: 'Ajouter à ta bibliothèque',
    saved: 'Ajouté à ta bibliothèque.',
    removed: 'Retiré de ta bibliothèque.',
    saveError: "Impossible d'enregistrer ce mot pour le moment.",
    removeError: 'Impossible de retirer ce mot pour le moment.',
    inLibrary: 'Ce mot est dans ta bibliothèque.',
    choosePrompt:
      'Choisis un sentiment pour voir sa définition, un exemple et des mots liés.',
  },

  quiz: {
    meta: {
      title: 'Sentiment ou pensée',
      description:
        'Entraîne-toi à distinguer les vrais sentiments des pensées sur les autres.',
    },
    title: 'Sentiment ou pensée ?',
    intro:
      "Un sentiment décrit ce qui se passe en toi. Une pensée déguisée en sentiment, comme « je me sens ignoré », décrit ce que tu penses que quelqu'un d'autre a fait. Lis chaque phrase et classe-la.",
    levelsHeading: 'Choisis par où commencer',
    levels: {
      clear: {
        title: 'Niveau 1 : les cas clairs',
        text: "Des pensées faciles à repérer dès qu'on y prête attention.",
      },
      disguised: {
        title: 'Niveau 2 : les jugements déguisés',
        text: "Des mots comme ignoré ou utilisé, qui ressemblent à des sentiments mais décrivent ce que quelqu'un a fait.",
      },
      subtle: {
        title: 'Niveau 3 : les cas subtils',
        text: 'Des phrases où la limite est fine et qui méritent de ralentir.',
      },
    },
    roundLength: 'Chaque manche compte dix phrases.',
    loading: 'On rassemble les phrases...',
    emptyHeading: 'Pas encore de phrases ici',
    emptyText:
      "Ce niveau n'a pas de questions pour l'instant. Un autre niveau en a peut-être.",
    chooseAnotherLevel: 'Choisir un autre niveau',
    progress: (current: number, total: number) =>
      `Question ${current} sur ${total}`,
    questionHeading: 'Est-ce un sentiment, ou une pensée ?',
    answerFeeling: 'Un sentiment',
    answerThought: 'Une pensée',
    answerError:
      "Impossible d'enregistrer cette réponse pour le moment. Réessaie, s'il te plaît.",
    verdict: {
      correctFeeling: "Oui, c'est bien un sentiment.",
      correctThought: "Oui, c'est une pensée déguisée en sentiment.",
      wrongFeeling: 'En fait, celle-ci est un sentiment.',
      wrongThought: 'Celle-ci est une pensée déguisée en sentiment.',
    },
    insteadLabel: 'Des sentiments que tu pourrais nommer à la place : ',
    leveledUp: 'Tu passes au niveau suivant du quiz.',
    next: 'Phrase suivante',
    finish: 'Voir le bilan',
    summary: (sorted: number, total: number) =>
      `Tu en as bien classé ${sorted} sur ${total}.`,
    missedIntro:
      "Celles qui méritent un second regard sont ci-dessous. Ce sont souvent celles qu'on retient le mieux.",
    missedFeeling: 'Celle-ci est un sentiment.',
    missedThought: 'Celle-ci est une pensée déguisée en sentiment.',
    allCorrect:
      "Chaque phrase a trouvé sa place. Le niveau suivant t'attend dès que tu en as envie.",
    playAgain: 'Rejouer',
    backToFeelings: 'Retour aux sentiments',
  },
}
