import type { ScenarioTranslationTable } from '.'

export const es: ScenarioTranslationTable = {
  'Colleague Feedback': {
    title: 'La crítica de un compañero',
    description:
      'Un compañero te criticó en plena reunión de equipo y te tomó por sorpresa. Practica cómo expresar lo que sientes sin culpar.',
    situation: `En la reunión diaria del equipo, Javier dijo: «Tu proceso de revisión de código es demasiado lento. Está frenando a todo el equipo».

Sentiste vergüenza y te dolió que lo dijera delante de todos. Esta es tu oportunidad de responderle a Javier y expresar cómo te sentiste, qué necesitas y qué podría funcionar mejor de aquí en adelante.`,
    characterName: 'Javier',
    characterPersonality:
      'Directo y detallista, valora la eficiencia y la sinceridad, no busca herir a nadie',
    characterBackground:
      'Jefe de proyecto muy orientado a resultados. Suele poner la productividad por delante de cómo se sienten los demás.',
    characterHiddenNeeds: [
      'Respeto por su forma directa de hablar',
      'Eficiencia en el trabajo en equipo',
      'Que se entienda que tenía buena intención',
    ],
    aiOpeningMessage:
      'Mira, solo te estaba dando una opinión sincera. Ya sabes que yo siempre voy de frente. ¿Te molestó algo de lo que dije?',
  },
  'Family Responsibility Conflict': {
    title: 'El reparto de tareas en casa',
    description:
      'Te frustra que tu hermano no ayude con las tareas de la casa como prometió. Aprende a expresar tus necesidades sin acusar.',
    situation: `Tu hermano Daniel y tú acordaron repartirse las tareas de la casa a partes iguales. El fin de semana pasado hiciste casi toda la limpieza mientras Daniel decía que estaba muy ocupado.

Hoy ves que la cocina está otra vez desordenada y Daniel está descansando en el sofá. Sientes frustración y quieres hablarlo. Esta es tu oportunidad de expresar lo que observas y cómo te afecta.`,
    characterName: 'Daniel',
    characterPersonality:
      'Muy ocupado con el trabajo, se siente culpable por no ayudar, puede ponerse a la defensiva si lo atacan, le importa su familia',
    characterBackground:
      'Daniel asumió hace poco más responsabilidades en el trabajo y le cuesta llegar a todo. Se siente desbordado y a veces se cierra cuando lo confrontan.',
    characterHiddenNeeds: [
      'Comprensión por su carga de trabajo',
      'No sentirse culpado ni avergonzado',
      'Apoyo en lugar de crítica',
    ],
    aiOpeningMessage:
      'Oye, ya sé que no he hecho mucho en casa últimamente. Es que he tenido muchísimo trabajo. ¿No podemos hablarlo cuando esté menos estresado?',
  },
  'Friend Canceled Plans': {
    title: 'Tu amiga cancela otra vez',
    description:
      'Tu amiga volvió a cancelar sus planes a última hora. Practica cómo expresar tu decepción sin dejar de escuchar con curiosidad.',
    situation: `Habías quedado con Laura esta noche para ir al cine y cenar algo. Una hora antes, Laura te escribió: «Oye, lo siento muchísimo, me surgió algo en el trabajo. ¿Lo dejamos para otro día?»

Es la tercera vez en dos meses que Laura cancela. Sientes decepción y te duele, pero también te importa la amistad. Quieres expresarle cómo te afecta que esto se repita, con apertura para entender qué le está pasando.`,
    characterName: 'Laura',
    characterPersonality:
      'Sincera y cariñosa, tiene una agenda caótica, a veces se compromete con más cosas de las que puede, le cuesta organizarse',
    characterBackground:
      'Laura hace malabares entre un trabajo muy exigente y sus compromisos personales. Valora muchísimo la amistad, pero le cuesta decir que no y organizar su tiempo.',
    characterHiddenNeeds: [
      'Comprensión y aceptación',
      'No ser abandonada por sus dificultades',
      'Espacio para no ser perfecta',
    ],
    aiOpeningMessage:
      'Oye, lo siento muchísimo, me surgió algo en el trabajo. Me siento muy mal. Sé que siempre te hago lo mismo... ¿me odias?',
  },
  'Romantic Partner Emotional Distance': {
    title: 'Distancia en la pareja',
    description:
      'Tu pareja lleva semanas con distancia emocional. Afronta esta conversación delicada desde la vulnerabilidad y la curiosidad, sin dejar de lado tus propias necesidades.',
    situation: `Durante las últimas tres semanas, tu pareja, Andrea, se ha mostrado retraída. Pasa mucho tiempo con el móvil, se acuesta antes de lo habitual y apenas conversa contigo. Cuando intentas contarle cómo te fue el día, responde con pocas palabras y parece distraída.

Anoche sentiste soledad aunque estaban en la misma habitación. Te das cuenta de que hace semanas que no tienen una conversación de verdad ni contacto físico cariñoso. Quieres expresarle cómo te está afectando, con curiosidad por lo que ella está viviendo.`,
    characterName: 'Andrea',
    characterPersonality:
      'Cariñosa pero evitativa, tiende a retraerse cuando está estresada, le importa mucho la relación pero le cuesta expresar lo que siente',
    characterBackground:
      'Hace poco asumió un proyecto muy exigente en el trabajo. Suele cerrarse cuando se siente desbordada. Le preocupa que la relación se esté rompiendo, pero no sabe cómo arreglarlo.',
    characterHiddenNeeds: [
      'Espacio y comprensión en momentos de estrés',
      'Saber que la quieren aunque se haya alejado',
      'Ayuda para manejar su propio agobio',
      'Conexión sin presión',
    ],
    aiOpeningMessage:
      'No sé qué decirte... Sé que te has dado cuenta de que estoy distante. Es que ahora mismo tengo muchas cosas encima.',
  },
  'Workplace Boundary with Boss': {
    title: 'Poner límites a tu jefa',
    description:
      'Tu jefa espera que trabajes los fines de semana. Defiende tus límites con profesionalidad sin dañar la relación de trabajo.',
    situation: `Tu jefa, Patricia, te pidió que trabajes el domingo para terminar una presentación. Es el tercer fin de semana seguido que se espera que trabajes. Te encanta tu trabajo y quieres hacerlo bien, pero también valoras tener tiempo para ti y para tu familia.

Decides que necesitas tener esta conversación. Quieres expresar tus límites con claridad y mostrar a la vez tu compromiso con el trabajo.`,
    characterName: 'Patricia',
    characterPersonality:
      'Ambiciosa y orientada a resultados, no pretende pasar por encima de los límites de nadie pero sus expectativas no son claras, trabaja sin parar',
    characterBackground:
      'Directora con experiencia que llegó a donde está estando siempre disponible. Sin darse cuenta, espera lo mismo de su equipo. Tiene buenas intenciones, pero le cuesta poner límites.',
    characterHiddenNeeds: [
      'Que el proyecto salga bien y recibir reconocimiento',
      'Respeto por su liderazgo',
      'Eficiencia y fiabilidad en su equipo',
      'Que no la vean como alguien exigente',
    ],
    aiOpeningMessage:
      'Ya sé que es fin de semana, pero de verdad necesito que pulas esa presentación. El lunes presentamos la propuesta y es clave. Eres la mejor persona que tengo para esto.',
  },
  "Friend's Hurtful Comment About Your Appearance": {
    title: 'Un comentario sobre tu físico',
    description:
      'Una amiga cercana hizo un comentario poco delicado sobre tu aspecto. Habla de lo que te dolió, dándole el beneficio de la duda.',
    situation: `Ayer, delante de otros amigos, Lucía te dijo: «Te veo con unos kilos de más desde la última vez, ¿eh?» Te dolió y sentiste vergüenza. Lo dijo como quien comenta el tiempo, pero se te quedó grabado.

Valoras esta amistad y no crees que Lucía quisiera ser cruel, pero necesitas que entienda por qué te afectó ese comentario. Quieres hablarlo sin cerrarte y sin atacarla.`,
    characterName: 'Lucía',
    characterPersonality:
      'Franca y auténtica, dice las cosas sin filtro, te quiere pero no siempre lee bien las situaciones, se pone a la defensiva ante las críticas',
    characterBackground:
      'Siempre ha dicho lo primero que se le pasa por la cabeza. Cree que la sinceridad es lo mejor en cualquier caso. No se da cuenta de cuánto afectan a la gente los comentarios sobre su aspecto.',
    characterHiddenNeeds: [
      'Que la acepten tal como es',
      'Que la amistad siga siendo fuerte',
      'No ser atacada por su sinceridad',
      'Entender por qué esto importa',
    ],
    aiOpeningMessage:
      'Ay, por favor, solo fue un comentario. No lo dije con mala intención. Para mí sigues estando genial, solo estaba siendo sincera contigo.',
  },
  'Parent Critical of Your Life Choices': {
    title: 'Tu padre cuestiona tus decisiones',
    description:
      'Tu padre cuestiona tu decisión profesional. Defiende tu autonomía y cuida a la vez la relación.',
    situation: `Tu padre, Antonio, sigue cuestionando tu decisión de dejar tu trabajo en una gran empresa por algo con más sentido, aunque menos estable. En una conversación reciente te dijo: «No entiendo por qué vas a tirar por la borda tu estabilidad por el sueño de una startup. Me preocupa tu futuro».

Llevas meses escuchando esta crítica de distintas maneras. Quieres que entienda y respete tu decisión, y también hablar de lo que sientes cuando no notas su apoyo.`,
    characterName: 'Antonio',
    characterPersonality:
      'Bienintencionado pero controlador, se preocupa en exceso, actúa por amor pero le cuesta respetar tu independencia',
    characterBackground:
      'Viene de una generación en la que la seguridad laboral lo era todo. Renunció a sus propios sueños y quiere algo mejor para ti. Le cuesta aceptar que tus valores sean distintos.',
    characterHiddenNeeds: [
      'Tranquilidad de que vas a estar bien',
      'Sentirse respetado y escuchado',
      'Saber que su sacrificio valió la pena',
      'Formar parte de tus decisiones importantes',
    ],
    aiOpeningMessage:
      'Es que no entiendo por qué dejarías un trabajo estable. Me preocupa que te estés equivocando. Tendrías que haberme hecho caso.',
  },
  'Team Member Undermining You at Work': {
    title: 'Un compañero se apropia de tus ideas',
    description:
      'Un compañero se atribuye tus ideas en las reuniones. Maneja esta situación profesional compleja con las dos partes presentes.',
    situation: `En la reunión de dirección de hoy propusiste una función innovadora para el producto. Momentos después, Diego, tu compañero, la presentó en el chat del grupo como si fuera idea suya, con algunos cambios menores, como un concepto propio.

Es la tercera vez este mes. Sientes rabia y que tu trabajo pasa desapercibido, pero también trabajan juntos todos los días. Necesitas abordarlo de forma directa y clara, sin perder la posibilidad de seguir trabajando juntos.`,
    characterName: 'Diego',
    characterPersonality:
      'Competitivo e inseguro, brillante pero se siente amenazado por los compañeros talentosos, ambicioso y dispuesto a saltarse algunas reglas para ascender',
    characterBackground:
      'Viene de un entorno difícil y está decidido a salir adelante. Usa las ideas de otros porque se siente inseguro de las suyas. No lo ve como algo malo porque cree que las mejora.',
    characterHiddenNeeds: [
      'Reconocimiento por sus aportes',
      'Seguridad en su puesto',
      'Sentirse valorado y respetado',
      'No quedar en evidencia ni sentir vergüenza',
      'Crecimiento profesional',
    ],
    aiOpeningMessage:
      'No sé de qué hablas. Yo siempre reconozco el trabajo del equipo. Y la verdad, yo también aporté a esas ideas. ¿Por qué lo conviertes en algo personal?',
  },
  'Navigating Different Parenting Styles with Co-Parent': {
    title: 'Dos formas de criar',
    description:
      'Tú y Marta, con quien compartes la crianza de tu hijo, no están de acuerdo en cómo poner disciplina. Habla de sus valores distintos poniendo primero el bienestar de su hijo.',
    situation: `Has notado que a tu hijo le angustia equivocarse en el colegio. Cuando algo le sale mal, se cierra emocionalmente. Marta, con quien compartes la crianza, cree que hace falta una disciplina firme, pero tú has visto que tu hijo responde mejor cuando se le comprende y se buscan soluciones juntos.

Te cansa ser siempre quien «consiente» mientras a Marta se le reconoce el mérito de la disciplina. Necesitas tener una conversación de verdad sobre sus valores distintos y encontrar un camino que funcione para ti, para Marta y para su hijo.`,
    characterName: 'Marta',
    characterPersonality:
      'Estilo de crianza autoritario, cree en las consecuencias y la disciplina, quiere respeto y obediencia, se pone a la defensiva con sus decisiones como madre',
    characterBackground:
      'Se crió en una casa muy estricta y cree que eso la hizo fuerte. Le frustra el comportamiento de su hijo y siente que no recibe apoyo del otro progenitor. Ve la suavidad como debilidad.',
    characterHiddenNeeds: [
      'Respeto por sus valores y su forma de hacer las cosas',
      'Que su hijo salga adelante y tenga disciplina',
      'Que el otro progenitor respalde su autoridad',
      'Sentirse una buena madre',
      'El respeto y la obediencia de su hijo',
    ],
    aiOpeningMessage:
      'Tu forma de criar es demasiado blanda. Los niños necesitan consecuencias, si no, se nos suben a la cabeza. Estoy cansada de ser siempre la mala de la película.',
  },
}
