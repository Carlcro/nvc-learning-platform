import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

/** "de Sam", "d'Anna": the preposition, elided before a vowel or a mute h. */
function de(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? `d'${name}` : `de ${name}`
}

/** "que Sam", "qu'Anna": the conjunction, elided the same way. */
function que(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? `qu'${name}` : `que ${name}`
}

/** Capitalises the first letter, for a fallback that starts a sentence. */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const OTHER = "l'autre"

export const roleplay: Messages['roleplay'] = {
  meta: {
    title: 'Conversation',
    description:
      'Entraîne-toi à la communication bienveillante, message après message, avec un retour à chaque étape.',
  },

  milestones: {
    start: 'Début',
    observe: 'Observer',
    feeling: 'Sentiment',
    need: 'Besoin',
    request: 'Demande',
    done: 'Fin',
  },

  scoreMessages: {
    keepGoing: 'Continue',
    gettingThere: "Tu t'en approches",
    landingWell: 'Ça passe bien',
    beautifullySaid: 'Joliment dit',
  },

  errors: {
    sendFailed:
      "Ton message n'est pas parti. Tes mots sont toujours là, réessaie.",
    completeFailed:
      "Impossible d'enregistrer tes résultats. Réessaie, s'il te plaît.",
    startFailed:
      "Impossible de lancer une nouvelle conversation. Réessaie, s'il te plaît.",
    rewindFailed: "Impossible de revenir en arrière. Réessaie, s'il te plaît.",
  },

  celebrations: {
    characterFallback: 'Cette personne',
    observationMade: {
      title: 'Observation claire',
      message: (_name: string) =>
        "Tu as décrit ce qui s'est passé sans le juger.",
    },
    feelingExpressed: {
      title: 'Sentiment nommé',
      message: (_name: string) =>
        'Tu as mis des mots sincères sur une émotion.',
    },
    needIdentified: {
      title: 'Besoin trouvé',
      message: (_name: string) =>
        'Tu as relié ton sentiment à ce qui compte pour toi.',
    },
    requestMade: {
      title: 'Demande claire',
      message: (_name: string) =>
        'Tu as demandé quelque chose de concret et faisable.',
    },
    empathyShown: {
      title: 'Tu as su écouter',
      message: (name: string) =>
        `Tu as prêté attention à ce ${que(name)} ressent peut-être.`,
    },
    resolutionReached: {
      title: 'Un vrai déclic',
      message: (name: string) => `${name} sent qu'on l'écoute vraiment.`,
    },
  },

  page: {
    loadingScene: 'On prépare le décor de ta conversation…',
    loadingDefault: 'On prépare tout pour toi…',
    notFound: {
      title: 'Cette conversation est introuvable',
      body: "Elle a peut-être été supprimée, ou le lien n'est plus valide.",
      back: 'Retour à la pratique',
    },
    dismissError: 'Fermer',
    archive: {
      title: 'Conversation terminée',
      body: 'Cette conversation est terminée. Tu peux la relire, mais plus la modifier.',
    },
    viewScenario: 'Voir le scénario',
    practicingWith: { before: 'Entraînement avec ', after: '' },
    wrapUpArc: 'Conclure et voir le bilan',
    wrapUpEarly: 'Conclure ici et voir le bilan',
    turnLimitReached:
      "Cette conversation s'arrête ici. Conclus-la plus haut pour voir le bilan, et tu pourras toujours la recommencer.",
    turnsRemaining: (n: number) =>
      plural(n, {
        one:
          n === 0
            ? 'Plus aucun message possible dans cette conversation.'
            : "Plus qu'un message dans cette conversation.",
        other: `Encore ${n} messages dans cette conversation.`,
      }),
    mobile: {
      openFeedback: 'Voir le retour complet',
      tryNext: (text: string) => `Pour la suite : ${text}`,
      firstMessageTips: 'Conseils pour ton premier message',
      liveFeedback: 'Retour en direct',
      closeFeedback: 'Fermer le panneau de retour',
    },
    continueConversation: 'Continuer la conversation',
    context: {
      title: 'Contexte du scénario',
      close: 'Fermer le contexte du scénario',
      situation: 'Situation',
      whatYoullPractice: 'Ce que tu vas travailler :',
      tipLabel: 'Conseil :',
      tipBody:
        ' Une vraie conversation se construit étape par étape. Une observation dans un message, un sentiment dans le suivant, une demande plus tard. Inutile de mettre les quatre dans chaque message.',
    },
  },

  conversation: {
    you: 'Toi',
    moodShift: {
      openedUp: (name: string) => `${name} s'ouvre`,
      softened: (name: string) => `${name} se détend un peu`,
      moreGuarded: (name: string) => `${name} se ferme davantage`,
      pulledBack: (name: string) => `${name} prend un peu de distance`,
    },
    jackalMarkTitle:
      'Ceci pourrait être perçu comme un jugement ou un reproche',
    jackalNote:
      'Les mots soulignés pourraient être perçus comme un jugement ou un reproche.',
  },

  input: {
    placeholder: 'Quelle est la prochaine chose vraie que tu veux dire ?',
    ariaLabel: 'Ton message',
    emptyError: 'Écris un message',
    tooLongError: (max: number) =>
      `Message trop long (${max} caractères maximum)`,
    sendFailed: "Le message n'est pas parti. Réessaie, s'il te plaît.",
    send: 'Envoyer',
    hint: 'Une étape à la fois suffit. Dis la prochaine chose vraie.',
  },

  rewind: {
    button: 'Revenir en arrière',
    title: 'Reprendre ton dernier message ?',
    body: 'Tu bloques ? Cela retire ton dernier message et la réponse qui a suivi, et remet tes mots dans la zone de saisie pour que tu puisses les reformuler et essayer autrement.',
    remaining: 'Retours en arrière restants :',
    note: 'Un message repris est retiré de la conversation, il ne comptera donc pas dans ton bilan final.',
    cancel: 'Annuler',
    confirm: 'Revenir en arrière',
    rewinding: 'Retour en arrière...',
  },

  startOver: {
    button: 'Recommencer',
    title: 'Recommencer cette conversation ?',
    body: 'Tout ce qui a été dit sera mis de côté et le scénario reprendra depuis la première réplique. Impossible de revenir en arrière ensuite.',
    canWrapUp:
      'Si tu préfères garder ce que tu as travaillé, tu peux plutôt conclure et voir le bilan.',
    suggestRewind:
      'Si seul ton dernier message te gêne, un retour en arrière reprend juste celui-là.',
    keepGoing: 'Continuer',
    confirm: 'Recommencer',
    starting: 'On recommence…',
  },

  feedback: {
    srHeading: 'Retour',
    mood: {
      open: 'En confiance',
      warming: 'Se détend',
      neutral: 'Neutre',
      guarded: 'Sur ses gardes',
      defensive: 'Sur la défensive',
    },
    howFeels: (name: string | undefined) => ({
      before: 'Ce que ressent ',
      name: name || OTHER,
      after: '',
    }),
    moodAria: (name: string | undefined, label: string, opened: boolean) => {
      const who = name || OTHER
      return `Ce que ressent ${who} : ${label}${opened ? `. ${capitalize(who)} a baissé la garde.` : ''}`
    },
    starHint: (name: string | undefined) =>
      `L'étoile s'allume quand ${name || OTHER} baisse la garde. Une écoute sincère aide chacun à s'ouvrir.`,
    howLanded: 'Comment ce message a été reçu',
    arcTitle: 'Ton parcours',
    arcReached: (reached: number, total: number) =>
      `Étapes : ${reached} sur ${total}`,
    pieceStatus: {
      reached: "c'est fait",
      next: 'la prochaine',
      notYet: 'pas encore',
    },
    pieceAria: (label: string, status: string, value: number) =>
      `${label} : ${status}${value > 0 ? `, ${value} sur 25 dans ce message` : ''}`,
    pieceValueTitle: (value: number) => `Ce message : ${value} sur 25`,
    empathyEarned: (name: string | undefined) =>
      `Tu as su écouter. Tu as pris en compte le point de vue ${name ? de(name) : "de l'autre"}.`,
    empathyInvite: (name: string | undefined) =>
      `Tu te demandes ce ${que(name || OTHER)} ressent ? Poser la question, ça compte aussi.`,
    skillHintLink: (label: string) => `Ouvrir la ${label}`,
    skillHintAfter: " dans un nouvel onglet, cette conversation va t'attendre.",
    tryAgain: 'Réessayer',
    wordsComeBack: 'Tes mots reviennent dans la zone de saisie.',
    rewindsLeft: (n: number) =>
      plural(n, {
        one:
          n === 0
            ? 'Plus aucun retour en arrière.'
            : "Plus qu'un retour en arrière.",
        other: `Encore ${n} retours en arrière.`,
      }),
    tryNext: 'Pour la suite',
    defaultNextStep:
      'Essaie de nommer un sentiment et le besoin qui se cache derrière.',
    statusLine: (message: string, total: number, feedback: string) =>
      `${message}. Ton message a obtenu ${total} sur 100. ${feedback}`,
    reading: 'Lecture de ton message…',
    firstTurn: {
      intro:
        'Prends ton temps. Après chaque message, je te dirai comment il a été reçu et je te proposerai une prochaine étape.',
      focus: (components: string) => `Ton axe cette fois : ${components}`,
      openingTitle: 'Une bonne entrée en matière',
      openingBody:
        "Décris ce qui s'est passé, juste les faits, sans porter de jugement pour l'instant. Une étape suffit. Sentiments, besoins et demande pourront chacun avoir leur propre message.",
      practices: 'Ce que cette conversation permet de travailler',
    },
  },

  annotated: {
    you: 'Toi',
    mood: {
      openWarm: 'Ouverture et chaleur',
      warmingUp: 'Se détend',
      neutral: 'Neutre',
      guarded: 'Sur ses gardes',
      defensive: 'Sur la défensive',
    },
    breakdown: 'Détail du score CNV',
    notThisTurnAria: (label: string) => `${label} : pas dans ce message`,
    notThisTurn: '· pas cette fois',
    whatWentWell: 'Ce qui a bien marché',
    nextStepSuggested: 'La prochaine étape suggérée',
    phrasesToReconsider: 'Formulations à revoir',
    quoted: (text: string) => `« ${text} »`,
    couldAlsoSound: 'On pourrait aussi dire',
    characterMood: 'Humeur du personnage :',
  },

  empathyMeter: {
    title: "Jauge d'empathie",
    label: {
      excellent: 'Excellent',
      good: 'Bien',
      partial: 'Partiel',
      needsPractice: 'À travailler',
    },
    description: {
      excellent: 'Pur langage girafe',
      good: 'Quelques petites améliorations',
      partial: 'Un mélange de girafe et de chacal',
      needsPractice: 'Surtout du langage chacal',
    },
  },
}
