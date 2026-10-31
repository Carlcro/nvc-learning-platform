import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

export const learn: Messages['learn'] = {
  meta: {
    hub: {
      title: 'Leçons',
      description:
        'Six leçons de base sur les observations, les sentiments, les besoins et les demandes.',
    },
    introduction: {
      title: 'Introduction à la communication non violente',
      description:
        "Ce qu'est la communication bienveillante, et pourquoi elle change le cours des conversations.",
    },
    observation: {
      title: 'Observer sans évaluer',
      description:
        'Décrire ce que tu vois et entends sans jugement, la première étape de la CNV.',
    },
    feeling: {
      title: 'Reconnaître et exprimer ses sentiments',
      description:
        'Distinguer les vrais sentiments des pensées, et nommer ses émotions avec sincérité.',
    },
    need: {
      title: 'Relier ses sentiments à ses besoins',
      description:
        'Trouver le besoin humain universel qui se cache derrière un sentiment.',
    },
    request: {
      title: 'Formuler des demandes claires',
      description:
        'Demander quelque chose de concret et faisable, sans en faire une exigence.',
    },
    integration: {
      title: 'Tout assembler',
      description:
        'Réunir observation, sentiment, besoin et demande en un seul message clair.',
    },
  },
  loading: {
    hub: 'On rassemble tes leçons...',
    lesson: 'Ouverture de la leçon...',
  },
  hub: {
    title: 'Six courtes leçons, une seule compétence.',
    intro: (totalMinutes: number) =>
      `Chaque leçon aborde une étape de la communication non violente, l'illustre avec quelques exemples concrets et se termine par une petite vérification. L'ensemble prend environ ${totalMinutes} minutes, et tu peux t'arrêter quand tu veux.`,
    allFinished:
      'Tu as terminé les six leçons. Reviens sur celle que tu veux, quand tu veux.',
    finishedCount: (done: number, total: number) =>
      plural(done, {
        one: `${done} sur ${total} terminée`,
        other: `${done} sur ${total} terminées`,
      }),
    cardMeta: (order: number, minutes: number) =>
      `Leçon ${order}, ${minutes} min`,
    cardUpNext: ', la prochaine',
    done: 'Terminée',
    start: 'Commencer',
    open: 'Ouvrir',
  },
  page: {
    notFound: 'Cette leçon est introuvable.',
    backToLessons: 'Retour à toutes les leçons',
    allLessons: 'Toutes les leçons',
    lessonOf: (number: number, total: number) => `Leçon ${number} sur ${total}`,
    duration: (minutes: number) =>
      plural(minutes, {
        one: `Environ ${minutes} minute`,
        other: `Environ ${minutes} minutes`,
      }),
    completed: 'Terminée',
    pointsHeading: 'Quatre repères à garder',
    takeawaysHeading: 'À retenir',
    nextLesson: (shortName: string) => `Suivante : ${shortName}`,
    tryPractice: "Essayer une conversation d'entraînement",
    practice: 'Pratique',
    navLabel: 'Leçons',
    foundations: {
      title: 'Tu as terminé les bases.',
      text: "Les quatre étapes sont maintenant à toi. Elles deviennent naturelles quand tu les utilises avec quelqu'un qui te répond, alors une conversation d'entraînement est une bonne suite.",
    },
    examples: {
      counter: (index: number, total: number) =>
        `Exemple ${index} sur ${total}`,
      whyItMatters: "Pourquoi c'est important : ",
      previous: 'Exemple précédent',
      next: 'Exemple suivant',
    },
  },
  quiz: {
    heading: 'Vérifie ta compréhension',
    questionOf: (index: number, total: number) =>
      `Question ${index} sur ${total}`,
    notQuite: 'Pas tout à fait.',
    missedBefore: 'Jette un œil aux autres options, ou ',
    showAnswer: 'affiche la réponse',
    missedAfter: '.',
    foundFirstTry: "Oui, c'est celle-là.",
    foundLater: "C'est bien celle-là.",
    previousQuestion: 'Question précédente',
    nextQuestion: 'Question suivante',
    finish: 'Terminer',
    checkAnswer: 'Vérifier ma réponse',
    finishedTitle: 'Tu as terminé cette leçon.',
    firstLookSummary: (found: number, total: number) =>
      `Tu as trouvé ${found} sur ${total} du premier coup.`,
    secondLookNote:
      "Celles qui ont demandé un second regard sont souvent celles qu'on retient le mieux.",
    tryAgain: 'Refaire les questions',
  },
  lessons: {
    introduction: {
      shortName: 'Introduction',
      heading: "Qu'est-ce que la communication non violente ?",
      aside: {
        label: 'Pourquoi une girafe',
        text: "Rosenberg a choisi la girafe parce qu'elle a le plus gros cœur de tous les animaux terrestres, et un long cou qui lui permet de voir une situation de plus haut.",
      },
      points: [
        {
          title: 'Observation',
          text: "Ce qui s'est passé, sans verdict.",
        },
        { title: 'Sentiment', text: "L'émotion que tu remarques en toi." },
        {
          title: 'Besoin',
          text: 'Ce qui compte pour toi derrière ce sentiment.',
        },
        { title: 'Demande', text: 'Une chose concrète qui aiderait.' },
      ],
      examples: {
        heading: 'Le même moment, de deux façons',
        giraffe: 'Girafe',
        jackal: 'Chacal',
      },
      takeaways: [
        "La CNV est une façon de parler et d'écouter qui garde les deux personnes dans la conversation.",
        'Elle a quatre étapes : observation, sentiment, besoin et demande.',
        'Le langage girafe cherche à comprendre. Le langage chacal juge, accuse et exige.',
        "Tout le monde parle chacal parfois. L'exercice consiste à le remarquer et à réessayer.",
      ],
    },
    observation: {
      shortName: 'Observations',
      heading: "Dis ce qu'une caméra verrait",
      aside: {
        label: 'Un petit test',
        text: "Une vidéo pourrait-elle le montrer ? « Tu as laissé la vaisselle dans l'évier » passe le test. « Tu n'aides jamais » non, car aucune caméra ne peut filmer « jamais ».",
      },
      points: [
        {
          title: 'Décrire, pas juger',
          text: "Nomme l'action, pas le genre de personne qu'elle ferait de l'autre.",
        },
        {
          title: 'Viser la précision',
          text: "Un moment, un lieu ou un chiffre passent mieux qu'un résumé.",
        },
        {
          title: 'Oublier toujours et jamais',
          text: "Les absolus transforment un moment en verdict sur le caractère de quelqu'un.",
        },
        {
          title: 'Faire court',
          text: 'Une phrase claire suffit pour commencer.',
        },
      ],
      examples: {
        heading: 'Observation ou évaluation ?',
        giraffe: 'Observation',
        jackal: 'Évaluation',
      },
      takeaways: [
        "Une observation décrit ce qui s'est passé, sans jugement.",
        'Les détails précis passent mieux que les généralités.',
        'Des mots comme toujours et jamais signalent souvent une évaluation.',
        'Une observation claire donne aux trois autres étapes une base solide.',
      ],
    },
    feeling: {
      shortName: 'Sentiments',
      heading: "Nomme l'émotion elle-même",
      aside: {
        label: "Attention à « j'ai l'impression que »",
        text: "« J'ai l'impression que... » et « Je sens que... » sont presque toujours suivis d'une pensée. Essaie plutôt de finir la phrase par un seul mot d'émotion.",
      },
      points: [
        {
          title: 'Les sentiments',
          text: 'Des émotions que tu remarques en toi : tristesse, inquiétude, soulagement, joie.',
        },
        {
          title: 'Des pensées déguisées en sentiments',
          text: "Des mots comme ignoré, rejeté ou trahi décrivent ce que quelqu'un t'a fait.",
        },
        {
          title: "L'assumer",
          text: "« J'ai de la peine » garde le sentiment à toi. « Tu m'as fait de la peine » le met sur le dos de l'autre.",
        },
        {
          title: 'Utiliser la bibliothèque des sentiments',
          text: 'Quand le bon mot ne vient pas, parcourir une liste aide.',
        },
      ],
      examples: {
        heading: 'Sentiment ou pensée ?',
        giraffe: 'Un sentiment',
        jackal: 'Une pensée',
      },
      takeaways: [
        "Un sentiment est une émotion. Un pseudo-sentiment porte un jugement sur quelqu'un d'autre.",
        "« J'ai l'impression que » et « je sens que » introduisent souvent une pensée.",
        "Assumer ton sentiment aide l'autre à rester avec toi.",
        "Si le mot ne vient pas, la bibliothèque des sentiments peut t'aider à le trouver.",
      ],
    },
    need: {
      shortName: 'Besoins',
      heading: 'Ce qui compte, au fond',
      aside: {
        label: 'Besoin ou stratégie ?',
        text: "Si une seule personne en particulier peut y répondre, c'est sans doute une stratégie. « De l'aide pour la vaisselle » est une stratégie. Le soutien et l'équité sont les besoins qu'elle sert.",
      },
      points: [
        {
          title: 'Partagés par tous',
          text: 'Repos, sécurité, respect, lien, sens : des besoins que tout être humain peut avoir.',
        },
        {
          title: 'Pas une stratégie',
          text: '« Dîner ensemble » ou « appelle-moi » sont des façons de répondre à un besoin, pas le besoin lui-même.',
        },
        {
          title: 'Plusieurs chemins',
          text: "Une fois le besoin nommé, plus d'une solution peut y répondre.",
        },
        {
          title: "L'autre aussi",
          text: "L'autre personne a des besoins au même moment. S'y intéresser aide.",
        },
      ],
      examples: {
        heading: 'Nommer le besoin',
        giraffe: 'Nomme le besoin',
        jackal: 'Insiste sur une stratégie',
      },
      takeaways: [
        "Les besoins sont communs à tous. Les stratégies sont des façons particulières d'y répondre.",
        "Nommer le besoin ouvre plus d'un chemin.",
        'Un même besoin peut être satisfait par bien des stratégies différentes.',
        "L'autre a aussi des besoins, et s'y intéresser crée du lien.",
      ],
    },
    request: {
      shortName: 'Demandes',
      heading: 'Demande une chose faisable',
      aside: {
        label: 'Demande ou exigence ?',
        text: "Tu le découvres à ce qui se passe après un non. Si tu restes à l'écoute de ses raisons, c'était une demande.",
      },
      points: [
        {
          title: 'Concrète',
          text: "Quelque chose que l'on peut vraiment faire, aujourd'hui ou cette semaine.",
        },
        {
          title: 'Positive',
          text: "Demande ce que tu veux, pas ce que tu veux qu'on arrête.",
        },
        {
          title: 'De la place pour un non',
          text: "« Serais-tu d'accord pour... » veut dire que la réponse est vraiment ouverte.",
        },
        {
          title: 'Un non est une information',
          text: "Il te renseigne sur les besoins de l'autre, et la conversation peut continuer.",
        },
      ],
      examples: {
        heading: 'Demande ou exigence ?',
        giraffe: 'Une demande',
        jackal: 'Une exigence',
      },
      takeaways: [
        "Une demande est concrète et faisable, pour que l'autre sache ce que tu demandes.",
        'Demande ce que tu veux plutôt que ce que tu veux voir cesser.',
        "Une demande laisse l'autre libre de dire non.",
        'Un non ouvre une conversation sur les besoins de chacun.',
      ],
    },
    integration: {
      shortName: 'Tout assembler',
      heading: 'Un message, quatre étapes',
      aside: {
        label: 'La forme complète',
        text: "Quand j'ai vu [observation], j'ai ressenti [sentiment], parce que j'ai besoin de [besoin]. Serais-tu d'accord pour [demande] ?",
      },
      points: [
        {
          title: 'Observation',
          text: "Ce qui s'est passé, sans verdict.",
        },
        { title: 'Sentiment', text: "L'émotion que tu as remarquée en toi." },
        { title: 'Besoin', text: 'Ce qui comptait pour toi derrière.' },
        { title: 'Demande', text: 'Une chose concrète qui aiderait.' },
      ],
      examples: {
        heading: 'Le message complet',
        giraffe: 'Les quatre étapes',
        jackal: 'Chacal',
      },
      takeaways: [
        'Ensemble, les quatre étapes forment un message complet.',
        "Dans une vraie conversation, elles peuvent arriver sur plusieurs messages, et c'est très bien.",
        "Connaître la forme complète aide à repérer l'étape qui manque.",
        "C'est en t'entraînant que cette forme finit par te ressembler.",
      ],
    },
  },
}
