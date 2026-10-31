import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

/** "de Sam", "d'Anna": the preposition, elided before a vowel or a mute h. */
function de(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? `d'${name}` : `de ${name}`
}

export const practice: Messages['practice'] = {
  focusAreas: {
      boundary_setting: 'poser une limite',
      conflict_resolution: 'résoudre un conflit',
      feedback_response: 'répondre à une critique',
      feedback_and_sensitivity: 'critique et sensibilité',
      appreciation: 'exprimer sa gratitude',
      apology: 'présenter des excuses',
      request_making: 'formuler une demande',
      empathy: 'empathie',
      emotional_intimacy: 'intimité émotionnelle',
      friendship_and_reliability: 'amitié et fiabilité',
      parental_independence: "autonomie face à ses parents",
      parenting_partnership: 'élever un enfant à deux',
      responsibility_and_fairness: 'responsabilité et équité',
      workplace_conflict: 'conflit au travail',
  },
  meta: {
    hub: {
      title: 'Pratique',
      description:
        "Répète une conversation difficile avec un partenaire d'entraînement qui répond dans son rôle.",
    },
    brief: {
      title: 'Le scénario',
      description:
        'Découvre la situation et la personne avec qui tu vas parler.',
    },
    create: {
      title: 'Créer un scénario',
      description:
        "Construis un scénario à partir d'une vraie situation de ta vie, puis entraîne-toi.",
    },
  },

  categories: {
    workplace: 'Travail',
    family: 'Famille',
    friendship: 'Amitié',
    self_expression: 'Expression de soi',
  },

  difficulties: {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  },

  tryAgainError: "Ça n'a pas marché. Respire un coup et réessaie.",
  readyWhenYouAre: 'Quand tu veux. Prends ton temps.',
  starsLabel: (stars: number) =>
    plural(stars, {
      one: `${stars} étoile sur 3`,
      other: `${stars} étoiles sur 3`,
    }),
  aboutCharacter: (name: string) => `À propos ${de(name)}`,
  situation: 'Situation',
  personality: 'Personnalité',
  background: 'Contexte',
  whatYoullPractice: 'Ce que tu vas travailler',

  hub: {
    title: 'Avec qui veux-tu parler ?',
    intro:
      'Tous les scénarios sont ouverts. Choisis une situation proche de la tienne, ou commence par la suggestion ci-dessous.',
    levelNote: (level: number, pointsToNext?: number) =>
      pointsToNext !== undefined && pointsToNext > 0
        ? plural(pointsToNext, {
            one: `Niveau ${level}, encore ${pointsToNext} point avant le suivant`,
            other: `Niveau ${level}, encore ${pointsToNext} points avant le suivant`,
          })
        : `Niveau ${level}`,
    suggestion: {
      waitingEyebrow: 'Reprends là où tu en étais',
      waitingNote: (name: string) => `Ta conversation avec ${name} t'attend.`,
      firstEyebrow: 'Un bon point de départ',
      nextEyebrow: 'Suggestion pour la suite',
      continue: 'Continuer',
      tryAgain: 'Recommencer',
      start: 'Commencer',
    },
    rehearse: {
      title: 'Prépare une vraie conversation',
      body: "Une discussion difficile t'attend ? Fais-en un espace d'entraînement et essaie, en douceur, ce que tu veux dire avant le moment venu.",
      action: 'Préparer ma conversation',
    },
    yourScenarios: 'Tes propres scénarios',
    library: 'Bibliothèque de scénarios',
    allCategories: 'Tous les thèmes',
    allDifficulties: 'Tous les niveaux',
    filterByCategory: 'Filtrer les scénarios par thème',
    filterByDifficulty: 'Filtrer les scénarios par niveau',
    loading: 'Chargement des scénarios',
    noMatches: 'Aucun scénario ne correspond à ces filtres.',
    clearFilters: 'Effacer les filtres',
    empty:
      "Aucun scénario pour l'instant. Tu peux quand même préparer le tien juste au-dessus.",
    onePiece: {
      title: 'Une étape à la fois',
      body: 'Une vraie conversation se construit peu à peu. Dis ce que tu as vu, puis ce que tu as ressenti, ce qui compte pour toi, et ce que tu aimerais. Une étape par message suffit, les autres viendront en leur temps.',
    },
    deleteDialog: {
      title: 'Supprimer ce scénario ?',
      descriptionBefore: 'Le scénario ',
      descriptionAfter: ' et son historique seront supprimés définitivement.',
      keep: 'Le garder',
      delete: 'Supprimer',
      deleting: 'Suppression…',
    },
  },

  card: {
    categoryAndDifficulty: (category: string, difficulty: string) =>
      `${category}, ${difficulty.toLowerCase()}`,
    deleteLabel: (title: string) => `Supprimer ${title}`,
    deleteTitle: 'Supprimer',
    withCharacter: (name: string) => `avec ${name}`,
    aboveLevel: (minLevel: number) =>
      `En général abordé à partir du niveau ${minLevel}. Il t'est ouvert dès maintenant si tu veux un défi.`,
    status: {
      in_progress: 'En cours',
      attempted: 'Essayé une fois',
      completed: 'Terminé',
    },
    suggestedNext: 'Suggestion pour la suite',
    viewBest: 'Voir ton meilleur essai',
    actions: {
      continue: 'Continuer',
      improve: "S'améliorer",
      tryAgain: 'Recommencer',
      start: 'Commencer',
    },
  },

  brief: {
    loading: 'On prépare le décor de ta conversation…',
    notFound: {
      title: 'Ce scénario est introuvable',
      body: "Il a peut-être été supprimé, ou le lien n'est plus valide.",
    },
    back: 'Retour aux scénarios',
    focus: 'Axe :',
    onePiece: {
      lead: 'Une étape à la fois.',
      body: 'Une vraie conversation se construit peu à peu : une observation dans un message, un sentiment dans le suivant, une demande plus tard. Inutile de tout mettre dans un seul message.',
    },
    tipsTitle: 'Les quatre étapes, pour mémoire',
    tips: {
      observation:
        'Observation : décris ce que tu as vu ou entendu, sans jugement.',
      feeling:
        "Sentiment : nomme l'émotion elle-même, pas une pensée ni un reproche.",
      need: 'Besoin : dis ce qui compte pour toi derrière ce sentiment.',
      request:
        'Demande : propose une seule chose précise et faisable, en laissant la place à un non.',
    },
    stayCurious: (name: string) =>
      `Intéresse-toi aussi au point de vue et aux besoins ${de(name)}.`,
    best: (score: number) => `Ton record : ${score}/100`,
    attempts: (n: number) =>
      plural(n, { one: `· ${n} essai`, other: `· ${n} essais` }),
    waiting: (name: string, turns: number) =>
      plural(turns, {
        one: `Ta conversation avec ${name} t'attend, après un message.`,
        other: `Ta conversation avec ${name} t'attend, après ${turns} messages.`,
      }),
    startFresh: 'Repartir de zéro',
    starting: "C'est parti...",
    continue: 'Reprendre la conversation',
    start: 'Commencer la conversation',
  },

  create: {
    generateError:
      'Impossible de préparer ça pour le moment. Respire un coup et réessaie.',
    loading: "On prépare ton espace d'entraînement…",
    themFallback: "l'autre",
    guideAlt: 'Ton guide',
    progressLabel: 'Ta progression',
    stages: [
      'La situation',
      "L'autre personne",
      'Ce que tu espères',
      'Ton espace',
    ],
    bubble: {
      situation:
        'Commençons par ce qui te préoccupe. Partage seulement ce que tu veux, et reste simple.',
      person: (name: string) =>
        `Quelques mots sur ${name}, pour que la conversation sonne vrai.`,
      you: 'Maintenant, la partie qui te concerne, et ce que tu espères.',
      refine: (name: string) =>
        `Deux ou trois précisions, pour coller au plus près de ta situation avec ${name}.`,
      review:
        'Voici ton espace. Fais-le tien, et ajuste ce qui ne te correspond pas.',
    },
    backToPractice: 'Retour à la pratique',
    backAStep: 'Étape précédente',
    continue: 'Continuer',
    optional: '(facultatif)',

    situationStep: {
      title: 'La situation',
      who: 'Avec qui as-tu cette conversation ?',
      whoHint: 'Un prénom, ou la façon dont tu parles de cette personne',
      whoPlaceholder: 'Par exemple : Sam',
      relationship: 'Quel est votre lien ?',
      whatsGoingOn: 'En une ou deux phrases, que se passe-t-il ?',
      whatsGoingOnPlaceholder: 'Quelle situation veux-tu préparer ?',
      whatHappened: "Qu'est-ce qui s'est passé, concrètement ?",
      whatHappenedPlaceholder: 'Une chose précise qui a été dite ou faite',
      incompleteHint: 'Indique avec qui et ce qui se passe pour continuer.',
    },

    personStep: {
      title: (name: string) => `À propos ${de(name)}`,
      reactions: 'Comment cette personne réagit-elle quand le ton monte ?',
      chooseAny: 'Choisis tout ce qui correspond',
      whatMatters:
        "D'après toi, qu'est-ce qui compte le plus pour cette personne ici ?",
      whatMattersHint: "Par exemple : le respect, l'écoute, la justice",
      whatMattersPlaceholder: "Qu'y a-t-il derrière sa réaction ?",
      openness: "À quel point t'attends-tu à de l'ouverture au début ?",
      history: 'Autre chose sur cette personne ou sur votre histoire ?',
      historyPlaceholder: 'Seulement si ça aide à imaginer la conversation',
    },

    youStep: {
      title: 'Ce que tu espères',
      feelings: "Qu'est-ce que ça éveille en toi ?",
      feelingsHint: 'Choisis ce qui correspond, ou rien du tout',
      goodOutcome: 'Quelle issue te ferait du bien ?',
      goodOutcomePlaceholder:
        'Ce que tu aimerais ressentir ou entendre à la fin',
      practice: 'Que veux-tu travailler en priorité ?',
      chooseAny: 'Choisis tout ce qui correspond',
      challenge: 'Quel niveau de difficulté ?',
      incompleteHint: "Décris l'issue que tu espères pour continuer.",
    },

    relationships: {
      partner: 'Partenaire',
      familyMember: 'Membre de la famille',
      friend: 'Ami ou amie',
      manager: 'Responsable',
      coworker: 'Collègue',
      roommate: 'Colocataire',
      other: 'Autre',
    },
    reactions: {
      defensive: 'Se met sur la défensive',
      shutsDown: 'Se ferme ou se tait',
      louder: 'Hausse le ton',
      humor: "Esquive avec l'humour",
      calm: 'Reste calme',
      apologizes: "S'excuse très vite",
      past: 'Ressort le passé',
      notSure: 'Je ne sais pas encore',
    },
    openness: {
      guarded: 'Plutôt sur ses gardes',
      mixed: "Sur ses gardes, mais à l'écoute",
      open: "Plutôt dans l'ouverture",
    },
    // Written as nouns so nothing has to agree with the reader's gender.
    feelings: {
      frustrated: 'frustration',
      angry: 'colère',
      irritated: 'agacement',
      upset: 'contrariété',
      sad: 'tristesse',
      disappointed: 'déception',
      lonely: 'solitude',
      discouraged: 'découragement',
      anxious: 'anxiété',
      worried: 'inquiétude',
      overwhelmed: 'débordement',
      resentful: 'rancœur',
    },
    practiceFocus: {
      observation: "Dire ce que j'ai observé sans reproche",
      feelings: 'Nommer mes sentiments',
      needs: 'Me relier à mes besoins',
      request: 'Formuler une demande claire',
      grounded: 'Rester calme si le ton monte',
    },
    challenge: {
      gentle: 'Tout en douceur',
      true: 'Comme en vrai',
      tougher: "Plus coriace que d'habitude",
    },
    otherPersonFallback: "l'autre personne",
    relationshipFallback: "quelqu'un de mon entourage",

    retry: {
      title: 'On réessaie',
      body: 'Impossible de préparer ça pour le moment. Tes réponses sont bien gardées.',
      tryAgain: 'Réessayer',
      backToEditing: 'Revenir aux réponses',
    },

    refine: {
      title: 'Quelques précisions',
      thinking: 'Un instant',
      placeholder: 'Écris ce qui te vient…',
      send: 'Envoyer',
      skip: 'Passer et continuer',
    },

    review: {
      titleLabel: 'Titre',
      standIn: (name: string) =>
        `Ici, les réponses ${de(name)} sont celles d'un partenaire d'entraînement, pour que tu puisses essayer en douceur avant la vraie conversation.`,
      keepEditing: 'Continuer à modifier',
      starting: "C'est parti…",
      start: 'Commencer la conversation',
    },
  },
}
