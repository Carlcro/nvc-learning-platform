import type { LessonTranslationTable } from '../lib/contentText'

export const lessonsSv: LessonTranslationTable = {
  introduction: {
    title: 'Introduktion till nonviolent communication',
    description:
      'Vad NVC är, var det kommer ifrån och de fyra delar du kan ta med dig in i ett svårt ögonblick.',
    content:
      'Nonviolent communication (NVC), ibland kallat giraffspråk, är ett sätt att tala och lyssna som psykologen Marshall Rosenberg utvecklade. Grundtanken är att bakom varje handling, även de som gör ont, finns en människa som försöker tillgodose ett behov. När du säger vad du såg, vad du kände, vad du behöver och vad som skulle hjälpa, får den andra personen mycket mindre att försvara sig mot.',
    examples: [
      {
        title: 'Från skuld till förståelse',
        scenario:
          'Din vän glömde din födelsedag. Vanligtvis kanske du skulle bli arg. Med NVC kan du i stället uttrycka dina känslor och behov.',
        giraffResponse:
          'När du glömde min födelsedag blev jag ledsen, eftersom firande och gemenskap är viktiga för mig. Skulle du vilja uppmärksamma dagen tillsammans med mig någon gång den här veckan?',
        jackalResponse: 'Du är så tanklös. Du glömmer alltid viktiga saker om mig.',
        explanation:
          'Giraffsvaret uttrycker känslan (ledsen) och behovet (gemenskap) utan att skuldbelägga. Vargsvaret bygger på omdömen och generaliseringar.',
      },
    ],
    questions: [
      {
        question: 'Vad står giraffen för inom NVC?',
        options: [
          'Snabba omdömen från ovan',
          'Empati och medkännande kommunikation',
          'Abstrakt tänkande',
          'Kommunikation som går till angrepp',
        ],
        explanation:
          'Inom NVC står giraffen för empati och medkännande kommunikation, eftersom den har ett stort hjärta och en lång hals som låter den se saker från olika håll. Vargen står för reaktiv och försvarsinriktad kommunikation.',
      },
      {
        question: 'Vilket av följande är ett exempel på giraffspråk?',
        options: [
          'Du är så oansvarig och tanklös.',
          'När du kom sent blev jag orolig, eftersom punktlighet hjälper mig att känna mig respekterad.',
          'Du gör alltid samma misstag.',
          'Du borde veta bättre än så.',
        ],
        explanation:
          'Det här svaret följer NVC genom att ta med en observation (kom sent), en känsla (orolig) och ett behov (respekt), alltså kärnan i medkännande kommunikation.',
      },
      {
        question: 'Vad är det främsta målet med nonviolent communication?',
        options: [
          'Att vinna diskussioner och få som du vill',
          'Att få andra att känna skuld för det de har gjort',
          'Att uttrycka dina behov och skapa ömsesidig förståelse och medkänsla',
          'Att undvika alla konflikter till varje pris',
        ],
        explanation:
          'NVC syftar till ömsesidig förståelse och medkänsla: du uttrycker dina behov ärligt och är samtidigt öppen för den andra personens behov.',
      },
      {
        question: 'Vilket av dessa hör INTE till de fyra delarna i NVC?',
        options: ['Observation', 'Omdöme', 'Känsla', 'Önskemål'],
        explanation:
          'De fyra delarna i NVC är observation, känsla, behov och önskemål. Omdömen är just det NVC lägger åt sidan, och därför hålls observationerna fria från dem.',
      },
      {
        question: 'Vilket av dessa är vargspråk?',
        options: [
          'Jag blev orolig när jag inte hörde något från dig.',
          'Skulle du vilja ringa mig i morgon?',
          'Du tänker aldrig på någon annan än dig själv.',
          'Vila är verkligen viktigt för mig just nu.',
        ],
        explanation:
          '”Du tänker aldrig på någon annan än dig själv” är ett omdöme inlindat i en generalisering. De andra tre bidrar var och en med en giraffdel: en känsla, ett önskemål och ett behov.',
      },
    ],
  },
  observation: {
    title: 'Observationer utan värderingar',
    description:
      'Beskriv det som hände så som en kamera skulle se det, så att den andra kan lyssna utan att gå i försvar.',
    content:
      'En observation beskriver vad som hände utan att lägga till en dom över det. ”Du kom hem klockan elva” är en observation. ”Du är så hänsynslös” är en värdering, och värderingar får människor att diskutera om de stämmer i stället för att höra vad du behöver.',
    examples: [
      {
        title: 'Fakta eller omdöme',
        scenario: 'Din kollega lämnade in ett projekt för sent.',
        giraffResponse:
          'Du lämnade in projektet klockan 17, och deadline var klockan 15.',
        jackalResponse: 'Du är alltid sen och oansvarig.',
        explanation:
          'Giraffsvaret beskriver det som går att iaktta. Vargsvaret lägger till ett omdöme (alltid sen, oansvarig) i stället för att beskriva vad som faktiskt hände.',
      },
      {
        title: 'Var konkret',
        scenario: 'Någon svarade inte direkt på ditt sms.',
        giraffResponse:
          'Jag skickade ett sms till dig vid lunch och fick inget svar förrän på kvällen.',
        jackalResponse: 'Du svarar aldrig på mina meddelanden.',
        explanation:
          'Giraffsvaret är konkret och sakligt. Vargen använder ”aldrig”, som är en generalisering.',
      },
    ],
    questions: [
      {
        question: 'Vad är den viktigaste skillnaden mellan en observation och ett omdöme?',
        options: [
          'Observationer är alltid positiva, omdömen är alltid negativa',
          'Observationer beskriver det som går att iaktta utan värdering, omdömen innehåller tolkning och värdering',
          'Observationer används om goda människor, omdömen om dåliga människor',
          'Det finns ingen skillnad mellan dem',
        ],
        explanation:
          'En observation säger vad du kan se, höra eller uppleva, utan tolkning. Ett omdöme lägger till värdering, skuld eller tolkning till det du iakttar.',
      },
      {
        question: 'Vilket av följande är en ren observation UTAN omdöme?',
        options: [
          'Du är alltid stökig och oorganiserad',
          'Du har lämnat skorna vid dörren tre gånger den här veckan',
          'Du är slarvig med dina saker',
          'Du plockar aldrig undan efter dig',
        ],
        explanation:
          'Det här är ett konkret faktum som går att iaktta, med en tidsram. De andra använder generaliseringar (”alltid”, ”aldrig”) eller omdömen (”stökig”, ”slarvig”).',
      },
      {
        question: 'Vad bör du undvika i observationer enligt NVC?',
        options: [
          'Att vara för detaljerad',
          'Att använda siffror eller mått',
          'Generaliseringar som ”alltid”, ”aldrig” och ”jämt”',
          'Att beskriva exakt vad som hände',
        ],
        explanation:
          'Generaliseringar förvränger observationen och får den att låta som ett omdöme. Rena observationer undviker ord som ”alltid”, ”aldrig”, ”jämt” och andra absoluta påståenden.',
      },
      {
        question: 'Hur bör du uttrycka en observation om någons beteende?',
        options: [
          'Utifrån vad du tycker om personens karaktär',
          'Utifrån det du själv ser, hör eller upplever, utan tolkning',
          'Utifrån tidigare mönster, för att förutsäga hur personen kommer att bete sig',
          'Utifrån vad andra har berättat för dig',
        ],
        explanation:
          'En observation ska bygga på det du själv har uppfattat med dina sinnen, alltså det du faktiskt ser eller hör, utan att du lägger till tolkningar eller omdömen om personens karaktär.',
      },
      {
        question: 'Vilket påstående följer bäst observationsdelen i NVC?',
        options: [
          'När jag ser dig himla med ögonen utgår jag från att du inte respekterar mig',
          'När du himlar med ögonen åt mig blir jag sårad, eftersom respekt är viktigt för mig',
          'Du himlar alltid med ögonen åt allt jag säger, och det är respektlöst',
          'Jag tycker att du är dömande eftersom du himlar med ögonen',
        ],
        explanation:
          'Det här håller isär observationen (du himlar med ögonen) och känslan (sårad), utan att lägga till omdömen eller tolkningar om personens karaktär eller avsikter.',
      },
    ],
  },
  feeling: {
    title: 'Att känna igen och uttrycka känslor',
    description:
      'Sätt ord på själva känslan, och lägg märke till när en tanke om den andra personen klätt ut sig till en känsla.',
    content:
      'En känsla är något du märker inom dig: ledsen, glad, ängslig, lättad. Många meningar som börjar med ”jag känner” är egentligen tankar om någon annan, som ”jag känner mig ignorerad” eller ”det känns som att du inte bryr dig”. När du sätter ord på själva känslan förblir den din, och det blir lättare för den andra att stanna kvar hos dig.',
    examples: [
      {
        title: 'Äkta känslor eller tankar förklädda till känslor',
        scenario: 'Någon bjöd inte in dig till en tillställning.',
        giraffResponse: 'Jag känner mig ledsen och utanför.',
        jackalResponse: 'Det känns som att du inte bryr dig om mig.',
        explanation:
          '”Det känns som att” leder in en tanke, inte en känsla. Giraffsvaret sätter ord på verkliga känslor.',
      },
      {
        title: 'Ta ansvar för dina känslor',
        scenario: 'Någon avbröt dig.',
        giraffResponse: 'Jag blev frustrerad när jag blev avbruten.',
        jackalResponse: 'Du gjorde mig arg när du avbröt mig.',
        explanation:
          'Giraffsvaret tar ansvar för känslan. Vargen lägger skulden för känslan på den andra personen.',
      },
    ],
    questions: [
      {
        question: 'Vad är den största skillnaden mellan en känsla och en pseudokänsla?',
        options: [
          'Känslor är alltid starkare än pseudokänslor',
          'Känslor är verkliga känslor, pseudokänslor innehåller tankar eller omdömen',
          'Pseudokänslor är viktigare inom NVC',
          'Det finns ingen verklig skillnad mellan dem',
        ],
        explanation:
          'Äkta känslor är till exempel glad, ledsen, ängslig eller arg. Pseudokänslor som ”jag känner mig avvisad” eller ”jag känner mig sviken” är egentligen tankar eller tolkningar av vad andra har gjort eller tycker om dig.',
      },
      {
        question: 'Vilket av dessa är en äkta känsla (inte en pseudokänsla)?',
        options: [
          'Det känns som att du inte bryr dig om mig',
          'Jag känner mig ängslig och orolig',
          'Jag känner att du är orättvis',
          'Det känns som att ingen respekterar mig',
        ],
        explanation:
          '”Ängslig och orolig” är känslor du kan uppleva i kroppen. De andra är pseudokänslor, eftersom de innehåller omdömen om vad andra tänker eller gör (inte bryr sig, orättvis, respektlös).',
      },
      {
        question: 'Hur uttrycker du känslor enligt NVC?',
        options: [
          'Lägg skulden för dem på den andra personen',
          'Ta ansvar för dina känslor utan att skylla dem på andra',
          'Utgå från att den andra redan vet hur du känner',
          'Uttryck bara positiva känslor',
        ],
        explanation:
          'Inom NVC tar du ansvar för dina känslor genom att säga ”jag blev ledsen” i stället för ”du gjorde mig ledsen”. Det ger dig kraft och håller samtalet inriktat på förståelse i stället för skuld.',
      },
      {
        question: 'Vad är problemet med att säga ”du gör mig arg”?',
        options: [
          'Det är grammatiskt fel',
          'Ilska är ingen riktig känsla',
          'Det ger den andra personen makt över dina känslor och antyder skuld',
          'Det är för rakt på sak',
        ],
        explanation:
          'Den andra personens handlingar kan ha väckt din ilska, men de ”gjorde” dig inte arg. Dina känslor är ditt ansvar. NVC lägger vikt vid att äga sina känslor: ”jag blir arg när...” i stället för ”du gör mig arg”.',
      },
      {
        question: 'Vilket påstående uttrycker känslor mest äkta enligt NVC?',
        options: [
          'Det känns som att du aldrig lyssnar på mig',
          'Jag är sårad och besviken, eftersom kontakt är viktigt för mig',
          'Du gör mig alltid ängslig',
          'Jag känner att du inte förstår mig',
        ],
        explanation:
          'Det här svaret sätter ord på äkta känslor (sårad, besviken), tar ansvar för dem och kopplar dem till ett behov (kontakt). Det innehåller varken skuld eller omdömen om den andra personen.',
      },
    ],
  },
  need: {
    title: 'Att koppla känslor till behov',
    description:
      'Hitta det som är viktigt för dig under känslan, och håll isär det från strategin för att få det.',
    content:
      'Under varje känsla finns ett behov: något alla människor delar, som vila, respekt, gemenskap eller trygghet. Ett behov är något annat än en strategi, alltså det särskilda sätt du hoppas få behovet tillgodosett på. När du säger behovet öppnas många vägar framåt, medan envishet kring en enda strategi ofta leder till en dragkamp.',
    examples: [
      {
        title: 'Behov eller strategi',
        scenario: 'Du vill att din partner ska gå ut med soporna.',
        giraffResponse:
          'Jag behöver känna mig respekterad och att vi delar på ansvaret för vårt hem. Skulle du vilja hjälpa till med hushållssysslorna?',
        jackalResponse: 'Du måste börja hjälpa till hemma.',
        explanation:
          'Giraffsvaret visar det underliggande behovet (respekt, delat ansvar för hemmet). Vargen blandar ihop strategin (att partnern går ut med soporna) med behovet.',
      },
      {
        title: 'Universella behov',
        scenario: 'Du är upprörd för att någon kom sent.',
        giraffResponse:
          'Jag blev ängslig, eftersom pålitlighet och respekt är viktiga för mig.',
        jackalResponse: 'Du ska alltid komma i tid.',
        explanation:
          'Giraffsvaret knyter an till universella behov (pålitlighet, respekt). Vargen ställer ett krav utan att uttrycka behovet bakom.',
      },
    ],
    questions: [
      {
        question: 'Vad är skillnaden mellan ett behov och en strategi?',
        options: [
          'Behov är krav, strategier är önskemål',
          'Ett behov är något alla människor behöver, en strategi är ett särskilt sätt att tillgodose behovet',
          'Strategier är viktigare än behov',
          'Det finns ingen skillnad mellan dem',
        ],
        explanation:
          'Ett behov är något grundläggande för människors välbefinnande (trygghet, gemenskap, respekt). En strategi är en särskild handling för att tillgodose behovet. ”Gemenskap” är till exempel ett behov, ”att äta middag tillsammans” är en strategi.',
      },
      {
        question: 'Vilket av följande är ett universellt behov (inte en strategi)?',
        options: [
          'Din partner borde hjälpa till med hushållet',
          'Du borde lyssna mer på mig',
          'Självbestämmande och respekt',
          'Du måste komma i tid',
        ],
        explanation:
          '”Självbestämmande och respekt” är universella behov som gäller alla människor. De andra är särskilda strategier eller krav på ett visst beteende.',
      },
      {
        question:
          'Din vän ställer in era planer för tredje gången och du blir besviken. Vilket är behovet under känslan?',
        options: [
          'Att vännen slutar ställa in',
          'Pålitlighet och gemenskap',
          'En ursäkt',
          'Att vännen hör av sig tidigare nästa gång',
        ],
        explanation:
          'Pålitlighet och gemenskap är behov som vem som helst kan ha. De andra är strategier, alltså särskilda sätt att tillgodose de behoven, och många olika strategier kan tillgodose samma behov.',
      },
      {
        question: 'Hur hittar du bäst ditt underliggande behov?',
        options: [
          'Kräv att andra tillgodoser dina behov',
          'Titta under dina känslor för att förstå vad som är viktigt för dig',
          'Utgå från att andra vet vad du behöver',
          'Uttryck dina behov som krav',
        ],
        explanation:
          'Inom NVC hittar du dina behov genom att utforska vad som är viktigt för dig under känslorna. Fråga dig själv: ”Vad är det jag egentligen längtar efter?” eller ”Vad är viktigt för mig i den här situationen?”',
      },
      {
        question: 'Vilket påstående kopplar bäst en känsla till ett universellt behov?',
        options: [
          'Jag är ledsen för att du inte hjälper till med sysslorna',
          'Jag är sårad, eftersom respekt och delat ansvar är viktiga för mig',
          'Jag är frustrerad för att du måste ändra dig',
          'Jag är arg för att du aldrig lyssnar',
        ],
        explanation:
          'Det här svaret sätter ord på känslan (sårad), kopplar den till universella behov (respekt, delat ansvar) och undviker skuld. Det visar vad som verkligen är viktigt i stället för att fastna i ett visst beteende.',
      },
    ],
  },
  request: {
    title: 'Att uttrycka tydliga önskemål',
    description:
      'Be om en konkret sak som går att göra, på ett sätt som låter den andra vara fri att säga nej.',
    content:
      'Ett önskemål ber om en konkret handling som någon kan utföra, formulerad som det du vill i stället för det du inte vill. Det låter den andra personen vara fri att säga nej. Om ett nej möts av skuld eller press var det ett krav från början, och den skillnaden brukar människor känna.',
    examples: [
      {
        title: 'Önskemål eller krav',
        scenario: 'Du vill att din vän ska lyssna på det du har på hjärtat.',
        giraffResponse: 'Skulle du vilja lyssna medan jag berättar vad jag går och tänker på?',
        jackalResponse: 'Du borde bry dig om mina problem.',
        explanation:
          'Giraffsvaret är ett tydligt, konkret önskemål som går att tacka nej till. Vargsvaret är ett krav förklätt till en förväntan.',
      },
      {
        title: 'Positivt språk',
        scenario: 'Du vill att någon ska sluta avbryta dig.',
        giraffResponse: 'Skulle du vilja vänta tills jag har pratat färdigt?',
        jackalResponse: 'Sluta avbryta mig.',
        explanation:
          'Giraffsvaret ber om en positiv handling. Vargen använder negativt språk (vad som inte ska göras).',
      },
    ],
    questions: [
      {
        question: 'Vad kännetecknar ett önskemål inom NVC?',
        options: [
          'Det är ett krav som andra måste följa',
          'Det ber om en konkret handling, och den andra personen kan säga nej',
          'Det utgår från att andra vet vad du vill',
          'Det handlar om vad den andra personen inte ska göra',
        ],
        explanation:
          'Inom NVC är ett önskemål något annat än ett krav. Ett önskemål ber om en konkret handling som går att utföra OCH lämnar utrymme för den andra att tacka nej utan att mötas av omdömen eller straff.',
      },
      {
        question: 'Vilket av följande är ett tydligt önskemål som går att göra något med?',
        options: [
          'Du borde sluta komma för sent',
          'Jag behöver att du bryr dig mer om vår relation',
          'Skulle du vilja ringa mig när du är sen?',
          'Du måste lyssna bättre',
        ],
        explanation:
          'Det här önskemålet är specifikt (ring när du är sen), konkret (personen vet exakt vad som ska göras) och går att tacka nej till. De andra är vaga krav eller omdömen.',
      },
      {
        question: 'Varför är positivt språk viktigt när du uttrycker önskemål?',
        options: [
          'För att människor måste lyda positiva önskemål',
          'För att det beskriver vad du vill i stället för vad du inte vill',
          'För att det låter trevligare',
          'För att det inte kräver någon eftertanke',
        ],
        explanation:
          'Positiva önskemål säger vad någon SKA göra i stället för vad de INTE ska göra. ”Kan du prata lite tystare?” är tydligare än ”Sluta vara så högljudd”. Positivt språk hjälper den andra att förstå vilken handling du ber om.',
      },
      {
        question: 'Vad gör du om någon tackar nej till ditt önskemål?',
        options: [
          'Straffar personen eller drar tillbaka din värme',
          'Lyssnar på personens behov och letar efter andra strategier för att tillgodose dina',
          'Upprepar samma önskemål om och om igen',
          'Drar slutsatsen att personen inte bryr sig om dig',
        ],
        explanation:
          'Inom NVC är ett nej en möjlighet till dialog. Du lyssnar på den andras behov och begränsningar och utforskar sedan tillsammans andra sätt att tillgodose dina behov.',
      },
      {
        question: 'Vilket påstående är det bästa exemplet på ett önskemål enligt NVC?',
        options: [
          'Du måste ta mer ansvar',
          'Sluta vara så stökig',
          'Skulle du vilja lägga smutskläderna i tvättkorgen när du byter om?',
          'Du är alltid så tanklös',
        ],
        explanation:
          'Det här önskemålet är konkret (lägg smutskläderna i tvättkorgen), tydligt om handlingen, frågar ”skulle du vilja” (vilket lämnar utrymme för ett nej) och innehåller varken skuld eller omdömen.',
      },
    ],
  },
  integration: {
    title: 'Att sätta ihop allt',
    description:
      'Sätt ihop de fyra delarna till ett budskap och se hur det förändrar en verklig konflikt.',
    content:
      'Tillsammans blir de fyra delarna ett budskap: när jag såg det här kände jag så här, eftersom jag behöver det här. Skulle du vilja göra det här? I verkliga samtal kommer de sällan i ett andetag, och det behöver de inte heller. När du känner till hela formen blir det lättare att märka vilken del som fortfarande saknas.',
    examples: [
      {
        title: 'Ett komplett NVC-budskap',
        scenario: 'Din partner hjälper inte till med hushållssysslorna.',
        giraffResponse:
          'När jag ser disken stå och växa i diskhon känner jag mig överväldigad och bitter, eftersom jag behöver samarbete och delat ansvar. Skulle du vilja hjälpa till med disken efter middagen?',
        jackalResponse:
          'Du hjälper aldrig till. Du är så lat och tanklös. Du borde börja göra din del av sysslorna.',
        explanation:
          'Giraffsvaret innehåller en observation (disken i diskhon), en känsla (överväldigad), ett behov (samarbete) och ett önskemål (hjälp med disken). Vargen använder omdömen, skuld och krav.',
      },
      {
        title: 'Empati i en konflikt',
        scenario: 'Någon gick i försvar när du gav återkoppling.',
        giraffResponse:
          'Jag anar att du kanske är sårad eller känner att du behöver försvara dig. Vår relation betyder mycket för mig, och jag vill prata på ett sätt som hjälper dig att känna dig förstådd. Skulle du vara öppen för att prata om det här?',
        jackalResponse: 'Varför är du så känslig? Det är ingen stor grej.',
        explanation:
          'Giraffsvaret visar empati och nyfikenhet på den andra personens känslor. Vargen avfärdar och förminskar.',
      },
    ],
    questions: [
      {
        question:
          'Vilket svar innehåller alla fyra delarna i NVC (observation, känsla, behov, önskemål)?',
        options: [
          'Du lyssnar aldrig på mig och du bryr dig inte om hur jag känner.',
          'När du avbryter mig blir jag frustrerad, eftersom det är viktigt för mig att bli hörd. Skulle du vilja låta mig prata färdigt?',
          'Det känns som att du inte respekterar mig. Du måste ändra dig.',
          'Du är hänsynslös och oförskämd.',
        ],
        explanation:
          'Det här svaret innehåller en observation (du avbryter mig), en känsla (frustrerad), ett behov (att bli hörd) och ett önskemål (låt mig prata färdigt). Alla fyra delarna finns med.',
      },
      {
        question: 'Vad kommer EFTER behovet i ett komplett NVC-budskap?',
        options: [
          'Att skuldbelägga den andra personen',
          'Att upprepa observationen',
          'Ett tydligt önskemål',
          'Att döma personens karaktär',
        ],
        explanation:
          'Ett komplett NVC-budskap går från observation till känsla, sedan till behov och sist till önskemål. Önskemålet kommer sist och ber om en konkret handling.',
      },
      {
        question: 'Vad är syftet med att avsluta ett komplett NVC-budskap med ett önskemål?',
        options: [
          'Att kräva att den andra personen lyder dig',
          'Att be om en särskild handling som kan tillgodose ditt behov, med respekt för den andras frihet att säga nej',
          'Att få den andra personen att känna skuld',
          'Att bevisa att du har rätt',
        ],
        explanation:
          'Ett önskemål inom NVC föreslår en konkret handling som kan hjälpa till att tillgodose ditt behov, samtidigt som den andra är fri att tacka nej. Det bygger på samarbete, inte tvång.',
      },
      {
        question:
          'Hur skulle du översätta det här vargpåståendet till ett komplett NVC-budskap? ”Du är alltid sen och oansvarig.”',
        options: [
          'Du är en dålig människa som alltid kommer sent.',
          'När du kommer en kvart efter den tid vi bestämt blir jag ängslig, eftersom pålitlighet och respekt är viktiga för mig. Skulle du vilja ringa om du blir sen?',
          'Sluta vara så oansvarig.',
          'Du respekterar aldrig min tid.',
        ],
        explanation:
          'Det här svaret innehåller en konkret observation (en kvart efter bestämd tid), en känsla (ängslig), universella behov (pålitlighet, respekt) och ett konkret önskemål (ring om du blir sen).',
      },
      {
        question:
          'Vad skiljer ett komplett NVC-budskap från att bara uttrycka ilska eller frustration?',
        options: [
          'Det är längre och mer komplicerat',
          'Det uttrycker alla fyra delarna och fokuserar på förståelse i stället för skuld',
          'Det får den andra personen att må sämre',
          'Det är mer kraftfullt och krävande',
        ],
        explanation:
          'Ett komplett NVC-budskap går bortom skuld mot ömsesidig förståelse genom att tydligt sätta ord på observationer, känslor, behov och önskemål. Det öppnar för dialog i stället för att stänga den.',
      },
      {
        question: 'Vilket av följande är ett komplett och medkännande NVC-budskap?',
        options: [
          'Du är självisk och tänker aldrig på någon annan än dig själv.',
          'När du inte hör av dig på flera dagar blir jag sårad och känner mig ensam, eftersom vänskap och närhet är viktiga för mig. Skulle du vilja höra av dig oftare?',
          'Du måste bry dig mer om vår vänskap.',
          'Du är en usel vän.',
        ],
        explanation:
          'Det här budskapet innehåller alla delarna: en observation (ingen kontakt på flera dagar), känslor (sårad, ensam), behov (vänskap, närhet) och ett önskemål (hör av dig oftare). Det bjuder in till dialog och förståelse.',
      },
    ],
  },
}
