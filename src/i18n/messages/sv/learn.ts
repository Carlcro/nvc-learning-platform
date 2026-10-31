import { pluralFor } from '../../plural'
import type { Messages } from '..'

/**
 * Swedish copy for the lessons area: the lessons hub, the six lesson pages
 * and the quiz at the end of each.
 */

const plural = pluralFor('sv')

export const learn: Messages['learn'] = {
  meta: {
    hub: {
      title: 'Lektioner',
      description:
        'Sex grundläggande lektioner om observationer, känslor, behov och önskemål.',
    },
    introduction: {
      title: 'Introduktion till nonviolent communication',
      description:
        'Vad medkännande kommunikation är, och varför den förändrar hur samtal blir.',
    },
    observation: {
      title: 'Observationer utan värderingar',
      description:
        'Beskriv vad du ser och hör utan att döma, det första steget i NVC.',
    },
    feeling: {
      title: 'Att känna igen och uttrycka känslor',
      description:
        'Skilj äkta känslor från tankar och sätt ärliga ord på det du känner.',
    },
    need: {
      title: 'Att koppla känslor till behov',
      description: 'Hitta det universella mänskliga behovet under en känsla.',
    },
    request: {
      title: 'Att uttrycka tydliga önskemål',
      description:
        'Be om något konkret som går att göra, utan att det blir ett krav.',
    },
    integration: {
      title: 'Att sätta ihop allt',
      description:
        'Foga ihop observation, känsla, behov och önskemål till ett tydligt budskap.',
    },
  },
  loading: {
    hub: 'Hämtar dina lektioner...',
    lesson: 'Öppnar lektionen...',
  },
  hub: {
    title: 'Sex korta lektioner, en färdighet.',
    intro: (totalMinutes: number) =>
      `Varje lektion tar upp en del av nonviolent communication, visar den i några verkliga exempel och avslutas med en kort kontroll. Tillsammans tar de ungefär ${totalMinutes} minuter, och du kan stanna var du vill.`,
    allFinished:
      'Du har gjort klart alla sex. Gå tillbaka till dem när du vill.',
    finishedCount: (done: number, total: number) => `${done} av ${total} klara`,
    cardMeta: (order: number, minutes: number) =>
      `Lektion ${order}, ${minutes} min`,
    cardUpNext: ', nästa på tur',
    done: 'Klar',
    start: 'Börja',
    open: 'Öppna',
  },
  page: {
    notFound: 'Den här lektionen kunde inte hittas.',
    backToLessons: 'Tillbaka till alla lektioner',
    allLessons: 'Alla lektioner',
    lessonOf: (number: number, total: number) =>
      `Lektion ${number} av ${total}`,
    duration: (minutes: number) =>
      plural(minutes, {
        one: `Ungefär ${minutes} minut`,
        other: `Ungefär ${minutes} minuter`,
      }),
    completed: 'Klar',
    pointsHeading: 'Fyra saker att hålla fast vid',
    takeawaysHeading: 'Det här är bra att komma ihåg',
    nextLesson: (shortName: string) => `Nästa: ${shortName}`,
    tryPractice: 'Prova ett övningssamtal',
    practice: 'Öva',
    navLabel: 'Lektioner',
    foundations: {
      title: 'Du har gjort klart grunderna.',
      text: 'Alla fyra delarna är dina nu. De börjar kännas naturliga när du använder dem med någon som svarar, så ett övningssamtal är ett bra nästa steg.',
    },
    examples: {
      counter: (index: number, total: number) => `Exempel ${index} av ${total}`,
      whyItMatters: 'Därför spelar det roll: ',
      previous: 'Föregående exempel',
      next: 'Nästa exempel',
    },
  },
  quiz: {
    heading: 'Kolla vad du har förstått',
    questionOf: (index: number, total: number) => `Fråga ${index} av ${total}`,
    notQuite: 'Inte riktigt den här.',
    missedBefore: 'Titta en gång till på de andra alternativen, eller ',
    showAnswer: 'visa mig svaret',
    missedAfter: '.',
    foundFirstTry: 'Ja, den.',
    foundLater: 'Där har du den.',
    previousQuestion: 'Föregående fråga',
    nextQuestion: 'Nästa fråga',
    finish: 'Klar',
    checkAnswer: 'Kolla mitt svar',
    finishedTitle: 'Du har gjort klart den här lektionen.',
    firstLookSummary: (found: number, total: number) =>
      `Du hittade ${found} av ${total} på första försöket.`,
    secondLookNote: 'De som krävde en extra titt är ofta de som fastnar.',
    tryAgain: 'Gå igenom frågorna igen',
  },
  lessons: {
    introduction: {
      shortName: 'Introduktion',
      heading: 'Vad är nonviolent communication?',
      aside: {
        label: 'Varför en giraff',
        text: 'Rosenberg valde giraffen eftersom den har det största hjärtat av alla landdjur, och en lång hals som låter den se en situation från ovan.',
      },
      points: [
        {
          title: 'Observation',
          text: 'Det som hände, utan något omdöme om det.',
        },
        { title: 'Känsla', text: 'Den känsla du märker i dig själv.' },
        { title: 'Behov', text: 'Det som är viktigt för dig under känslan.' },
        { title: 'Önskemål', text: 'En konkret sak som skulle hjälpa.' },
      ],
      examples: {
        heading: 'Samma ögonblick, på två sätt',
        giraffe: 'Giraff',
        jackal: 'Varg',
      },
      takeaways: [
        'NVC är ett sätt att tala och lyssna som håller kvar båda i samtalet.',
        'Det har fyra delar: observation, känsla, behov och önskemål.',
        'Giraffspråket söker förståelse. Vargspråket dömer, skuldbelägger och ställer krav.',
        'Alla talar vargspråk ibland. Övningen är att märka det och försöka igen.',
      ],
    },
    observation: {
      shortName: 'Observationer',
      heading: 'Säg det en kamera skulle se',
      aside: {
        label: 'Ett snabbt test',
        text: 'Skulle en videoinspelning kunna visa det? ”Du lämnade disken i diskhon” klarar testet. ”Du hjälper aldrig till” gör det inte, för ingen kamera kan filma ”aldrig”.',
      },
      points: [
        {
          title: 'Beskriv, döm inte',
          text: 'Nämn handlingen, inte vad den säger om personen.',
        },
        {
          title: 'Var konkret',
          text: 'En tid, en plats eller en siffra är lättare att höra än en sammanfattning.',
        },
        {
          title: 'Släpp alltid och aldrig',
          text: 'Absoluta ord gör ett enda ögonblick till en dom över någons karaktär.',
        },
        {
          title: 'Håll det kort',
          text: 'En tydlig mening räcker att börja med.',
        },
      ],
      examples: {
        heading: 'Observation eller värdering?',
        giraffe: 'Observation',
        jackal: 'Värdering',
      },
      takeaways: [
        'En observation beskriver vad som hände, utan något omdöme om det.',
        'Konkreta detaljer är lättare att höra än generaliseringar.',
        'Ord som alltid och aldrig brukar vara ett tecken på en värdering.',
        'En tydlig observation ger de andra tre delarna något att stå på.',
      ],
    },
    feeling: {
      shortName: 'Känslor',
      heading: 'Sätt ord på själva känslan',
      aside: {
        label: 'Lyssna efter ”att” och ”som”',
        text: '”Jag känner att...” och ”Jag känner mig som...” följs nästan alltid av en tanke. Prova att avsluta meningen med ett enda känsloord i stället.',
      },
      points: [
        {
          title: 'Känslor',
          text: 'Det du märker i dig själv: ledsen, orolig, lättad, glad.',
        },
        {
          title: 'Tankar förklädda till känslor',
          text: 'Ord som ignorerad, avvisad eller sviken beskriver vad någon gjorde mot dig.',
        },
        {
          title: 'Ta ansvar för den',
          text: '”Jag blev sårad” låter känslan vara din. ”Du sårade mig” lägger den på den andra.',
        },
        {
          title: 'Använd känslobiblioteket',
          text: 'När rätt ord inte vill komma hjälper det att bläddra i en lista.',
        },
      ],
      examples: {
        heading: 'Känsla eller tanke?',
        giraffe: 'En känsla',
        jackal: 'En tanke',
      },
      takeaways: [
        'En känsla är något du upplever inom dig. En pseudokänsla bär på ett omdöme om någon annan.',
        '”Jag känner att” och ”Jag känner mig som” leder oftast in i en tanke.',
        'När du tar ansvar för en känsla blir det lättare för den andra att stanna kvar hos dig.',
        'Om ordet inte vill komma kan känslobiblioteket hjälpa dig att hitta det.',
      ],
    },
    need: {
      shortName: 'Behov',
      heading: 'Det som är viktigt under ytan',
      aside: {
        label: 'Behov eller strategi?',
        text: 'Om bara en viss person skulle kunna tillgodose det är det troligen en strategi. ”Hjälp med disken” är en strategi, stöd och rättvisa är behoven den tjänar.',
      },
      points: [
        {
          title: 'Gemensamma för alla',
          text: 'Vila, trygghet, respekt, kontakt, mening: behov som vem som helst kan ha.',
        },
        {
          title: 'Inte en strategi',
          text: '”Äta middag tillsammans” eller ”ring mig” är sätt att tillgodose ett behov, inte själva behovet.',
        },
        {
          title: 'Många vägar framåt',
          text: 'När behovet har fått ett namn kan fler än en lösning tillgodose det.',
        },
        {
          title: 'Den andras också',
          text: 'Den andra personen har behov i samma stund. Det hjälper att undra över dem.',
        },
      ],
      examples: {
        heading: 'Att sätta ord på behovet',
        giraffe: 'Nämner behovet',
        jackal: 'Håller fast vid en strategi',
      },
      takeaways: [
        'Behov delas av alla människor. Strategier är särskilda sätt att tillgodose dem.',
        'När du sätter ord på behovet öppnas fler än en väg framåt.',
        'Samma behov kan tillgodoses med många olika strategier.',
        'Den andra personen har också behov, och nyfikenhet på dem bygger kontakt.',
      ],
    },
    request: {
      shortName: 'Önskemål',
      heading: 'Be om en sak som går att göra',
      aside: {
        label: 'Önskemål eller krav?',
        text: 'Du märker det på vad som händer efter ett nej. Om du kan förbli nyfiken på skälen var det ett önskemål.',
      },
      points: [
        {
          title: 'Konkret',
          text: 'Något som någon faktiskt kan göra, i dag eller den här veckan.',
        },
        {
          title: 'Positivt',
          text: 'Be om det du vill ha, inte om det du vill att den andra ska sluta med.',
        },
        {
          title: 'Plats för ett nej',
          text: '”Skulle du vilja...” betyder att svaret verkligen är öppet.',
        },
        {
          title: 'Ett nej är information',
          text: 'Det berättar något om den andras behov, och samtalet kan fortsätta.',
        },
      ],
      examples: {
        heading: 'Önskemål eller krav?',
        giraffe: 'Ett önskemål',
        jackal: 'Ett krav',
      },
      takeaways: [
        'Ett önskemål är konkret och går att göra, så att den andra vet vad du ber om.',
        'Be om det du vill ha snarare än det du vill att någon ska sluta med.',
        'Ett önskemål lämnar den andra fri att säga nej.',
        'Ett nej öppnar för ett samtal om bådas behov.',
      ],
    },
    integration: {
      shortName: 'Att sätta ihop allt',
      heading: 'Ett meddelande, fyra delar',
      aside: {
        label: 'Hela formen',
        text: 'När jag såg [observation] kände jag mig [känsla], eftersom jag behöver [behov]. Skulle du vilja [önskemål]?',
      },
      points: [
        {
          title: 'Observation',
          text: 'Det som hände, utan något omdöme om det.',
        },
        { title: 'Känsla', text: 'Den känsla du märkte i dig själv.' },
        { title: 'Behov', text: 'Det som var viktigt för dig under den.' },
        { title: 'Önskemål', text: 'En konkret sak som skulle hjälpa.' },
      ],
      examples: {
        heading: 'Hela meddelandet',
        giraffe: 'Alla fyra delarna',
        jackal: 'Varg',
      },
      takeaways: [
        'De fyra delarna bildar tillsammans ett helt meddelande.',
        'I verkliga samtal kan de komma under flera turer, och det är helt i sin ordning.',
        'När du känner till hela formen blir det lättare att märka vilken del som saknas.',
        'Det är när du övar som formen börjar låta som du.',
      ],
    },
  },
}
