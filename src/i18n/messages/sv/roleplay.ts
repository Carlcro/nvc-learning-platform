import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('sv')

/** Swedish genitive: "Sams", but "Jonas" and "Max" stay as they are. */
function genitive(name: string): string {
  return /[sxz]$/i.test(name) ? name : `${name}s`
}

/**
 * Swedish copy for the live conversation screen: the conversation itself,
 * the composer, the feedback panel, rewinding and starting over, and the
 * milestone celebrations.
 */
export const roleplay: Messages['roleplay'] = {
  meta: {
    title: 'Samtal',
    description:
      'Öva medkännande kommunikation tur för tur, med återkoppling längs vägen.',
  },

  milestones: {
    start: 'Start',
    observe: 'Observera',
    feeling: 'Känsla',
    need: 'Behov',
    request: 'Önskemål',
    done: 'Klart',
  },

  scoreMessages: {
    keepGoing: 'Fortsätt',
    gettingThere: 'Du är på väg',
    landingWell: 'Det går fram fint',
    beautifullySaid: 'Vackert sagt',
  },

  errors: {
    sendFailed:
      'Något gick fel när ditt meddelande skulle skickas. Dina ord finns kvar nedan, försök gärna igen.',
    completeFailed: 'Vi kunde inte spara ditt resultat. Försök igen.',
    startFailed: 'Vi kunde inte starta ett nytt samtal. Försök igen.',
    rewindFailed: 'Vi kunde inte spola tillbaka. Försök igen.',
  },

  celebrations: {
    characterFallback: 'Personen',
    observationMade: {
      title: 'Tydlig observation',
      message: (_name: string) => 'Du beskrev vad som hände utan att döma det.',
    },
    feelingExpressed: {
      title: 'Känsla satt i ord',
      message: (_name: string) => 'Du satte ärliga ord på en känsla.',
    },
    needIdentified: {
      title: 'Behov upptäckt',
      message: (_name: string) =>
        'Du kopplade din känsla till det som är viktigt.',
    },
    requestMade: {
      title: 'Tydligt önskemål',
      message: (_name: string) => 'Du bad om något konkret som går att göra.',
    },
    empathyShown: {
      title: 'Du lyssnade',
      message: (name: string) => `Du kände in vad ${name} kanske känner.`,
    },
    resolutionReached: {
      title: 'Genombrott',
      message: (name: string) => `${name} känner sig verkligen hörd.`,
    },
  },

  page: {
    loadingScene: 'Förbereder ditt samtal…',
    loadingDefault: 'Gör allt klart för dig…',
    notFound: {
      title: 'Vi hittade inte det här samtalet',
      body: 'Det kan ha tagits bort, eller så fungerar länken inte längre.',
      back: 'Tillbaka till att öva',
    },
    dismissError: 'Stäng',
    archive: {
      title: 'Ett avslutat samtal',
      body: 'Det här samtalet är avslutat. Du kan läsa igenom det men inte ändra något.',
    },
    viewScenario: 'Visa scenariot',
    practicingWith: { before: 'Du övar med ', after: '' },
    wrapUpArc: 'Avsluta och se hur det gick',
    wrapUpEarly: 'Avsluta här och se hur det gick',
    turnLimitReached:
      'Längre än så här går inte samtalet. Avsluta det ovan för att se hur det gick, du kan alltid börja om.',
    turnsRemaining: (n: number) =>
      plural(n, {
        one: 'Ett meddelande kvar i det här samtalet.',
        other: `${n} meddelanden kvar i det här samtalet.`,
      }),
    mobile: {
      openFeedback: 'Öppna hela återkopplingen',
      tryNext: (text: string) => `Prova härnäst: ${text}`,
      firstMessageTips: 'Tips för ditt första meddelande',
      liveFeedback: 'Återkoppling',
      closeFeedback: 'Stäng återkopplingen',
    },
    continueConversation: 'Fortsätt samtalet',
    context: {
      title: 'Om scenariot',
      close: 'Stäng scenariot',
      situation: 'Situation',
      whatYoullPractice: 'Det här övar du på:',
      tipLabel: 'Tips:',
      tipBody:
        ' Ett verkligt samtal växer fram en del i taget. En observation i ett meddelande, en känsla i nästa, ett önskemål längre fram. Du behöver inte få med alla fyra i varje meddelande.',
    },
  },

  conversation: {
    you: 'Du',
    moodShift: {
      openedUp: (name: string) => `${name} öppnade sig`,
      softened: (name: string) => `${name} mjuknade lite`,
      moreGuarded: (name: string) => `${name} blev mer reserverad`,
      pulledBack: (name: string) => `${name} drog sig undan lite`,
    },
    jackalMarkTitle: 'Det här kan uppfattas som ett omdöme eller en anklagelse',
    jackalNote: 'Understrukna ord kan uppfattas som omdömen eller anklagelser.',
  },

  input: {
    placeholder: 'Vad är nästa sanna sak du vill säga?',
    ariaLabel: 'Ditt meddelande',
    emptyError: 'Skriv ett meddelande',
    tooLongError: (max: number) =>
      `Meddelandet är för långt (högst ${max} tecken)`,
    sendFailed: 'Meddelandet kunde inte skickas. Försök igen.',
    send: 'Skicka svar',
    hint: 'En del i taget räcker gott. Säg nästa sanna sak.',
  },

  rewind: {
    button: 'Spola tillbaka',
    title: 'Spola tillbaka senaste meddelandet?',
    body: 'Har du kört fast? Det här tar tillbaka ditt senaste meddelande och svaret på det, och lägger dina ord i rutan igen så att du kan forma om dem och prova ett annat sätt.',
    remaining: 'Tillbakaspolningar kvar:',
    note: 'Ett meddelande du spolar tillbaka tas bort ur samtalet och blir inte en del av din slutliga reflektion.',
    cancel: 'Avbryt',
    confirm: 'Spola tillbaka',
    rewinding: 'Spolar tillbaka...',
  },

  startOver: {
    button: 'Börja om',
    title: 'Börja om samtalet?',
    body: 'Allt som har sagts hittills läggs åt sidan och scenariot börjar om från första repliken. Det går inte att ångra.',
    canWrapUp:
      'Om du hellre vill behålla det du har övat på kan du avsluta i stället och se hur det gick.',
    suggestRewind:
      'Om det bara var ditt senaste meddelande som kändes fel kan du spola tillbaka just det.',
    keepGoing: 'Fortsätt',
    confirm: 'Börja om',
    starting: 'Börjar om…',
  },

  feedback: {
    srHeading: 'Återkoppling',
    mood: {
      open: 'Öppen',
      warming: 'Mjuknar',
      neutral: 'Neutral',
      guarded: 'Reserverad',
      defensive: 'I försvar',
    },
    howFeels: (name: string | undefined) => ({
      before: 'Så känner sig ',
      name: name || 'personen',
      after: '',
    }),
    moodAria: (name: string | undefined, label: string, opened: boolean) => {
      const who = name || 'personen'
      return `Så känner sig ${who}: ${label}${opened ? `. ${upperFirst(who)} har öppnat sig.` : ''}`
    },
    starHint: (name: string | undefined) =>
      `Stjärnan tänds när ${name || 'personen'} öppnar sig. Människor öppnar sig när de känner sig hörda.`,
    howLanded: 'Så togs meddelandet emot',
    arcTitle: 'Din båge',
    arcReached: (reached: number, total: number) =>
      `${reached} av ${total} nådda`,
    pieceStatus: {
      reached: 'nådd',
      next: 'nästa att nå',
      notYet: 'inte än',
    },
    pieceAria: (label: string, status: string, value: number) =>
      `${label}: ${status}${value > 0 ? `, ${value} av 25 i det här meddelandet` : ''}`,
    pieceValueTitle: (value: number) => `Det här meddelandet: ${value} av 25`,
    empathyEarned: (name: string | undefined) =>
      `Du lyssnade. Du kände in ${name ? genitive(name) : 'den andras'} sida.`,
    empathyInvite: (name: string | undefined) =>
      `Undrar du vad ${name || 'personen'} kanske känner? Att fråga räknas också.`,
    skillHintLink: (label: string) =>
      `Öppna ${label.charAt(0).toLowerCase()}${label.slice(1)}`,
    skillHintAfter: ' i en ny flik, samtalet väntar på dig.',
    tryAgain: 'Försök igen',
    wordsComeBack: 'Dina ord kommer tillbaka till rutan.',
    rewindsLeft: (n: number) =>
      plural(n, {
        one: 'En tillbakaspolning kvar.',
        other: `${n} tillbakaspolningar kvar.`,
      }),
    tryNext: 'Prova härnäst',
    defaultNextStep: 'Prova att sätta ord på en känsla och behovet under den.',
    statusLine: (message: string, total: number, feedback: string) =>
      `${message}. Ditt meddelande fick ${total} av 100. ${feedback}`,
    reading: 'Läser ditt meddelande…',
    firstTurn: {
      intro:
        'Ta den tid du behöver. Efter varje meddelande berättar jag hur det togs emot och föreslår ett nästa steg.',
      focus: (components: string) => `Ditt fokus den här gången: ${components}`,
      openingTitle: 'En bra början',
      openingBody:
        'Beskriv vad som hände, bara fakta, utan att döma det än. En del räcker gott. Känslor, behov och ett önskemål kan få var sitt meddelande.',
      practices: 'Det här övar samtalet på',
    },
  },

  annotated: {
    you: 'Du',
    mood: {
      openWarm: 'Öppen och varm',
      warmingUp: 'Mjuknar',
      neutral: 'Neutral',
      guarded: 'Reserverad',
      defensive: 'I försvar',
    },
    breakdown: 'NVC-poäng i detalj',
    notThisTurnAria: (label: string) =>
      `${label}: inte med i det här meddelandet`,
    notThisTurn: '· inte den här gången',
    whatWentWell: 'Det här gick bra',
    nextStepSuggested: 'Föreslaget nästa steg',
    phrasesToReconsider: 'Uttryck att fundera över',
    quoted: (text: string) => `”${text}”`,
    couldAlsoSound: 'Det skulle också kunna låta så här',
    characterMood: 'Personens humör:',
  },

  empathyMeter: {
    title: 'Empatimätare',
    label: {
      excellent: 'Utmärkt',
      good: 'Bra',
      partial: 'Delvis',
      needsPractice: 'Behöver övning',
    },
    description: {
      excellent: 'Rent giraffspråk',
      good: 'Små förbättringar',
      partial: 'Blandning av giraff och varg',
      needsPractice: 'Mest vargspråk',
    },
  },
}

function upperFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
