import { pluralFor } from '../../plural'
import type { Messages } from '..'
import type { NVCComponent } from '../../../lib/conversationInsights'

const plural = pluralFor('fr')

/** "a", "a et b", "a, b et c". */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`
}

/** "que Sam", "qu'Anna": elided before a vowel or a mute h. */
function que(name: string): string {
  return /^[aeiouyhàâäéèêëîïôöûüœ]/i.test(name) ? `qu'${name}` : `que ${name}`
}

/**
 * `label` is lowercase with no article: it is only shown after "Ouvrir la",
 * so every label names something feminine (leçon, bibliothèque).
 */
const skills: Messages['results']['skills'] = {
  observation: {
    label: 'leçon sur les observations',
    invite:
      "Distinguer ce qui s'est passé de ce qu'on en pense, c'est une compétence à part entière.",
    plural: 'observations',
    nudge:
      "Décris ce qui s'est passé comme une caméra l'aurait filmé, avant de dire ce que tu en penses.",
  },
  feeling: {
    label: 'bibliothèque des sentiments',
    invite:
      'Trouver le mot juste pour un sentiment devient plus facile avec un vocabulaire plus riche.',
    plural: 'sentiments',
    nudge:
      "Cherche le mot qui nomme l'émotion elle-même : inquiétude, peine, fatigue, espoir.",
  },
  need: {
    label: 'leçon sur les besoins',
    invite:
      'Relier ses sentiments aux besoins universels qui se trouvent dessous demande de la pratique.',
    plural: 'besoins',
    nudge:
      "Demande-toi ce qui compte pour toi sous ce sentiment : la confiance, le repos, le respect, l'appartenance.",
  },
  request: {
    label: 'leçon sur les demandes',
    invite:
      'Formuler des demandes claires et réalisables, ça vaut bien un petit rappel.',
    plural: 'demandes',
    nudge:
      "Demande une chose concrète à laquelle l'autre peut répondre oui ou non, et laisse de la place pour un non.",
  },
}

