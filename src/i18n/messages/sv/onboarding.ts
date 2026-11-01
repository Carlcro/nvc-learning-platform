import type { Messages } from '..'

export const onboarding: Messages['onboarding'] = {
  meta: {
    title: 'Välkommen',
    description:
      'Välj ditt språk och ta en snabb titt runt innan du börjar öva.',
  },
  loading: 'Gör i ordning ditt välkomnande...',
  stepOf: (step: number, total: number) => `Steg ${step} av ${total}`,
  back: 'Tillbaka',
  next: 'Nästa',
  skip: 'Hoppa över rundturen',
  language: {
    bubble:
      'Hej och välkommen! Jag är din giraffguide. Först av allt, vilket språk känns mest som hemma?',
    title: 'Välj ditt språk',
    subtitle:
      'Lektioner, övningssamtal och återkoppling kommer att vara på det språk du väljer.',
    changeLater: 'Du kan ändra det när som helst i menyn under ditt namn.',
  },
  areas: {
    bubble: 'Här är en snabb rundtur, så att du vet var allt finns.',
    title: 'Dina platser att växa på',
    subtitle: 'Du hittar alla i menyn högst upp på sidan.',
    lessons: {
      title: 'Lektioner',
      body: 'Korta lektioner tar dig igenom NVC:s fyra delar: observation, känsla, behov och önskemål. Varje lektion avslutas med ett litet quiz.',
    },
    practice: {
      title: 'Öva',
      body: 'Prata med personer i vardagliga situationer och få varsam återkoppling på varje meddelande. Du kan också göra en situation från ditt eget liv till ett övningssamtal.',
    },
    daily: {
      title: 'Dagens utmaning',
      body: 'En ny situation varje dag, anpassad efter din nivå, med bonuspoäng när du antar den.',
    },
    feelings: {
      title: 'Känslor',
      body: 'Utforska känslohjulet, känn efter hur du mår i dag och hitta fler ord för det som händer inom dig.',
    },
    profile: {
      title: 'Profil',
      body: 'Se din nivå, dina poäng, din svit och dina utmärkelser, och hur varje del av NVC utvecklas.',
    },
  },
  practice: {
    bubble: 'Det är i övningen som allt faller på plats. Så här går ett samtal till.',
    title: 'Så går ett övningssamtal till',
    subtitle: 'Det finns inga fel svar här, bara övning.',
    brief: {
      title: 'Läs beskrivningen',
      body: 'Varje samtal börjar med vem du pratar med och vad som pågår mellan er.',
    },
    oneStep: {
      title: 'En del i taget',
      body: 'Du behöver inte säga allt på en gång. En observation i ett meddelande, en känsla i nästa. Stigen högst upp visar hur långt du har kommit.',
    },
    hints: {
      title: 'Varsam återkoppling',
      body: 'Efter varje meddelande ser du hur det togs emot och får en ledtråd om vad du kan prova härnäst.',
    },
    rewind: {
      title: 'Spola tillbaka',
      body: 'Önskar du att du hade sagt något annorlunda? Ta tillbaka ditt senaste meddelande och forma om dina ord.',
    },
    wrapUp: {
      title: 'Avsluta när du är redo',
      body: 'Efter några meddelanden kan du avsluta och se vad som gick bra, plus en sak att prova nästa gång.',
    },
  },
  start: {
    bubble: 'Det var allt. Var vill du börja?',
    title: 'Var vill du börja?',
    subtitle: 'Allt är öppet, så du kan utforska i vilken ordning du vill.',
    lessons: {
      title: 'Börja med första lektionen',
      body: 'En bra start om NVC är nytt för dig.',
      tag: 'Rekommenderas',
    },
    practice: {
      title: 'Hoppa direkt till övningen',
      body: 'Kan du redan grunderna? Välj ett samtal och sätt igång.',
    },
  },
}
