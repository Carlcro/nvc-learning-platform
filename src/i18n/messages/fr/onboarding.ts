import type { Messages } from '..'

export const onboarding: Messages['onboarding'] = {
  meta: {
    title: 'Bienvenue',
    description:
      'Choisis ta langue et fais un petit tour avant de commencer à pratiquer.',
  },
  loading: "On prépare ton accueil...",
  stepOf: (step: number, total: number) => `Étape ${step} sur ${total}`,
  back: 'Retour',
  next: 'Suivant',
  skip: 'Passer la visite',
  language: {
    bubble:
      'Bonjour et bienvenue ! Je suis ta girafe guide. Pour commencer, dans quelle langue te sens-tu le plus chez toi ?',
    title: 'Choisis ta langue',
    subtitle:
      'Les leçons, les conversations de pratique et les retours seront tous dans la langue que tu choisis.',
    changeLater:
      'Tu peux la changer à tout moment depuis le menu sous ton nom.',
  },
  areas: {
    bubble: 'Voici un petit tour pour que tu saches où se trouve chaque chose.',
    title: 'Tes espaces pour grandir',
    subtitle: 'Tu les retrouves tous dans le menu en haut de la page.',
    lessons: {
      title: 'Leçons',
      body: "De courtes leçons te font découvrir les quatre parties de la CNV : l'observation, le sentiment, le besoin et la demande. Chacune se termine par un petit quiz.",
    },
    practice: {
      title: 'Pratique',
      body: "Parle avec des personnages dans des situations du quotidien et reçois un retour bienveillant sur chaque message. Tu peux aussi transformer une situation de ta propre vie en conversation de pratique.",
    },
    daily: {
      title: 'Défi du jour',
      body: 'Une nouvelle situation chaque jour, adaptée à ton niveau, avec des points en bonus quand tu la relèves.',
    },
    feelings: {
      title: 'Sentiments',
      body: "Explore la roue des sentiments, fais le point sur ce que tu ressens aujourd'hui et enrichis tes mots pour dire ce qui se passe en toi.",
    },
    profile: {
      title: 'Profil',
      body: 'Retrouve ton niveau, tes points, ta série et tes succès, et vois comment progresse chaque partie de la CNV.',
    },
  },
  practice: {
    bubble: "C'est dans la pratique que tout se rejoint. Voici comment se déroule une conversation.",
    title: "Comment se passe une conversation de pratique",
    subtitle: "Il n'y a pas de mauvaise réponse ici, seulement de la pratique.",
    brief: {
      title: 'Lis la mise en situation',
      body: 'Chaque conversation commence par la personne à qui tu parles et ce qui se passe entre vous.',
    },
    oneStep: {
      title: 'Une étape à la fois',
      body: "Pas besoin de tout dire d'un coup. Une observation dans un message, un sentiment dans le suivant. Le chemin en haut te montre où tu en es.",
    },
    hints: {
      title: 'Des retours bienveillants',
      body: 'Après chaque message, tu vois comment il a été reçu et une piste pour la suite.',
    },
    rewind: {
      title: 'Revenir en arrière',
      body: "Tu aurais aimé dire les choses autrement ? Reprends ton dernier message et reformule tes mots.",
    },
    wrapUp: {
      title: 'Conclure quand tu le sens',
      body: "Après quelques messages, tu peux conclure et voir ce qui a bien marché, avec une chose à essayer la prochaine fois.",
    },
  },
  start: {
    bubble: "C'est tout. Par où aimerais-tu commencer ?",
    title: 'Par où veux-tu commencer ?',
    subtitle: "Tout reste ouvert, tu peux explorer dans l'ordre qui te plaît.",
    lessons: {
      title: 'Commencer par la première leçon',
      body: 'Un bon point de départ si la CNV est nouvelle pour toi.',
      tag: 'Conseillé',
    },
    practice: {
      title: 'Passer directement à la pratique',
      body: 'Tu connais déjà les bases ? Choisis une conversation et lance-toi.',
    },
  },
}
