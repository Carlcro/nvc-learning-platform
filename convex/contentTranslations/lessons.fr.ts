import type { LessonTranslationTable } from '../lib/contentText'

export const lessonsFr: LessonTranslationTable = {
  introduction: {
    title: 'Introduction à la communication non violente',
    description:
      "Ce qu'est la CNV, d'où elle vient, et les quatre éléments qu'elle t'invite à apporter dans un moment difficile.",
    content:
      "La communication non violente (CNV) est une façon de parler et d'écouter développée par le psychologue Marshall Rosenberg. Son point de départ : derrière chaque action, même celles qui blessent, il y a une personne qui cherche à répondre à un besoin. Quand tu dis ce que tu as vu, ce que tu as ressenti, ce dont tu as besoin et ce qui t'aiderait, l'autre a beaucoup moins de raisons de se défendre.",
    examples: [
      {
        title: 'Du reproche à la compréhension',
        scenario:
          "Ton ami a oublié ton anniversaire. D'habitude, tu te mettrais peut-être en colère. Avec la CNV, tu peux plutôt exprimer ce que tu ressens et ce dont tu as besoin.",
        giraffResponse:
          "Quand tu as oublié mon anniversaire, j'ai eu de la peine, parce que fêter les moments importants et le lien entre nous comptent beaucoup pour moi. Est-ce que tu accepterais qu'on marque le coup ensemble cette semaine ?",
        jackalResponse:
          "Tu n'as aucun égard pour moi. Tu oublies toujours ce qui est important pour moi.",
        explanation:
          'La réponse girafe exprime le sentiment (la peine) et le besoin (le lien) sans reproche. La réponse chacal juge et généralise.',
      },
    ],
    questions: [
      {
        question: 'Que représente la girafe en CNV ?',
        options: [
          'Un jugement rapide, porté de haut',
          "L'empathie et la communication bienveillante",
          'La pensée abstraite',
          'Une communication de prédateur',
        ],
        explanation:
          "En CNV, la girafe symbolise l'empathie et la communication bienveillante : elle a un très grand cœur, et son long cou lui permet de voir les choses sous différents angles. Le chacal représente une communication réactive et défensive.",
      },
      {
        question: 'Laquelle de ces phrases relève du langage girafe ?',
        options: [
          "Tu es vraiment irresponsable, tu ne penses qu'à toi.",
          "Quand tu es arrivé en retard, j'ai ressenti de l'inquiétude, parce que le respect de ce qu'on a convenu compte beaucoup pour moi.",
          'Tu fais toujours les mêmes erreurs.',
          'Tu devrais savoir ça, quand même.',
        ],
        explanation:
          "Cette phrase suit la CNV : elle contient une observation (l'arrivée en retard), un sentiment (l'inquiétude) et un besoin (le respect), les éléments de base d'une communication bienveillante.",
      },
      {
        question: 'Quel est le but PRINCIPAL de la communication non violente ?',
        options: [
          "Gagner les disputes et obtenir ce qu'on veut",
          "Culpabiliser les autres pour ce qu'ils ont fait",
          'Exprimer ses besoins et favoriser la compréhension mutuelle et la bienveillance',
          "Éviter tout conflit, à n'importe quel prix",
        ],
        explanation:
          "La CNV vise la compréhension mutuelle et la bienveillance : tu exprimes tes besoins avec sincérité, tout en restant à l'écoute de ceux de l'autre.",
      },
      {
        question: 'Lequel de ces éléments ne fait PAS partie des 4 piliers de la CNV ?',
        options: [
          "L'observation",
          'Le jugement',
          'Le sentiment',
          'La demande',
        ],
        explanation:
          "Les 4 piliers de la CNV sont l'observation, le sentiment, le besoin et la demande. Le jugement est justement ce que la CNV met de côté, et c'est pourquoi on veille à ce que les observations n'en contiennent pas.",
      },
      {
        question: 'Laquelle de ces phrases relève du langage chacal ?',
        options: [
          "Je me suis fait du souci quand je n'avais pas de nouvelles de toi.",
          "Est-ce que tu serais d'accord pour m'appeler demain ?",
          "Tu ne penses qu'à toi, jamais aux autres.",
          "J'ai vraiment besoin de repos en ce moment.",
        ],
        explanation:
          "« Tu ne penses qu'à toi, jamais aux autres » est un jugement enveloppé dans une généralisation. Les trois autres phrases apportent chacune un élément girafe : un sentiment, une demande et un besoin.",
      },
    ],
  },
  observation: {
    title: 'Observer sans évaluer',
    description:
      "Raconte ce qui s'est passé comme une caméra l'aurait filmé, pour que l'autre puisse t'entendre sans se crisper.",
    content:
      "Une observation décrit ce qui s'est passé sans y ajouter de verdict. « Tu es rentré à onze heures du soir » est une observation. « Tu n'as aucun égard pour les autres » est une évaluation, et une évaluation pousse l'autre à débattre de sa justesse au lieu d'entendre ce dont tu as besoin.",
    examples: [
      {
        title: 'Les faits ou le jugement',
        scenario: 'Ton collègue a rendu un projet en retard.',
        giraffResponse:
          'Tu as rendu le projet à 17 h, alors que la date limite était à 15 h.',
        jackalResponse: "Tu es toujours en retard, c'est irresponsable.",
        explanation:
          "La réponse girafe énonce le fait observable. La réponse chacal ajoute un jugement (« toujours », « irresponsable ») au lieu de décrire ce qui s'est réellement passé.",
      },
      {
        title: 'Précise les faits',
        scenario: "Quelqu'un n'a pas répondu tout de suite à ton message.",
        giraffResponse:
          "Je t'ai envoyé un message à midi, et je n'ai reçu ta réponse que le soir.",
        jackalResponse: 'Tu ne réponds jamais à mes messages.',
        explanation:
          'La réponse girafe est précise et factuelle. La réponse chacal utilise « jamais », qui est une généralisation.',
      },
    ],
    questions: [
      {
        question:
          'Quelle est la différence essentielle entre une observation et un jugement ?',
        options: [
          'Les observations sont toujours positives, les jugements toujours négatifs',
          'Une observation décrit des faits observables sans les évaluer ; un jugement y ajoute une interprétation et une évaluation',
          'Les observations sont pour les gens bien, les jugements pour les gens mauvais',
          "Il n'y a aucune différence entre les deux",
        ],
        explanation:
          'Une observation dit ce que tu peux voir, entendre ou vivre, sans interprétation. Un jugement ajoute une évaluation, un reproche ou une interprétation à ce que tu observes.',
      },
      {
        question: 'Laquelle de ces phrases est une pure observation, SANS jugement ?',
        options: [
          "Tu es toujours désordonné, rien n'est jamais rangé",
          'Tu as laissé tes chaussures devant la porte trois fois cette semaine',
          'Tu ne prends pas soin de tes affaires',
          'Tu ne ranges jamais rien',
        ],
        explanation:
          "C'est un fait précis et observable, situé dans le temps. Les autres phrases utilisent des généralisations (« toujours », « jamais ») ou des jugements (« désordonné », « tu ne prends pas soin »).",
      },
      {
        question: 'Que vaut-il mieux éviter dans une observation, selon la CNV ?',
        options: [
          'Donner trop de détails précis',
          'Utiliser des chiffres ou des mesures',
          'Les généralisations comme « toujours », « jamais », « sans arrêt »',
          "Décrire exactement ce qui s'est passé",
        ],
        explanation:
          "Les généralisations déforment l'observation et la font sonner comme un jugement. Une observation pure évite les mots comme « toujours », « jamais », « sans arrêt » et toutes les affirmations absolues.",
      },
      {
        question: "Comment exprimer une observation sur le comportement de quelqu'un ?",
        options: [
          'En partant de ce que tu penses de son caractère',
          'En disant ce que tu vois, entends ou vis directement, sans interprétation',
          "En t'appuyant sur ses habitudes passées pour prédire la suite",
          "En te fondant sur ce que d'autres t'ont raconté",
        ],
        explanation:
          'Une observation repose sur ce que tu perçois directement, ce que tu vois ou entends réellement, sans y ajouter ton interprétation ni un jugement sur la personne.',
      },
      {
        question: "Quelle phrase respecte le mieux le pilier de l'observation ?",
        options: [
          "Quand je te vois lever les yeux au ciel, j'en conclus que tu ne me respectes pas",
          "Quand tu lèves les yeux au ciel pendant que je parle, j'ai de la peine, parce que le respect compte pour moi",
          "Tu lèves toujours les yeux au ciel dès que je dis quelque chose, c'est irrespectueux",
          'Je pense que tu me juges, puisque tu lèves les yeux au ciel',
        ],
        explanation:
          "Cette phrase sépare bien l'observation (tu lèves les yeux au ciel) du sentiment (la peine), sans ajouter de jugement ni d'interprétation sur le caractère ou les intentions de l'autre.",
      },
    ],
  },
  feeling: {
    title: 'Reconnaître et exprimer ses sentiments',
    description:
      "Nomme l'émotion elle-même, et repère quand une pensée sur l'autre se déguise en sentiment.",
    content:
      "Un sentiment est une émotion que tu remarques en toi : la tristesse, la joie, l'anxiété, le soulagement. Beaucoup de phrases qui commencent par « je me sens » ou « je sens que » sont en réalité des pensées sur quelqu'un d'autre, comme « je me sens ignoré » ou « j'ai l'impression que tu t'en fiches ». Nommer l'émotion elle-même, c'est la garder de ton côté, et cela aide l'autre à rester avec toi.",
    examples: [
      {
        title: 'Vrais sentiments et pseudo-sentiments',
        scenario: "Quelqu'un a organisé une fête sans te compter parmi les invités.",
        giraffResponse: "Je suis triste, et je me sens un peu à l'écart.",
        jackalResponse: "J'ai l'impression que je ne compte pas pour toi.",
        explanation:
          "« J'ai l'impression que » introduit une pensée, pas un sentiment. La réponse girafe nomme de vraies émotions.",
      },
      {
        title: "Tes sentiments t'appartiennent",
        scenario: "Quelqu'un t'a coupé la parole.",
        giraffResponse: "J'ai ressenti de la frustration quand on m'a coupé la parole.",
        jackalResponse: "Tu m'énerves à toujours me couper la parole.",
        explanation:
          "La réponse girafe prend la responsabilité du sentiment. La réponse chacal accuse l'autre de l'avoir provoqué.",
      },
    ],
    questions: [
      {
        question:
          'Quelle est la principale différence entre un sentiment et un pseudo-sentiment ?',
        options: [
          'Les sentiments sont toujours plus forts que les pseudo-sentiments',
          'Les sentiments sont de vraies émotions ; les pseudo-sentiments contiennent des pensées ou des jugements',
          'Les pseudo-sentiments sont plus importants en CNV',
          "Il n'y a pas vraiment de différence entre les deux",
        ],
        explanation:
          "Les vrais sentiments sont des émotions comme la joie, la tristesse, l'anxiété ou la colère. Les pseudo-sentiments comme « je me sens rejeté » ou « je me sens trahi » sont en fait des pensées, des interprétations de ce que les autres pensent de toi ou te font.",
      },
      {
        question: 'Lequel de ces exemples est un vrai sentiment (et non un pseudo-sentiment) ?',
        options: [
          "J'ai l'impression que tu te fiches de moi",
          "Je ressens de l'anxiété et de l'inquiétude",
          'Je sens que tu es injuste avec moi',
          "J'ai l'impression que personne ne me respecte",
        ],
        explanation:
          "L'anxiété et l'inquiétude sont de vraies émotions, que tu peux ressentir en toi. Les autres sont des pseudo-sentiments, car ils contiennent des jugements sur ce que pensent ou font les autres (tu te fiches de moi, tu es injuste, personne ne me respecte).",
      },
      {
        question: 'En CNV, comment exprimer ses sentiments ?',
        options: [
          "En accusant l'autre de les avoir provoqués",
          'En les assumant, sans en rendre les autres responsables',
          "En partant du principe que l'autre sait ce que tu ressens",
          "En n'exprimant que les sentiments agréables",
        ],
        explanation:
          "En CNV, tu assumes tes sentiments en disant « j'étais triste » plutôt que « tu me rends triste ». Cela te redonne du pouvoir et garde l'échange centré sur la compréhension plutôt que sur le reproche.",
      },
      {
        question: "Qu'est-ce qui pose problème dans la phrase « Tu me mets en colère » ?",
        options: [
          'Elle est grammaticalement incorrecte',
          "La colère n'est pas un vrai sentiment",
          "Elle donne à l'autre du pouvoir sur tes émotions et sous-entend un reproche",
          'Elle est trop directe',
        ],
        explanation:
          "Ce que l'autre a fait a peut-être déclenché ta colère, mais ce n'est pas lui qui te la fait ressentir. Tes sentiments t'appartiennent. La CNV invite à les assumer : « je ressens de la colère quand... » plutôt que « tu me mets en colère ».",
      },
      {
        question: 'Quelle phrase exprime le mieux un sentiment de façon authentique, selon la CNV ?',
        options: [
          "J'ai l'impression que tu ne m'écoutes jamais",
          "J'ai de la peine et de la déception, parce que le lien entre nous compte pour moi",
          'Tu me stresses tout le temps',
          'Je sens que tu ne me comprends pas',
        ],
        explanation:
          "Cette phrase nomme de vraies émotions (la peine, la déception), les assume et les relie à un besoin (le lien). Elle ne contient ni reproche ni jugement sur l'autre.",
      },
    ],
  },
  need: {
    title: 'Relier ses sentiments à ses besoins',
    description:
      "Trouve ce qui compte pour toi sous le sentiment, et distingue-le de la stratégie pour l'obtenir.",
    content:
      "Sous chaque sentiment se trouve un besoin : quelque chose que tout être humain partage, comme le repos, le respect, le lien ou la sécurité. Un besoin n'est pas une stratégie, c'est-à-dire la façon précise dont tu espères y répondre. Nommer le besoin ouvre de nombreux chemins, alors que s'accrocher à une seule stratégie déclenche souvent un bras de fer.",
    examples: [
      {
        title: 'Besoin ou stratégie',
        scenario: 'Tu aimerais que ton ou ta partenaire sorte les poubelles.',
        giraffResponse:
          "J'ai besoin de respect, et d'un foyer dont on prend soin à deux. Est-ce que tu serais d'accord pour m'aider davantage dans les tâches de la maison ?",
        jackalResponse: 'Il faut que tu te mettes à participer à la maison.',
        explanation:
          "La réponse girafe nomme le besoin sous-jacent (le respect, un foyer partagé). La réponse chacal confond la stratégie (que l'autre sorte les poubelles) avec le besoin.",
      },
      {
        title: 'Des besoins universels',
        scenario: "Quelqu'un est arrivé en retard, et ça te pèse.",
        giraffResponse:
          "J'ai ressenti de l'anxiété, parce que la fiabilité et le respect comptent pour moi.",
        jackalResponse: "Tu devrais toujours être à l'heure.",
        explanation:
          'La réponse girafe se relie à des besoins universels (la fiabilité, le respect). La réponse chacal formule une exigence sans exprimer le besoin qui se cache derrière.',
      },
    ],
    questions: [
      {
        question: 'Quelle est la différence entre un besoin et une stratégie ?',
        options: [
          'Les besoins sont des exigences, les stratégies sont des demandes',
          "Un besoin est universel, commun à tous les êtres humains ; une stratégie est une façon précise d'y répondre",
          'Les stratégies sont plus importantes que les besoins',
          "Il n'y a aucune différence entre les deux",
        ],
        explanation:
          'Un besoin est essentiel au bien-être de tout être humain (la sécurité, le lien, le respect). Une stratégie est une action précise pour y répondre. Par exemple, « le lien » est un besoin ; « dîner ensemble » est une stratégie.',
      },
      {
        question: 'Lequel de ces exemples est un besoin universel (et non une stratégie) ?',
        options: [
          'Ton partenaire devrait aider aux tâches ménagères',
          "Tu devrais m'écouter davantage",
          "L'autonomie et le respect",
          "Il faut que tu sois à l'heure",
        ],
        explanation:
          "L'autonomie et le respect sont des besoins universels, communs à tout le monde. Les autres sont des stratégies précises ou des exigences portant sur un comportement particulier.",
      },
      {
        question:
          'Ton amie annule vos projets pour la troisième fois, et tu ressens de la déception. Quel est le besoin en dessous ?',
        options: [
          "Qu'elle arrête d'annuler",
          'La fiabilité et le lien',
          'Des excuses',
          "Qu'elle prévienne plus tôt la prochaine fois",
        ],
        explanation:
          "La fiabilité et le lien sont des besoins que n'importe qui peut partager. Les autres sont des stratégies, des façons précises de répondre à ces besoins, et bien des stratégies différentes pourraient répondre au même besoin.",
      },
      {
        question: 'Quelle est la meilleure façon de repérer ton besoin profond ?',
        options: [
          'Exiger que les autres répondent à tes besoins',
          'Regarder sous tes sentiments pour comprendre ce qui compte pour toi',
          'Partir du principe que les autres savent ce dont tu as besoin',
          "Exprimer tes besoins sous forme d'exigences",
        ],
        explanation:
          "En CNV, tu repères tes besoins en explorant ce qui compte pour toi sous tes sentiments. Demande-toi : « Qu'est-ce que je souhaite vraiment ? » ou « Qu'est-ce qui est important pour moi dans cette situation ? »",
      },
      {
        question: 'Quelle phrase relie le mieux un sentiment à un besoin universel ?',
        options: [
          "Je suis triste parce que tu ne m'aides pas pour les tâches",
          "J'ai de la peine, parce que le respect et le partage des responsabilités comptent pour moi",
          "Je ressens de la frustration parce qu'il faut que tu changes",
          "Je suis en colère parce que tu n'écoutes jamais",
        ],
        explanation:
          "Cette phrase nomme le sentiment (la peine), le relie à des besoins universels (le respect, le partage des responsabilités) et évite le reproche. Elle montre ce qui compte vraiment au lieu de s'arrêter à des comportements précis.",
      },
    ],
  },
  request: {
    title: 'Formuler des demandes claires',
    description:
      "Demande une seule chose concrète et réalisable, d'une manière qui laisse l'autre libre de dire non.",
    content:
      "Une demande porte sur une action concrète que l'autre pourrait faire, formulée selon ce que tu veux plutôt que selon ce que tu ne veux pas. Elle laisse l'autre libre de dire non. Si ce non est accueilli par des reproches ou de la pression, c'était en fait une exigence depuis le début, et les gens sentent généralement la différence.",
    examples: [
      {
        title: 'Demande ou exigence',
        scenario: "Tu aimerais qu'un ami écoute ce qui te tracasse.",
        giraffResponse:
          "Est-ce que tu accepterais de m'écouter un moment pendant que je te raconte ce qui me préoccupe ?",
        jackalResponse: "Tu devrais t'intéresser à mes problèmes.",
        explanation:
          "La réponse girafe est une demande claire et concrète, que l'autre peut refuser. La réponse chacal est une exigence déguisée en attente.",
      },
      {
        title: 'Une formulation positive',
        scenario: "Tu aimerais que quelqu'un arrête de te couper la parole.",
        giraffResponse:
          "Est-ce que tu serais d'accord pour attendre que j'aie fini de parler ?",
        jackalResponse: 'Arrête de me couper la parole.',
        explanation:
          "La réponse girafe demande une action positive. La réponse chacal est formulée en négatif (ce qu'il ne faut pas faire).",
      },
    ],
    questions: [
      {
        question: "Quelle est la caractéristique essentielle d'une demande en CNV ?",
        options: [
          "C'est une exigence que les autres doivent suivre",
          "Elle porte sur une action concrète, et l'autre peut dire non",
          'Elle part du principe que les autres savent ce que tu veux',
          "Elle se concentre sur ce que l'autre ne devrait pas faire",
        ],
        explanation:
          "En CNV, une demande n'est pas une exigence. Elle porte sur une action précise et réalisable, ET elle laisse à l'autre la place de refuser sans être jugé ni puni.",
      },
      {
        question: 'Laquelle de ces phrases est une demande claire et réalisable ?',
        options: [
          "Tu devrais arrêter d'être en retard",
          "J'ai besoin que tu t'investisses davantage dans notre relation",
          "Est-ce que tu serais d'accord pour m'appeler quand tu as du retard ?",
          'Il faut que tu écoutes mieux',
        ],
        explanation:
          "Cette demande est précise (appeler en cas de retard), concrète (l'autre sait exactement quoi faire) et peut être refusée. Les autres sont des exigences vagues ou des jugements.",
      },
      {
        question: 'Pourquoi une formulation positive est-elle importante dans une demande ?',
        options: [
          "Parce qu'on est obligé d'obéir aux demandes positives",
          "Parce qu'elle décrit ce que tu veux plutôt que ce que tu ne veux pas",
          "Parce que c'est plus joli",
          "Parce qu'elle ne demande aucune réflexion",
        ],
        explanation:
          "Une demande positive dit quoi FAIRE plutôt que quoi NE PAS faire. « Est-ce que tu pourrais parler plus doucement ? » est plus clair que « Arrête de faire autant de bruit ». La formulation positive aide l'autre à comprendre l'action que tu demandes.",
      },
      {
        question: "Que faire si quelqu'un refuse ta demande ?",
        options: [
          'Le punir ou lui retirer ton affection',
          "Écouter ses besoins et chercher d'autres stratégies pour répondre aux tiens",
          'Répéter la même demande encore et encore',
          "En conclure qu'il ne tient pas à toi",
        ],
        explanation:
          "En CNV, un refus est une occasion de dialoguer. Tu écoutes les besoins et les contraintes de l'autre, puis vous cherchez ensemble d'autres façons de répondre à tes besoins.",
      },
      {
        question: 'Quelle phrase est le meilleur exemple de demande en CNV ?',
        options: [
          'Il faut que tu sois plus responsable',
          "Arrête d'être aussi désordonné",
          "Est-ce que tu serais d'accord pour mettre tes vêtements sales dans le panier à linge quand tu te changes ?",
          'Tu ne penses jamais aux autres',
        ],
        explanation:
          "Cette demande est concrète (mettre les vêtements sales dans le panier), précise sur l'action, commence par « est-ce que tu serais d'accord » (ce qui laisse la place à un refus) et ne contient ni reproche ni jugement.",
      },
    ],
  },
  integration: {
    title: 'Tout assembler',
    description:
      'Réunis les quatre éléments en un seul message, et vois comment il transforme un vrai conflit.',
    content:
      "Ensemble, les quatre éléments forment un seul message : quand j'ai vu ceci, j'ai ressenti cela, parce que j'ai besoin de ceci. Est-ce que tu serais d'accord pour faire cela ? Dans une vraie conversation, ils arrivent rarement d'un seul souffle, et ce n'est pas nécessaire. Connaître la forme complète t'aide à remarquer quel élément manque encore.",
    examples: [
      {
        title: 'Une expression complète en CNV',
        scenario: 'Ton ou ta partenaire ne participe pas aux tâches ménagères.',
        giraffResponse:
          "Quand je vois la vaisselle s'empiler dans l'évier, je suis à bout et je ressens de la rancœur, parce que j'ai besoin de coopération et d'un vrai partage des responsabilités. Est-ce que tu serais d'accord pour t'occuper de la vaisselle avec moi après le dîner ?",
        jackalResponse:
          "Tu ne m'aides jamais. Tu es paresseux et tu ne penses qu'à toi. Il serait temps que tu fasses ta part.",
        explanation:
          "La réponse girafe contient une observation (la vaisselle dans l'évier), un sentiment (être à bout), un besoin (la coopération) et une demande (s'occuper de la vaisselle ensemble). La réponse chacal accumule jugements, reproches et exigences.",
      },
      {
        title: "L'empathie dans le conflit",
        scenario: "Quelqu'un s'est mis sur la défensive après une remarque de ta part.",
        giraffResponse:
          "Je me demande si tu te sens blessé, ou un peu sur la défensive. Notre relation compte pour moi, et j'aimerais te parler d'une façon qui t'aide à te sentir compris. Est-ce que tu accepterais qu'on en parle ?",
        jackalResponse: "Pourquoi tu es si susceptible ? Ce n'est pas grave.",
        explanation:
          "La réponse girafe montre de l'empathie et de la curiosité pour les sentiments de l'autre. La réponse chacal balaie et minimise.",
      },
    ],
    questions: [
      {
        question:
          'Quelle phrase contient les 4 éléments de la CNV (observation, sentiment, besoin, demande) ?',
        options: [
          "Tu ne m'écoutes jamais et tu te fiches de ce que je ressens.",
          "Quand tu me coupes la parole, je ressens de la frustration, parce que l'écoute compte beaucoup pour moi. Est-ce que tu serais d'accord pour me laisser finir ?",
          "J'ai l'impression que tu ne me respectes pas. Il faut que tu changes.",
          'Tu es égoïste et impoli.',
        ],
        explanation:
          "Cette phrase contient une observation (tu me coupes la parole), un sentiment (la frustration), un besoin (l'écoute) et une demande (me laisser finir). Les quatre piliers sont là.",
      },
      {
        question: "Dans une expression complète en CNV, qu'est-ce qui vient APRÈS le besoin ?",
        options: [
          "Accuser l'autre",
          "Répéter l'observation",
          'Formuler une demande claire',
          'Juger son caractère',
        ],
        explanation:
          "L'enchaînement complet de la CNV est : observation, sentiment, besoin, demande. La demande vient en dernier et porte sur une action concrète.",
      },
      {
        question: "À quoi sert la demande à la fin d'une expression complète en CNV ?",
        options: [
          "À exiger que l'autre t'obéisse",
          'À proposer une action précise qui pourrait répondre à ton besoin, tout en respectant sa liberté de dire non',
          "À culpabiliser l'autre",
          'À prouver que tu as raison',
        ],
        explanation:
          "En CNV, la demande propose une action concrète qui pourrait aider à répondre à ton besoin, tout en laissant l'autre libre de refuser. C'est une invitation à coopérer, pas une contrainte.",
      },
      {
        question:
          "Comment traduire cette phrase chacal en une expression complète en CNV ? « Tu es toujours en retard, c'est irresponsable. »",
        options: [
          "Tu es quelqu'un de mal, à toujours être en retard.",
          "Quand tu arrives un quart d'heure après l'heure convenue, je ressens de l'anxiété, parce que la fiabilité et le respect comptent pour moi. Est-ce que tu serais d'accord pour m'appeler quand tu as du retard ?",
          "Arrête d'être irresponsable.",
          'Tu ne respectes jamais mon temps.',
        ],
        explanation:
          "Cette phrase contient une observation précise (un quart d'heure de retard), une émotion (l'anxiété), un besoin universel (la fiabilité, le respect) et une demande concrète (appeler en cas de retard).",
      },
      {
        question:
          "Qu'est-ce qui distingue une expression complète en CNV d'un simple accès de colère ou de frustration ?",
        options: [
          'Elle est plus longue et plus compliquée',
          'Elle exprime les quatre éléments et vise la compréhension plutôt que le reproche',
          "Elle fait que l'autre se sent encore plus mal",
          'Elle est plus dure et plus exigeante',
        ],
        explanation:
          'Une expression complète en CNV dépasse le reproche pour aller vers la compréhension mutuelle, en nommant clairement observations, sentiments, besoins et demandes. Elle ouvre le dialogue au lieu de le fermer.',
      },
      {
        question: 'Laquelle de ces phrases est une expression complète et bienveillante en CNV ?',
        options: [
          "Tu es égoïste, tu ne penses qu'à toi.",
          "Quand je n'ai pas de nouvelles de toi pendant plusieurs jours, j'ai de la peine et je me sens loin de toi, parce que l'amitié et la proximité comptent pour moi. Est-ce que tu serais d'accord pour me donner des nouvelles plus souvent ?",
          'Il faut que tu prennes davantage soin de notre amitié.',
          'Tu es vraiment un mauvais ami.',
        ],
        explanation:
          "Cette phrase contient tous les éléments : une observation (pas de nouvelles pendant plusieurs jours), des sentiments (la peine, le sentiment d'éloignement), des besoins (l'amitié, la proximité) et une demande (donner des nouvelles plus souvent). Elle invite au dialogue et à la compréhension.",
      },
    ],
  },
}
