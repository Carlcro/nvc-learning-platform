import { ConvexError } from 'convex/values'

/**
 * Every message the server may show to the person using the app, in English.
 *
 * The client translates by code (see `errors` in src/i18n), so these English
 * strings are the source text for translators and the fallback for any client
 * that does not know a code yet. Add a code here, not a loose string, when a
 * new user-facing error is needed.
 */
export const USER_ERRORS = {
  notAuthenticated: 'Not authenticated',
  notFound: 'Not found',
  messageEmpty: 'Message is empty',
  messageTooLong: 'Message is too long',
  conversationNotFound: 'Conversation not found',
  conversationNotActive: 'Conversation is no longer active',
  conversationAtTurnLimit:
    'This conversation has run its course. Wrap it up to see how it went, and you can always start it again.',
  cannotRewindCompleted: 'Cannot rewind a completed conversation',
  noRewindsLeft: 'No rewinds remaining',
  notEnoughMessagesToRewind: 'Not enough messages to rewind',
  scenarioNotFound: 'Scenario not found',
  notYourScenario: 'You can only delete your own scenarios',
  descriptionTooLong: 'Description is too long',
  answersTooLong: 'Answers are too long',
  dailyTurnLimit:
    'You have reached the practice limit for today. Come back tomorrow, and in the meantime the lessons and the feelings library are always open.',
  dailyScenarioLimit:
    'You have shaped a lot of scenarios today. Try practicing one of them, and you can build more tomorrow.',
  lessonNotFound: 'Lesson not found',
  quizSubmissionMismatch: 'That quiz submission did not match this lesson.',
  questionNotFound: 'Question not found',
  feelingNotRecognised: 'That is not a feeling we recognise.',
  someFeelingNotRecognised: 'One of those is not a feeling we recognise.',
  pickAtLeastOneFeeling: 'Pick at least one feeling',
  tooManyFeelings: 'Too many feelings selected',
  noteTooLong: 'Note is too long',
} as const

export type UserErrorCode = keyof typeof USER_ERRORS

/** What a user-facing error carries to the client. */
export type UserErrorData = {
  kind: 'user'
  code: UserErrorCode
  message: string
}

/**
 * Throw an error meant to be read by the person using the app.
 *
 * Convex redacts plain `Error` messages on production deployments, replacing
 * them with an opaque request id. `ConvexError` data survives, so anything a
 * user is supposed to read has to go through here. Internal invariants and
 * upstream failures should stay as plain `Error`: their details help us, not
 * the user, and the UI shows warm generic copy for them instead.
 */
export function userError(code: UserErrorCode): never {
  const data: UserErrorData = { kind: 'user', code, message: USER_ERRORS[code] }
  throw new ConvexError(data)
}
