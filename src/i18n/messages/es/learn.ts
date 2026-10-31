import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('es')

export const learn: Messages['learn'] = {
  meta: {
    hub: {
      title: 'Lecciones',
      description:
        'Seis lecciones básicas sobre observaciones, sentimientos, necesidades y peticiones.',
    },
    introduction: {
      title: 'Introducción a la comunicación no violenta',
      description:
        'Qué es la comunicación compasiva y por qué cambia el rumbo de las conversaciones.',
    },
    observation: {
      title: 'Observar sin evaluar',
      description:
        'Describe lo que ves y oyes sin juzgarlo, el primer paso de la CNV.',
    },
    feeling: {
      title: 'Reconocer y expresar sentimientos',
      description:
        'Distingue los sentimientos reales de los pensamientos y nombra tus emociones con sinceridad.',
    },
    need: {
      title: 'Conectar los sentimientos con las necesidades',
      description:
        'Encuentra la necesidad humana universal que hay debajo de un sentimiento.',
    },
    request: {
      title: 'Hacer peticiones claras',
      description:
        'Pide algo concreto y factible, sin convertirlo en una exigencia.',
    },
    integration: {
      title: 'Unir todas las piezas',
      description:
        'Combina observación, sentimiento, necesidad y petición en un mensaje claro.',
    },
  },
  loading: {
    hub: 'Reuniendo tus lecciones...',
    lesson: 'Abriendo la lección...',
  },
  hub: {
    title: 'Seis lecciones breves, una habilidad.',
    intro: (totalMinutes: number) =>
      `Cada lección toma una pieza de la comunicación no violenta, la muestra en algunos ejemplos reales y termina con una breve comprobación. En total llevan unos ${totalMinutes} minutos, y puedes parar cuando quieras.`,
    allFinished:
      'Has terminado las seis. Vuelve a cualquiera de ellas cuando quieras.',
    finishedCount: (done: number, total: number) =>
      `${done} de ${total} terminadas`,
    cardMeta: (order: number, minutes: number) =>
      `Lección ${order}, ${minutes} min`,
    cardUpNext: ', la siguiente',
    done: 'Hecha',
    start: 'Empezar',
    open: 'Abrir',
  },
  page: {
    notFound: 'No encontramos esta lección.',
    backToLessons: 'Volver a todas las lecciones',
    allLessons: 'Todas las lecciones',
    lessonOf: (number: number, total: number) =>
      `Lección ${number} de ${total}`,
    duration: (minutes: number) =>
      plural(minutes, {
        one: `Alrededor de ${minutes} minuto`,
        other: `Alrededor de ${minutes} minutos`,
      }),
    completed: 'Completada',
    pointsHeading: 'Cuatro ideas para llevarte',
    takeawaysHeading: 'Lo que conviene recordar',
    nextLesson: (shortName: string) => `Siguiente: ${shortName}`,
    tryPractice: 'Prueba una conversación de práctica',
    practice: 'Practicar',
    navLabel: 'Lecciones',
    foundations: {
      title: 'Has terminado los fundamentos.',
      text: 'Las cuatro piezas ya son tuyas. Empiezan a sonar naturales cuando las usas con alguien que te responde, así que una conversación de práctica es un buen siguiente paso.',
    },
    examples: {
      counter: (index: number, total: number) => `Ejemplo ${index} de ${total}`,
      whyItMatters: 'Por qué importa: ',
      previous: 'Ejemplo anterior',
      next: 'Ejemplo siguiente',
    },
  },
  quiz: {
    heading: 'Comprueba lo que has entendido',
    questionOf: (index: number, total: number) =>
      `Pregunta ${index} de ${total}`,
    notQuite: 'Esta no es.',
    missedBefore: 'Echa otro vistazo a las demás opciones, o ',
    showAnswer: 'muéstrame la respuesta',
    missedAfter: '.',
    foundFirstTry: 'Sí, esa es.',
    foundLater: 'Esa es.',
    previousQuestion: 'Pregunta anterior',
    nextQuestion: 'Pregunta siguiente',
    finish: 'Terminar',
    checkAnswer: 'Comprobar mi respuesta',
    finishedTitle: 'Has terminado esta lección.',
    firstLookSummary: (found: number, total: number) =>
      `Acertaste ${found} de ${total} a la primera.`,
    secondLookNote:
      'Las que necesitaron un segundo vistazo suelen ser las que se quedan.',
    tryAgain: 'Repasar las preguntas otra vez',
  },
  lessons: {
    introduction: {
      shortName: 'Introducción',
      heading: '¿Qué es la comunicación no violenta?',
      aside: {
        label: 'Por qué una jirafa',
        text: 'Rosenberg eligió la jirafa porque tiene el corazón más grande de todos los animales terrestres, y un cuello largo que le permite ver una situación desde más arriba.',
      },
      points: [
        {
          title: 'Observación',
          text: 'Lo que pasó, sin un veredicto sobre ello.',
        },
        { title: 'Sentimiento', text: 'La emoción que notas en ti.' },
        {
          title: 'Necesidad',
          text: 'Lo que te importa debajo de ese sentimiento.',
        },
        { title: 'Petición', text: 'Una cosa concreta que te ayudaría.' },
      ],
      examples: {
        heading: 'El mismo momento, de dos maneras',
        giraffe: 'Jirafa',
        jackal: 'Chacal',
      },
      takeaways: [
        'La CNV es una forma de hablar y escuchar que mantiene a las dos personas en la conversación.',
        'Tiene cuatro piezas: observación, sentimiento, necesidad y petición.',
        'El lenguaje jirafa busca comprender. El lenguaje chacal juzga, culpa y exige.',
        'Todo el mundo habla en chacal a veces. La práctica consiste en darse cuenta y volver a intentarlo.',
      ],
    },
    observation: {
      shortName: 'Observaciones',
      heading: 'Di lo que vería una cámara',
      aside: {
        label: 'Una prueba rápida',
        text: '¿Podría mostrarlo una grabación de vídeo? «Dejaste los platos en el fregadero» pasa la prueba. «Nunca ayudas» no, porque ninguna cámara puede grabar un «nunca».',
      },
      points: [
        {
          title: 'Describe, no juzgues',
          text: 'Nombra la acción, no lo que dice de cómo es la persona.',
        },
        {
          title: 'Ve a lo concreto',
          text: 'Un momento, un lugar o una cifra se escuchan mejor que un resumen.',
        },
        {
          title: 'Deja el siempre y el nunca',
          text: 'Los absolutos convierten un momento en un veredicto sobre el carácter de alguien.',
        },
        {
          title: 'Que sea breve',
          text: 'Con una frase clara basta para empezar.',
        },
      ],
      examples: {
        heading: '¿Observación o evaluación?',
        giraffe: 'Observación',
        jackal: 'Evaluación',
      },
      takeaways: [
        'Una observación describe lo que pasó, sin juzgarlo.',
        'Los detalles concretos se escuchan mejor que las generalizaciones.',
        'Palabras como siempre y nunca suelen indicar una evaluación.',
        'Una observación clara da a las otras tres piezas un lugar donde apoyarse.',
      ],
    },
    feeling: {
      shortName: 'Sentimientos',
      heading: 'Nombra la emoción en sí',
      aside: {
        label: 'Atención al «que»',
        text: '«Siento que...» casi siempre va seguido de un pensamiento. Prueba a terminar la frase con una sola palabra que nombre una emoción.',
      },
      points: [
        {
          title: 'Sentimientos',
          text: 'Emociones que notas en ti: tristeza, ansiedad, alivio, alegría.',
        },
        {
          title: 'Pensamientos disfrazados de sentimientos',
          text: 'Palabras como ignorado, rechazado o traicionado describen lo que alguien te hizo.',
        },
        {
          title: 'Hazlo tuyo',
          text: '«Me dolió» mantiene el sentimiento como tuyo. «Me hiciste daño» se lo entrega a la otra persona.',
        },
        {
          title: 'Usa la biblioteca de sentimientos',
          text: 'Cuando no te sale la palabra justa, recorrer una lista ayuda.',
        },
      ],
      examples: {
        heading: '¿Sentimiento o pensamiento?',
        giraffe: 'Un sentimiento',
        jackal: 'Un pensamiento',
      },
      takeaways: [
        'Un sentimiento es una emoción; un pseudosentimiento lleva dentro un juicio sobre otra persona.',
        '«Siento que» suele introducir un pensamiento.',
        'Hacerte cargo de un sentimiento ayuda a que la otra persona siga contigo.',
        'Si no te sale la palabra, la biblioteca de sentimientos te puede ayudar a encontrarla.',
      ],
    },
    need: {
      shortName: 'Necesidades',
      heading: 'Lo que importa debajo',
      aside: {
        label: '¿Necesidad o estrategia?',
        text: 'Si solo una persona concreta pudiera satisfacerla, probablemente es una estrategia. «Ayuda con los platos» es una estrategia; el apoyo y la equidad son las necesidades a las que sirve.',
      },
      points: [
        {
          title: 'Universales',
          text: 'Descanso, seguridad, respeto, conexión, sentido: necesidades que cualquier persona podría tener.',
        },
        {
          title: 'No es una estrategia',
          text: '«Cenar juntos» o «llámame» son formas de cubrir una necesidad, no la necesidad.',
        },
        {
          title: 'Muchos caminos',
          text: 'Una vez nombrada la necesidad, más de una solución puede cubrirla.',
        },
        {
          title: 'También las suyas',
          text: 'La otra persona también tiene necesidades en ese mismo momento. Preguntarte por ellas ayuda.',
        },
      ],
      examples: {
        heading: 'Nombrar la necesidad',
        giraffe: 'Nombra la necesidad',
        jackal: 'Insiste en una estrategia',
      },
      takeaways: [
        'Todas las personas compartimos las necesidades; las estrategias son formas concretas de cubrirlas.',
        'Nombrar la necesidad abre más de un camino.',
        'Una misma necesidad se puede cubrir con muchas estrategias distintas.',
        'La otra persona también tiene necesidades, y la curiosidad por ellas crea conexión.',
      ],
    },
    request: {
      shortName: 'Peticiones',
      heading: 'Pide una cosa factible',
      aside: {
        label: '¿Petición o exigencia?',
        text: 'Lo descubres por lo que pasa después de un no. Si puedes mantener la curiosidad por sus motivos, era una petición.',
      },
      points: [
        {
          title: 'Concreta',
          text: 'Algo que alguien podría hacer de verdad, hoy o esta semana.',
        },
        {
          title: 'En positivo',
          text: 'Pide lo que quieres, no lo que quieres que deje de pasar.',
        },
        {
          title: 'Espacio para un no',
          text: '«¿Te parecería bien...?» significa que la respuesta está abierta de verdad.',
        },
        {
          title: 'Un no es información',
          text: 'Te habla de sus necesidades, y la conversación puede continuar.',
        },
      ],
      examples: {
        heading: '¿Petición o exigencia?',
        giraffe: 'Una petición',
        jackal: 'Una exigencia',
      },
      takeaways: [
        'Una petición es concreta y factible, así la otra persona sabe qué le pides.',
        'Pide lo que quieres, en lugar de lo que quieres que se detenga.',
        'Una petición deja a la otra persona libre para decir que no.',
        'Un no abre una conversación sobre las necesidades de ambas personas.',
      ],
    },
    integration: {
      shortName: 'Todo junto',
      heading: 'Un mensaje, cuatro piezas',
      aside: {
        label: 'La forma completa',
        text: 'Cuando vi [observación], sentí [sentimiento], porque necesito [necesidad]. ¿Te parecería bien [petición]?',
      },
      points: [
        {
          title: 'Observación',
          text: 'Lo que pasó, sin un veredicto sobre ello.',
        },
        { title: 'Sentimiento', text: 'La emoción que notaste en ti.' },
        { title: 'Necesidad', text: 'Lo que te importaba debajo.' },
        { title: 'Petición', text: 'Una cosa concreta que te ayudaría.' },
      ],
      examples: {
        heading: 'El mensaje completo',
        giraffe: 'Las cuatro piezas',
        jackal: 'Chacal',
      },
      takeaways: [
        'Las cuatro piezas juntas forman un mensaje completo.',
        'En las conversaciones reales pueden llegar a lo largo de varios turnos, y no pasa nada.',
        'Conocer la forma completa te ayuda a notar qué pieza falta.',
        'La práctica es donde la forma empieza a sonar como tú.',
      ],
    },
  },
}
