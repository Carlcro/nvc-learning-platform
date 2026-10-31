import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('sv')

/**
 * Swedish copy for the practice hub, the scenario brief, the scenario card
 * and the custom scenario builder.
 */
export const practice: Messages['practice'] = {
  focusAreas: {
      boundary_setting: 'sätta gränser',
      conflict_resolution: 'lösa en konflikt',
      feedback_response: 'ta emot kritik',
      feedback_and_sensitivity: 'kritik och lyhördhet',
      appreciation: 'visa uppskattning',
      apology: 'be om ursäkt',
      request_making: 'uttrycka önskemål',
      empathy: 'empati',
      emotional_intimacy: 'känslomässig närhet',
      friendship_and_reliability: 'vänskap och pålitlighet',
      parental_independence: 'självständighet gentemot föräldrar',
      parenting_partnership: 'föräldraskap tillsammans',
      responsibility_and_fairness: 'ansvar och rättvisa',
      workplace_conflict: 'konflikt på jobbet',
  },
  meta: {
    hub: {
      title: 'Öva',
      description:
        'Öva på ett svårt samtal med en övningspartner som svarar i sin roll.',
    },
    brief: {
      title: 'Om scenariot',
      description:
        'Läs om situationen och möt personen du snart ska prata med.',
    },
    create: {
      title: 'Skapa ett scenario',
      description:
        'Forma ett scenario utifrån en verklig situation i ditt liv och öva på det.',
    },
  },

  categories: {
    workplace: 'Jobbet',
    family: 'Familj',
    friendship: 'Vänskap',
    self_expression: 'Att uttrycka sig',
  },

  difficulties: {
    beginner: 'Nybörjare',
    intermediate: 'Medel',
    advanced: 'Avancerad',
  },

  tryAgainError: 'Det gick inte igenom. Andas lugnt och försök igen.',
  readyWhenYouAre: 'Börja när du vill. Ta den tid du behöver.',
  starsLabel: (stars: number) => `${stars} av 3 stjärnor`,
  aboutCharacter: (name: string) => `Om ${name}`,
  situation: 'Situation',
  personality: 'Personlighet',
  background: 'Bakgrund',
  whatYoullPractice: 'Det här övar du på',

  hub: {
    title: 'Vem vill du öva med?',
    intro:
      'Alla scenarier är öppna. Välj någon vars situation känns nära din, eller börja med förslaget nedan.',
    levelNote: (level: number, pointsToNext?: number) =>
      pointsToNext !== undefined && pointsToNext > 0
        ? `Nivå ${level}, ${pointsToNext} poäng kvar till nästa`
        : `Nivå ${level}`,
    suggestion: {
      waitingEyebrow: 'Fortsätt där du slutade',
      waitingNote: (name: string) => `Ditt samtal med ${name} väntar på dig.`,
      firstEyebrow: 'Ett bra ställe att börja',
      nextEyebrow: 'Förslag på nästa',
      continue: 'Fortsätt',
      tryAgain: 'Försök igen',
      start: 'Börja',
    },
    rehearse: {
      title: 'Öva inför ett verkligt samtal',
      body: 'Har du något svårt framför dig? Gör det till ett övningsrum och prova i lugn och ro det du vill säga, innan det är på riktigt.',
      action: 'Börja forma det',
    },
    yourScenarios: 'Dina egna scenarier',
    library: 'Scenariobibliotek',
    allCategories: 'Alla ämnen',
    allDifficulties: 'Alla nivåer',
    filterByCategory: 'Filtrera scenarier efter kategori',
    filterByDifficulty: 'Filtrera scenarier efter svårighetsgrad',
    loading: 'Hämtar scenarier',
    noMatches: 'Inga scenarier passar de här filtren.',
    clearFilters: 'Rensa filter',
    empty:
      'Här finns inga scenarier än. Du kan fortfarande öva på ett eget här ovanför.',
    onePiece: {
      title: 'En del i taget',
      body: 'Ett verkligt samtal växer fram steg för steg. Säg vad du såg, sedan vad du kände, vad som är viktigt för dig och vad du önskar. En av dem per meddelande räcker gott, de andra kan vänta på sin tur.',
    },
    deleteDialog: {
      title: 'Ta bort scenariot?',
      descriptionBefore: '',
      descriptionAfter: ' och dess övningshistorik tas bort för gott.',
      keep: 'Behåll det',
      delete: 'Ta bort',
      deleting: 'Tar bort…',
    },
  },

  card: {
    categoryAndDifficulty: (category: string, difficulty: string) =>
      `${category}, ${difficulty.toLowerCase()}`,
    deleteLabel: (title: string) => `Ta bort ${title}`,
    deleteTitle: 'Ta bort',
    withCharacter: (name: string) => `med ${name}`,
    aboveLevel: (minLevel: number) =>
      `Brukar provas från nivå ${minLevel}. Öppet för dig redan nu om du vill utmana dig.`,
    status: {
      in_progress: 'Pågår',
      attempted: 'Provat en gång',
      completed: 'Klart',
    },
    suggestedNext: 'Förslag på nästa',
    viewBest: 'Se ditt bästa',
    actions: {
      continue: 'Fortsätt',
      improve: 'Förbättra',
      tryAgain: 'Försök igen',
      start: 'Börja',
    },
  },

  brief: {
    loading: 'Förbereder ditt samtal…',
    notFound: {
      title: 'Vi hittade inte det här scenariot',
      body: 'Det kan ha tagits bort, eller så fungerar länken inte längre.',
    },
    back: 'Tillbaka till scenarierna',
    focus: 'Fokus:',
    onePiece: {
      lead: 'En del i taget.',
      body: 'Ett verkligt samtal växer fram steg för steg: en observation i ett meddelande, en känsla i nästa, ett önskemål längre fram. Du behöver aldrig få med allt i ett och samma meddelande.',
    },
    tipsTitle: 'De fyra delarna, att titta på vid behov',
    tips: {
      observation:
        'Observation: beskriv vad du såg eller hörde, utan att döma.',
      feeling:
        'Känsla: sätt ord på själva känslan, inte en tanke eller en anklagelse.',
      need: 'Behov: säg vad som är viktigt för dig under känslan.',
      request:
        'Önskemål: be om en konkret sak som går att göra, och lämna plats för ett nej.',
    },
    stayCurious: (name: string) =>
      `Var också nyfiken på hur ${name} ser på saken och vad hen behöver.`,
    best: (score: number) => `Ditt bästa: ${score}/100`,
    attempts: (n: number) =>
      plural(n, { one: `· ${n} försök`, other: `· ${n} försök` }),
    waiting: (name: string, turns: number) =>
      plural(turns, {
        one: `Ditt samtal med ${name} väntar, med ett meddelande skrivet.`,
        other: `Ditt samtal med ${name} väntar, med ${turns} meddelanden skrivna.`,
      }),
    startFresh: 'Börja om från början',
    starting: 'Startar...',
    continue: 'Fortsätt ditt samtal',
    start: 'Starta samtalet',
  },

  create: {
    generateError:
      'Vi kunde inte forma det här just nu. Andas lugnt och försök igen.',
    loading: 'Formar ditt övningsrum…',
    themFallback: 'personen',
    guideAlt: 'Din guide',
    progressLabel: 'Hur långt du har kommit',
    stages: [
      'Situationen',
      'Den andra personen',
      'Det du hoppas på',
      'Ditt rum',
    ],
    bubble: {
      situation:
        'Vi börjar med det du har på hjärtat. Berätta bara det du vill, och håll det enkelt.',
      person: (name: string) =>
        `Lite om ${name}, så att det känns verkligt att prata med hen.`,
      you: 'Nu kommer delen som handlar om dig och det du hoppas på.',
      refine: (name: string) =>
        `Ett par saker till, så att det här känns sant för din situation med ${name}.`,
      review:
        'Här är ditt rum. Gör det till ditt och ändra det som inte stämmer.',
    },
    backToPractice: 'Tillbaka till att öva',
    backAStep: 'Ett steg tillbaka',
    continue: 'Fortsätt',
    optional: '(valfritt)',

    situationStep: {
      title: 'Situationen',
      who: 'Vem är samtalet med?',
      whoHint: 'Ett namn eller det du kallar personen',
      whoPlaceholder: 't.ex. Sam',
      relationship: 'Vilken relation har ni?',
      whatsGoingOn: 'Vad är det som händer, med en mening eller två?',
      whatsGoingOnPlaceholder: 'Vilken situation vill du öva på?',
      whatHappened: 'Vad hände, mer konkret?',
      whatHappenedPlaceholder: 'Något särskilt som sades eller gjordes',
      incompleteHint:
        'Fyll i vem det gäller och vad som händer för att fortsätta.',
    },

    personStep: {
      title: (name: string) => `Om ${name}`,
      reactions: 'Hur brukar personen reagera när det blir spänt?',
      chooseAny: 'Välj de som stämmer',
      whatMatters: 'Vad tror du är viktigast för personen här?',
      whatMattersHint:
        'Till exempel: att bli respekterad, att bli hörd, rättvisa',
      whatMattersPlaceholder: 'Vad ligger under reaktionen?',
      openness: 'Hur öppen tror du att personen är i början?',
      history: 'Något mer om personen eller er historia?',
      historyPlaceholder: 'Bara om det hjälper dig att föreställa dig samtalet',
    },

    youStep: {
      title: 'Det du hoppas på',
      feelings: 'Hur känner du dig inför det här?',
      feelingsHint: 'Välj de som stämmer, eller ingen alls',
      goodOutcome: 'Vad skulle kännas som ett bra resultat för dig?',
      goodOutcomePlaceholder: 'Det du skulle vilja känna eller höra till slut',
      practice: 'Vad vill du helst öva på?',
      chooseAny: 'Välj de som stämmer',
      challenge: 'Hur utmanande ska personen vara?',
      incompleteHint:
        'Berätta hur ett bra resultat skulle se ut för att fortsätta.',
    },

    relationships: {
      partner: 'Partner',
      familyMember: 'Familjemedlem',
      friend: 'Vän',
      manager: 'Chef',
      coworker: 'Kollega',
      roommate: 'Rumskamrat',
      other: 'Annat',
    },
    reactions: {
      defensive: 'Går i försvar',
      shutsDown: 'Stänger av eller blir tyst',
      louder: 'Höjer rösten',
      humor: 'Skämtar bort det',
      calm: 'Förblir lugn',
      apologizes: 'Ber snabbt om ursäkt',
      past: 'Tar upp gamla saker',
      notSure: 'Vet inte än',
    },
    openness: {
      guarded: 'Ganska reserverad',
      mixed: 'Reserverad men villig',
      open: 'Ganska öppen',
    },
    feelings: {
      frustrated: 'frustrerad',
      angry: 'arg',
      irritated: 'irriterad',
      upset: 'upprörd',
      sad: 'ledsen',
      disappointed: 'besviken',
      lonely: 'ensam',
      discouraged: 'modfälld',
      anxious: 'ängslig',
      worried: 'orolig',
      overwhelmed: 'överväldigad',
      resentful: 'bitter',
    },
    practiceFocus: {
      observation: 'Att säga vad jag såg utan att skuldbelägga',
      feelings: 'Att sätta ord på mina känslor',
      needs: 'Att komma i kontakt med vad jag behöver',
      request: 'Att uttrycka ett tydligt önskemål',
      grounded: 'Att hålla mig lugn om det hettar till',
    },
    challenge: {
      gentle: 'Mild',
      true: 'Som i verkligheten',
      tougher: 'Tuffare än vanligt',
    },
    otherPersonFallback: 'den andra personen',
    relationshipFallback: 'någon i mitt liv',

    retry: {
      title: 'Vi försöker igen',
      body: 'Vi kunde inte forma det här just nu. Dina svar finns kvar.',
      tryAgain: 'Försök igen',
      backToEditing: 'Tillbaka till redigeringen',
    },

    refine: {
      title: 'Några detaljer',
      thinking: 'Ett ögonblick',
      placeholder: 'Skriv det som dyker upp…',
      send: 'Skicka',
      skip: 'Hoppa över och fortsätt',
    },

    review: {
      titleLabel: 'Titel',
      standIn: (name: string) =>
        `Svaren från ${name} är här en övningsversion, så att du i lugn och ro kan prova dig fram före det verkliga samtalet.`,
      keepEditing: 'Fortsätt redigera',
      starting: 'Startar…',
      start: 'Starta samtalet',
    },
  },
}
