import { pluralFor } from '../../plural'
import type { Messages } from '..'

const plural = pluralFor('es')

/**
 * "descanso, conexión o apoyo". The "o" becomes "u" before a word that
 * starts with an o sound ("descanso u orden").
 */
function joinWithOr(words: ReadonlyArray<string>): string {
  if (words.length <= 1) return words.join('')
  const last = words[words.length - 1]
  const or = /^h?[oó]/i.test(last) ? 'u' : 'o'
  return `${words.slice(0, -1).join(', ')} ${or} ${last}`
}

/** "una vez", "dos veces", "algunas veces": how often a feeling came up. */
function howOften(count: number): string {
  if (count <= 1) return 'una vez'
  if (count === 2) return 'dos veces'
  if (count <= 4) return 'algunas veces'
  return 'a menudo'
}

export const feelings: Messages['feelings'] = {
  page: {
    back: 'Sentimientos',
    inASentence: 'En una frase: ',
  },

  // Intensity words agree with "intensidad", so they never have to agree
  // with the feeling or the reader.
  scale: {
    intensity: {
      faint: 'Muy leve',
      mild: 'Leve',
      moderate: 'Media',
      strong: 'Fuerte',
      intense: 'Intensa',
    },
    category: {
      pleasant: 'Agradable',
      unpleasant: 'Desagradable',
    },
    describe: (intensity: string, category: string) =>
      `${intensity}, ${category.toLowerCase()}`,
  },

  hub: {
    meta: {
      title: 'Sentimientos',
      description:
        'Amplía tu vocabulario para nombrar con precisión lo que sientes.',
    },
    title: 'Encuentra las palabras para lo que sientes.',
    intro:
      'Los sentimientos son la segunda pieza de un mensaje compasivo. Cuantas más palabras tengas para ellos, más fácil es decir lo que de verdad está pasando y distinguir un sentimiento de un pensamiento sobre otra persona.',
    guide:
      'Nombrar lo que sientes es donde empieza la compasión. Tómate tu tiempo. Aquí no hay respuestas incorrectas.',
    today: {
      doneHeading: 'Hoy ya has hecho tu registro.',
      notDoneHeading: '¿Cómo te sientes hoy?',
      doneText:
        'Puedes volver a ver lo que notaste, o cambiarlo si el día ha dado un giro.',
      notDoneText:
        'Haz una pausa de un minuto y elige las palabras que encajen. Una nota breve es bienvenida, y solo tú puedes verla.',
      doneAction: 'Abrir el registro de hoy',
      notDoneAction: 'Registrar cómo estás hoy',
    },
    toolsHeading: 'Otras formas de explorar',
    tools: {
      wheel: {
        title: 'Explorar sentimientos',
        text: 'Sentimientos agrupados por familia, cada uno con su definición, ejemplos y palabras cercanas.',
      },
      intensity: {
        title: 'Con qué intensidad',
        text: 'Mira cómo cambia un sentimiento al hacerse más suave o más fuerte, para poder nombrar cuánto.',
      },
      library: {
        title: 'Tus sentimientos guardados',
        text: 'Las palabras que has guardado para volver a ellas.',
      },
      quiz: {
        title: 'Sentimiento o pensamiento',
        text: 'Frases breves para clasificar: ¿es un sentimiento o un pensamiento sobre otra persona?',
      },
    },
    whyItHelps:
      'Por qué ayuda: un sentimiento nombrado con precisión es más fácil de compartir sin culpar, y más fácil de escuchar para la otra persona. Palabras como «ignorado» o «juzgado» describen lo que crees que alguien hizo. Los sentimientos de debajo, quizá soledad o dolor, son tuyos para compartir.',
  },

  checkIn: {
    meta: {
      title: 'Registro diario',
      description: 'Nota y nombra cómo te sientes hoy.',
    },
    loading: 'Reuniendo palabras para los sentimientos...',
    title: '¿Cómo te sientes hoy?',
    intro:
      'Tómate un momento para notar lo que hay y elige las palabras que encajen. No hay una respuesta correcta, y puedes cambiarla más tarde.',
    formHeading: '¿Qué estás sintiendo?',
    selectedHeading: 'Tus palabras de hoy',
    remove: (word: string) => `Quitar ${word}`,
    commonHeading: 'Algunos sentimientos comunes',
    searchLabel: 'Busca otra palabra',
    searchPlaceholder: 'Por ejemplo, inquietud',
    matches: (n: number) =>
      plural(n, { one: `${n} resultado`, other: `${n} resultados` }),
    noMatches:
      'Todavía ninguna palabra coincide. Prueba con un trozo más corto.',
    noteLabel: 'Añade una nota, si quieres',
    notePlaceholder: '¿Qué está pasando hoy?',
    notePrivacy: 'Solo tú puedes ver tus registros.',
    saving: 'Guardando...',
    update: 'Actualizar registro',
    save: 'Guardar registro',
    chooseOne: 'Elige al menos una palabra para guardar.',
    saved: 'Guardado. Gracias por hacer una pausa para notar cómo estás.',
    saveError:
      'No pudimos guardar tu registro en este momento. Vuelve a intentarlo, por favor.',
    historyHeading: 'Días recientes',
    historyEmpty: 'Tus registros se irán reuniendo aquí, una línea por día.',
    weekHeading: 'Esta semana',
    cameUp: (count: number) => ({
      before: '',
      after: ` apareció ${howOften(count)} esta semana.`,
    }),
    pointsToNeeds: (needs: ReadonlyArray<string>) =>
      `Suele apuntar a una necesidad de ${joinWithOr(needs)}.`,
    balanceLabel: 'Sentimientos agradables y desagradables esta semana',
    pleasantPercent: (percent: number) => `Agradables ${percent}%`,
    unpleasantPercent: (percent: number) => `Desagradables ${percent}%`,
    balanceNote:
      'Los dos tipos son bienvenidos. Cada uno apunta a algo que te importa.',
    didYouKnowHeading: '¿Sabías que...?',
    didYouKnowText:
      'Poner un sentimiento en palabras puede suavizarlo un poco y ayudarte a pensar con más claridad en lo que necesitas.',
  },

  intensity: {
    meta: {
      title: 'Intensidad de los sentimientos',
      description:
        'Mira cómo cambia un sentimiento cuando su intensidad sube y baja.',
    },
    loading: 'Reuniendo sentimientos...',
    title: '¿Con qué intensidad?',
    intro:
      'Un mismo sentimiento puede ser muy leve o intenso. Elige una familia y recorre la escala hasta dar con la palabra que encaje con cuánto sientes.',
    familiesHeading: 'Familias',
    scaleHeading: (family: string) =>
      `${family}, de la intensidad más leve a la más fuerte`,
    sliderLabel: 'Intensidad',
    sliderValue: (level: string, word: string) => `${level}: ${word}`,
    noWordAtLevel: (level: string) =>
      `Todavía no hay ninguna palabra de esta familia con intensidad ${level.toLowerCase()}. Prueba un paso más suave o más fuerte.`,
    spectrumHeading:
      'Todas las palabras de esta familia, de la más suave a la más fuerte',
    spectrumItem: (word: string, level: string) =>
      `${word}, intensidad ${level.toLowerCase()}`,
  },

  library: {
    meta: {
      title: 'Tus sentimientos guardados',
      description: 'Los sentimientos que has explorado y guardado.',
    },
    loading: 'Abriendo tu biblioteca...',
    title: 'Tus sentimientos guardados',
    intro:
      'Las palabras que has guardado para volver a ellas. Leerlas de vez en cuando hace que te vengan antes cuando importa.',
    removed: (word: string) => `Quitaste ${word} de tu biblioteca.`,
    removeError: (word: string) => `No pudimos quitar ${word} en este momento.`,
    empty: {
      before:
        'Aún no hay nada guardado. Cuando una palabra encaje con algo que hayas sentido, guárdala mientras ',
      linkText: 'exploras los sentimientos',
      after: ' y te esperará aquí.',
    },
    searchLabel: 'Busca en tus sentimientos guardados',
    familyLabel: 'Familia',
    allFamilies: 'Todas las familias',
    savedCount: (n: number) =>
      plural(n, { one: `${n} guardado`, other: `${n} guardados` }),
    showing: (shown: number, total: number) => `Mostrando ${shown} de ${total}`,
    findMore: 'Encontrar más palabras',
    detail: (description: string, family: string) =>
      `${description}, ${family}`,
    remove: (word: string) => `Quitar ${word}`,
    noMatches:
      'Ninguno de tus sentimientos guardados coincide. Prueba otra búsqueda u otra familia.',
  },

  wheel: {
    meta: {
      title: 'Explorar sentimientos',
      description:
        'Explora los sentimientos por familia, con definiciones, ejemplos y palabras relacionadas.',
    },
    loading: 'Reuniendo sentimientos...',
    title: 'Explorar sentimientos',
    intro:
      'Sentimientos agrupados en familias. Elige cualquier palabra para ver qué significa, cómo suena en una frase y qué palabras tiene cerca.',
    searchLabel: 'Busca entre todos los sentimientos',
    searchPlaceholder: 'Por ejemplo, calma',
    showHeading: 'Mostrar',
    categoryAll: 'Todos',
    familiesHeading: 'Familias',
    intensityPrompt: '¿Quieres ver cómo crece un sentimiento? ',
    intensityLink: 'Explorar la intensidad',
    gridHeadingSearch: (term: string) =>
      `Sentimientos que coinciden con «${term}»`,
    gridHeadingFamily: (family: string) => `Familia: ${family}`,
    noMatches:
      'Ningún sentimiento coincide con lo que elegiste. Prueba otra familia o muestra todos los sentimientos.',
    detail: (description: string, family: string) =>
      `${description}, de la familia ${family}`,
    close: (word: string) => `Cerrar ${word}`,
    meaningHeading: 'Qué significa',
    sentenceHeading: 'En una frase',
    similarHeading: 'Palabras parecidas',
    relatedHeading: 'Sentimientos relacionados',
    remove: 'Quitar de tu biblioteca',
    save: 'Guardar en tu biblioteca',
    saved: 'Guardado en tu biblioteca.',
    removed: 'Quitado de tu biblioteca.',
    saveError: 'No pudimos guardar esta palabra en este momento.',
    removeError: 'No pudimos quitar esta palabra en este momento.',
    inLibrary: 'Esta palabra está en tu biblioteca.',
    choosePrompt:
      'Elige un sentimiento para ver qué significa, un ejemplo y palabras relacionadas.',
  },

  quiz: {
    meta: {
      title: 'Sentimiento o pensamiento',
      description:
        'Practica cómo distinguir los sentimientos reales de los pensamientos sobre otras personas.',
    },
    title: '¿Sentimiento o pensamiento?',
    intro:
      'Un sentimiento describe lo que pasa dentro de ti. Un pensamiento disfrazado de sentimiento, como «me siento ignorado», describe lo que crees que otra persona hizo. Lee cada frase y clasifícala.',
    levelsHeading: 'Elige por dónde empezar',
    levels: {
      clear: {
        title: 'Nivel 1: casos claros',
        text: 'Pensamientos fáciles de detectar en cuanto los buscas.',
      },
      disguised: {
        title: 'Nivel 2: juicios disfrazados',
        text: 'Palabras como ignorado o utilizado, que suenan a sentimientos pero describen lo que alguien hizo.',
      },
      subtle: {
        title: 'Nivel 3: casos sutiles',
        text: 'Frases en las que la línea es fina y merece la pena ir despacio.',
      },
    },
    roundLength: 'Cada ronda tiene diez frases.',
    loading: 'Reuniendo frases...',
    emptyHeading: 'Todavía no hay frases aquí',
    emptyText:
      'Este nivel no tiene preguntas por ahora. Puede que otro nivel sí tenga.',
    chooseAnotherLevel: 'Elegir otro nivel',
    progress: (current: number, total: number) =>
      `Pregunta ${current} de ${total}`,
    questionHeading: '¿Es un sentimiento o un pensamiento?',
    answerFeeling: 'Un sentimiento',
    answerThought: 'Un pensamiento',
    answerError:
      'No pudimos registrar esa respuesta en este momento. Vuelve a intentarlo, por favor.',
    verdict: {
      correctFeeling: 'Sí, es un sentimiento.',
      correctThought: 'Sí, es un pensamiento disfrazado de sentimiento.',
      wrongFeeling: 'En realidad, es un sentimiento.',
      wrongThought: 'En realidad, es un pensamiento disfrazado de sentimiento.',
    },
    insteadLabel: 'Sentimientos que podrías nombrar en su lugar: ',
    leveledUp: 'Has subido un nivel en el cuestionario.',
    next: 'Siguiente frase',
    finish: 'Ver cómo fue',
    summary: (sorted: number, total: number) =>
      `Clasificaste bien ${sorted} de ${total}.`,
    missedIntro:
      'Abajo están las que merecen un segundo vistazo. Suelen ser las que se quedan.',
    missedFeeling: 'Esta frase expresa un sentimiento.',
    missedThought:
      'Esta frase expresa un pensamiento disfrazado de sentimiento.',
    allCorrect:
      'Cada frase acabó donde le correspondía. El siguiente nivel te espera cuando quieras.',
    playAgain: 'Jugar otra vez',
    backToFeelings: 'Volver a sentimientos',
  },
}
