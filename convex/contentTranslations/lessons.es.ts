import type { LessonTranslationTable } from '../lib/contentText'

export const lessonsEs: LessonTranslationTable = {
  introduction: {
    title: 'Introducción a la comunicación no violenta',
    description:
      'Qué es la CNV, de dónde viene y las cuatro piezas que te invita a llevar a un momento difícil.',
    content:
      'La comunicación no violenta (CNV) es una forma de hablar y escuchar que desarrolló el psicólogo Marshall Rosenberg. Parte de una idea sencilla: detrás de cada acción, incluso de las que hacen daño, hay una persona que intenta satisfacer una necesidad. Cuando dices lo que viste, cómo te sentiste, qué necesitas y qué te ayudaría, la otra persona tiene mucho menos de lo que defenderse.',
    examples: [
      {
        title: 'De la culpa a la comprensión',
        scenario:
          'Una amiga se olvidó de tu cumpleaños. Lo habitual sería reaccionar con rabia. Con la CNV, puedes expresar lo que sientes y lo que necesitas.',
        giraffResponse:
          'Cuando te olvidaste de mi cumpleaños, me dolió, porque celebrar y sentirme cerca de ti es importante para mí. ¿Te parecería bien que celebráramos el día en algún momento de esta semana?',
        jackalResponse:
          'No te importa nada. Siempre te olvidas de lo que es importante para mí.',
        explanation:
          'La respuesta jirafa expresa el sentimiento (dolor) y la necesidad (conexión) sin culpar. La respuesta chacal recurre al juicio y a la generalización.',
      },
    ],
    questions: [
      {
        question: '¿Qué representa la jirafa en la CNV?',
        options: [
          'Juzgar desde arriba y con rapidez',
          'La empatía y la comunicación compasiva',
          'El pensamiento abstracto',
          'Una comunicación depredadora',
        ],
        explanation:
          'En la CNV, la jirafa simboliza la empatía y la comunicación compasiva: tiene un corazón enorme y un cuello largo para ver la situación desde distintas perspectivas. El chacal representa la comunicación reactiva y defensiva.',
      },
      {
        question: '¿Cuál de estas frases es un ejemplo de lenguaje jirafa?',
        options: [
          'Eres muy irresponsable y no piensas en los demás.',
          'Cuando llegaste tarde, me preocupé, porque el respeto es importante para mí.',
          'Siempre cometes los mismos errores.',
          'Ya deberías saberlo.',
        ],
        explanation:
          'Esta frase usa la CNV: incluye una observación (llegaste tarde), un sentimiento (preocupación) y una necesidad (respeto), que son piezas centrales de la comunicación compasiva.',
      },
      {
        question: '¿Cuál es el objetivo PRINCIPAL de la comunicación no violenta?',
        options: [
          'Ganar las discusiones y salirte con la tuya',
          'Hacer que los demás se sientan culpables por lo que hacen',
          'Expresar tus necesidades y favorecer la comprensión mutua y la compasión',
          'Evitar cualquier conflicto a toda costa',
        ],
        explanation:
          'La CNV busca crear comprensión mutua y compasión: expresas tus necesidades con autenticidad y, al mismo tiempo, mantienes la empatía hacia las necesidades de la otra persona.',
      },
      {
        question: '¿Cuál de estos NO es uno de los 4 pilares de la CNV?',
        options: ['Observación', 'Juicio', 'Sentimiento', 'Petición'],
        explanation:
          'Los 4 pilares de la CNV son: observación, sentimiento, necesidad y petición. El juicio es justo lo que la CNV deja a un lado, y por eso las observaciones se mantienen libres de él.',
      },
      {
        question: '¿Cuál de estas frases es lenguaje chacal?',
        options: [
          'Me preocupé cuando no supe nada de ti.',
          '¿Te parecería bien llamarme mañana?',
          'Nunca piensas en nadie más que en ti.',
          'Ahora mismo, descansar es muy importante para mí.',
        ],
        explanation:
          '«Nunca piensas en nadie más que en ti» es un juicio envuelto en una generalización. Cada una de las otras tres aporta una pieza jirafa: un sentimiento, una petición y una necesidad.',
      },
    ],
  },
  observation: {
    title: 'Observar sin evaluar',
    description:
      'Cuenta lo que pasó tal como lo vería una cámara, para que la otra persona pueda escucharte sin ponerse en guardia.',
    content:
      'Una observación describe lo que pasó sin añadirle un veredicto. «Llegaste a casa a las once» es una observación. «Qué desconsiderado eres» es una evaluación, y las evaluaciones invitan a discutir si son ciertas en lugar de escuchar lo que necesitas.',
    examples: [
      {
        title: 'Hechos frente a juicios',
        scenario: 'Un compañero de trabajo entregó un proyecto tarde.',
        giraffResponse:
          'Entregaste el proyecto a las 17:00 y el plazo terminaba a las 15:00.',
        jackalResponse: 'Siempre llegas tarde con todo, eres un irresponsable.',
        explanation:
          'La respuesta jirafa describe el hecho que se puede observar. La respuesta chacal añade un juicio (siempre, irresponsable) en lugar de describir lo que pasó de verdad.',
      },
      {
        title: 'Cuanto más concreto, mejor',
        scenario: 'Alguien no contestó enseguida a tu mensaje.',
        giraffResponse:
          'Te escribí a mediodía y no recibí respuesta hasta la noche.',
        jackalResponse: 'Nunca contestas a mis mensajes.',
        explanation:
          'La respuesta jirafa es concreta y se ciñe a los hechos. La respuesta chacal usa «nunca», que es una generalización.',
      },
    ],
    questions: [
      {
        question:
          '¿Cuál es la diferencia clave entre una observación y un juicio?',
        options: [
          'Las observaciones siempre son positivas y los juicios siempre son negativos',
          'Las observaciones describen hechos observables sin evaluarlos, y los juicios incluyen interpretación y evaluación',
          'Las observaciones son para la gente buena y los juicios para la gente mala',
          'No hay ninguna diferencia entre ellos',
        ],
        explanation:
          'Una observación expresa lo que puedes ver, oír o vivir sin interpretarlo. Un juicio añade evaluación, culpa o interpretación a lo que observas.',
      },
      {
        question: '¿Cuál de estas frases es una observación pura, SIN juicio?',
        options: [
          'Siempre lo tienes todo hecho un desastre',
          'Esta semana dejaste los zapatos junto a la puerta tres veces',
          'Eres un irresponsable con tus cosas',
          'Nunca guardas nada',
        ],
        explanation:
          'Es un hecho concreto y observable, con un marco de tiempo. Las demás usan generalizaciones («siempre», «nunca») o juicios («desastre», «irresponsable»).',
      },
      {
        question: 'Según la CNV, ¿qué conviene evitar en una observación?',
        options: [
          'Dar demasiados detalles',
          'Usar números o medidas',
          'Generalizaciones como «siempre», «nunca» o «constantemente»',
          'Describir con exactitud lo que pasó',
        ],
        explanation:
          'Las generalizaciones distorsionan la observación y la hacen sonar a juicio. Una observación pura evita palabras como «siempre», «nunca», «constantemente» y otras afirmaciones absolutas.',
      },
      {
        question:
          '¿Cómo conviene expresar una observación sobre el comportamiento de alguien?',
        options: [
          'A partir de lo que piensas de su carácter',
          'Con lo que ves, oyes o vives directamente, sin interpretarlo',
          'A partir de patrones pasados, para predecir lo que hará',
          'A partir de lo que te han contado otras personas',
        ],
        explanation:
          'Una observación se basa en lo que percibes directamente, lo que de verdad ves u oyes, sin añadir tu interpretación ni un juicio sobre su carácter.',
      },
      {
        question:
          '¿Qué frase sigue mejor el pilar de la observación en la CNV?',
        options: [
          'Cuando veo que pones los ojos en blanco, doy por hecho que no me respetas',
          'Cuando pones los ojos en blanco mientras hablo, me duele, porque el respeto es importante para mí',
          'Siempre pones los ojos en blanco con todo lo que digo, y eso es una falta de respeto',
          'Creo que eres muy crítico porque pones los ojos en blanco',
        ],
        explanation:
          'Esta frase separa bien la observación (pones los ojos en blanco) del sentimiento (dolor), sin añadir juicios ni interpretaciones sobre el carácter o las intenciones de la otra persona.',
      },
    ],
  },
  feeling: {
    title: 'Reconocer y expresar sentimientos',
    description:
      'Nombra la emoción en sí, y date cuenta de cuándo un pensamiento sobre la otra persona se disfraza de sentimiento.',
    content:
      'Un sentimiento es una emoción que notas en ti: tristeza, alegría, inquietud, alivio. Muchas frases que empiezan con «siento» son en realidad pensamientos sobre otra persona, como «siento que me ignoras» o «siento que no te importo». Nombrar la emoción en sí hace que siga siendo tuya, y a la otra persona le resulta más fácil seguir escuchándote.',
    examples: [
      {
        title: 'Sentimientos reales y pseudosentimientos',
        scenario: 'Alguien no te invitó a un evento.',
        giraffResponse: 'Siento tristeza, y me duele haberme quedado fuera.',
        jackalResponse: 'Siento que no me valoras.',
        explanation:
          '«Siento que...» introduce un pensamiento, no un sentimiento. La respuesta jirafa nombra emociones reales.',
      },
      {
        title: 'Hazte cargo de tus sentimientos',
        scenario: 'Alguien te interrumpió.',
        giraffResponse: 'Sentí frustración cuando me interrumpiste.',
        jackalResponse: 'Me hiciste sentir rabia al interrumpirme.',
        explanation:
          'La respuesta jirafa asume el sentimiento como propio. La respuesta chacal culpa a la otra persona de provocarlo.',
      },
    ],
    questions: [
      {
        question:
          '¿Cuál es la principal diferencia entre un sentimiento y un pseudosentimiento?',
        options: [
          'Los sentimientos siempre son más intensos que los pseudosentimientos',
          'Los sentimientos son emociones reales, y los pseudosentimientos contienen pensamientos o juicios',
          'Los pseudosentimientos son más importantes en la CNV',
          'En realidad no hay ninguna diferencia entre ellos',
        ],
        explanation:
          'Los sentimientos genuinos son emociones como la alegría, la tristeza, la ansiedad o la rabia. Los pseudosentimientos, como «siento que me rechazan» o «siento que me han traicionado», son en realidad pensamientos o interpretaciones sobre lo que otras personas piensan de ti.',
      },
      {
        question:
          '¿Cuál de estas frases expresa un sentimiento genuino (y no un pseudosentimiento)?',
        options: [
          'Siento que no te importo',
          'Siento ansiedad y preocupación',
          'Siento que estás siendo injusto',
          'Me siento como si nadie me respetara',
        ],
        explanation:
          'La ansiedad y la preocupación son emociones que puedes vivir de verdad. Las demás son pseudosentimientos, porque contienen juicios sobre lo que piensan o hacen los demás (no importarle a alguien, que te traten de forma injusta, que nadie te respete).',
      },
      {
        question: 'En la CNV, ¿cómo conviene expresar los sentimientos?',
        options: [
          'Culpando a la otra persona de provocarlos',
          'Haciéndote cargo de ellos sin culpar a nadie',
          'Dando por hecho que la otra persona ya sabe cómo te sientes',
          'Expresando solo los sentimientos agradables',
        ],
        explanation:
          'En la CNV, te haces cargo de tus sentimientos diciendo «me sentí triste» en lugar de «me pusiste triste». Eso te devuelve el poder y mantiene la conversación centrada en entenderse, no en culpar.',
      },
      {
        question: '¿Qué tiene de malo decir «me hiciste sentir rabia»?',
        options: [
          'Es gramaticalmente incorrecto',
          'La rabia no es un sentimiento real',
          'Le da a la otra persona poder sobre tus emociones y sugiere culpa',
          'Es demasiado directo',
        ],
        explanation:
          'Lo que hizo la otra persona puede haber despertado tu rabia, pero no te la «hizo» sentir. Tus sentimientos son tuyos. La CNV invita a hacerse cargo de las emociones: «siento rabia cuando...» en lugar de «me hiciste sentir rabia».',
      },
      {
        question:
          '¿Qué frase expresa los sentimientos de forma más auténtica según la CNV?',
        options: [
          'Siento que nunca me escuchas',
          'Me duele y siento decepción, porque la conexión es importante para mí',
          'Siempre me haces sentir ansiedad',
          'Siento que no me entiendes',
        ],
        explanation:
          'Esta frase nombra emociones genuinas (dolor, decepción), las asume como propias y las conecta con una necesidad (conexión). No culpa ni incluye juicios sobre la otra persona.',
      },
    ],
  },
  need: {
    title: 'Conectar los sentimientos con las necesidades',
    description:
      'Descubre lo que te importa debajo del sentimiento, y distínguelo de la estrategia para conseguirlo.',
    content:
      'Debajo de cada sentimiento hay una necesidad: algo que todas las personas compartimos, como el descanso, el respeto, la conexión o la seguridad. Una necesidad no es lo mismo que una estrategia, la forma concreta en que esperas satisfacerla. Nombrar la necesidad abre muchos caminos, mientras que aferrarse a una sola estrategia suele empezar un tira y afloja.',
    examples: [
      {
        title: 'Necesidad frente a estrategia',
        scenario: 'Quieres que tu pareja saque la basura.',
        giraffResponse:
          'Necesito respeto y sentir que el hogar que compartimos es responsabilidad de todos. ¿Podrías echarme una mano con las tareas de casa?',
        jackalResponse: 'Tienes que empezar a ayudar en casa.',
        explanation:
          'La respuesta jirafa identifica la necesidad de fondo (respeto, un hogar compartido). La respuesta chacal confunde la estrategia (que tu pareja saque la basura) con la necesidad.',
      },
      {
        title: 'Necesidades universales',
        scenario: 'Te molesta que alguien haya llegado tarde.',
        giraffResponse:
          'Sentí inquietud, porque la confianza y el respeto son importantes para mí.',
        jackalResponse: 'Tendrías que llegar siempre a tiempo.',
        explanation:
          'La respuesta jirafa conecta con necesidades universales (confianza, respeto). La respuesta chacal hace una exigencia sin expresar la necesidad que hay debajo.',
      },
    ],
    questions: [
      {
        question: '¿Cuál es la diferencia entre una necesidad y una estrategia?',
        options: [
          'Las necesidades son exigencias y las estrategias son peticiones',
          'Una necesidad es algo universal para todas las personas, y una estrategia es una forma concreta de satisfacerla',
          'Las estrategias son más importantes que las necesidades',
          'No hay ninguna diferencia entre ellas',
        ],
        explanation:
          'Una necesidad es algo fundamental para el bienestar humano (seguridad, conexión, respeto). Una estrategia es una acción concreta para satisfacerla. Por ejemplo, la conexión es una necesidad, y cenar juntos es una estrategia.',
      },
      {
        question:
          '¿Cuál de estas opciones es una necesidad universal (y no una estrategia)?',
        options: [
          'Tu pareja debería ayudar con las tareas de casa',
          'Tienes que escucharme más',
          'Autonomía y respeto',
          'Tienes que llegar a tiempo',
        ],
        explanation:
          'La autonomía y el respeto son necesidades humanas universales que compartimos todas las personas. Las demás son estrategias concretas o exigencias de un comportamiento determinado.',
      },
      {
        question:
          'Alguien cercano cancela un plan por tercera vez y sientes decepción. ¿Qué necesidad hay debajo?',
        options: [
          'Que deje de cancelar',
          'Confianza y conexión',
          'Una disculpa',
          'Que te avise antes la próxima vez',
        ],
        explanation:
          'La confianza y la conexión son necesidades que cualquier persona podría compartir. Las demás son estrategias, formas concretas de satisfacer esas necesidades, y muchas estrategias distintas podrían satisfacer la misma necesidad.',
      },
      {
        question: '¿Cuál es la mejor forma de descubrir tu necesidad de fondo?',
        options: [
          'Exigir que los demás satisfagan tus necesidades',
          'Mirar debajo de tus sentimientos para entender qué es importante para ti',
          'Dar por hecho que los demás saben lo que necesitas',
          'Expresar tus necesidades como exigencias',
        ],
        explanation:
          'En la CNV, descubres tus necesidades explorando qué es importante para ti debajo de lo que sientes. Pregúntate: «¿Qué quiero de verdad?» o «¿Qué es importante para mí en esta situación?».',
      },
      {
        question:
          '¿Qué frase conecta mejor un sentimiento con una necesidad universal?',
        options: [
          'Siento tristeza porque no ayudas con las tareas',
          'Me duele, porque el respeto y la responsabilidad compartida son importantes para mí',
          'Siento frustración porque tienes que cambiar',
          'Siento rabia porque nunca escuchas',
        ],
        explanation:
          'Esta frase identifica el sentimiento (dolor), lo conecta con necesidades universales (respeto, responsabilidad compartida) y evita culpar. Muestra lo que de verdad importa en lugar de centrarse en un comportamiento concreto.',
      },
    ],
  },
  request: {
    title: 'Hacer peticiones claras',
    description:
      'Pide una sola cosa concreta y posible, de forma que la otra persona quede libre para decir que no.',
    content:
      'Una petición pide una acción concreta que la otra persona podría hacer, expresada en términos de lo que quieres y no de lo que no quieres. Deja a la otra persona libre para decir que no. Si ese no recibe culpa o presión, en realidad era una exigencia desde el principio, y la gente suele notar la diferencia.',
    examples: [
      {
        title: 'Petición frente a exigencia',
        scenario: 'Quieres que alguien cercano escuche lo que te preocupa.',
        giraffResponse:
          '¿Te parecería bien escucharme un rato mientras te cuento lo que tengo en la cabeza?',
        jackalResponse: 'Deberían importarte mis problemas.',
        explanation:
          'La respuesta jirafa es una petición clara y concreta que se puede rechazar. La respuesta chacal es una exigencia disfrazada de expectativa.',
      },
      {
        title: 'Lenguaje en positivo',
        scenario: 'Quieres que alguien deje de interrumpirte.',
        giraffResponse: '¿Podrías esperar a que termine de hablar?',
        jackalResponse: 'Deja de interrumpirme.',
        explanation:
          'La respuesta jirafa pide una acción en positivo. La respuesta chacal usa lenguaje en negativo (lo que no hay que hacer).',
      },
    ],
    questions: [
      {
        question: '¿Cuál es el rasgo clave de una petición en la CNV?',
        options: [
          'Es una exigencia que los demás tienen que cumplir',
          'Pide una acción concreta y la otra persona puede decir que no',
          'Da por hecho que los demás saben lo que quieres',
          'Se centra en lo que la otra persona no debería hacer',
        ],
        explanation:
          'En la CNV, una petición no es una exigencia. Pide una acción concreta y posible, Y deja espacio para que la otra persona diga que no sin recibir juicios ni castigos.',
      },
      {
        question: '¿Cuál de estas frases es una petición clara y realizable?',
        options: [
          'Deja de llegar tarde',
          'Necesito que te importe más nuestra relación',
          '¿Podrías llamarme cuando vayas a llegar tarde?',
          'Tienes que escuchar mejor',
        ],
        explanation:
          'Esta petición es específica (llamar cuando vayas a llegar tarde), concreta (la persona sabe exactamente qué hacer) y se puede rechazar. Las demás son exigencias vagas o juicios.',
      },
      {
        question:
          '¿Por qué es importante usar lenguaje en positivo al hacer peticiones?',
        options: [
          'Porque la gente tiene que obedecer las peticiones en positivo',
          'Porque describe lo que quieres en lugar de lo que no quieres',
          'Porque suena más amable',
          'Porque no hace falta pensar',
        ],
        explanation:
          'Las peticiones en positivo dicen lo que SÍ hacer en lugar de lo que NO hacer. «Por favor, habla más bajo» es más claro que «Deja de hacer tanto ruido». El lenguaje en positivo ayuda a entender qué acción estás pidiendo.',
      },
      {
        question: '¿Qué puedes hacer si alguien dice que no a tu petición?',
        options: [
          'Castigarle o retirarle el cariño',
          'Escuchar sus necesidades y buscar otras estrategias para satisfacer las tuyas',
          'Repetir la misma petición una y otra vez',
          'Dar por hecho que no le importas',
        ],
        explanation:
          'En la CNV, un no es una oportunidad para dialogar. Escuchas las necesidades y los límites de la otra persona, y luego exploran juntos otras formas de satisfacer tus necesidades.',
      },
      {
        question: '¿Qué frase es el mejor ejemplo de una petición en la CNV?',
        options: [
          'Tienes que ser más responsable',
          'Deja de dejarlo todo tirado',
          '¿Te parecería bien echar la ropa sucia al cesto cuando te cambies?',
          'Nunca tienes en cuenta a nadie',
        ],
        explanation:
          'Esta petición es concreta (echar la ropa sucia al cesto), deja clara la acción, pregunta «¿te parecería bien...?» (dejando espacio para decir que no) y no incluye culpa ni juicios.',
      },
    ],
  },
  integration: {
    title: 'Unir todas las piezas',
    description:
      'Junta las cuatro piezas en un solo mensaje y descubre cómo cambia un conflicto real.',
    content:
      'Juntas, las cuatro piezas forman un solo mensaje: cuando vi esto, sentí esto, porque necesito esto. ¿Te parecería bien hacer esto? En las conversaciones reales casi nunca llegan todas de una vez, y no hace falta. Conocer la forma completa te ayuda a notar qué pieza falta todavía.',
    examples: [
      {
        title: 'Una expresión completa de CNV',
        scenario: 'Tu pareja no ayuda con las tareas de casa.',
        giraffResponse:
          'Cuando veo los platos amontonándose en el fregadero, me abruma y siento resentimiento, porque necesito que seamos un equipo y compartamos la responsabilidad. ¿Podrías encargarte de lavar los platos después de cenar?',
        jackalResponse:
          'Nunca me ayudas. Eres un egoísta y un desconsiderado. Ya va siendo hora de que hagas tu parte.',
        explanation:
          'La respuesta jirafa incluye una observación (los platos en el fregadero), un sentimiento (agobio, resentimiento), una necesidad (trabajo en equipo) y una petición (lavar los platos). La respuesta chacal recurre al juicio, la culpa y las exigencias.',
      },
      {
        title: 'Empatía en el conflicto',
        scenario: 'Alguien se puso a la defensiva cuando le diste tu opinión.',
        giraffResponse:
          'Me da la impresión de que quizá esto te ha dolido o te ha puesto a la defensiva. Me importa nuestra relación y quiero hablar de una manera que te ayude a sentir que te entiendo. ¿Te parece si hablamos de esto?',
        jackalResponse: '¿Por qué te pones así? Tampoco es para tanto.',
        explanation:
          'La respuesta jirafa muestra empatía y curiosidad por lo que siente la otra persona. La respuesta chacal le quita importancia y lo despacha.',
      },
    ],
    questions: [
      {
        question:
          '¿Qué frase incluye los 4 componentes de la CNV (observación, sentimiento, necesidad y petición)?',
        options: [
          'Nunca me escuchas y no te importa lo que siento.',
          'Cuando me interrumpes, siento frustración, porque para mí es importante que me escuchen. ¿Podrías dejarme terminar de hablar?',
          'Siento que no me respetas. Tienes que cambiar.',
          'Eres un desconsiderado y un maleducado.',
        ],
        explanation:
          'Esta frase incluye una observación (me interrumpes), un sentimiento (frustración), una necesidad (que me escuchen) y una petición (dejarme terminar de hablar). Están los cuatro pilares.',
      },
      {
        question:
          'En una expresión completa de CNV, ¿qué viene DESPUÉS de expresar tu necesidad?',
        options: [
          'Culpar a la otra persona',
          'Repetir la observación',
          'Hacer una petición clara',
          'Juzgar su carácter',
        ],
        explanation:
          'El orden de una expresión completa de CNV es: observación, sentimiento, necesidad y petición. La petición va al final y pide una acción concreta.',
      },
      {
        question:
          '¿Para qué sirve hacer una petición al final de una expresión completa de CNV?',
        options: [
          'Para exigir que la otra persona te obedezca',
          'Para pedir una acción concreta que podría satisfacer tu necesidad, respetando su libertad para decir que no',
          'Para que la otra persona se sienta culpable',
          'Para demostrar que tienes razón',
        ],
        explanation:
          'En la CNV, una petición propone una acción concreta que podría ayudar a satisfacer tu necesidad, y deja a la otra persona libre para decir que no. Busca colaborar, no forzar.',
      },
      {
        question:
          '¿Cómo traducirías esta frase chacal a una expresión completa de CNV? «Siempre llegas tarde, eres un irresponsable.»',
        options: [
          'Eres mala persona por llegar tarde.',
          'Cuando llegas 15 minutos después de la hora acordada, siento inquietud, porque la confianza y el respeto son importantes para mí. ¿Podrías llamarme si vas a llegar tarde?',
          'Deja de ser tan irresponsable.',
          'Nunca respetas mi tiempo.',
        ],
        explanation:
          'Esta frase ofrece una observación concreta (15 minutos tarde), una emoción (inquietud), una necesidad universal (confianza, respeto) y una petición concreta (llamar si vas a llegar tarde).',
      },
      {
        question:
          '¿Qué diferencia una expresión completa de CNV de simplemente expresar rabia o frustración?',
        options: [
          'Es más larga y complicada',
          'Expresa los cuatro componentes y se centra en entenderse, no en culpar',
          'Hace que la otra persona se sienta peor',
          'Es más contundente y exigente',
        ],
        explanation:
          'Una expresión completa de CNV va más allá de la culpa y busca la comprensión mutua, nombrando con claridad observaciones, sentimientos, necesidades y peticiones. Eso abre el diálogo en lugar de cerrarlo.',
      },
      {
        question:
          '¿Cuál de estas frases es una expresión de CNV completa y compasiva?',
        options: [
          'Eres un egoísta y nunca piensas en nadie más que en ti.',
          'Cuando pasan días sin saber de ti, me duele y te siento lejos, porque la amistad y la cercanía son importantes para mí. ¿Te parecería bien escribirme más a menudo?',
          'Tendrías que cuidar más nuestra amistad.',
          'Eres un pésimo amigo.',
        ],
        explanation:
          'Esta frase incluye todos los componentes: una observación (días sin contacto), un sentimiento (dolor, distancia), una necesidad (amistad, cercanía) y una petición (escribir más a menudo). Invita al diálogo y a la comprensión.',
      },
    ],
  },
}
