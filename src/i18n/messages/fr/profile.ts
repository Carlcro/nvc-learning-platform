import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('fr')

/** "a", "a et b", "a, b et c". */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`
}

/** A component name with its article, for running text: "l'observation", "le besoin". */
function withArticle(name: string): string {
  const word = name.toLowerCase()
  if (/^[aeiouyéèêh]/.test(word)) return `l'${word}`
  const feminine = word === 'demande'
  return `${feminine ? 'la' : 'le'} ${word}`
}

export const profile: Messages['profile'] = {
  meta: {
    title: 'Ton profil',
    description:
      'Ton niveau, ta série, tes succès et la progression de tes compétences.',
  },
  loading: 'On rassemble ta progression...',
  setupFailed: {
    title: 'Ta progression prend un moment',
    body: 'Impossible de la charger pour le moment. Ta pratique est en sécurité, et réessayer suffit souvent.',
    retry: 'Réessayer',
  },
  hero: {
    title: "Ta pratique jusqu'ici",
    startPracticing: 'Commencer à pratiquer',
    continuePracticing: 'Continuer à pratiquer',
    statLine: ({
      level,
      totalPoints,
      pointsToNextLevel,
      currentStreak,
    }: {
      level: number
      totalPoints: number
      pointsToNextLevel: number
      currentStreak: number
    }) => {
      let line = `Niveau ${level}, avec ${plural(totalPoints, {
        one: `${totalPoints} point`,
        other: `${totalPoints} points`,
      })}`
      if (pointsToNextLevel > 0) {
        line += `, encore ${pointsToNextLevel} pour atteindre le niveau ${level + 1}`
      }
      line += '.'
      if (currentStreak > 1) {
        line += ` Tu as pratiqué ${currentStreak} jours d'affilée.`
      } else if (currentStreak === 1) {
        line += ' Ta série de pratique a commencé.'
      }
      return line
    },
    mentor: {
      welcome:
        'Bienvenue. Chaque conversation que tu pratiques est un pas vers le lien.',
      compassion: 'Tes mots portent une vraie compassion.',
      steady: 'Tu progresses régulièrement. Continue.',
      finding: "Tu trouves ta voix de girafe, une conversation après l'autre.",
      showingUp: "Tu es là pour ça, et c'est ce qui compte le plus.",
    },
  },
  growth: {
    title: 'Les quatre pièces',
    empty:
      'Observation, sentiment, besoin et demande. Après ta première conversation terminée, tu verras ici laquelle te vient naturellement et laquelle explorer ensuite.',
    emptyLink: 'Commencer par la leçon sur les observations',
    strongest: (name: string) =>
      `Ces derniers temps, ton point fort, c'est ${withArticle(name)}.`,
    nextToExplore: (name: string) =>
      ` À explorer ensuite : ${withArticle(name)}.`,
    allLanding: ' Les quatre portent bien dans tes conversations.',
    focus: {
      observation: {
        untried:
          "Tu n'as pas encore utilisé d'observation dans une conversation. ",
        visit: 'Voir la leçon sur les observations',
      },
      feeling: {
        untried:
          "Tu n'as pas encore exprimé de sentiment dans une conversation. ",
        visit: 'Voir la bibliothèque des sentiments',
      },
      need: {
        untried: "Tu n'as pas encore exprimé de besoin dans une conversation. ",
        visit: 'Voir la leçon sur les besoins',
      },
      request: {
        untried: "Tu n'as pas encore fait de demande dans une conversation. ",
        visit: 'Voir la leçon sur les demandes',
      },
    },
    words: {
      notTried: 'à essayer',
      starting: 'à ses débuts',
      growing: 'en progrès',
      steady: 'stable',
      strong: 'solide',
    },
  },
  conversations: {
    title: 'Tes conversations',
    none: "Tu n'as pas encore terminé de conversation. La première est souvent la plus difficile, et un scénario débutant est un bon point de départ.",
    summary: ({
      completed,
      threeStars,
      stars,
    }: {
      completed: number
      threeStars: number
      stars: number
    }) => {
      let sentence = `Tu as terminé ${plural(completed, {
        one: `${completed} scénario`,
        other: `${completed} scénarios différents`,
      })}`
      if (threeStars > 0) {
        sentence +=
          completed === 1
            ? ', avec trois étoiles'
            : `, dont ${threeStars} avec trois étoiles`
      }
      if (stars > 0) {
        sentence += `, en récoltant ${plural(stars, {
          one: `${stars} étoile`,
          other: `${stars} étoiles`,
        })} au passage`
      }
      return `${sentence}.`
    },
    createLink: 'Prépare une vraie conversation de ta vie',
  },
  feelings: {
    title: 'Nommer ses sentiments',
    none: "Rien ici pour l'instant. Nommer ce que tu ressens, c'est ce qui rend le reste de la conversation plus facile.",
    summary: ({
      totalFeelingsExplored,
      totalCheckIns,
      checkInStreak,
      quizScore,
      quizLevel,
    }: {
      totalFeelingsExplored: number
      totalCheckIns: number
      checkInStreak: number
      quizScore: number
      quizLevel: number
    }) => {
      const parts: Array<string> = []
      if (totalFeelingsExplored > 0) {
        parts.push(
          `exploré ${plural(totalFeelingsExplored, {
            one: `${totalFeelingsExplored} sentiment`,
            other: `${totalFeelingsExplored} sentiments`,
          })}`,
        )
      }
      if (totalCheckIns > 0) {
        parts.push(
          `fait le point avec toi-même ${plural(totalCheckIns, {
            one: `${totalCheckIns} fois`,
            other: `${totalCheckIns} fois`,
          })}`,
        )
      }
      if (quizScore > 0) {
        parts.push(`atteint le niveau ${quizLevel} du quiz des sentiments`)
      }
      let sentence = `Tu as ${andList(parts)}.`
      if (checkInStreak > 1) {
        sentence += ` Cela fait ${checkInStreak} jours d'affilée que tu fais le point.`
      }
      return `${sentence} C'est le vocabulaire qui se trouve sous chaque conversation sincère.`
    },
    keepExploring: 'Continuer à explorer les sentiments',
    openLibrary: 'Ouvrir la bibliothèque des sentiments',
  },
  achievements: {
    title: 'Succès',
    none: 'Le premier arrive avec ta première conversation terminée.',
    progress: (earned: number, total: number) =>
      `${earned} sur ${total} pour l'instant.`,
    earned: 'Obtenus',
    ahead: 'À venir',
    notYetEarned: ', pas encore obtenu',
  },
  settings: {
    title: 'Paramètres',
  },
}
