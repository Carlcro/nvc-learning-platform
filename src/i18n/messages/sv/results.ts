import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('sv')

/** "a", "a och b", "a, b och c" (Swedish uses no comma before och). */
function andList(items: ReadonlyArray<string>): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} och ${items[items.length - 1]}`
}

/** A label written for the start of a line, lowered for the middle of one. */
function midSentence(label: string): string {
  return label.charAt(0).toLowerCase() + label.slice(1)
}

export const results: Messages['results'] = {
  skills: {
    observation: {
      label: 'Lektionen om observationer',
      invite:
        'Att skilja det som hände från vad vi tycker om det är en färdighet i sig.',
      plural: 'observationer',
      nudge:
        'Beskriv vad som hände så som en kamera skulle ha sett det, innan du säger vad du tycker om det.',
    },
    feeling: {
      label: 'Känslobiblioteket',
      invite:
        'Det blir lättare att hitta exakt rätt känsloord med ett större ordförråd.',
      plural: 'känslor',
      nudge:
        'Leta efter det enda ord som sätter namn på själva känslan: orolig, sårad, trött, hoppfull.',
    },
    need: {
      label: 'Lektionen om behov',
      invite:
        'Att koppla känslor till de universella behoven under dem kräver övning.',
      plural: 'behov',
      nudge:
        'Fråga dig vad som är viktigt för dig under känslan: tillit, vila, respekt, att få vara med.',
    },
    request: {
      label: 'Lektionen om önskemål',
      invite:
        'Att forma tydliga och genomförbara önskemål är värt en kort repetition.',
      plural: 'önskemål',
      nudge:
        'Be om en konkret sak som den andra kan säga ja eller nej till, och lämna utrymme för ett nej.',
    },
  },

  screen: {
    scoreLabel: {
      excellent: 'Utmärkt',
      good: 'Bra',
      gettingThere: 'På god väg',
      keepPracticing: 'Fortsätt öva',
    },
    comparison: {
      firstRun:
        'Första gången du har tagit dig igenom det här scenariot. Nu finns det något att bygga vidare på.',
      newBest: (previousBest: number) =>
        `Upp från ${previousBest} förra gången. Det är ditt nya bästa här.`,
      levelWithBest: (previousBest: number) =>
        `Lika med ditt bästa, ${previousBest}. Att vara stadig är också en färdighet.`,
      belowBest: (previousBest: number) =>
        `Ditt bästa här är fortfarande ${previousBest}. Varje försök lär dig något nytt.`,
    },

    ending: {
      connected: {
        headline: 'Se hur långt du har kommit',
        label: (name: string) => `Du fick kontakt med ${name}`,
        sub: 'Du uttryckte dig och blev hörd.',
      },
      listening: {
        headline: 'Ett riktigt steg framåt',
        label: (name: string) => `${name} började lyssna`,
        sub: (didManage: string, nextPiece: string) =>
          `Inte helt öppen än. ${didManage} ${nextPiece}`,
      },
      guarded: {
        headline: 'Det var ett svårt samtal, och du stannade kvar i det',
        label: (name: string) => `${name} var fortfarande på sin vakt i slutet`,
        sub: (didManage: string, nextPiece: string) =>
          `Så blir det i riktiga samtal också. ${didManage} ${nextPiece}`,
      },
      managed: {
        observation: 'en tydlig observation',
        feeling: 'en känsla',
        need: 'ett behov',
        request: 'ett önskemål',
      },
      didManage: (pieces: Array<string>) =>
        `Du tog med ${andList(pieces)}, och det är det svåra.`,
      didManageNothing:
        'Du stannade kvar i ett svårt samtal, och det är där det börjar.',
      nextPiece: {
        observation:
          'Att beskriva vad som hände, utan att döma, är det du kan prova nästa gång.',
        feeling: 'Att sätta ord på en känsla är det du kan prova nästa gång.',
        need: 'Behovet under känslan är det du kan prova nästa gång.',
        request: 'Ett tydligt önskemål är det du kan prova nästa gång.',
      },
      nextPieceEmpathy: (name: string) =>
        `Att undra högt vad ${name} kände är det du kan prova nästa gång.`,
      nextPieceTime: 'Lite mer tid kanske var allt som behövdes.',
    },

    stations: {
      opened: 'Du öppnade samtalet',
      observation: 'Du beskrev vad som hände',
      feeling: 'Du satte ord på vad du kände',
      need: 'Du hittade behovet under det',
      request: 'Du framförde ett tydligt önskemål',
      notYet: ' (inte än)',
    },

    starsAria: (stars: number) => `${stars} av 3 stjärnor`,
    scoreLine: {
      empathy: 'Empati',
      afterScore: (label: string, messages: number) =>
        `· ${label} · ${plural(messages, { one: `${messages} meddelande`, other: `${messages} meddelanden` })}`,
    },

    earned: {
      points: (points: number) => `+${points}`,
      pointsLabel: 'poäng',
      levelLabel: 'nivå',
      newLevelLabel: 'ny nivå',
      streakLabel: (days: number) =>
        days === 1 ? 'dag i rad' : 'dagar i rad',
      reachedLevel: (level: number) => `Du nådde nivå ${level}. `,
      toNextLevel: (points: number, level: number) =>
        `${points} poäng kvar till nivå ${level}. `,
      noPoints:
        'Poäng kommer från nya stjärnor i ett scenario, så det är att slå ditt bästa här som ger mer.',
      challengeBonus: (bonus: number) =>
        `Det inkluderar ${bonus} för dagens utmaning.`,
      streakExtended: 'I dag räknas nu in i din svit.',
    },

    takeaway: {
      title: 'Det här tar du med dig',
      bestMessage: 'Ditt meddelande som nådde fram bäst',
      strongest: (skillPlural: string) =>
        `Dina ${skillPlural} var den starkaste delen.`,
      strongestAfter: 'Det är en färdighet du kan luta dig mot nu.',
      stillToTry: (skillPlural: string) => `Kvar att prova: ${skillPlural}`,
      worthAttention: (skillPlural: string) =>
        `Värt lite extra uppmärksamhet: ${skillPlural}`,
      openResource: (label: string) => `Öppna ${midSentence(label)}`,
    },

    reflection: {
      title: 'Ett meddelande, på ett annat sätt',
      youSaid: 'Du skrev',
      couldSound: 'Det skulle också kunna låta så här',
    },

    hiddenNeeds: {
      title: (name: string) => `Vad ${name} behövde innerst inne`,
      reachedConnected: (name: string) =>
        `Du sträckte dig mot det här under samtalet. Det var det som hjälpte ${name} att öppna sig.`,
      reachedNotConnected:
        'Du sträckte dig mot det här under samtalet. Fortsätt med det. Det är det som får människor att öppna sig, även när det tar längre tid än ett samtal.',
      nextTime: (name: string) =>
        `Nästa gång kan du prova att undra högt vad ${name} kanske känner eller behöver. Att gissa på det är det som får människor att öppna sig.`,
    },

    badges: (count: number) =>
      plural(count, { one: 'Ny utmärkelse', other: 'Nya utmärkelser' }),

    encouragement:
      'Växande, inte perfektion. Varje sådant här samtal gör de riktiga lite lättare.',

    actions: {
      practiceAgain: 'Öva igen',
      practiceAgainFocus: (skillPlural: string) =>
        `Öva igen, med fokus på ${skillPlural}`,
      nextUp: (title: string) => `Nästa: ${title}`,
      backToScenarios: 'Tillbaka till alla scenarier',
      reviewTranscript: 'Gå igenom det tur för tur',
      tryAnother: 'Prova ett annat',
    },
  },

  transcript: {
    meta: {
      title: 'Samtalsutskrift',
      description: 'Se hur samtalet gick, tur för tur.',
    },
    loading: 'Letar fram ditt samtal…',
    notFound: {
      title: 'Vi hittade inte det här samtalet',
      body: 'Det kan ha tagits bort, eller så gäller länken inte längre.',
    },
    backToPractice: 'Tillbaka till övningar',
    backToResults: 'Tillbaka till resultatet',
    copied: 'Kopierat!',
    copy: 'Kopiera utskrift',
    title: 'Samtalsutskrift',
    finalScore: 'Slutpoäng',
    scoreOutOf: (score: number) => `${score}/100`,
    mood: {
      title: 'Humörets resa',
      startPoint: 'Start',
      response: (n: number) => `Svar ${n}`,
      start: 'Samtalets början',
      end: 'Samtalets slut',
    },
    stats: {
      finalScore: 'Slutpoäng',
      yourMessages: 'Dina meddelanden',
      ofTotal: (total: number) => ` av ${total}`,
      freeOfBlame: 'Fria från anklagelser',
      bestTurn: 'Bästa enskilda tur',
      averagesTitle: 'Genomsnitt per del',
      averagesHint:
        'Av 25, räknat på de meddelanden där du använde varje del. En prick betyder att den inte var med i det här samtalet.',
    },
    fullConversation: 'Hela samtalet',
    export: {
      heading: 'SAMTALSUTSKRIFT',
      underline: '===============',
      scenario: (title: string) => `Scenario: ${title}`,
      finalScore: (score: number) => `Slutpoäng: ${score}/100`,
      date: (date: string) => `Datum: ${date}`,
      you: 'Du',
      score: (total: number) => ` [Poäng: ${total}/100]`,
    },
  },
}
