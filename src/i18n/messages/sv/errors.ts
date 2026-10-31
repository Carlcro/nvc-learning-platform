import type { UserErrorCode } from '../../../../convex/lib/errors'

export const errors: Record<UserErrorCode, string> = {
  notAuthenticated: 'Du är inte inloggad',
  notFound: 'Hittades inte',
  messageEmpty: 'Meddelandet är tomt',
  messageTooLong: 'Meddelandet är för långt',
  conversationNotFound: 'Samtalet hittades inte',
  conversationNotActive: 'Samtalet är inte längre aktivt',
  conversationAtTurnLimit:
    'Det här samtalet har nått sitt slut. Avsluta det för att se hur det gick, du kan alltid börja om.',
  cannotRewindCompleted: 'Ett avslutat samtal går inte att spola tillbaka',
  noRewindsLeft: 'Du har inga tillbakaspolningar kvar',
  notEnoughMessagesToRewind:
    'Det finns inte tillräckligt många meddelanden att spola tillbaka',
  scenarioNotFound: 'Scenariot hittades inte',
  notYourScenario: 'Du kan bara ta bort dina egna scenarier',
  descriptionTooLong: 'Beskrivningen är för lång',
  answersTooLong: 'Svaren är för långa',
  dailyTurnLimit:
    'Du har nått dagens gräns för övning. Kom tillbaka i morgon. Lektionerna och känslobiblioteket är alltid öppna under tiden.',
  dailyScenarioLimit:
    'Du har skapat många scenarier i dag. Prova att öva på något av dem, så kan du skapa fler i morgon.',
  lessonNotFound: 'Lektionen hittades inte',
  quizSubmissionMismatch: 'Quizsvaren stämde inte med den här lektionen.',
  questionNotFound: 'Frågan hittades inte',
  feelingNotRecognised: 'Det är ingen känsla vi känner igen.',
  someFeelingNotRecognised: 'En av dem är ingen känsla vi känner igen.',
  pickAtLeastOneFeeling: 'Välj minst en känsla',
  tooManyFeelings: 'Du har valt för många känslor',
  noteTooLong: 'Anteckningen är för lång',
}
