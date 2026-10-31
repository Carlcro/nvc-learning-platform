import type { Messages } from '..'

export const home: Messages['home'] = {
  meta: {
    title: 'Lär dig medkännande kommunikation',
    description:
      'Öva de fyra stegen i medkännande kommunikation med korta lektioner och rollspel som känns som riktiga samtal.',
  },
  hero: {
    title: 'Öva på det svåra samtalet innan du har det.',
    intro:
      'Lär dig de fyra delarna i nonviolent communication och prova dem sedan högt med någon som svarar. När det riktiga samtalet kommer känns orden redan som dina egna.',
    primaryAction: 'Prova ett övningssamtal',
    secondaryAction: 'Eller börja med en kort lektion',
    bubble: 'Gick ett samtal snett? Vi provar igen, i lugn takt.',
  },
  showcase: {
    title: 'Säg det, se hur det tas emot, prova igen.',
    partners:
      'Varje övningspartner har en historia och ett humör. Anklagelser gör dem vaksamma. Ärlighet om vad du såg och kände hjälper dem att mjukna.',
    hints:
      'Efter varje meddelande får du en ledtråd, aldrig ett manus, och bågen fylls i när du tar med varje del i samtalet. En del per meddelande räcker gott.',
  },
  voices: {
    title: 'Varje svårt ögonblick har två röster.',
    intro:
      'Marshall Rosenberg kallade dem vargen och giraffen. Vargen dömer, anklagar och ställer krav, och då försvarar sig människor. Giraffen, landdjuret med det största hjärtat, säger vad som hände, hur det kändes, vad som var viktigt och vad som skulle hjälpa.',
    jackal: {
      name: 'Vargen',
      tagline: 'Dömer, anklagar och ställer krav',
      outcome: 'Sam hör en attack och börjar försvara sig.',
      lines: [
        { move: 'Omdöme', line: 'Du struntar alltid i mig.' },
        { move: 'Tankeläsning', line: 'Jag känner att du inte bryr dig.' },
        { move: 'Kritik', line: 'Du måste skärpa dig.' },
        { move: 'Krav', line: 'Skicka bara ett sms nästa gång.' },
      ],
    },
    giraffe: {
      name: 'Giraffen',
      tagline: 'Säger vad som hände och vad som skulle hjälpa',
      outcome: 'Sam hör att du var orolig och mjuknar.',
      lines: [
        {
          move: 'Observation',
          line: 'När jag inte hörde av dig i går kväll',
        },
        { move: 'Känsla', line: 'blev jag orolig,' },
        {
          move: 'Behov',
          line: 'för det är viktigt för mig att veta att du är okej.',
        },
        {
          move: 'Önskemål',
          line: 'Skulle du vilja skicka ett kort sms när du är ute sent?',
        },
      ],
    },
    lessonsNote:
      'Ingen säger alla fyra på en gång i verkligheten, och det behöver inte du heller. Lektionerna tar en del i taget, med ett kort quiz i slutet av varje.',
    seeLessons: 'Se lektionerna',
  },
  closing: {
    title: 'Ta med samtalet du bävar inför.',
    body: 'Välj ett färdigt scenario, eller beskriv en situation från ditt eget liv och öva på den. Dina övningssamtal är bara dina.',
    action: 'Börja öva',
  },
  footer: {
    creditBefore: 'Practice NVC. Bygger på Marshall Rosenbergs arbete och ',
    creditLink: 'Center for Nonviolent Communication',
    creditAfter: '.',
    navLabel: 'Sidfot',
    lessons: 'Lektioner',
    practice: 'Öva',
    feelings: 'Känslor',
  },
  preview: {
    label: 'Ett exempel på ett övningssamtal med Sam',
    talkingWith: 'Samtal med Sam',
    situation: 'En vän som slutade höra av sig',
    firstAttempt: 'Du svarar aldrig när jag skriver.',
    firstAttemptBlame: 'Jag är tydligen inte viktig för dig.',
    samReplyGuarded: 'Jaha. Så jag är den dumma för att jag hade fullt upp?',
    hintLabel: 'En ledtråd',
    hint: 'Det landade som en anklagelse. Vad såg du faktiskt hända, och hur kändes det?',
    secondAttempt:
      'När jag inte hörde av dig efter tio i går kväll blev jag orolig, för det är viktigt för mig att veta att du är okej.',
    samReplyOpen:
      'Åh. Det tänkte jag inte på. Mobilen dog och jag gick bara och lade mig.',
    youAvatar: 'Du',
    samAvatar: 'S',
    youSpeaker: 'Du: ',
    samSpeaker: 'Sam: ',
    arcSummary:
      'Tre av fyra delar på plats. Ett önskemål kan komma i nästa tur.',
    arc: {
      observation: 'Observation',
      feeling: 'Känsla',
      need: 'Behov',
      request: 'Önskemål',
    },
  },
  dailyTeaser: {
    title: 'Dagens övning',
    pending:
      'Dagens situation är fortfarande på väg. Under tiden är alla övningsscenarier öppna för dig.',
    browseScenarios: 'Bläddra bland scenarierna',
    finished: 'Du har klarat dagens utmaning.',
    nextArrives: (time: string) => `En ny kommer klockan ${time}.`,
    seeChallenges: 'Se dagens utmaningar',
    details: (
      difficulty: string,
      bonusPoints: number,
      nextTime: string | null,
    ) =>
      `${difficulty}, ger ${bonusPoints} bonuspoäng${
        nextTime ? `. Ny utmaning klockan ${nextTime}.` : '.'
      }`,
    start: 'Starta dagens övning',
  },
}
