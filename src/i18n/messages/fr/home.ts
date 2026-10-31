import type { Messages } from '..'

export const home: Messages['home'] = {
  meta: {
    title: 'Apprendre la communication bienveillante',
    description:
      'Pratique les quatre étapes de la communication bienveillante grâce à des leçons guidées et des conversations de mise en situation proches de la réalité.',
  },
  hero: {
    title: "Prépare la conversation difficile avant qu'elle arrive.",
    intro:
      "Découvre les quatre étapes de la communication non violente, puis essaie-les à voix haute avec quelqu'un qui te répond. Le jour venu, les mots te sembleront déjà les tiens.",
    primaryAction: 'Essayer une conversation',
    secondaryAction: 'Ou commencer par une courte leçon',
    bubble: 'Une discussion a mal tourné ? Reprenons-la, doucement.',
  },
  showcase: {
    title: 'Dis-le, vois comment ça passe, recommence.',
    partners:
      "Chaque partenaire a son histoire et son humeur. Les reproches créent de la méfiance. L'honnêteté sur ce que tu as vu et ressenti aide à l'apaiser.",
    hints:
      "Après chaque message, tu reçois un indice, jamais un script, et l'arc se remplit à mesure que tu apportes chaque pièce à la conversation. Une pièce par message, c'est bien assez.",
  },
  voices: {
    title: 'Chaque moment difficile a deux voix.',
    intro:
      "Marshall Rosenberg les appelait le chacal et la girafe. Le chacal juge, accuse et exige, et les gens se défendent face à lui. La girafe, l'animal terrestre au plus grand cœur, dit ce qui s'est passé, ce qu'elle a ressenti, ce qui comptait et ce qui aiderait.",
    jackal: {
      name: 'Le chacal',
      tagline: 'Juge, accuse et exige',
      outcome: 'Sam entend une attaque, et se met à se défendre.',
      lines: [
        { move: 'Jugement', line: "Tu m'ignores tout le temps." },
        {
          move: 'Lecture de pensée',
          line: "J'ai l'impression que tu t'en fiches.",
        },
        { move: 'Critique', line: 'Il faut que tu fasses mieux que ça.' },
        {
          move: 'Exigence',
          line: 'Envoie-moi juste un message la prochaine fois.',
        },
      ],
    },
    giraffe: {
      name: 'La girafe',
      tagline: "Dit ce qui s'est passé et ce qui aiderait",
      outcome: "Sam entend ton inquiétude, et s'adoucit.",
      lines: [
        {
          move: 'Observation',
          line: "Quand je n'ai pas eu de nouvelles de toi hier soir,",
        },
        { move: 'Sentiment', line: "j'ai ressenti de l'inquiétude," },
        {
          move: 'Besoin',
          line: 'parce que savoir que tu es en sécurité compte pour moi.',
        },
        {
          move: 'Demande',
          line: "Est-ce que tu serais d'accord pour m'envoyer un petit message quand tu rentres tard ?",
        },
      ],
    },
    lessonsNote:
      "Dans la vraie vie, personne ne dit les quatre d'un coup, et tu n'as pas à le faire non plus. Les leçons abordent chaque pièce l'une après l'autre, avec un petit quiz à la fin de chacune.",
    seeLessons: 'Voir les leçons',
  },
  closing: {
    title: 'Apporte la conversation que tu redoutes.',
    body: "Choisis un scénario tout prêt, ou décris une situation de ta vie pour t'y entraîner. Tes conversations d'entraînement restent privées.",
    action: 'Commencer',
  },
  footer: {
    creditBefore:
      'Practice NVC. Inspiré des travaux de Marshall Rosenberg et du ',
    creditLink: 'Center for Nonviolent Communication',
    creditAfter: '.',
    navLabel: 'Pied de page',
    lessons: 'Leçons',
    practice: 'Pratique',
    feelings: 'Sentiments',
  },
  preview: {
    label: "Un exemple de conversation d'entraînement avec Sam",
    talkingWith: 'En discussion avec Sam',
    situation: 'Un ami qui ne donne plus de nouvelles',
    firstAttempt: 'Tu ne réponds jamais à mes messages.',
    firstAttemptBlame: 'Visiblement, je ne suis pas une priorité.',
    samReplyGuarded:
      "Sérieux ? Donc c'est moi le méchant parce que j'étais occupé ?",
    hintLabel: 'Un indice',
    hint: "Ça a sonné comme un reproche. Qu'as-tu vu se passer, concrètement, et qu'as-tu ressenti ?",
    secondAttempt:
      "Quand je n'ai pas eu de nouvelles de toi après vingt-deux heures hier soir, j'ai ressenti de l'inquiétude, parce que savoir que tu es en sécurité compte pour moi.",
    samReplyOpen:
      "Oh. Je n'y avais pas pensé. Mon téléphone n'avait plus de batterie et je suis allé me coucher.",
    youAvatar: 'Toi',
    samAvatar: 'S',
    youSpeaker: 'Toi : ',
    samSpeaker: 'Sam : ',
    arcSummary:
      'Trois pièces sur quatre sont là. Une demande peut venir au prochain tour.',
    arc: {
      observation: 'Observer',
      feeling: 'Sentiment',
      need: 'Besoin',
      request: 'Demande',
    },
  },
  dailyTeaser: {
    title: 'La pratique du jour',
    pending:
      'La situation du jour est encore en route. En attendant, tous les scénarios de pratique te sont ouverts.',
    browseScenarios: 'Parcourir les scénarios',
    finished: 'Tu as terminé le défi du jour.',
    nextArrives: (time: string) => `Le prochain arrive à ${time}.`,
    seeChallenges: 'Voir les défis du jour',
    details: (
      difficulty: string,
      bonusPoints: number,
      nextTime: string | null,
    ) =>
      `${difficulty}, ${bonusPoints} points bonus à la clé${
        nextTime ? `. Nouveau défi à ${nextTime}.` : '.'
      }`,
    start: 'Commencer la pratique du jour',
  },
}
