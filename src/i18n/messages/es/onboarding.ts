import type { Messages } from '..'

export const onboarding: Messages['onboarding'] = {
  meta: {
    title: 'Bienvenida',
    description:
      'Elige tu idioma y echa un vistazo rápido antes de empezar a practicar.',
  },
  loading: 'Preparando tu bienvenida...',
  stepOf: (step: number, total: number) => `Paso ${step} de ${total}`,
  back: 'Atrás',
  next: 'Siguiente',
  skip: 'Saltar el recorrido',
  language: {
    bubble:
      '¡Hola y te damos la bienvenida! Soy tu jirafa guía. Para empezar, ¿en qué idioma te sientes más en casa?',
    title: 'Elige tu idioma',
    subtitle:
      'Las lecciones, las conversaciones de práctica y los comentarios estarán en el idioma que elijas.',
    changeLater: 'Puedes cambiarlo cuando quieras desde el menú bajo tu nombre.',
  },
  areas: {
    bubble: 'Aquí tienes un recorrido rápido para que sepas dónde está cada cosa.',
    title: 'Tus espacios para crecer',
    subtitle: 'Los encontrarás todos en el menú de la parte superior.',
    lessons: {
      title: 'Lecciones',
      body: 'Lecciones breves te guían por las cuatro partes de la CNV: observación, sentimiento, necesidad y petición. Cada una termina con un pequeño cuestionario.',
    },
    practice: {
      title: 'Práctica',
      body: 'Habla con personajes en situaciones cotidianas y recibe comentarios amables sobre cada mensaje. También puedes convertir una situación de tu propia vida en una conversación de práctica.',
    },
    daily: {
      title: 'Reto diario',
      body: 'Una situación nueva cada día, a tu nivel, con puntos extra por aceptarla.',
    },
    feelings: {
      title: 'Sentimientos',
      body: 'Explora la rueda de sentimientos, conecta con cómo estás hoy y amplía tus palabras para lo que pasa dentro de ti.',
    },
    profile: {
      title: 'Perfil',
      body: 'Consulta tu nivel, tus puntos, tu racha y tus logros, y cómo avanza cada parte de la CNV.',
    },
  },
  practice: {
    bubble: 'En la práctica es donde todo se une. Así funciona una conversación.',
    title: 'Cómo funciona una conversación de práctica',
    subtitle: 'Aquí no hay respuestas incorrectas, solo práctica.',
    brief: {
      title: 'Lee la situación',
      body: 'Cada conversación empieza contándote con quién hablas y qué está pasando entre ustedes.',
    },
    oneStep: {
      title: 'Una pieza cada vez',
      body: 'No hace falta decirlo todo de golpe. Una observación en un mensaje, un sentimiento en el siguiente. El camino de arriba te muestra cuánto has avanzado.',
    },
    hints: {
      title: 'Comentarios amables',
      body: 'Después de cada mensaje ves cómo ha llegado y una pista sobre qué probar a continuación.',
    },
    rewind: {
      title: 'Retroceder',
      body: '¿Te gustaría haberlo dicho de otra forma? Recupera tu último mensaje y dale otra forma a tus palabras.',
    },
    wrapUp: {
      title: 'Termina cuando te apetezca',
      body: 'Tras unos cuantos mensajes puedes terminar y ver lo que salió bien, además de algo que probar la próxima vez.',
    },
  },
  start: {
    bubble: 'Eso es todo. ¿Por dónde te gustaría empezar?',
    title: '¿Por dónde quieres empezar?',
    subtitle: 'Todo sigue abierto, así que puedes explorar en el orden que prefieras.',
    lessons: {
      title: 'Empezar con la primera lección',
      body: 'Un buen punto de partida si la CNV es nueva para ti.',
      tag: 'Recomendado',
    },
    practice: {
      title: 'Ir directo a la práctica',
      body: '¿Ya conoces lo básico? Elige una conversación y anímate.',
    },
  },
}
