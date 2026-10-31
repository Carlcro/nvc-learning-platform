import type { ScenarioTranslationTable } from '.'

export const fr: ScenarioTranslationTable = {
  'Colleague Feedback': {
    title: "La remarque d'un collègue",
    description:
      "Ton collègue t'a fait une critique en pleine réunion d'équipe et tu ne l'as pas vue venir. Entraîne-toi à exprimer ce que tu ressens sans faire de reproches.",
    situation: `Pendant le point d'équipe de ce matin, Julien a dit : « Tes relectures de code sont trop lentes. Ça bloque toute l'équipe. »

Tu as ressenti de la gêne et de la peine que ce soit dit devant tout le monde. C'est le moment de répondre à Julien et de lui dire ce que tu as ressenti, ce dont tu as besoin, et ce qui pourrait mieux marcher à l'avenir.`,
    characterName: 'Julien',
    characterPersonality:
      "Direct et attentif aux détails, tient à l'efficacité et aux retours francs, ne cherche pas à blesser",
    characterBackground:
      "Chef de projet tourné vers les résultats. A tendance à faire passer la productivité avant l'attention aux émotions.",
    characterHiddenNeeds: [
      'Respect pour sa franchise',
      "Efficacité dans le travail d'équipe",
      'Être compris dans ses bonnes intentions',
    ],
    aiOpeningMessage:
      "Écoute, je t'ai juste fait un retour honnête. Tu sais que je dis toujours les choses comme elles sont. Il y a un souci avec ce que j'ai dit ?",
  },
  'Family Responsibility Conflict': {
    title: 'Le partage des tâches en famille',
    description:
      "Ton frère ne participe pas aux tâches ménagères comme il l'avait promis, et ça t'agace. Apprends à exprimer tes besoins sans accuser.",
    situation: `Avec ton frère Thomas, vous vous étiez mis d'accord pour partager les tâches ménagères à égalité. Le week-end dernier, tu as fait presque tout le ménage pendant que Thomas disait qu'il était trop occupé.

Aujourd'hui, tu vois que la cuisine est de nouveau en désordre et que Thomas se repose sur le canapé. Tu ressens de la frustration et tu as envie d'en parler. C'est le moment d'exprimer ce que tu observes et l'effet que ça a sur toi.`,
    characterName: 'Thomas',
    characterPersonality:
      "Débordé par son travail, se sent coupable de ne pas aider, peut se braquer s'il se sent attaqué, tient à sa famille",
    characterBackground:
      "Thomas a récemment pris des responsabilités en plus au travail et a du mal à tout concilier. Il se sent submergé et se ferme parfois quand on le met face aux choses.",
    characterHiddenNeeds: [
      'Compréhension pour sa charge de travail',
      'Ne pas être blâmé ni mis en honte',
      'Du soutien plutôt que des critiques',
    ],
    aiOpeningMessage:
      "Oui, je sais, j'ai pas trop assuré pour le ménage. J'ai juste eu énormément de trucs au boulot. On peut pas en parler quand je serai moins stressé ?",
  },
  'Friend Canceled Plans': {
    title: 'Une amie annule encore',
    description:
      "Ton amie a encore annulé votre soirée à la dernière minute. Entraîne-toi à exprimer ta déception tout en gardant de l'ouverture et de la curiosité.",
    situation: `Tu devais retrouver Camille ce soir pour aller au cinéma et dîner ensemble. Une heure avant le rendez-vous, Camille t'a envoyé un message : « Je suis vraiment désolée, j'ai un imprévu au boulot. On peut décaler ? »

C'est la troisième fois en deux mois que Camille annule. Tu ressens de la déception et de la peine, mais tu tiens aussi à cette amitié. Tu veux lui dire l'effet que ça te fait quand ça se répète, tout en restant à l'écoute de ce qui se passe pour elle.`,
    characterName: 'Camille',
    characterPersonality:
      "Sincère et attentionnée, emploi du temps chaotique, en prend parfois trop sur elle, a du mal à s'organiser",
    characterBackground:
      "Camille jongle entre un travail prenant et ses engagements personnels. Elle tient énormément à cette amitié mais a du mal à dire non et à gérer son temps.",
    characterHiddenNeeds: [
      'Compréhension et acceptation',
      'Ne pas être laissée tomber à cause de ses difficultés',
      "Avoir le droit d'être imparfaite",
    ],
    aiOpeningMessage:
      "Je suis vraiment désolée, j'ai eu un imprévu au boulot. Je m'en veux trop. Je sais que je te fais le coup à chaque fois... tu m'en veux à mort, c'est ça ?",
  },
  'Romantic Partner Emotional Distance': {
    title: 'De la distance dans le couple',
    description:
      'Depuis des semaines, ton compagnon est distant. Aborde cette conversation délicate avec vulnérabilité et curiosité, sans perdre de vue tes propres besoins.',
    situation: `Depuis trois semaines, ton compagnon Antoine est en retrait. Il passe du temps sur son téléphone, se couche plus tôt que d'habitude et participe à peine aux conversations avec toi. Quand tu essaies de lui raconter ta journée, il répond en quelques mots et semble ailleurs.

Hier soir, tu as ressenti de la solitude alors que vous étiez dans la même pièce. Tu te rends compte que vous n'avez pas eu de vraie conversation ni de gestes tendres depuis des semaines. Tu veux lui dire l'effet que ça a sur toi, tout en restant à l'écoute de ce qu'il traverse.`,
    characterName: 'Antoine',
    characterPersonality:
      "Aimant mais fuyant, se replie sur lui quand il est stressé, tient profondément à la relation mais a du mal à exprimer ses émotions",
    characterBackground:
      "Vient de se lancer dans un projet très prenant au travail. A tendance à se fermer quand il est débordé. Il a peur que le couple aille mal mais ne sait pas comment arranger les choses.",
    characterHiddenNeeds: [
      "De l'espace et de la compréhension quand il est stressé",
      "Être rassuré sur le fait qu'il est aimé, même quand il prend de la distance",
      'Du soutien pour faire face à ce qui le submerge',
      'Du lien sans pression',
    ],
    aiOpeningMessage:
      "Je sais pas quoi te dire... Je sais que t'as remarqué que je suis distant. J'ai juste beaucoup de choses en ce moment.",
  },
  'Workplace Boundary with Boss': {
    title: 'Poser une limite à ta manager',
    description:
      'Ta manager compte sur toi pour travailler le week-end. Pose tes limites avec professionnalisme tout en préservant votre relation de travail.',
    situation: `Ta manager Nathalie t'a demandé de travailler dimanche pour finir une présentation. C'est le troisième week-end d'affilée où on attend de toi que tu travailles. Tu aimes ton travail et tu veux bien faire, mais tu tiens aussi à avoir du temps pour toi et pour ta famille.

Tu décides qu'il faut avoir cette conversation. Tu veux exprimer clairement tes limites tout en montrant que ton travail compte pour toi.`,
    characterName: 'Nathalie',
    characterPersonality:
      "Ambitieuse et tournée vers les résultats, ne cherche pas à piétiner les limites des autres mais ses attentes restent floues, travaille sans arrêt",
    characterBackground:
      "Manager expérimentée qui a gravi les échelons en étant toujours disponible. Attend sans s'en rendre compte la même chose de son équipe. Pleine de bonnes intentions, mais a du mal à poser des limites.",
    characterHiddenNeeds: [
      'Réussite du projet et reconnaissance',
      'Respect pour son rôle de manager',
      "Efficacité et fiabilité de la part de l'équipe",
      'Ne pas être vue comme exigeante',
    ],
    aiOpeningMessage:
      "Je sais que c'est le week-end, mais j'ai vraiment besoin que tu peaufines cette présentation. On pitche lundi et c'est crucial. T'es la personne sur qui je compte le plus pour ça.",
  },
  "Friend's Hurtful Comment About Your Appearance": {
    title: 'Une remarque blessante sur ton physique',
    description:
      "Une amie proche a fait une remarque maladroite sur ton apparence. Parle de ce qui t'a fait de la peine, tout en lui accordant le bénéfice du doute.",
    situation: `Hier, devant d'autres amis, Léa t'a dit : « T'as pris un peu de poids depuis la dernière fois, non ? » Sur le moment, tu as ressenti de la peine et de la gêne. Elle l'a dit l'air de rien, comme si elle parlait de la météo, mais ça ne t'a pas quitté.

Tu tiens à cette amitié et tu ne penses pas que Léa voulait être méchante, mais tu as besoin qu'elle comprenne pourquoi cette remarque t'a fait autant d'effet. Tu veux en parler sans te fermer ni l'attaquer.`,
    characterName: 'Léa',
    characterPersonality:
      "Cash et authentique, filtre peu ce qu'elle dit, tient à toi mais manque de tact, se braque quand on lui fait une remarque",
    characterBackground:
      "A toujours dit tout ce qui lui passe par la tête. Pense que l'honnêteté est toujours la meilleure solution. Ne se rend pas compte de l'effet que les remarques sur le physique ont sur les gens.",
    characterHiddenNeeds: [
      "Être acceptée telle qu'elle est",
      "Que l'amitié reste solide",
      'Ne pas être attaquée pour sa franchise',
      'Comprendre pourquoi ça compte',
    ],
    aiOpeningMessage:
      "Oh, arrête, j'ai juste dit ce que je voyais. C'était pas méchant. T'es toujours canon, j'étais juste honnête avec toi.",
  },
  'Parent Critical of Your Life Choices': {
    title: 'Un parent qui critique tes choix',
    description:
      'Ta mère remet en question ton choix de carrière. Préserve ton autonomie tout en prenant soin de votre relation.',
    situation: `Ta mère, Martine, continue de remettre en question ta décision de quitter ton poste en entreprise pour un travail qui a plus de sens, mais qui est moins stable. Lors d'une conversation récente, elle t'a dit : « Je comprends pas pourquoi tu lâches la sécurité pour un rêve de start-up. Je m'inquiète pour ton avenir. »

Ça fait des mois que tu entends ce genre de critiques, sous une forme ou une autre. Tu veux qu'elle comprenne et respecte ton choix, et aussi lui parler de ce que tu ressens face à son manque de soutien.`,
    characterName: 'Martine',
    characterPersonality:
      "Bien intentionnée mais contrôlante, s'inquiète énormément, agit par amour mais a du mal à respecter ton indépendance",
    characterBackground:
      "Vient d'une génération où la sécurité de l'emploi passait avant tout. A renoncé à ses propres rêves et veut mieux pour toi. A du mal à accepter que tes valeurs soient différentes des siennes.",
    characterHiddenNeeds: [
      'Être rassurée que tout ira bien pour toi',
      'Se sentir respectée et écoutée',
      'Savoir que ses sacrifices ont compté',
      'Faire partie de tes décisions importantes',
    ],
    aiOpeningMessage:
      "Je comprends vraiment pas pourquoi tu quittes un travail stable. J'ai peur que tu fasses une erreur. T'aurais dû m'écouter.",
  },
  'Team Member Undermining You at Work': {
    title: "Un collègue s'attribue tes idées",
    description:
      "Un collègue présente tes idées comme les siennes en réunion. Fais face à cette situation professionnelle délicate, en parlant directement avec lui.",
    situation: `Lors de la réunion de direction d'aujourd'hui, tu as proposé une nouvelle fonctionnalité innovante pour votre produit. Quelques minutes plus tard, Romain, ton collègue, l'a présentée sur le chat de groupe en y apportant de petites modifications, comme si c'était son idée.

C'est la troisième fois ce mois-ci. Tu es en colère et tu te sens invisible, mais vous travaillez ensemble tous les jours. Tu as besoin d'en parler directement et clairement, tout en préservant votre capacité à travailler ensemble.`,
    characterName: 'Romain',
    characterPersonality:
      "Compétitif et peu sûr de lui, brillant mais se sent menacé par les collègues doués, ambitieux et prêt à contourner les règles pour avancer",
    characterBackground:
      "A grandi dans un milieu difficile et est déterminé à réussir. Reprend les idées des autres parce qu'il manque de confiance dans les siennes. N'y voit rien de mal, puisqu'il y ajoute sa touche.",
    characterHiddenNeeds: [
      'Reconnaissance pour ses contributions',
      'Sécurité quant à sa place',
      'Être valorisé et respecté',
      'Ne pas être exposé ni humilié',
      'Évolution professionnelle',
    ],
    aiOpeningMessage:
      "Je vois pas de quoi tu parles. Je cite toujours l'équipe. Et franchement, j'ai contribué à ces idées, moi aussi. Pourquoi tu ramènes tout à toi ?",
  },
  'Navigating Different Parenting Styles with Co-Parent': {
    title: "Deux façons d'éduquer un enfant",
    description:
      "Ton coparent et toi n'êtes pas d'accord sur la façon de poser un cadre. Parlez de vos valeurs différentes en gardant le bien-être de votre enfant au centre.",
    situation: `Tu as remarqué que votre enfant a peur de faire des erreurs à l'école. Quand il se trompe, il se ferme complètement. Ton coparent, Stéphane, pense qu'une discipline ferme est indispensable, mais tu as constaté que votre enfant réagit mieux quand on cherche à le comprendre et à résoudre le problème avec lui.

Tu en as assez de te sentir le parent « laxiste » pendant que Stéphane a le mérite de la discipline. Tu as besoin d'avoir une vraie conversation sur vos valeurs différentes et de trouver une façon d'avancer qui vous convienne à tous les deux et à votre enfant.`,
    characterName: 'Stéphane',
    characterPersonality:
      "Style éducatif autoritaire, croit aux conséquences et à la discipline, attend du respect et de l'obéissance, se braque quand on remet en cause ses choix de parent",
    characterBackground:
      "A grandi dans une famille stricte et pense que ça l'a rendu fort. Frustré par le comportement de son enfant, il ne se sent pas soutenu par l'autre parent. Voit la douceur comme une faiblesse.",
    characterHiddenNeeds: [
      'Respect pour ses valeurs et sa façon de faire',
      "Que l'enfant s'en sorte bien et ait un cadre",
      "Que l'autre parent soutienne son autorité",
      "Se sentir un bon père",
      "Le respect et l'écoute de son enfant",
    ],
    aiOpeningMessage:
      "T'es beaucoup trop cool avec lui. Les enfants ont besoin de conséquences, sinon ils nous marchent dessus. J'en ai marre d'être toujours le méchant.",
  },
}
