import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('sv')

/** "a", "a och b", "a, b och c" (Swedish uses no comma before och). */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} och ${items[items.length - 1]}`
}

export const profile: Messages['profile'] = {
  meta: {
    title: 'Din profil',
    description:
      'Din nivå, din svit, dina utmärkelser och hur dina färdigheter växer.',
  },
  loading: 'Samlar ihop dina framsteg...',
  setupFailed: {
    title: 'Dina framsteg tar en stund',
    body: 'Vi kunde inte hämta dem just nu. Din övning är sparad, och att försöka igen brukar hjälpa.',
    retry: 'Försök igen',
  },
  hero: {
    title: 'Din övning hittills',
    startPracticing: 'Börja öva',
    continuePracticing: 'Fortsätt öva',
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
      let line = `Nivå ${level}, med ${totalPoints} poäng`
      if (pointsToNextLevel > 0) {
        line += ` och ${pointsToNextLevel} kvar till nivå ${level + 1}`
      }
      line += '.'
      if (currentStreak > 1) {
        line += ` Du har övat ${currentStreak} dagar i rad.`
      } else if (currentStreak === 1) {
        line += ' Din svit har börjat.'
      }
      return line
    },
    mentor: {
      welcome: 'Välkommen. Varje samtal du övar på är ett steg mot kontakt.',
      compassion: 'Dina ord når fram med äkta medkänsla.',
      steady: 'Du växer stadigt. Fortsätt så.',
      finding: 'Du hittar din giraffröst, ett samtal i taget.',
      showingUp: 'Du är här och gör det, och det är det som betyder mest.',
    },
  },
  growth: {
    title: 'De fyra delarna',
    empty:
      'Observation, känsla, behov och önskemål. När du har avslutat ditt första samtal ser du här vilken av dem som faller sig naturligt för dig och vilken du kan utforska härnäst.',
    emptyLink: 'Börja med lektionen om observationer',
    strongest: (name: string) =>
      `På sistone är ${name.toLowerCase()} din starkaste del.`,
    nextToExplore: (name: string) =>
      ` Nästa att utforska: ${name.toLowerCase()}.`,
    allLanding: ' Alla fyra når fram bra i dina samtal.',
    focus: {
      observation: {
        untried: 'Du har inte provat observationer i ett samtal än. ',
        visit: 'Gå till lektionen om observationer',
      },
      feeling: {
        untried: 'Du har inte provat känslor i ett samtal än. ',
        visit: 'Gå till känslobiblioteket',
      },
      need: {
        untried: 'Du har inte provat behov i ett samtal än. ',
        visit: 'Gå till lektionen om behov',
      },
      request: {
        untried: 'Du har inte provat önskemål i ett samtal än. ',
        visit: 'Gå till lektionen om önskemål',
      },
    },
    words: {
      notTried: 'inte provat än',
      starting: 'precis i början',
      growing: 'växer',
      steady: 'stadig',
      strong: 'stark',
    },
  },
  conversations: {
    title: 'Dina samtal',
    none: 'Du har inte avslutat något samtal än. Det första är ofta det svåraste, och ett nybörjarscenario är ett lugnt ställe att börja på.',
    summary: ({
      completed,
      threeStars,
      stars,
    }: {
      completed: number
      threeStars: number
      stars: number
    }) => {
      let sentence = `Du har avslutat ${plural(completed, {
        one: `${completed} scenario`,
        other: `${completed} olika scenarier`,
      })}`
      if (threeStars > 0) {
        sentence +=
          completed === 1
            ? ', med tre stjärnor'
            : `, ${threeStars} av dem med tre stjärnor`
      }
      if (stars > 0) {
        sentence += `, och samlat ${plural(stars, {
          one: `${stars} stjärna`,
          other: `${stars} stjärnor`,
        })} på vägen`
      }
      return `${sentence}.`
    },
    createLink: 'Öva på ett eget, verkligt samtal',
  },
  feelings: {
    title: 'Att sätta ord på känslor',
    none: 'Inget här än. När du sätter ord på vad du känner blir resten av samtalet lättare.',
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
          `utforskat ${plural(totalFeelingsExplored, {
            one: `${totalFeelingsExplored} känsla`,
            other: `${totalFeelingsExplored} känslor`,
          })}`,
        )
      }
      if (totalCheckIns > 0) {
        parts.push(
          `checkat in med dig själv ${plural(totalCheckIns, {
            one: `${totalCheckIns} gång`,
            other: `${totalCheckIns} gånger`,
          })}`,
        )
      }
      if (quizScore > 0) {
        parts.push(`nått nivå ${quizLevel} i känsloquizet`)
      }
      let sentence = `Du har ${andList(parts)}.`
      if (checkInStreak > 1) {
        sentence += ` Det blir ${checkInStreak} dagar i rad med incheckningar.`
      }
      return `${sentence} Det här är ordförrådet under varje ärligt samtal.`
    },
    keepExploring: 'Fortsätt utforska känslor',
    openLibrary: 'Öppna känslobiblioteket',
  },
  achievements: {
    title: 'Utmärkelser',
    none: 'Din första kommer med ditt första avslutade samtal.',
    progress: (earned: number, total: number) =>
      `${earned} av ${total} hittills.`,
    earned: 'Uppnådda',
    ahead: 'Kvar att nå',
    notYetEarned: ', inte uppnådd än',
  },
  settings: {
    title: 'Inställningar',
  },
}
