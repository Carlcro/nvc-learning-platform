import type { UserErrorCode } from '../../../../convex/lib/errors'

export const errors: Record<UserErrorCode, string> = {
  notAuthenticated: 'Necesitas iniciar sesión',
  notFound: 'No se encontró',
  messageEmpty: 'El mensaje está vacío',
  messageTooLong: 'El mensaje es demasiado largo',
  conversationNotFound: 'No encontramos la conversación',
  conversationNotActive: 'Esta conversación ya no está activa',
  conversationAtTurnLimit:
    'Esta conversación ha llegado a su fin. Ciérrala para ver cómo fue, y siempre puedes empezarla de nuevo.',
  cannotRewindCompleted: 'No se puede retroceder en una conversación terminada',
  noRewindsLeft: 'No te quedan retrocesos',
  notEnoughMessagesToRewind: 'Todavía no hay suficientes mensajes para retroceder',
  scenarioNotFound: 'No encontramos el escenario',
  notYourScenario: 'Solo puedes eliminar tus propios escenarios',
  descriptionTooLong: 'La descripción es demasiado larga',
  answersTooLong: 'Las respuestas son demasiado largas',
  dailyTurnLimit:
    'Has llegado al límite de práctica de hoy. Vuelve mañana, y mientras tanto las lecciones y la biblioteca de sentimientos siguen abiertas.',
  dailyScenarioLimit:
    'Hoy has creado muchos escenarios. Prueba a practicar con uno de ellos, y mañana podrás crear más.',
  lessonNotFound: 'No encontramos la lección',
  quizSubmissionMismatch: 'Esas respuestas no corresponden a esta lección.',
  questionNotFound: 'No encontramos la pregunta',
  feelingNotRecognised: 'No reconocemos ese sentimiento.',
  someFeelingNotRecognised: 'No reconocemos uno de esos sentimientos.',
  pickAtLeastOneFeeling: 'Elige al menos un sentimiento',
  tooManyFeelings: 'Has elegido demasiados sentimientos',
  noteTooLong: 'La nota es demasiado larga',
}
