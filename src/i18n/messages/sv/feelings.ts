import { pluralFor } from '../../plural'
import type { Messages } from '..'

/**
 * Swedish copy for the feelings area: the hub, the daily check-in, browsing,
 * intensity, the saved library and the feeling or thought quiz.
 */

const plural = pluralFor('sv')

/** "vila, kontakt eller stöd" */
function joinWithOr(words: ReadonlyArray<string>): string {
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} eller ${words[words.length - 1]}`
}

/** "en gång", "två gånger", "några gånger": how often a feeling came up. */
function howOften(count: number): string {
  if (count <= 1) return 'en gång'
  if (count === 2) return 'två gånger'
  if (count <= 4) return 'några gånger'
  return 'ofta'
}

export const feelings: Messages['feelings'] = {
  page: {
    back: 'Känslor',
    inASentence: 'I en mening: ',
  },

  scale: {
    intensity: {
      faint: 'Svag',
      mild: 'Mild',
      moderate: 'Måttlig',
      strong: 'Stark',
      intense: 'Intensiv',
    },
    category: {
      pleasant: 'Behaglig',
      unpleasant: 'Obehaglig',
    },
    describe: (intensity: string, category: string) =>
      `${intensity}, ${category.toLowerCase()}`,
  },

  hub: {
    meta: {
      title: 'Känslor',
      description:
        'Bygg upp orden du behöver för att säga exakt vad du känner.',
    },
    title: 'Hitta orden för det du känner.',
    intro:
      'Känslor är den andra delen i ett medkännande budskap. Ju fler ord du har för dem, desto lättare är det att säga vad som verkligen pågår, och att skilja en känsla från en tanke om någon annan.',
    guide:
      'Att sätta ord på det du känner är där medkänslan börjar. Ta den tid du behöver. Det finns inga fel svar.',
    today: {
      doneHeading: 'Du har checkat in i dag.',
      notDoneHeading: 'Hur mår du i dag?',
      doneText:
        'Du kan titta tillbaka på det du lade märke till, eller ändra det om dagen har tagit en ny vändning.',
      notDoneText:
        'Stanna upp en minut och välj de ord som passar. En kort anteckning är välkommen, och bara du kan se den.',
      doneAction: 'Öppna dagens incheckning',
      notDoneAction: 'Checka in för i dag',
    },
    toolsHeading: 'Fler sätt att utforska',
    tools: {
      wheel: {
        title: 'Bläddra bland känslor',
        text: 'Känslor sorterade i familjer, var och en med en förklaring, exempel och närliggande ord.',
      },
      intensity: {
        title: 'Hur stark är den',
        text: 'Se hur en känsla förändras när den blir svagare eller starkare, så att du kan säga hur mycket.',
      },
      library: {
        title: 'Dina sparade känslor',
        text: 'Orden du har sparat för att komma tillbaka till.',
      },
      quiz: {
        title: 'Känsla eller tanke',
        text: 'Korta meningar att sortera: är det här en känsla, eller en tanke om någon annan?',
      },
    },
    whyItHelps:
      'Därför hjälper det: en känsla som har fått ett precist namn är lättare att dela utan att skuldbelägga, och lättare för den andra att höra. Ord som ”ignorerad” eller ”dömd” beskriver vad du tror att någon har gjort. Känslorna under dem, kanske ensam eller sårad, är dina att dela.',
  },

  checkIn: {
    meta: {
      title: 'Daglig incheckning',
      description: 'Lägg märke till och sätt ord på hur du känner dig i dag.',
    },
    loading: 'Hämtar ord för känslor...',
    title: 'Hur mår du i dag?',
    intro:
      'Ta en stund och lägg märke till det som finns här, och välj de ord som passar. Det finns inget rätt svar, och du kan ändra det senare under dagen.',
    formHeading: 'Vad känner du?',
    selectedHeading: 'Dina ord för i dag',
    remove: (word: string) => `Ta bort ${word}`,
    commonHeading: 'Några vanliga känslor',
    searchLabel: 'Hitta ett annat ord',
    searchPlaceholder: 'Till exempel rastlös',
    matches: (n: number) =>
      plural(n, { one: `${n} träff`, other: `${n} träffar` }),
    noMatches: 'Inget ord matchar det än. Prova med en kortare del av ordet.',
    noteLabel: 'Skriv en anteckning, om du vill',
    notePlaceholder: 'Vad händer i dag?',
    notePrivacy: 'Bara du kan se dina incheckningar.',
    saving: 'Sparar...',
    update: 'Uppdatera incheckningen',
    save: 'Spara incheckningen',
    chooseOne: 'Välj minst ett ord för att spara.',
    saved: 'Sparat. Tack för att du stannade upp och kände efter hur du mår.',
    saveError: 'Vi kunde inte spara din incheckning just nu. Försök igen.',
    historyHeading: 'De senaste dagarna',
    historyEmpty: 'Dina incheckningar samlas här, en rad per dag.',
    weekHeading: 'Den här veckan',
    cameUp: (count: number) => ({
      before: '',
      after: ` dök upp ${howOften(count)} den här veckan.`,
    }),
    pointsToNeeds: (needs: ReadonlyArray<string>) =>
      `Den pekar ofta på ett behov av ${joinWithOr(needs)}.`,
    balanceLabel: 'Behagliga och obehagliga känslor den här veckan',
    pleasantPercent: (percent: number) => `Behagliga ${percent} %`,
    unpleasantPercent: (percent: number) => `Obehagliga ${percent} %`,
    balanceNote:
      'Båda sorterna är välkomna. Var och en pekar på något som är viktigt för dig.',
    didYouKnowHeading: 'Visste du',
    didYouKnowText:
      'Att sätta ord på en känsla kan mildra den lite och hjälpa dig att tänka klarare på vad du behöver.',
  },

  intensity: {
    meta: {
      title: 'Känslornas styrka',
      description:
        'Se hur en känsla förändras när den blir starkare eller svagare.',
    },
    loading: 'Hämtar känslor...',
    title: 'Hur stark är den?',
    intro:
      'Samma känsla kan vara svag eller intensiv. Välj en familj och rör dig sedan längs skalan för att hitta ordet som stämmer med hur mycket du känner.',
    familiesHeading: 'Familjer',
    scaleHeading: (family: string) => `${family}, från svag till intensiv`,
    sliderLabel: 'Hur stark',
    sliderValue: (level: string, word: string) => `${level}: ${word}`,
    noWordAtLevel: (level: string) =>
      `Det finns inget ord i den här familjen på nivån ${level.toLowerCase()} än. Prova ett steg svagare eller starkare.`,
    spectrumHeading: 'Alla ord i den här familjen, svagast först',
    spectrumItem: (word: string, level: string) =>
      `${word}, ${level.toLowerCase()}`,
  },

  library: {
    meta: {
      title: 'Dina sparade känslor',
      description: 'Känslorna du har utforskat och sparat.',
    },
    loading: 'Öppnar ditt bibliotek...',
    title: 'Dina sparade känslor',
    intro:
      'Orden du har sparat för att komma tillbaka till. Om du läser dem då och då blir de lättare att ta fram när det verkligen gäller.',
    removed: (word: string) => `${word} togs bort från ditt bibliotek.`,
    removeError: (word: string) => `Vi kunde inte ta bort ${word} just nu.`,
    empty: {
      before:
        'Inget sparat än. När ett ord passar något du har känt kan du spara det medan du ',
      linkText: 'bläddrar bland känslor',
      after: ', så väntar det på dig här.',
    },
    searchLabel: 'Sök bland dina sparade känslor',
    familyLabel: 'Familj',
    allFamilies: 'Alla familjer',
    savedCount: (n: number) =>
      plural(n, { one: `${n} sparad`, other: `${n} sparade` }),
    showing: (shown: number, total: number) => `Visar ${shown} av ${total}`,
    findMore: 'Hitta fler ord',
    detail: (description: string, family: string) =>
      `${description}, ${family}`,
    remove: (word: string) => `Ta bort ${word}`,
    noMatches:
      'Ingen av dina sparade känslor matchar. Prova en annan sökning eller familj.',
  },

  wheel: {
    meta: {
      title: 'Bläddra bland känslor',
      description:
        'Utforska känslor efter familj, med förklaringar, exempel och närliggande ord.',
    },
    loading: 'Hämtar känslor...',
    title: 'Bläddra bland känslor',
    intro:
      'Känslor sorterade i familjer. Välj ett ord för att se vad det betyder, hur det låter i en mening och vilka ord som ligger nära.',
    searchLabel: 'Sök bland alla känslor',
    searchPlaceholder: 'Till exempel lugn',
    showHeading: 'Visa',
    categoryAll: 'Alla',
    familiesHeading: 'Familjer',
    intensityPrompt: 'Vill du se en känsla bli starkare? ',
    intensityLink: 'Utforska styrkan',
    gridHeadingSearch: (term: string) => `Känslor som matchar ”${term}”`,
    gridHeadingFamily: (family: string) =>
      `Känslor i familjen ${family.toLowerCase()}`,
    noMatches:
      'Inga känslor matchar de här valen. Prova en annan familj, eller visa alla känslor.',
    detail: (description: string, family: string) =>
      `${description}, i familjen ${family}`,
    close: (word: string) => `Stäng ${word}`,
    meaningHeading: 'Vad det betyder',
    sentenceHeading: 'I en mening',
    similarHeading: 'Liknande ord',
    relatedHeading: 'Närliggande känslor',
    remove: 'Ta bort från ditt bibliotek',
    save: 'Spara i ditt bibliotek',
    saved: 'Sparat i ditt bibliotek.',
    removed: 'Borttaget från ditt bibliotek.',
    saveError: 'Vi kunde inte spara ordet just nu.',
    removeError: 'Vi kunde inte ta bort ordet just nu.',
    inLibrary: 'Det här ordet finns i ditt bibliotek.',
    choosePrompt:
      'Välj en känsla för att se vad den betyder, ett exempel och närliggande ord.',
  },

  quiz: {
    meta: {
      title: 'Känsla eller tanke',
      description:
        'Öva på att skilja äkta känslor från tankar om andra människor.',
    },
    title: 'Känsla eller tanke?',
    intro:
      'En känsla beskriver vad som pågår inom dig. En tanke förklädd till känsla, som ”jag känner mig ignorerad”, beskriver vad du tror att någon annan har gjort. Läs varje mening och sortera den.',
    levelsHeading: 'Välj var du vill börja',
    levels: {
      clear: {
        title: 'Nivå 1: tydliga fall',
        text: 'Tankar som är lätta att upptäcka när du väl letar efter dem.',
      },
      disguised: {
        title: 'Nivå 2: förklädda omdömen',
        text: 'Ord som ignorerad eller utnyttjad, som låter som känslor men beskriver vad någon har gjort.',
      },
      subtle: {
        title: 'Nivå 3: subtila fall',
        text: 'Meningar där gränsen är hårfin och värd att sakta ner för.',
      },
    },
    roundLength: 'Varje omgång har tio meningar.',
    loading: 'Hämtar meningar...',
    emptyHeading: 'Inga meningar här än',
    emptyText:
      'Den här nivån har inga frågor just nu. En annan nivå kanske har några.',
    chooseAnotherLevel: 'Välj en annan nivå',
    progress: (current: number, total: number) =>
      `Fråga ${current} av ${total}`,
    questionHeading: 'Är det här en känsla eller en tanke?',
    answerFeeling: 'En känsla',
    answerThought: 'En tanke',
    answerError: 'Vi kunde inte spara svaret just nu. Försök igen.',
    verdict: {
      correctFeeling: 'Ja, det där är en känsla.',
      correctThought: 'Ja, det där är en tanke förklädd till känsla.',
      wrongFeeling: 'Det där är faktiskt en känsla.',
      wrongThought: 'Det där är en tanke förklädd till känsla.',
    },
    insteadLabel: 'Känslor du skulle kunna nämna i stället: ',
    leveledUp: 'Du har gått upp en nivå i quizet.',
    next: 'Nästa mening',
    finish: 'Se hur det gick',
    summary: (sorted: number, total: number) =>
      `Du sorterade ${sorted} av ${total} rätt.`,
    missedIntro:
      'De som är värda en extra titt finns nedan. Det är ofta de som fastnar.',
    missedFeeling: 'Den här är en känsla.',
    missedThought: 'Den här är en tanke förklädd till känsla.',
    allCorrect:
      'Varje mening hamnade där den hör hemma. Nästa nivå finns där när du känner för det.',
    playAgain: 'Spela igen',
    backToFeelings: 'Tillbaka till känslor',
  },
}
