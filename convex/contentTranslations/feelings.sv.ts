import type { FeelingsTranslation } from '../lib/contentText'

export const feelingsSv: FeelingsTranslation = {
  feelings: {
    // ========== GLÄDJE ==========
    joyful: {
      word: 'glädjefylld',
      definition: 'En stark känsla av lycka och glädje. Något i dig vill fira.',
      examples: [
        'Jag känner mig glädjefylld när jag når ett mål som har varit svårt.',
        'Beskedet gjorde mig glädjefylld och förväntansfull inför framtiden.',
        'Hon kände sig glädjefylld när hennes barn tog examen.',
      ],
      synonyms: ['lycklig', 'förtjust', 'uppsluppen', 'munter'],
      relatedFeelings: ['munter', 'förtjust', 'glad', 'lycklig'],
    },
    cheerful: {
      word: 'munter',
      definition:
        'Ljus till sinnes och hoppfull. Du har nära till skratt och gott humör.',
      examples: [
        'Hon log muntert trots att dagen hade varit tung.',
        'Jag känner mig munter efter en natt med god sömn.',
        'Han tog sig an projektet med ett muntert humör.',
      ],
      synonyms: ['glad', 'uppåt', 'ljus', 'positiv'],
      relatedFeelings: ['glädjefylld', 'glad', 'lycklig', 'sorglös'],
    },
    delighted: {
      word: 'förtjust',
      definition:
        'En varm känsla av glädje och tillfredsställelse över något som har hänt.',
      examples: [
        'Jag blev förtjust när jag fick den oväntade presenten.',
        'Hon blev förtjust när hennes mentor berömde henne.',
        'Han verkade förtjust över hur kvällen blev.',
      ],
      synonyms: ['glad', 'lycklig', 'hänförd', 'charmad'],
      relatedFeelings: ['glädjefylld', 'glad', 'tacksam', 'nöjd'],
    },
    glad: {
      word: 'glad',
      definition:
        'En känsla av glädje eller tillfredsställelse över något som har hänt.',
      examples: [
        'Jag är glad att du mår bättre nu.',
        'Hon blev glad när hon träffade sina gamla vänner.',
        'Han var glad att kunna hjälpa till med projektet.',
      ],
      synonyms: ['lycklig', 'nöjd', 'belåten', 'tillfreds'],
      relatedFeelings: ['glädjefylld', 'munter', 'nöjd', 'tillfreds'],
    },
    happy: {
      word: 'lycklig',
      definition:
        'En känsla av glädje och tillfredsställelse. Ett allmänt välbefinnande.',
      examples: [
        'Jag känner mig lycklig när jag är med min familj.',
        'Hon var lycklig över de nya möjligheterna.',
        'Han såg lycklig ut när han kom in i rummet.',
      ],
      synonyms: ['glädjefylld', 'glad', 'tillfreds', 'munter'],
      relatedFeelings: ['glädjefylld', 'munter', 'förtjust', 'glad'],
    },
    grateful: {
      word: 'tacksam',
      definition:
        'En varm känsla när du har fått omtanke eller hjälp. Du uppskattar det du har fått.',
      examples: [
        'Jag känner mig tacksam för allt stöd du har gett mig.',
        'Hon kände sig tacksam när kollegorna hjälpte henne att hinna klart i tid.',
        'Han berättade hur tacksam han var för chansen.',
      ],
      synonyms: ['uppskattande', 'erkänsam', 'varm'],
      relatedFeelings: ['uppskattande', 'hoppfull', 'nöjd', 'glad'],
    },
    thankful: {
      word: 'uppskattande',
      definition:
        'En känsla av tacksamhet och uppskattning för något du har fått eller fått vara med om.',
      examples: [
        'Jag är full av uppskattning för den här chansen att lära mig och växa.',
        'Hon kände sig varm och uppskattande när någon visade henne vänlighet.',
        'Han uppskattade verkligen återkopplingen på sitt arbete.',
      ],
      synonyms: ['tacksam', 'erkänsam', 'varm'],
      relatedFeelings: ['tacksam', 'hoppfull', 'glad', 'nöjd'],
    },
    inspired: {
      word: 'inspirerad',
      definition:
        'Du känner lust och energi att skapa eller åstadkomma något. Tankarna sätts i rörelse.',
      examples: [
        'Jag känner mig inspirerad av hennes beslutsamhet och glöd.',
        'Föredraget inspirerade honom att tänka på ett nytt sätt.',
        'Hon kände sig inspirerad efter att ha läst boken.',
      ],
      synonyms: ['motiverad', 'energifylld', 'stimulerad', 'berörd'],
      relatedFeelings: ['hoppfull', 'uppspelt', 'entusiastisk', 'energifylld'],
    },
    hopeful: {
      word: 'hoppfull',
      definition: 'Du bär på hopp och tror att något gott kommer att hända.',
      examples: [
        'Jag känner mig hoppfull inför framtiden, trots allt som är svårt.',
        'Hon kände sig hoppfull när hon hörde talas om det nya programmet.',
        'Han var hoppfull om att saker skulle bli bättre.',
      ],
      synonyms: ['optimistisk', 'tillitsfull', 'förväntansfull'],
      relatedFeelings: ['optimistisk', 'uppspelt', 'inspirerad', 'fridfull'],
    },
    optimistic: {
      word: 'optimistisk',
      definition:
        'En tillit till framtiden. Du räknar med att det kommer att gå bra.',
      examples: [
        'Hon såg optimistiskt på saken trots svårigheterna.',
        'Han kände sig optimistisk om sina chanser att lyckas.',
        'Jag är optimistisk om att vi kan lösa det här.',
      ],
      synonyms: ['hoppfull', 'tillitsfull', 'positiv'],
      relatedFeelings: ['hoppfull', 'trygg', 'fridfull', 'glädjefylld'],
    },

    // ========== FRID ==========
    peaceful: {
      word: 'fridfull',
      definition: 'Fri från konflikt och oro. Lugn och stillhet inombords.',
      examples: [
        'Jag känner mig fridfull efter att ha mediterat.',
        'Den lugna kvällen kändes fridfull och vilsam.',
        'Hon skapade en fridfull stämning i sitt hem.',
      ],
      synonyms: ['lugn', 'rofylld', 'stilla', 'harmonisk'],
      relatedFeelings: ['lugn', 'rofylld', 'avslappnad', 'nöjd'],
    },
    calm: {
      word: 'lugn',
      definition: 'Utan oro eller stress. Samlad och i balans.',
      examples: [
        'Hon förblev lugn mitt i krisen.',
        'Jag kände mig lugn efter att vi hade pratat igenom saken.',
        'Han talade med en lugn röst som fick alla att slappna av.',
      ],
      synonyms: ['fridfull', 'samlad', 'rofylld', 'stilla'],
      relatedFeelings: ['fridfull', 'avslappnad', 'balanserad', 'trygg'],
    },
    relaxed: {
      word: 'avslappnad',
      definition: 'Fri från spänning och oro. Du känner dig bekväm och lätt.',
      examples: [
        'Jag kände mig avslappnad på semestern, långt från jobbet.',
        'Hon tog motgången på ett avslappnat sätt.',
        'Han verkade avslappnad och bekväm i gruppen.',
      ],
      synonyms: ['lugn', 'bekväm', 'avspänd', 'sorglös'],
      relatedFeelings: ['lugn', 'fridfull', 'nöjd', 'tillfreds'],
    },
    serene: {
      word: 'rofylld',
      definition: 'Lugn och fridfull. Ingenting stör eller oroar.',
      examples: [
        'Den rofyllda sjön speglade bergen.',
        'Hon såg rofylld ut trots kaoset omkring henne.',
        'Han kände sig rofylld efter att konflikten hade lösts.',
      ],
      synonyms: ['fridfull', 'lugn', 'stilla', 'samlad'],
      relatedFeelings: ['fridfull', 'lugn', 'balanserad', 'nöjd'],
    },
    satisfied: {
      word: 'nöjd',
      definition: 'Du är tillfreds med det du har eller har åstadkommit.',
      examples: [
        'Jag kände mig nöjd när projektet var klart.',
        'Hon var nöjd med kvaliteten på sitt arbete.',
        'Han verkade nöjd med lösningen.',
      ],
      synonyms: ['tillfreds', 'belåten', 'glad', 'uppfylld'],
      relatedFeelings: ['tillfreds', 'fridfull', 'tacksam', 'glad'],
    },
    content: {
      word: 'tillfreds',
      definition: 'Nöjd och i frid. Du trivs med hur du har det.',
      examples: [
        'Jag kände mig tillfreds när jag satt hemma och läste i lugn och ro.',
        'Hon kände sig tillfreds med det enkla livet.',
        'Han verkade tillfreds med hur långt de hade kommit.',
      ],
      synonyms: ['nöjd', 'fridfull', 'bekväm', 'uppfylld'],
      relatedFeelings: ['nöjd', 'fridfull', 'tacksam', 'trygg'],
    },

    // ========== FÖRVÄNTAN ==========
    excited: {
      word: 'uppspelt',
      definition:
        'Full av iver och förväntan. Det bubblar av energi inombords.',
      examples: [
        'Jag kände mig uppspelt inför att börja på det nya jobbet.',
        'Hon blev uppspelt när hon fick de goda nyheterna.',
        'Han lät uppspelt när han berättade om projektet.',
      ],
      synonyms: ['entusiastisk', 'ivrig', 'energifylld', 'exalterad'],
      relatedFeelings: ['entusiastisk', 'energifylld', 'ivrig', 'inspirerad'],
    },
    enthusiastic: {
      word: 'entusiastisk',
      definition:
        'Ett starkt och ivrigt intresse för något. Du brinner för det.',
      examples: [
        'Hon var entusiastisk inför den nya satsningen.',
        'Han pratade entusiastiskt om möjligheten.',
        'De deltog entusiastiskt i diskussionen.',
      ],
      synonyms: ['ivrig', 'uppspelt', 'passionerad', 'engagerad'],
      relatedFeelings: ['uppspelt', 'passionerad', 'energifylld', 'hoppfull'],
    },
    eager: {
      word: 'ivrig',
      definition: 'En stark lust eller nyfikenhet. Du vill gärna sätta igång.',
      examples: [
        'Jag var ivrig att lära mig mer om ämnet.',
        'Hon verkade ivrig att anta utmaningen.',
        'Han var ivrig att dela med sig av sina idéer.',
      ],
      synonyms: ['angelägen', 'entusiastisk', 'uppspelt', 'sugen'],
      relatedFeelings: ['uppspelt', 'entusiastisk', 'hoppfull', 'inspirerad'],
    },
    energized: {
      word: 'energifylld',
      definition: 'Full av energi och lust. Du känner dig pigg och stark.',
      examples: [
        'Jag kände mig energifylld efter träningen.',
        'Hon blev energifylld av den uppmuntrande återkopplingen.',
        'Han kände sig energifylld av gruppens entusiasm.',
      ],
      synonyms: ['pigg', 'stimulerad', 'vital', 'laddad'],
      relatedFeelings: ['uppspelt', 'entusiastisk', 'inspirerad', 'hoppfull'],
    },

    // ========== ILSKA ==========
    angry: {
      word: 'arg',
      definition:
        'En stark känsla av ilska och motstånd. Det kan koka inombords.',
      examples: [
        'Jag blev arg när mina gränser inte respekterades.',
        'Hon var arg över att ha blivit orättvist behandlad.',
        'Han lät arg när han pratade om situationen.',
      ],
      synonyms: ['rasande', 'ilsken', 'uppretad', 'vred'],
      relatedFeelings: ['frustrerad', 'bitter', 'irriterad', 'upprörd'],
    },
    frustrated: {
      word: 'frustrerad',
      definition:
        'Irritation över att inte kunna påverka eller ändra något. Det tar stopp.',
      examples: [
        'Jag kände mig frustrerad när projektet körde fast.',
        'Hon var frustrerad över att ingenting gick framåt.',
        'Han kände sig frustrerad när han inte fick fram sina idéer.',
      ],
      synonyms: ['förargad', 'irriterad', 'otålig', 'besvärad'],
      relatedFeelings: ['arg', 'irriterad', 'modfälld', 'förargad'],
    },
    irritated: {
      word: 'irriterad',
      definition: 'Lätt arg eller otålig över något som skaver.',
      examples: [
        'Jag kände mig irriterad av de ständiga avbrotten.',
        'Hon verkade irriterad på oljudet.',
        'Han var irriterad över den långsamma servicen.',
      ],
      synonyms: ['förargad', 'stött', 'otålig', 'besvärad'],
      relatedFeelings: ['frustrerad', 'förargad', 'otålig', 'besvärad'],
    },
    resentful: {
      word: 'bitter',
      definition:
        'En kvardröjande känsla av orättvisa. Ilskan har satt sig och blivit kvar.',
      examples: [
        'Jag kände mig bitter över att inte ha blivit inbjuden till mötet.',
        'Hon var bitter över allt extraarbete hon hade fått.',
        'Han kände sig bitter över det orättvisa beslutet.',
      ],
      synonyms: ['förbittrad', 'harmsen', 'indignerad', 'kränkt'],
      relatedFeelings: ['arg', 'frustrerad', 'sårad', 'besviken'],
    },
    annoyed: {
      word: 'förargad',
      definition: 'Lite arg eller irriterad. Något stör dig.',
      examples: [
        'Jag blev förargad av allt sms:ande.',
        'Hon kände sig förargad när planerna ändrades.',
        'Han verkade förargad över frågorna.',
      ],
      synonyms: ['irriterad', 'besvärad', 'missnöjd', 'sur'],
      relatedFeelings: ['frustrerad', 'irriterad', 'besvärad', 'missnöjd'],
    },
    upset: {
      word: 'upprörd',
      definition:
        'Känslomässigt omskakad eller olycklig. Det rör om inombords.',
      examples: [
        'Jag blev upprörd över de sårande kommentarerna.',
        'Hon blev upprörd när hennes förtroende sveks.',
        'Han verkade upprörd över att det blev inställt.',
      ],
      synonyms: ['skakad', 'olycklig', 'besvärad', 'uppriven'],
      relatedFeelings: ['arg', 'sårad', 'ledsen', 'ängslig'],
    },

    // ========== SORG ==========
    sad: {
      word: 'ledsen',
      definition:
        'En känsla av sorg eller olycka, ofta över en förlust eller en besvikelse.',
      examples: [
        'Jag blev ledsen när min vän flyttade.',
        'Hon blev ledsen av slutet på berättelsen.',
        'Han verkade ledsen när han tänkte tillbaka på förlusten.',
      ],
      synonyms: ['sorgsen', 'olycklig', 'nedstämd', 'dyster'],
      relatedFeelings: ['besviken', 'ensam', 'förkrossad', 'nere'],
    },
    disappointed: {
      word: 'besviken',
      definition:
        'Ledsen eller missnöjd för att något inte blev som du hade hoppats.',
      examples: [
        'Jag blev besviken när evenemanget ställdes in.',
        'Hon var besviken på provresultatet.',
        'Han verkade besviken över svaret.',
      ],
      synonyms: ['snopen', 'nedslagen', 'modfälld', 'missnöjd'],
      relatedFeelings: ['ledsen', 'modfälld', 'sårad', 'frustrerad'],
    },
    lonely: {
      word: 'ensam',
      definition: 'En sorg över att sakna gemenskap och kontakt med andra.',
      examples: [
        'Jag kände mig ensam under den långa resan hemifrån.',
        'Hon kände sig ensam efter att hennes vänner hade flyttat.',
        'Han verkade ensam fast han var omgiven av folk.',
      ],
      synonyms: ['isolerad', 'övergiven', 'utanför', 'vilsen'],
      relatedFeelings: ['ledsen', 'vilsen', 'sorgsen', 'längtande'],
    },
    discouraged: {
      word: 'modfälld',
      definition:
        'Du har tappat modet och tron på att det ska gå. Hoppet har sjunkit.',
      examples: [
        'Jag kände mig modfälld efter flera misslyckanden i rad.',
        'Hon var modfälld över att ingenting gick framåt.',
        'Han verkade modfälld inför framtiden.',
      ],
      synonyms: ['nedslagen', 'missmodig', 'uppgiven', 'håglös'],
      relatedFeelings: ['ledsen', 'besviken', 'hjälplös', 'osäker'],
    },
    heartbroken: {
      word: 'förkrossad',
      definition:
        'Fylld av djup sorg, till exempel efter en separation eller en stor besvikelse.',
      examples: [
        'Jag kände mig förkrossad när relationen tog slut.',
        'Hon var förkrossad över att ha förlorat sin närmaste vän.',
        'Han verkade förkrossad över det som hade hänt.',
      ],
      synonyms: ['nedbruten', 'krossad', 'tillintetgjord', 'sorgtyngd'],
      relatedFeelings: ['ledsen', 'sörjande', 'sårad', 'nedbruten'],
    },

    // ========== RÄDSLA ==========
    scared: {
      word: 'rädd',
      definition: 'En känsla av fruktan eller oro inför något.',
      examples: [
        'Jag blev rädd när jag hörde den höga smällen.',
        'Hon var rädd för den okända framtiden.',
        'Han verkade rädd inför ingreppet.',
      ],
      synonyms: ['skrämd', 'skraj', 'skräckslagen', 'panikslagen'],
      relatedFeelings: ['ängslig', 'orolig', 'skräckslagen', 'olustig'],
    },
    anxious: {
      word: 'ängslig',
      definition: 'Oro eller nervös spänning inför något osäkert.',
      examples: [
        'Jag kände mig ängslig före presentationen.',
        'Hon var ängslig inför vad mötet skulle leda till.',
        'Han verkade ängslig när de pratade om ekonomin.',
      ],
      synonyms: ['orolig', 'nervös', 'bekymrad', 'olustig'],
      relatedFeelings: ['rädd', 'orolig', 'nervös', 'osäker'],
    },
    worried: {
      word: 'orolig',
      definition: 'Bekymrad eller olustig inför det som kan hända.',
      examples: [
        'Jag kände mig orolig för hennes hälsa.',
        'Hon var orolig att planen inte skulle fungera.',
        'Han verkade orolig för att inte hinna klart i tid.',
      ],
      synonyms: ['ängslig', 'bekymrad', 'nervös', 'olustig'],
      relatedFeelings: ['ängslig', 'rädd', 'osäker', 'sårbar'],
    },
    nervous: {
      word: 'nervös',
      definition: 'Spänd och orolig inför något som ska hända.',
      examples: [
        'Jag känner mig nervös inför att tala inför publik.',
        'Hon var nervös inför den kommande tentan.',
        'Han verkade nervös när han träffade hennes föräldrar.',
      ],
      synonyms: ['ängslig', 'darrig', 'spänd', 'på helspänn'],
      relatedFeelings: ['ängslig', 'orolig', 'osäker', 'sårbar'],
    },
    terrified: {
      word: 'skräckslagen',
      definition: 'Väldigt rädd. En intensiv skräck.',
      examples: [
        'Jag var skräckslagen under jordbävningen.',
        'Hon var skräckslagen inför tanken på att förlora jobbet.',
        'Han verkade skräckslagen av hotet.',
      ],
      synonyms: ['vettskrämd', 'förstenad', 'panikslagen', 'livrädd'],
      relatedFeelings: ['rädd', 'panikslagen', 'hjälplös', 'överväldigad'],
    },

    // ========== FÖRVIRRING ==========
    confused: {
      word: 'förvirrad',
      definition:
        'Svårt att förstå eller tänka klart. Du vet inte riktigt var du står.',
      examples: [
        'Jag kände mig förvirrad av de motstridiga instruktionerna.',
        'Hon var förvirrad över vilket håll hon skulle gå åt.',
        'Han verkade förvirrad av förklaringen.',
      ],
      synonyms: ['villrådig', 'desorienterad', 'konfunderad', 'brydd'],
      relatedFeelings: ['osäker', 'vilsen', 'överväldigad', 'frustrerad'],
    },
    uncertain: {
      word: 'osäker',
      definition:
        'Du kan inte bestämma dig eller vara säker på något. Tvivel tar plats.',
      examples: [
        'Jag kände mig osäker på vad som var rätt val.',
        'Hon var osäker på hur hon skulle gå vidare.',
        'Han verkade osäker på sitt beslut.',
      ],
      synonyms: ['tveksam', 'tvivlande', 'velig', 'obeslutsam'],
      relatedFeelings: ['förvirrad', 'ängslig', 'sårbar', 'otrygg'],
    },
    overwhelmed: {
      word: 'överväldigad',
      definition: 'Det är för mycket att hantera eller ta in på en gång.',
      examples: [
        'Jag kände mig överväldigad av alla uppgifter.',
        'Hon blev överväldigad av känslorna.',
        'Han verkade överväldigad av alla deadlines på jobbet.',
      ],
      synonyms: ['överbelastad', 'översköljd', 'dränkt', 'uppslukad'],
      relatedFeelings: ['stressad', 'ängslig', 'hjälplös', 'utmattad'],
    },
  },

  quiz: {
    // ========== NIVÅ 1 ==========
    "I feel like you don't respect me.": {
      sentence: 'Det känns som att du inte respekterar mig.',
      explanation:
        'Det här är inte en känsla. ”Du respekterar inte mig” är en tanke om hur den andra personen ser på dig. Känslan under kan vara sårad, ledsen eller ensam.',
      correctFeelings: ['sårad', 'ledsen', 'ensam'],
    },
    'I feel that this is unfair.': {
      sentence: 'Jag känner att det här är orättvist.',
      explanation:
        '”Det här är orättvist” är en bedömning, inte en känsla. Under den kanske du känner dig frustrerad, sårad eller arg.',
      correctFeelings: ['frustrerad', 'sårad', 'arg'],
    },
    "I feel that you're being disrespectful.": {
      sentence: 'Jag känner att du är respektlös.',
      explanation:
        'Här beskrivs den andra personens beteende, inte din känsla. Fråga dig vad som händer i dig: kanske är du irriterad, sårad eller ledsen.',
      correctFeelings: ['irriterad', 'sårad', 'ledsen'],
    },
    'I feel abandoned by you.': {
      sentence: 'Jag känner mig övergiven av dig.',
      explanation:
        'Det låter som en känsla, men ”övergiven” beskriver hur du tolkar det den andra har gjort. Känslan inuti kan vara ensam, sårad eller ledsen.',
      correctFeelings: ['ensam', 'sårad', 'ledsen'],
    },
    "I feel like you don't care about me.": {
      sentence: 'Det känns som att du inte bryr dig om mig.',
      explanation:
        'Det här är en gissning om vad den andra känner eller tänker, inte din egen känsla. Kanske känner du dig sårad, ensam eller ledsen.',
      correctFeelings: ['sårad', 'ensam', 'ledsen'],
    },
    'I feel worried about the deadline.': {
      sentence: 'Jag känner mig orolig inför deadlinen.',
      explanation:
        '”Orolig” är en äkta känsla. Den beskriver hur du har det inför en situation, utan att skylla på eller döma någon.',
    },
    'I feel frustrated when you interrupt me.': {
      sentence: 'Jag känner mig frustrerad när du avbryter mig.',
      explanation:
        '”Frustrerad” är en äkta känsla. Meningen nämner vad den andra gör, men fokus ligger på det du själv upplever.',
    },
    'I feel hurt by what you said.': {
      sentence: 'Jag blev sårad av det du sa.',
      explanation:
        '”Sårad” är en äkta känsla som sätter ord på det du upplever, även om det var den andras ord som väckte den.',
    },
    'I feel angry when people are late.': {
      sentence: 'Jag blir arg när folk kommer för sent.',
      explanation:
        '”Arg” är en äkta känsla. Den beskriver hur du reagerar på förseningar, utan att döma personen.',
    },
    'I feel that you never listen to me.': {
      sentence: 'Jag känner att du aldrig lyssnar på mig.',
      explanation:
        '”Du lyssnar aldrig på mig” är en generalisering och en bedömning, inte en känsla. Kanske känner du dig frustrerad, ensam eller ledsen.',
      correctFeelings: ['frustrerad', 'ensam', 'ledsen'],
    },

    // ========== NIVÅ 2 ==========
    "I feel ignored when you don't respond quickly.": {
      sentence: 'Jag känner mig ignorerad när du inte svarar direkt.',
      explanation:
        '”Ignorerad” är egentligen en bedömning av vad den andra gör. Känslan under kan vara sårad, osäker eller orolig över att inte vara viktig.',
      correctFeelings: ['sårad', 'osäker', 'orolig'],
    },
    'I feel rejected by the group.': {
      sentence: 'Jag känner mig avvisad av gruppen.',
      explanation:
        '”Avvisad” beskriver hur du tolkar att andra behandlar dig. Känslan inuti kan vara sårad, ensam eller ledsen.',
      correctFeelings: ['sårad', 'ensam', 'ledsen'],
    },
    'I feel manipulated by your behavior.': {
      sentence: 'Jag känner mig manipulerad av hur du beter dig.',
      explanation:
        '”Manipulerad” är en bedömning av den andras avsikter. Känslan kan vara orolig, misstänksam eller spänd.',
      correctFeelings: ['orolig', 'misstänksam', 'spänd'],
    },
    'I feel unappreciated at work.': {
      sentence: 'Jag känner mig ouppskattad på jobbet.',
      explanation:
        '”Ouppskattad” är en bedömning av hur andra behandlar dig. Kanske känner du dig frustrerad, modfälld eller ledsen.',
      correctFeelings: ['frustrerad', 'modfälld', 'ledsen'],
    },
    'I feel excluded from the conversation.': {
      sentence: 'Jag känner mig utestängd från samtalet.',
      explanation:
        '”Utestängd” beskriver situationen, inte känslan. Under den kan du känna dig sårad, ensam eller ledsen.',
      correctFeelings: ['sårad', 'ensam', 'ledsen'],
    },
    'I feel sad when remembering that day.': {
      sentence: 'Jag blir ledsen när jag tänker på den dagen.',
      explanation:
        '”Ledsen” är en äkta grundkänsla som träffande beskriver hur du har det när du minns.',
    },
    'I feel anxious about speaking up in meetings.': {
      sentence: 'Jag känner mig ängslig inför att ta ordet på möten.',
      explanation:
        '”Ängslig” är en äkta känsla som beskriver vad du upplever i just den situationen.',
    },
    'I feel grateful for your help.': {
      sentence: 'Jag känner mig tacksam för din hjälp.',
      explanation:
        '”Tacksam” är en äkta och varm känsla som uttrycker uppskattning utan att döma.',
    },
    'I feel unsupported by my team.': {
      sentence: 'Jag känner mig inte stöttad av mina kollegor.',
      explanation:
        '”Inte stöttad” är en bedömning av hur kollegorna behandlar dig. Känslan under kan vara ensam, modfälld eller ledsen.',
      correctFeelings: ['ensam', 'modfälld', 'ledsen'],
    },
    'I feel criticized when people give feedback.': {
      sentence: 'Jag känner mig kritiserad när någon ger mig feedback.',
      explanation:
        '”Kritiserad” är en tolkning av avsikten bakom återkopplingen. Kanske känner du dig sårad, orolig eller osäker.',
      correctFeelings: ['sårad', 'orolig', 'osäker'],
    },

    // ========== NIVÅ 3 ==========
    'I feel misunderstood by everyone.': {
      sentence: 'Jag känner mig missförstådd av alla.',
      explanation:
        '”Missförstådd” är en bedömning av hur andra uppfattar dig. Känslan under kan vara frustrerad, ensam eller förtvivlad, med en stor längtan efter att bli hörd.',
      correctFeelings: ['frustrerad', 'ensam', 'förtvivlad'],
    },
    'I feel vulnerable when sharing my thoughts.': {
      sentence: 'Jag känner mig sårbar när jag delar mina tankar.',
      explanation:
        '”Sårbar” är en äkta grundkänsla. Den beskriver hur blottad du kan känna dig, och hur mycket mod det krävs för att dela.',
    },
    'I feel betrayed by your actions.': {
      sentence: 'Jag känner mig sviken av det du har gjort.',
      explanation:
        '”Sviken” bygger på en tolkning av den andras avsikter. Känslan under kan vara sårad, arg eller misstänksam.',
      correctFeelings: ['sårad', 'arg', 'misstänksam'],
    },
    'I feel powerless in this situation.': {
      sentence: 'Jag känner mig maktlös i den här situationen.',
      explanation:
        '”Maktlös” är en bedömning av vad du förmår. Känslan under kan vara uppgiven, frustrerad eller rädd.',
      correctFeelings: ['uppgiven', 'frustrerad', 'rädd'],
    },
    'I feel invisible when you ignore me.': {
      sentence: 'Jag känner mig osynlig när du inte ser mig.',
      explanation:
        '”Osynlig” är en bild av hur du upplever att andra behandlar dig. Känslan bakom bilden kan vara sårad, ensam eller ledsen.',
      correctFeelings: ['sårad', 'ensam', 'ledsen'],
    },
    "I feel alive when I'm creating something new.": {
      sentence: 'Jag känner mig levande när jag skapar något nytt.',
      explanation:
        '”Levande” är en äkta känsla som beskriver livskraft och engagemang.',
    },
    'I feel peaceful after our conversation.': {
      sentence: 'Jag känner mig fridfull efter vårt samtal.',
      explanation:
        '”Fridfull” är en äkta känsla som beskriver ett lugnt och stilla inre tillstånd.',
    },
    'I feel disconnected from the group.': {
      sentence: 'Det känns som att jag inte hör hemma i gruppen.',
      explanation:
        '”Jag hör inte hemma här” är en tolkning av din plats i gruppen, inte en känsla. Känslan under kan vara ensam, ledsen eller osäker.',
      correctFeelings: ['ensam', 'ledsen', 'osäker'],
    },
    'I feel inspired by her courage.': {
      sentence: 'Jag känner mig inspirerad av hennes mod.',
      explanation:
        '”Inspirerad” är en äkta känsla. Den beskriver lusten och energin som väcks när du ser någon annan våga.',
    },
    'I feel trapped by my responsibilities.': {
      sentence: 'Jag känner mig fast i alla mina åtaganden.',
      explanation:
        '”Fast” är en bedömning av din situation. Känslan under kan vara överväldigad, orolig eller bitter.',
      correctFeelings: ['överväldigad', 'orolig', 'bitter'],
    },
  },
}
