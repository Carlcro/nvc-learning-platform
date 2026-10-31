import type { ScenarioTranslationTable } from '.'

export const sv: ScenarioTranslationTable = {
  'Colleague Feedback': {
    title: 'Kritik från en kollega',
    description:
      'Din kollega kritiserade dig inför hela teamet och du blev helt tagen på sängen. Öva på att uttrycka hur du känner dig utan att skuldbelägga.',
    situation: `På dagens morgonmöte sa Mattias: ”Din kodgranskning går för långsamt. Den bromsar hela teamet.”

Du kände dig generad och sårad över att det sades inför alla. Nu har du chansen att svara Mattias och berätta hur du kände dig, vad du behöver och vad som skulle kunna fungera bättre framöver.`,
    characterName: 'Mattias',
    characterPersonality:
      'Rak och noggrann, värdesätter effektivitet och ärlig återkoppling, vill inte såra någon',
    characterBackground:
      'Projektledare som är inriktad på resultat. Sätter ofta produktiviteten före känslorna.',
    characterHiddenNeeds: [
      'Respekt för hans rakhet',
      'Effektivitet i samarbetet',
      'Förståelse för att han menar väl',
    ],
    aiOpeningMessage:
      'Alltså, jag gav dig bara ärlig feedback. Du vet att jag alltid säger som det är. Är det något problem med det jag sa?',
  },
  'Family Responsibility Conflict': {
    title: 'Hushållssysslor i familjen',
    description:
      'Du är frustrerad över att ditt syskon inte hjälper till hemma som ni kommit överens om. Lär dig att uttrycka dina behov utan att anklaga.',
    situation: `Du och ditt syskon Elin kom överens om att dela lika på hushållssysslorna. Förra helgen gjorde du det mesta av städningen medan Elin sa att hon hade för mycket att göra.

I dag ser du att köket är stökigt igen och att Elin ligger och vilar i soffan. Du känner dig frustrerad och vill ta upp det. Nu har du chansen att säga vad du ser och hur det påverkar dig.`,
    characterName: 'Elin',
    characterPersonality:
      'Upptagen med jobbet, har dåligt samvete för att hon inte hjälper till, kan gå i försvar om hon känner sig attackerad, bryr sig om familjen',
    characterBackground:
      'Elin har nyligen fått mer ansvar på jobbet och har svårt att få ihop allt. Hon känner sig överväldigad och stänger ibland av när någon konfronterar henne.',
    characterHiddenNeeds: [
      'Medkänsla för hur mycket hon har på jobbet',
      'Att slippa skuld och skam',
      'Stöd i stället för kritik',
    ],
    aiOpeningMessage:
      'Jag vet att jag har slarvat med städningen. Det har bara varit så mycket på jobbet. Kan vi inte ta det här när jag är lite mindre stressad?',
  },
  'Friend Canceled Plans': {
    title: 'En vän ställde in',
    description:
      'Din vän ställde in era planer i sista minuten, igen. Öva på att uttrycka din besvikelse och samtidigt vara öppen och nyfiken.',
    situation: `Du och Sara skulle ses i kväll för att gå på bio och äta middag. En timme innan ni skulle träffas skrev Sara: ”Förlåt, förlåt, det har hänt grejer på jobbet. Kan vi ta det en annan dag?”

Det är tredje gången på två månader som Sara ställer in. Du är besviken och sårad, men du bryr dig också om er vänskap. Du vill berätta hur det här mönstret påverkar dig och samtidigt vara öppen för att förstå vad som händer hos henne.`,
    characterName: 'Sara',
    characterPersonality:
      'Varm och omtänksam, har ett kaotiskt schema, lovar ibland för mycket, har svårt att hålla ordning',
    characterBackground:
      'Sara försöker få ihop ett krävande jobb med allt annat i livet. Hon värdesätter er vänskap djupt men har svårt att säga nej och att planera sin tid.',
    characterHiddenNeeds: [
      'Förståelse och acceptans',
      'Att inte bli lämnad för att hon har det kämpigt',
      'Utrymme att vara ofullkomlig',
    ],
    aiOpeningMessage:
      'Förlåt, verkligen. Det dök upp en grej på jobbet. Jag mår så dåligt över det här. Jag vet att jag gör så hela tiden... är du sur på mig nu?',
  },
  'Romantic Partner Emotional Distance': {
    title: 'Avstånd i relationen',
    description:
      'Din partner har varit känslomässigt frånvarande i flera veckor. Ta dig an ett ömtåligt samtal med sårbarhet och nyfikenhet, utan att släppa dina egna behov.',
    situation: `De senaste tre veckorna har din partner Jonas dragit sig undan. Han sitter mycket med mobilen, går och lägger sig tidigare än vanligt och pratar knappt med dig. När du berättar om din dag svarar han kort och verkar tänka på annat.

I går kväll kände du dig ensam fast ni satt i samma rum. Du inser att ni inte har haft ett riktigt samtal eller varit nära varandra fysiskt på flera veckor. Du vill berätta hur det här påverkar dig och samtidigt vara nyfiken på hur han har det.`,
    characterName: 'Jonas',
    characterPersonality:
      'Kärleksfull men undvikande, drar sig undan när han är stressad, bryr sig mycket men har svårt att visa känslor',
    characterBackground:
      'Har nyligen tagit sig an ett krävande projekt på jobbet. Har en tendens att stänga av när det blir för mycket. Är orolig för att relationen håller på att gå sönder men vet inte hur han ska laga den.',
    characterHiddenNeeds: [
      'Utrymme och förståelse när han är stressad',
      'Trygghet i att han är älskad trots att han drar sig undan',
      'Stöd med det som känns överväldigande',
      'Kontakt utan press',
    ],
    aiOpeningMessage:
      'Jag vet inte riktigt vad jag ska säga... Jag vet att du har märkt att jag har varit lite borta. Det är bara väldigt mycket just nu.',
  },
  'Workplace Boundary with Boss': {
    title: 'Gränser mot chefen',
    description:
      'Din chef förväntar sig att du jobbar på helgerna. Sätt dina gränser på ett professionellt sätt och behåll samtidigt en bra arbetsrelation.',
    situation: `Din chef Karin har bett dig jobba på söndag för att bli klar med en presentation. Det är tredje helgen i rad som du förväntas jobba. Du gillar ditt jobb och vill göra bra ifrån dig, men du värdesätter också tid för dig själv och din familj.

Du bestämmer dig för att ta det här samtalet. Du vill vara tydlig med dina gränser och samtidigt visa att du är engagerad i ditt arbete.`,
    characterName: 'Karin',
    characterPersonality:
      'Ambitiös och resultatinriktad, kör inte medvetet över andras gränser men är otydlig med sina förväntningar, jobbar jämt',
    characterBackground:
      'Erfaren chef som har gjort karriär genom att alltid vara tillgänglig. Förväntar sig omedvetet samma sak av sitt team. Menar väl men är dålig på gränser.',
    characterHiddenNeeds: [
      'Att projektet lyckas och får uppskattning',
      'Respekt för hennes ledarskap',
      'Effektivitet och pålitlighet i teamet',
      'Att inte uppfattas som krävande',
    ],
    aiOpeningMessage:
      'Jag vet att det är helg, men jag behöver verkligen att du putsar på presentationen. Vi har pitchen på måndag och den är jätteviktig. Du är min bästa person på det här.',
  },
  "Friend's Hurtful Comment About Your Appearance": {
    title: 'En vän kommenterade ditt utseende',
    description:
      'En nära vän sa något okänsligt om hur du ser ut. Ta upp det som sårade dig och ge samtidigt din vän tolkningsföreträde.',
    situation: `I går sa Linnea inför era andra vänner: ”Du har gått upp lite i vikt sen sist, va?” Du blev sårad och generad. Hon sa det i förbifarten, ungefär som att prata om vädret, men det har stannat kvar i dig.

Du värdesätter er vänskap och tror inte att Linnea ville vara elak, men du behöver att hon förstår varför kommentaren påverkade dig. Du vill ta upp det utan att varken stänga av eller gå till attack.`,
    characterName: 'Linnea',
    characterPersonality:
      'Rättfram och äkta, filtrerar inte mycket, bryr sig om dig men är dålig på att läsa av folk, går i försvar när hon får kritik',
    characterBackground:
      'Har alltid sagt precis vad hon tänker. Tycker att ärlighet alltid är bäst. Inser inte hur kommentarer om utseende påverkar folk.',
    characterHiddenNeeds: [
      'Att bli accepterad som hon är',
      'Att vänskapen håller',
      'Att inte bli attackerad för sin ärlighet',
      'Att förstå varför det här spelar roll',
    ],
    aiOpeningMessage:
      'Men kom igen, jag konstaterade ju bara en grej. Jag menade inget med det. Du är fortfarande jättefin, jag var bara ärlig mot dig.',
  },
  'Parent Critical of Your Life Choices': {
    title: 'En förälder ifrågasätter dina val',
    description:
      'Din förälder ifrågasätter ditt yrkesval. Värna om ditt självbestämmande och samtidigt om er relation.',
    situation: `Din mamma Eva fortsätter att ifrågasätta ditt beslut att lämna ditt jobb på ett stort företag för något mer meningsfullt men mindre tryggt. Häromdagen sa hon: ”Jag förstår inte varför du kastar bort din trygghet för någon startupdröm. Jag är orolig för din framtid.”

Du har hört olika varianter av den här kritiken i flera månader. Du vill att hon ska förstå och respektera ditt val, och du vill också ta upp hur det känns för dig att inte få hennes stöd.`,
    characterName: 'Eva',
    characterPersonality:
      'Menar väl men är kontrollerande, oroar sig mycket, gör det av kärlek men har svårt att respektera ditt oberoende',
    characterBackground:
      'Kommer från en generation där ett tryggt jobb var det viktigaste av allt. Har offrat sina egna drömmar och vill att du ska få det bättre. Har svårt att acceptera att du har andra värderingar.',
    characterHiddenNeeds: [
      'Trygghet i att du kommer klara dig',
      'Att känna sig respekterad och lyssnad på',
      'Att veta att hennes uppoffringar betydde något',
      'Att få vara delaktig i dina viktiga beslut',
    ],
    aiOpeningMessage:
      'Jag förstår bara inte varför du skulle lämna ett tryggt jobb. Jag är rädd att du gör ett misstag. Du borde ha lyssnat på mig.',
  },
  'Team Member Undermining You at Work': {
    title: 'En kollega tar åt sig äran',
    description:
      'En kollega tar åt sig äran för dina idéer på möten. Hantera en knepig situation på jobbet på ett professionellt sätt.',
    situation: `På dagens ledningsmöte föreslog du en ny innovativ funktion till er produkt. Några minuter senare presenterade Viktor, som har samma roll som du, förslaget i gruppchatten som om det var hans idé, med några små justeringar, som hans eget koncept.

Det är tredje gången den här månaden. Du är arg och känner dig osynliggjord, men ni jobbar också ihop varje dag. Du behöver ta upp det här rakt och tydligt och samtidigt kunna fortsätta jobba tillsammans.`,
    characterName: 'Viktor',
    characterPersonality:
      'Tävlingsinriktad och osäker, skicklig men känner sig hotad av duktiga kollegor, ambitiös och beredd att tänja på reglerna för att komma framåt',
    characterBackground:
      'Har kämpat sig upp från tuffa förhållanden och är fast besluten att lyckas. Använder andras idéer för att han känner sig osäker på sina egna. Tycker inte att det är fel eftersom han bygger vidare på idéerna.',
    characterHiddenNeeds: [
      'Erkännande för det han bidrar med',
      'Trygghet i sin position',
      'Att bli uppskattad och respekterad',
      'Att inte bli uthängd eller skämd',
      'Att utvecklas i sin yrkesroll',
    ],
    aiOpeningMessage:
      'Jag vet inte vad du menar. Jag lyfter alltid teamet. Och ärligt talat, jag bidrog också till de där idéerna. Varför gör du det här till en grej om dig?',
  },
  'Navigating Different Parenting Styles with Co-Parent': {
    title: 'Olika syn på föräldraskap',
    description:
      'Du och den andra föräldern är oense om hur ni ska sätta gränser för barnet. Prata om era olika värderingar och sätt barnets välmående först.',
    situation: `Du har märkt att ert barn är oroligt för att göra fel i skolan. När något går snett stänger barnet av känslomässigt. Barnets andra förälder, Andreas, tycker att det behövs fast disciplin, men du har märkt att barnet svarar bättre på förståelse och på att ni löser problemen tillsammans.

Du är trött på att känna dig som den ”snälla” föräldern medan Andreas får äran för disciplinen. Du behöver ha ett riktigt samtal om era olika värderingar och hitta en väg framåt som fungerar för er båda och för ert barn.`,
    characterName: 'Andreas',
    characterPersonality:
      'Auktoritär som förälder, tror på konsekvenser och disciplin, vill ha respekt och lydnad, går i försvar när hans föräldraskap ifrågasätts',
    characterBackground:
      'Växte upp i ett strängt hem och tycker att det gjorde honom stark. Är frustrerad över hur barnet beter sig och känner att han inte får stöd av den andra föräldern. Ser mildhet som svaghet.',
    characterHiddenNeeds: [
      'Respekt för hans värderingar och sätt',
      'Att barnet ska klara sig bra och ha självdisciplin',
      'Stöd i sin roll som förälder',
      'Att känna sig som en bra förälder',
      'Respekt från barnet',
    ],
    aiOpeningMessage:
      'Du är för mesig med barnet. Barn behöver konsekvenser, annars kör de över oss. Jag är trött på att alltid vara den som är dum.',
  },
}