export const results: Messages['results'] = {
  skills,

  screen: {
    scoreLabel: {
      excellent: 'Excellent',
      good: 'Bien',
      gettingThere: 'Ça vient',
      keepPracticing: 'Continue',
    },
    comparison: {
      firstRun:
        'Ta première partie terminée sur ce scénario. Tu as maintenant une base pour progresser.',
      newBest: (previousBest: number) =>
        `Tu avais ${previousBest} la dernière fois. C'est ton nouveau record ici.`,
      levelWithBest: (previousBest: number) =>
        `À égalité avec ton record de ${previousBest}. La constance, ça compte aussi.`,
      belowBest: (previousBest: number) =>
        `Ton record ici reste ${previousBest}. Chaque partie apprend quelque chose de différent.`,
    },

    ending: {
      connected: {
        headline: 'Regarde le chemin parcouru',
        label: (name: string) => `Tu as créé un lien avec ${name}`,
        sub: 'Tu as dit ce qui comptait pour toi, et ça a été entendu.',
      },
      listening: {
        headline: 'Un vrai pas en avant',
        label: (name: string) => `${name} commençait à écouter`,
        sub: (didManage: string, nextPiece: string) =>
          `L'ouverture n'est pas encore complète. ${didManage} ${nextPiece}`,
      },
      guarded: {
        headline: "C'était difficile, et tu as tenu bon",
        label: (name: string) => `${name} restait sur la réserve à la fin`,
        sub: (didManage: string, nextPiece: string) =>
          `Ça arrive aussi dans les vraies conversations. ${didManage} ${nextPiece}`,
      },
      managed: {
        observation: 'une observation claire',
        feeling: 'un sentiment',
        need: 'un besoin',
        request: 'une demande',
      } satisfies Record<NVCComponent, string>,
      didManage: (pieces: Array<string>) =>
        `Tu as apporté ${andList(pieces)}, et c'est le plus difficile.`,
      didManageNothing:
        "Tu as tenu bon dans une conversation difficile, et c'est là que tout commence.",
      nextPiece: {
        observation:
          "La prochaine fois, essaie de décrire ce qui s'est passé, sans porter de jugement.",
        feeling: 'La prochaine fois, essaie de nommer un sentiment.',
        need: 'La prochaine fois, cherche le besoin qui se trouve sous le sentiment.',
        request: 'La prochaine fois, essaie de formuler une demande claire.',
      } satisfies Record<NVCComponent, string>,
      nextPieceEmpathy: (name: string) =>
        `La prochaine fois, essaie de te demander à voix haute ce ${que(name)} ressentait.`,
      nextPieceTime: 'Un peu plus de temps aurait peut-être suffi.',
    },

    stations: {
      opened: 'Tu as ouvert la conversation',
      observation: "Tu as décrit ce qui s'est passé",
      feeling: 'Tu as nommé ce que tu ressentais',
      need: 'Tu as trouvé le besoin en dessous',
      request: 'Tu as fait une demande claire',
      notYet: ' (pas encore)',
    },

    starsAria: (stars: number) =>
      plural(stars, {
        one: `${stars} étoile sur 3`,
        other: `${stars} étoiles sur 3`,
      }),
    scoreLine: {
      empathy: 'Empathie',
      afterScore: (label: string, messages: number) =>
        `· ${label} · ${plural(messages, { one: `${messages} message`, other: `${messages} messages` })}`,
    },

    earned: {
      points: (points: number) => `+${points}`,
      pointsLabel: 'points',
      levelLabel: 'niveau',
      newLevelLabel: 'nouveau niveau',
      streakLabel: (days: number) =>
        days <= 1 ? 'jour de série' : 'jours de série',
      reachedLevel: (level: number) => `Tu passes au niveau ${level}. `,
      toNextLevel: (points: number, level: number) =>
        plural(points, {
          one: `Encore ${points} point avant le niveau ${level}. `,
          other: `Encore ${points} points avant le niveau ${level}. `,
        }),
      noPoints:
        "Les points viennent des nouvelles étoiles sur un scénario : c'est en battant ton record ici que tu en gagnes davantage.",
      challengeBonus: (bonus: number) => `Dont ${bonus} pour le défi du jour.`,
      streakExtended: "Aujourd'hui compte maintenant pour ta série.",
    },

    takeaway: {
      title: 'Ce que tu peux retenir',
      bestMessage: 'Ton message qui a le mieux porté',
      strongest: (skillPlural: string) =>
        `Tes ${skillPlural} ont été ton point fort.`,
      strongestAfter: 'Tu peux désormais compter sur cette compétence.',
      stillToTry: (skillPlural: string) =>
        `Encore à essayer : les ${skillPlural}`,
      worthAttention: (skillPlural: string) =>
        `À soigner un peu : les ${skillPlural}`,
      openResource: (label: string) => `Ouvrir la ${label}`,
    },

    reflection: {
      title: 'Un message, autrement',
      youSaid: 'Tu as dit',
      couldSound: 'Ça pourrait aussi donner',
    },

    hiddenNeeds: {
      title: (name: string) => `Ce dont ${name} avait besoin, au fond`,
      reachedConnected: (name: string) =>
        `Tu as cherché à rejoindre ce besoin pendant la conversation. C'est ce qui a aidé ${name} à s'ouvrir.`,
      reachedNotConnected:
        "Tu as cherché à rejoindre ce besoin pendant la conversation. Continue comme ça. C'est ce qui aide les gens à s'ouvrir, même quand il faut plus d'une discussion.",
      nextTime: (name: string) =>
        `La prochaine fois, essaie de te demander à voix haute ce ${que(name)} pourrait ressentir, ou ce dont ${name} pourrait avoir besoin. Ce sont ces suppositions qui aident les gens à s'ouvrir.`,
    },

    badges: (count: number) =>
      plural(count, { one: 'Nouveau badge', other: 'Nouveaux badges' }),

    encouragement:
      'Le progrès, pas la perfection. Chaque conversation comme celle-ci rend les vraies un peu plus faciles.',

    actions: {
      practiceAgain: 'Recommencer',
      practiceAgainFocus: (skillPlural: string) =>
        `Recommencer, en soignant les ${skillPlural}`,
      nextUp: (title: string) => `Ensuite : ${title}`,
      backToScenarios: 'Retour à tous les scénarios',
      reviewTranscript: 'Revoir tour par tour',
      tryAnother: 'En essayer un autre',
    },
  },

  transcript: {
    meta: {
      title: 'Transcription de la conversation',
      description: 'Revois le déroulé de la conversation, tour par tour.',
    },
    loading: 'On retrouve ta conversation…',
    notFound: {
      title: 'Impossible de trouver cette conversation',
      body: "Elle a peut-être été supprimée, ou le lien n'est plus valide.",
    },
    backToPractice: 'Retour à la pratique',
    backToResults: 'Retour aux résultats',
    copied: 'Copié !',
    copy: 'Copier la transcription',
    title: 'Transcription de la conversation',
    finalScore: 'Score final',
    scoreOutOf: (score: number) => `${score}/100`,
    mood: {
      title: "Évolution de l'humeur",
      startPoint: 'Début',
      response: (n: number) => `Réponse ${n}`,
      start: 'Début de la conversation',
      end: 'Fin de la conversation',
    },
    stats: {
      finalScore: 'Score final',
      yourMessages: 'Tes messages',
      ofTotal: (total: number) => ` sur ${total}`,
      freeOfBlame: 'Sans reproche',
      bestTurn: 'Meilleur message',
      averagesTitle: 'Scores moyens par composante',
      averagesHint:
        "Sur 25, pour les messages où tu as utilisé chacune. Un point signifie qu'elle n'a pas fait partie de cette conversation.",
    },
    fullConversation: 'Toute la conversation',
    export: {
      heading: 'TRANSCRIPTION DE LA CONVERSATION',
      underline: '================================',
      scenario: (title: string) => `Scénario : ${title}`,
      finalScore: (score: number) => `Score final : ${score}/100`,
      date: (date: string) => `Date : ${date}`,
      you: 'Toi',
      score: (total: number) => ` [Score : ${total}/100]`,
    },
  },
}
