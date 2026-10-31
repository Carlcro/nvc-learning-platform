import type { UserErrorCode } from '../../../../convex/lib/errors'

export const errors: Record<UserErrorCode, string> = {
  notAuthenticated: 'Connexion requise',
  notFound: 'Introuvable',
  messageEmpty: 'Le message est vide',
  messageTooLong: 'Le message est trop long',
  conversationNotFound: 'Conversation introuvable',
  conversationNotActive: "Cette conversation n'est plus en cours",
  conversationAtTurnLimit:
    "Cette conversation est arrivée à son terme. Termine-la pour voir comment elle s'est passée, et tu pourras toujours la recommencer.",
  cannotRewindCompleted:
    'Impossible de revenir en arrière dans une conversation terminée',
  noRewindsLeft: "Tu n'as plus de retours en arrière",
  notEnoughMessagesToRewind:
    'Pas encore assez de messages pour revenir en arrière',
  scenarioNotFound: 'Scénario introuvable',
  notYourScenario: 'Tu peux seulement supprimer tes propres scénarios',
  descriptionTooLong: 'La description est trop longue',
  answersTooLong: 'Les réponses sont trop longues',
  dailyTurnLimit:
    "Tu as atteint la limite de pratique pour aujourd'hui. Reviens demain, et en attendant, les leçons et la bibliothèque des sentiments restent ouvertes.",
  dailyScenarioLimit:
    "Tu as créé beaucoup de scénarios aujourd'hui. Essaie d'en pratiquer un, et tu pourras en créer d'autres demain.",
  lessonNotFound: 'Leçon introuvable',
  quizSubmissionMismatch:
    'Ces réponses au quiz ne correspondent pas à cette leçon.',
  questionNotFound: 'Question introuvable',
  feelingNotRecognised: 'Ce sentiment ne fait pas partie de notre liste.',
  someFeelingNotRecognised:
    "L'un de ces sentiments ne fait pas partie de notre liste.",
  pickAtLeastOneFeeling: 'Choisis au moins un sentiment',
  tooManyFeelings: 'Trop de sentiments choisis',
  noteTooLong: 'La note est trop longue',
}
