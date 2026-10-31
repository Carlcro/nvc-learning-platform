import type { FeelingsTranslation } from '../lib/contentText'

/**
 * The feelings library and the pseudo-feelings quiz in French. Feeling words
 * are shown in their dictionary form. Examples about the reader avoid forms
 * that would have to agree with their gender.
 */
export const feelingsFr: FeelingsTranslation = {
  feelings: {
    // Joyful
    joyful: {
      word: 'joyeux',
      definition:
        'Un sentiment de grand bonheur et de plaisir. Une envie de célébrer.',
      examples: [
        "Je ressens une grande joie quand j'atteins un objectif difficile.",
        "Cette nouvelle me remplit de joie et d'élan pour la suite.",
        'Elle était joyeuse le jour de la remise de diplôme de son enfant.',
      ],
      synonyms: ['heureux', 'ravi', 'radieux', 'enjoué'],
      relatedFeelings: ['enjoué', 'ravi', 'content', 'heureux'],
    },
    cheerful: {
      word: 'enjoué',
      definition:
        'Une humeur lumineuse et optimiste. De la bonne humeur qui se voit.',
      examples: [
        'Elle gardait un sourire enjoué malgré une journée difficile.',
        "Après une bonne nuit de sommeil, j'ai le cœur léger.",
        "Il s'est lancé dans le projet avec un entrain communicatif.",
      ],
      synonyms: ['gai', 'de bonne humeur', 'rayonnant', 'jovial'],
      relatedFeelings: ['joyeux', 'content', 'heureux', 'léger'],
    },
    delighted: {
      word: 'ravi',
      definition:
        "Un grand plaisir et une vraie satisfaction. Le bonheur d'une bonne surprise.",
      examples: [
        "Ce cadeau inattendu m'a fait un immense plaisir.",
        'Elle était ravie des compliments de sa mentore.',
        "Il avait l'air ravi de la façon dont la soirée s'était passée.",
      ],
      synonyms: ['enchanté', 'comblé', 'aux anges', 'charmé'],
      relatedFeelings: ['joyeux', 'content', 'reconnaissant', 'satisfait'],
    },
    glad: {
      word: 'content',
      definition:
        "Du plaisir ou de la satisfaction. Être heureux de ce qui vient d'arriver.",
      examples: [
        'Ça me fait plaisir de voir que tu vas mieux.',
        'Elle était contente de retrouver ses vieux amis.',
        'Il était content de donner un coup de main sur le projet.',
      ],
      synonyms: ['heureux', 'satisfait', 'réjoui', 'ravi'],
      relatedFeelings: ['joyeux', 'enjoué', 'ravi', 'satisfait'],
    },
    happy: {
      word: 'heureux',
      definition:
        'Du plaisir et du contentement. Une sensation générale de bien-être.',
      examples: [
        'Je me sens bien quand je suis avec ma famille.',
        'Elle était heureuse de toutes ces nouvelles possibilités.',
        "Il avait l'air heureux en entrant dans la pièce.",
      ],
      synonyms: ['joyeux', 'content', 'comblé', 'enjoué'],
      relatedFeelings: ['joyeux', 'enjoué', 'ravi', 'content'],
    },
    grateful: {
      word: 'reconnaissant',
      definition: "Un élan de gratitude pour la gentillesse ou l'aide reçue.",
      examples: [
        "J'ai beaucoup de gratitude pour tout le soutien que tu m'as apporté.",
        "Elle était reconnaissante que son équipe l'aide à tenir le délai.",
        'Il a dit à quel point il était reconnaissant de cette occasion.',
      ],
      synonyms: ['plein de gratitude', 'touché', 'comblé'],
      relatedFeelings: [
        'plein de gratitude',
        "plein d'espoir",
        'satisfait',
        'content',
      ],
    },
    thankful: {
      word: 'plein de gratitude',
      definition: "De la gratitude pour quelque chose que l'on a reçu ou vécu.",
      examples: [
        "J'ai de la gratitude pour cette chance d'apprendre et de grandir.",
        "Elle a ressenti beaucoup de gratitude quand quelqu'un s'est montré bienveillant avec elle.",
        'Il remerciait sincèrement pour les retours sur son travail.',
      ],
      synonyms: ['reconnaissant', 'touché', 'comblé'],
      relatedFeelings: [
        'reconnaissant',
        "plein d'espoir",
        'content',
        'satisfait',
      ],
    },
    inspired: {
      word: 'inspiré',
      definition:
        "Une envie de créer ou d'accomplir quelque chose, pleine d'énergie. L'esprit en éveil.",
      examples: [
        "Sa détermination et sa passion m'inspirent.",
        'La présentation lui a donné envie de voir les choses autrement.',
        "Elle s'est sentie inspirée après avoir lu ce livre.",
      ],
      synonyms: ['motivé', 'stimulé', 'touché', 'porté'],
      relatedFeelings: [
        "plein d'espoir",
        'emballé',
        'enthousiaste',
        "plein d'énergie",
      ],
    },
    hopeful: {
      word: "plein d'espoir",
      definition:
        "Le sentiment que quelque chose de bon va arriver. De l'espoir qui porte.",
      examples: [
        "J'ai de l'espoir pour l'avenir, malgré les difficultés.",
        'Elle a repris espoir en découvrant le nouveau programme.',
        "Il espérait que les choses allaient s'arranger.",
      ],
      synonyms: ['optimiste', 'confiant', "dans l'attente"],
      relatedFeelings: ['optimiste', 'emballé', 'inspiré', 'apaisé'],
    },
    optimistic: {
      word: 'optimiste',
      definition:
        "De la confiance en l'avenir. L'attente que les choses tournent bien.",
      examples: [
        'Elle voyait les choses de façon optimiste malgré les difficultés.',
        'Il était optimiste quant à ses chances de réussir.',
        'Je suis optimiste: on peut trouver une solution à ce problème.',
      ],
      synonyms: ["plein d'espoir", 'confiant', 'positif'],
      relatedFeelings: ["plein d'espoir", 'confiant', 'apaisé', 'joyeux'],
    },

    // Peaceful
    peaceful: {
      word: 'apaisé',
      definition:
        "L'absence de conflit et d'agitation intérieure. Du calme et de la sérénité.",
      examples: [
        'Je me sens en paix après la méditation.',
        'Cette soirée tranquille avait quelque chose de doux et de réparateur.',
        'Elle avait créé une atmosphère paisible chez elle.',
      ],
      synonyms: ['calme', 'serein', 'tranquille', 'en paix'],
      relatedFeelings: ['calme', 'serein', 'détendu', 'satisfait'],
    },
    calm: {
      word: 'calme',
      definition:
        "La paix intérieure, sans inquiétude ni agitation. Le sentiment d'être posé.",
      examples: [
        'Elle est restée calme pendant la crise.',
        "J'ai retrouvé mon calme après qu'on en a parlé.",
        "Il parlait d'une voix calme qui rassurait tout le monde.",
      ],
      synonyms: ['apaisé', 'posé', 'serein', 'tranquille'],
      relatedFeelings: ['apaisé', 'détendu', 'centré', 'confiant'],
    },
    relaxed: {
      word: 'détendu',
      definition:
        "Libre de tension et d'anxiété. Un état d'aise et de confort.",
      examples: [
        'En vacances, loin du travail, je me sens tout à fait à mon aise.',
        'Elle a pris ce contretemps avec décontraction.',
        "Il avait l'air détendu et à l'aise dans le groupe.",
      ],
      synonyms: ['calme', "à l'aise", 'décontracté', 'cool'],
      relatedFeelings: ['calme', 'apaisé', 'satisfait', 'comblé'],
    },
    serene: {
      word: 'serein',
      definition: 'Calme et paisible. Rien ne vient troubler la tranquillité.',
      examples: [
        'Le lac, parfaitement calme, reflétait les montagnes.',
        "Elle gardait un visage serein malgré l'agitation autour d'elle.",
        "Il s'est senti serein une fois le conflit apaisé.",
      ],
      synonyms: ['apaisé', 'calme', 'tranquille', 'posé'],
      relatedFeelings: ['apaisé', 'calme', 'centré', 'satisfait'],
    },
    satisfied: {
      word: 'satisfait',
      definition:
        "Le contentement face à ce que l'on a ou a accompli. Un sentiment de travail bien fait.",
      examples: [
        "J'ai ressenti une vraie satisfaction en terminant le projet.",
        'Elle était satisfaite de la qualité de son travail.',
        "Il avait l'air satisfait de la solution trouvée.",
      ],
      synonyms: ['content', 'comblé', 'gratifié', 'épanoui'],
      relatedFeelings: ['comblé', 'apaisé', 'reconnaissant', 'content'],
    },
    content: {
      word: 'comblé',
      definition:
        'Satisfait et en paix. Heureux de sa situation, sans rien désirer de plus.',
      examples: [
        "Lire tranquillement à la maison me suffit, je n'ai besoin de rien d'autre.",
        'Elle se sentait comblée par sa vie simple.',
        "Il avait l'air comblé par les progrès accomplis.",
      ],
      synonyms: ['satisfait', 'en paix', "à l'aise", 'épanoui'],
      relatedFeelings: ['satisfait', 'apaisé', 'reconnaissant', 'accepté'],
    },

    // Excited
    excited: {
      word: 'emballé',
      definition:
        "Un grand enthousiasme et beaucoup d'impatience. L'énergie qui monte.",
      examples: [
        "J'ai vraiment hâte de commencer ce nouveau travail.",
        'Elle était tout emballée en apprenant la bonne nouvelle.',
        "Il avait l'air emballé quand il parlait du projet.",
      ],
      synonyms: ['enthousiaste', 'impatient', "plein d'énergie", 'surexcité'],
      relatedFeelings: [
        'enthousiaste',
        "plein d'énergie",
        'impatient',
        'inspiré',
      ],
    },
    enthusiastic: {
      word: 'enthousiaste',
      definition: 'Un intérêt vif et ardent pour quelque chose. Un grand élan.',
      examples: [
        'Elle était enthousiaste à propos de la nouvelle initiative.',
        "Il parlait de cette occasion avec beaucoup d'enthousiasme.",
        'Ils ont participé à la discussion avec enthousiasme.',
      ],
      synonyms: ['emballé', 'passionné', 'motivé', 'fervent'],
      relatedFeelings: [
        'emballé',
        'passionné',
        "plein d'énergie",
        "plein d'espoir",
      ],
    },
    eager: {
      word: 'impatient',
      definition:
        "Avoir hâte. Un fort désir ou un vif intérêt pour ce qui s'annonce.",
      examples: [
        "J'avais hâte d'en apprendre plus sur le sujet.",
        'Elle semblait impatiente de relever le défi.',
        'Il était impatient de partager ses idées.',
      ],
      synonyms: ['enthousiaste', 'emballé', 'avide', 'motivé'],
      relatedFeelings: ['emballé', 'enthousiaste', "plein d'espoir", 'inspiré'],
    },
    energized: {
      word: "plein d'énergie",
      definition:
        "Rempli d'énergie et d'élan. Une sensation de vitalité et de force.",
      examples: [
        "Après le sport, je déborde d'énergie.",
        "Les retours encourageants lui ont redonné de l'énergie.",
        "L'enthousiasme de l'équipe l'a regonflé à bloc.",
      ],
      synonyms: ['revigoré', 'stimulé', 'dynamisé', 'en forme'],
      relatedFeelings: ['emballé', 'enthousiaste', 'inspiré', "plein d'espoir"],
    },

    // Angry
    angry: {
      word: 'en colère',
      definition:
        "Un mécontentement fort et une envie de se battre. Peut aller jusqu'à la rage.",
      examples: [
        "J'étais en colère quand mes limites n'ont pas été prises en compte.",
        'Elle était en colère face à ce traitement injuste.',
        "Il avait l'air en colère en parlant de la situation.",
      ],
      synonyms: ['furieux', 'fâché', 'enragé', 'hors de soi'],
      relatedFeelings: [
        'frustré',
        'plein de ressentiment',
        'irrité',
        'contrarié',
      ],
    },
    frustrated: {
      word: 'frustré',
      definition:
        "De l'agacement quand on ne peut pas changer quelque chose. Le sentiment d'être bloqué.",
      examples: [
        'Je ressens de la frustration quand le projet bute sur des obstacles.',
        "Elle était frustrée de voir que rien n'avançait.",
        'Il était frustré de ne pas réussir à faire passer ses idées.',
      ],
      synonyms: ['agacé', 'irrité', 'exaspéré', 'contrarié'],
      relatedFeelings: ['en colère', 'irrité', 'découragé', 'agacé'],
    },
    irritated: {
      word: 'irrité',
      definition:
        "De l'agacement qui monte. Une pointe de colère ou d'impatience.",
      examples: [
        'Les interruptions à répétition me mettent sur les nerfs.',
        'Elle semblait irritée par le bruit.',
        'Il était irrité par la lenteur du service.',
      ],
      synonyms: ['agacé', 'énervé', 'exaspéré', 'excédé'],
      relatedFeelings: ['frustré', 'agacé', 'à bout', 'contrarié'],
    },
    resentful: {
      word: 'plein de ressentiment',
      definition:
        "De l'amertume face à quelque chose d'injuste. Une rancœur qui reste.",
      examples: [
        "J'ai gardé du ressentiment quand on m'a écarté de la réunion.",
        "Elle en voulait à sa direction pour le travail supplémentaire qu'on lui avait confié.",
        'Il gardait de la rancœur après cette décision injuste.',
      ],
      synonyms: ['amer', 'rancunier', 'indigné', 'ulcéré'],
      relatedFeelings: ['en colère', 'frustré', 'blessé', 'amer'],
    },
    annoyed: {
      word: 'agacé',
      definition: "Un peu de colère ou d'irritation. Du mécontentement.",
      examples: [
        "Ces messages incessants m'agaçaient.",
        'Elle était agacée que ses projets changent.',
        "Il avait l'air agacé par les questions.",
      ],
      synonyms: ['irrité', 'énervé', 'mécontent', 'contrarié'],
      relatedFeelings: ['frustré', 'irrité', 'contrarié', 'mécontent'],
    },
    upset: {
      word: 'contrarié',
      definition:
        "Une émotion qui dérange et attriste. Le sentiment d'être troublé.",
      examples: [
        "Ces remarques blessantes m'ont beaucoup remué.",
        'Elle était bouleversée quand sa confiance a été trahie.',
        "Il avait l'air contrarié par l'annulation.",
      ],
      synonyms: ['troublé', 'bouleversé', 'remué', 'secoué'],
      relatedFeelings: ['en colère', 'blessé', 'triste', 'anxieux'],
    },

    // Sad
    sad: {
      word: 'triste',
      definition:
        'De la peine ou du chagrin. Parfois du deuil ou de la déception.',
      examples: [
        "J'étais triste quand mon amie a déménagé.",
        "Elle était triste à la fin de l'histoire.",
        'Il semblait triste en repensant à cette perte.',
      ],
      synonyms: ['peiné', 'malheureux', 'mélancolique', 'abattu'],
      relatedFeelings: ['déçu', 'seul', 'le cœur brisé', 'abattu'],
    },
    disappointed: {
      word: 'déçu',
      definition:
        'De la tristesse ou du mécontentement quand nos attentes ne sont pas comblées.',
      examples: [
        "J'ai ressenti une vraie déception quand l'événement a été annulé.",
        'Elle était déçue par ses résultats.',
        'Il semblait déçu par la réponse.',
      ],
      synonyms: ['désappointé', 'découragé', 'désenchanté', 'insatisfait'],
      relatedFeelings: ['triste', 'découragé', 'blessé', 'frustré'],
    },
    lonely: {
      word: 'seul',
      definition:
        "De la tristesse liée à l'isolement ou au manque de lien. Le manque de compagnie.",
      examples: [
        'Pendant ce long voyage loin de chez moi, la solitude me pesait.',
        'Elle se sentait seule après le départ de ses amis.',
        'Il semblait se sentir seul, même au milieu de la foule.',
      ],
      synonyms: ['isolé', 'esseulé', 'coupé des autres', 'délaissé'],
      relatedFeelings: ['triste', 'isolé', 'délaissé', 'incompris'],
    },
    discouraged: {
      word: 'découragé',
      definition:
        "Moins de confiance et d'élan qu'avant. Le sentiment de perdre espoir.",
      examples: [
        'Après plusieurs échecs, le découragement a pris le dessus.',
        "Elle était découragée de voir que rien n'avançait.",
        "Il semblait découragé face à l'avenir.",
      ],
      synonyms: ['démoralisé', 'abattu', 'las', 'démotivé'],
      relatedFeelings: ['triste', 'déçu', 'désemparé', 'hésitant'],
    },
    heartbroken: {
      word: 'le cœur brisé',
      definition:
        'Un chagrin immense, souvent après une rupture ou une très grande déception.',
      examples: [
        "J'ai eu le cœur brisé quand notre relation a pris fin.",
        'Elle avait le cœur brisé après avoir perdu sa meilleure amie.',
        'Il avait le cœur brisé par ce qui se passait.',
      ],
      synonyms: ['effondré', 'anéanti', 'dévasté', 'inconsolable'],
      relatedFeelings: ['triste', 'endeuillé', 'blessé', 'anéanti'],
    },

    // Scared
    scared: {
      word: 'effrayé',
      definition:
        "Le sentiment d'avoir peur. Une inquiétude forte face à quelque chose.",
      examples: [
        "Ce bruit violent m'a fait très peur.",
        "Elle avait peur de l'avenir incertain.",
        "Il semblait effrayé à l'idée de l'intervention médicale.",
      ],
      synonyms: ['apeuré', 'inquiet', 'terrifié', 'paniqué'],
      relatedFeelings: ['anxieux', 'inquiet', 'terrifié', "mal à l'aise"],
    },
    anxious: {
      word: 'anxieux',
      definition:
        "De l'inquiétude ou une tension nerveuse face à ce qui est incertain.",
      examples: [
        "J'ai ressenti beaucoup d'anxiété avant la présentation.",
        "Elle était anxieuse en attendant l'issue de la réunion.",
        "Il semblait anxieux quand on parlait d'argent.",
      ],
      synonyms: ['inquiet', 'nerveux', 'tendu', 'angoissé'],
      relatedFeelings: ['effrayé', 'inquiet', 'nerveux', 'hésitant'],
    },
    worried: {
      word: 'inquiet',
      definition:
        "Le sentiment d'être troublé ou mal à l'aise face à ce qui pourrait arriver.",
      examples: [
        'Sa santé me causait beaucoup de souci.',
        'Elle craignait que le plan ne fonctionne pas.',
        "Il semblait inquiet à l'idée de ne pas tenir le délai.",
      ],
      synonyms: ['anxieux', 'soucieux', 'préoccupé', 'tracassé'],
      relatedFeelings: ['anxieux', 'effrayé', 'hésitant', 'vulnérable'],
    },
    nervous: {
      word: 'nerveux',
      definition:
        "Une anxiété qui se voit. De l'appréhension ou une agitation intérieure.",
      examples: [
        'Parler en public me donne le trac.',
        "Elle était nerveuse à l'approche de l'examen.",
        'Il semblait nerveux de rencontrer les parents de sa compagne.',
      ],
      synonyms: ['anxieux', 'tendu', 'stressé', 'sur les nerfs'],
      relatedFeelings: ['anxieux', 'inquiet', 'hésitant', 'vulnérable'],
    },
    terrified: {
      word: 'terrifié',
      definition: 'Une peur extrême et intense.',
      examples: [
        "Pendant le tremblement de terre, j'ai ressenti une terreur absolue.",
        "Elle était terrifiée à l'idée de perdre son emploi.",
        'Il semblait terrifié par la menace.',
      ],
      synonyms: ['épouvanté', 'pétrifié', 'paniqué', 'affolé'],
      relatedFeelings: ['effrayé', 'paniqué', 'désemparé', 'submergé'],
    },

    // Confused
    confused: {
      word: 'perplexe',
      definition:
        "Ne pas arriver à comprendre ou à penser clairement. Le sentiment d'être perdu.",
      examples: [
        'Ces consignes contradictoires me laissaient perplexe.',
        'Elle ne savait plus dans quelle direction aller.',
        "Il semblait perplexe après l'explication.",
      ],
      synonyms: ['perdu', 'désorienté', 'déconcerté', 'dérouté'],
      relatedFeelings: ['hésitant', 'perdu', 'submergé', 'frustré'],
    },
    uncertain: {
      word: 'hésitant',
      definition:
        "Ne pas arriver à se décider ou à être sûr de soi. Un manque d'assurance.",
      examples: [
        "J'avais du mal à savoir quel était le bon choix.",
        'Elle hésitait sur la marche à suivre.',
        'Il semblait hésitant à propos de sa décision.',
      ],
      synonyms: ['incertain', 'dans le doute', 'indécis', 'partagé'],
      relatedFeelings: ['perplexe', 'anxieux', 'vulnérable', 'mal assuré'],
    },
    overwhelmed: {
      word: 'submergé',
      definition:
        "Trop de choses à gérer ou à absorber en même temps. Le sentiment d'être dépassé.",
      examples: [
        "Avec toutes ces tâches, j'avais l'impression de crouler sous le travail.",
        'Elle était submergée par ses émotions.',
        'Il semblait débordé par les échéances au travail.',
      ],
      synonyms: ['débordé', 'dépassé', 'surchargé', 'noyé'],
      relatedFeelings: ['stressé', 'anxieux', 'désemparé', 'épuisé'],
    },
  },

  quiz: {
    // Level 1
    "I feel like you don't respect me.": {
      sentence: "J'ai l'impression que tu ne me respectes pas.",
      explanation:
        "Ce n'est pas un sentiment. « Tu ne me respectes pas » est une pensée, une interprétation de ce que fait l'autre. En dessous, il y a peut-être de la peine, de la tristesse ou du découragement.",
      correctFeelings: ['blessé', 'triste', 'découragé'],
    },
    'I feel that this is unfair.': {
      sentence: "Je sens que c'est injuste.",
      explanation:
        "« C'est injuste » est un jugement sur la situation, pas un sentiment. Ce qui se vit en dessous, c'est peut-être de la frustration, de la peine ou de la colère.",
      correctFeelings: ['frustré', 'blessé', 'en colère'],
    },
    "I feel that you're being disrespectful.": {
      sentence: 'Je sens que tu me manques de respect.',
      explanation:
        "C'est une pensée sur le comportement de l'autre, pas un sentiment. Ce que tu ressens vraiment, c'est peut-être de l'agacement, de la peine ou de la tristesse.",
      correctFeelings: ['agacé', 'blessé', 'triste'],
    },
    'I feel abandoned by you.': {
      sentence: "J'ai l'impression que tu m'abandonnes.",
      explanation:
        "« Abandonner » décrit la façon dont tu interprètes ce que fait l'autre. Le sentiment, lui, ressemble plutôt à de la solitude, de la peine ou de la tristesse.",
      correctFeelings: ['seul', 'blessé', 'triste'],
    },
    "I feel like you don't care about me.": {
      sentence: "J'ai l'impression que je ne compte pas pour toi.",
      explanation:
        "C'est une pensée sur ce que l'autre ressent ou pense, pas ton propre sentiment. En dessous, il y a peut-être de la peine, de la solitude ou de la tristesse.",
      correctFeelings: ['blessé', 'seul', 'triste'],
    },
    'I feel worried about the deadline.': {
      sentence: "Je ressens de l'inquiétude à l'approche de l'échéance.",
      explanation:
        "L'inquiétude est un vrai sentiment. Elle décrit ce qui se passe en toi face à une situation, sans blâmer ni juger personne.",
    },
    'I feel frustrated when you interrupt me.': {
      sentence: 'Je ressens de la frustration quand tu me coupes la parole.',
      explanation:
        "La frustration est un vrai sentiment. Même si la phrase mentionne ce que fait l'autre, elle met l'accent sur ce que vit la personne qui parle.",
    },
    'I feel hurt by what you said.': {
      sentence: "Ce que tu m'as dit m'a fait de la peine.",
      explanation:
        "La peine est un vrai sentiment. Elle nomme avec justesse ce qui se passe à l'intérieur, même si ce sont les mots de l'autre qui l'ont déclenchée.",
    },
    'I feel angry when people are late.': {
      sentence: 'Je suis en colère quand les gens sont en retard.',
      explanation:
        'La colère est un vrai sentiment. Elle décrit ta réaction face au retard, sans porter de jugement sur la personne.',
    },
    'I feel that you never listen to me.': {
      sentence: "Je sens que tu ne m'écoutes jamais.",
      explanation:
        "« Tu ne m'écoutes jamais » est une généralisation et un jugement, pas un sentiment. Ce qui se vit en dessous, c'est peut-être de la frustration, de la solitude ou de la tristesse.",
      correctFeelings: ['frustré', 'seul', 'triste'],
    },

    // Level 2
    "I feel ignored when you don't respond quickly.": {
      sentence:
        "J'ai l'impression que tu m'ignores quand tu ne réponds pas vite.",
      explanation:
        "« Ignorer » est une évaluation de ce que fait l'autre. Les sentiments en dessous peuvent être de la peine, de la tristesse, ou de l'inquiétude à l'idée de ne pas compter.",
      correctFeelings: ['blessé', 'triste', 'inquiet'],
    },
    'I feel rejected by the group.': {
      sentence: "J'ai le sentiment que le groupe me rejette.",
      explanation:
        '« Rejeter » décrit ton interprétation de la façon dont on te traite. Le sentiment, lui, ressemble plutôt à de la peine, de la solitude ou de la tristesse.',
      correctFeelings: ['blessé', 'seul', 'triste'],
    },
    'I feel manipulated by your behavior.': {
      sentence: "J'ai l'impression que tu me manipules.",
      explanation:
        "« Manipuler » est un jugement sur les intentions de l'autre. Ce que tu ressens, c'est peut-être de l'inquiétude, de la méfiance, ou l'envie de te protéger.",
      correctFeelings: ['inquiet', 'méfiant', 'sur la défensive'],
    },
    'I feel unappreciated at work.': {
      sentence: "J'ai le sentiment que personne ne reconnaît mon travail.",
      explanation:
        "C'est une évaluation de la façon dont on te traite au travail. Les sentiments en dessous peuvent être de la frustration, du découragement ou de la tristesse.",
      correctFeelings: ['frustré', 'découragé', 'triste'],
    },
    'I feel excluded from the conversation.': {
      sentence:
        "J'ai l'impression qu'on me laisse en dehors de la conversation.",
      explanation:
        "Cette phrase décrit la situation, pas le sentiment. Ce qui se vit en dessous, c'est peut-être de la peine, de la solitude ou de la tristesse.",
      correctFeelings: ['blessé', 'seul', 'triste'],
    },
    'I feel sad when remembering that day.': {
      sentence: 'Je me sens triste quand je repense à ce jour-là.',
      explanation:
        "La tristesse est un vrai sentiment, l'un des plus essentiels. Elle exprime avec justesse ce que réveille un souvenir.",
    },
    'I feel anxious about speaking up in meetings.': {
      sentence:
        "Je ressens de l'appréhension à l'idée de prendre la parole en réunion.",
      explanation:
        "L'appréhension est un vrai sentiment. Elle décrit ce que tu vis intérieurement dans cette situation.",
    },
    'I feel grateful for your help.': {
      sentence: 'Je ressens beaucoup de gratitude pour ton aide.',
      explanation:
        'La gratitude est un vrai sentiment agréable. Elle exprime ce qui te touche, sans aucun jugement.',
    },
    'I feel unsupported by my team.': {
      sentence: "J'ai l'impression que mon équipe ne me soutient pas.",
      explanation:
        "C'est un jugement sur la façon dont ton équipe se comporte avec toi. En dessous, il y a peut-être de la solitude, du découragement ou de l'inquiétude.",
      correctFeelings: ['seul', 'découragé', 'inquiet'],
    },
    'I feel criticized when people give feedback.': {
      sentence:
        "J'ai l'impression qu'on me critique dès qu'on me fait un retour.",
      explanation:
        "« Critiquer » est un jugement sur l'intention derrière le retour. Ce que tu ressens, c'est peut-être l'envie de te défendre, de la peine ou de l'inquiétude.",
      correctFeelings: ['sur la défensive', 'blessé', 'inquiet'],
    },

    // Level 3
    'I feel misunderstood by everyone.': {
      sentence: "J'ai le sentiment que personne ne me comprend.",
      explanation:
        "C'est une évaluation de la façon dont les autres te perçoivent. En dessous, il y a peut-être de la frustration, de la solitude ou un profond découragement.",
      correctFeelings: ['frustré', 'seul', 'découragé'],
    },
    'I feel vulnerable when sharing my thoughts.': {
      sentence: 'Je me sens vulnérable quand je partage ce que je pense.',
      explanation:
        "« Vulnérable » est un vrai sentiment, et un sentiment essentiel. Il décrit ce que l'on vit quand on se dévoile, et le courage qu'il faut pour partager.",
    },
    'I feel betrayed by your actions.': {
      sentence: 'Je sens que tu as trahi ma confiance.',
      explanation:
        "« Trahir » juge les intentions de l'autre à partir de ton interprétation. Les sentiments en dessous peuvent être de la peine, de la colère ou de la méfiance.",
      correctFeelings: ['blessé', 'en colère', 'méfiant'],
    },
    'I feel powerless in this situation.': {
      sentence:
        "J'ai l'impression de n'avoir aucune prise sur cette situation.",
      explanation:
        "C'est un jugement sur ta capacité à agir. Ce que tu ressens en dessous, c'est peut-être du désarroi, de la frustration ou de la peur.",
      correctFeelings: ['désemparé', 'frustré', 'effrayé'],
    },
    'I feel invisible when you ignore me.': {
      sentence: "Je me sens invisible quand tu m'ignores.",
      explanation:
        '« Invisible » est une image qui décrit la façon dont on te traite. Les sentiments en dessous peuvent être de la peine, de la tristesse ou de la solitude.',
      correctFeelings: ['blessé', 'triste', 'seul'],
    },
    "I feel alive when I'm creating something new.": {
      sentence:
        'Je me sens pleinement en vie quand je crée quelque chose de nouveau.',
      explanation:
        "Se sentir en vie est un vrai sentiment. Il décrit un état de vitalité et d'engagement.",
    },
    'I feel peaceful after our conversation.': {
      sentence: 'Je me sens en paix après notre conversation.',
      explanation:
        'Se sentir en paix est un vrai sentiment. Il décrit un état intérieur calme et serein.',
    },
    'I feel disconnected from the group.': {
      sentence: "J'ai l'impression de ne plus faire partie du groupe.",
      explanation:
        "C'est une interprétation de ta place dans le groupe. Ce qui se vit en dessous, c'est peut-être de la solitude, de la tristesse ou un malaise.",
      correctFeelings: ['seul', 'triste', "mal à l'aise"],
    },
    'I feel inspired by her courage.': {
      sentence: "Son courage m'inspire profondément.",
      explanation:
        "L'inspiration est un vrai sentiment. Il décrit l'élan et l'émotion que l'on ressent en voyant ce qu'une autre personne ose faire.",
    },
    'I feel trapped by my responsibilities.': {
      sentence: "J'ai l'impression que mes responsabilités m'enferment.",
      explanation:
        "C'est un jugement sur ta situation. Les sentiments en dessous peuvent être de l'accablement, de l'anxiété ou du ressentiment.",
      correctFeelings: ['submergé', 'anxieux', 'plein de ressentiment'],
    },
  },
}
