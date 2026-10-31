import type { Messages } from '..'

export const auth: Messages['auth'] = {
  meta: {
    title: 'Logga in',
    description:
      'Logga in för att spara dina framsteg och fortsätta öva medkännande kommunikation.',
  },
  welcomingIn: 'Välkommen in...',
  protectedLoading: 'Gör din plats redo...',
  headings: {
    signIn: {
      title: 'Logga in',
      subtitle: 'Dina samtal och framsteg sparas på ditt konto',
    },
    signUp: {
      title: 'Skapa ditt konto',
      subtitle: 'Din övning är bara din',
    },
    resetRequest: {
      title: 'Återställ ditt lösenord',
      subtitle: 'Vi mejlar dig en kod så att du kan välja ett nytt',
    },
    resetVerify: {
      title: 'Välj ett nytt lösenord',
      subtitle: 'Skriv koden vi mejlade dig och ditt nya lösenord',
    },
  },
  welcome: {
    signIn:
      'Övningssamtalen sparas på ditt konto, så att du kan komma tillbaka till dem. Ny här? Skapa ett konto längst ner, det tar bara en stund.',
    signUp:
      'Kul att du är här. När du har ett konto kan du öva på vilket scenario som helst, så många gånger du vill.',
    resetRequest:
      'Det händer alla. Ge mig adressen du registrerade dig med, så skickar jag en kod så att du kan komma tillbaka till din övning.',
    resetVerify:
      'Nästan klart. Skriv in koden från din inkorg, välj ett nytt lösenord, så är du tillbaka där du slutade.',
  },
  errors: {
    codeMismatch:
      'Koden stämde inte, eller så har den gått ut. Du kan skicka en ny till dig själv.',
    wrongCredentials:
      'Den e-postadressen och det lösenordet hör inte ihop med något konto. Dubbelkolla dem, eller skapa ett nytt konto nedan.',
    tooManyAttempts:
      'För många försök just nu. Vänta en stund och försök igen.',
    passwordTooShort: 'Välj ett lösenord med minst 8 tecken.',
    accountExists:
      'Det finns redan ett konto med den här e-postadressen. Prova att logga in i stället.',
    signUpFailed:
      'Vi kunde inte skapa ditt konto. E-postadressen kanske redan har ett, eller så är lösenordet kortare än 8 tecken.',
    resetRequestFailed:
      'Vi kunde inte starta återställningen just nu. Försök igen om en stund.',
    resetVerifyFailed:
      'Vi kunde inte uppdatera ditt lösenord. Koden kanske inte stämmer, eller så har den gått ut. Du kan skicka en ny till dig själv.',
    signInFailed:
      'Vi kunde inte logga in dig. Kontrollera e-postadress och lösenord. Om du är osäker på lösenordet kan du återställa det.',
  },
  codeSent:
    'Om adressen har ett konto är en kod på väg. Det kan ta en liten stund innan den kommer fram.',
  submit: {
    waiting: 'Vänta lite...',
    signUp: 'Skapa konto',
    resetRequest: 'Mejla mig en kod',
    resetVerify: 'Uppdatera lösenord och logga in',
    signIn: 'Logga in',
  },
  github: {
    connecting: 'Ansluter...',
    continue: 'Fortsätt med GitHub',
  },
  orWithEmail: 'eller med e-post',
  fields: {
    email: 'E-postadress',
    emailPlaceholder: 'du@exempel.se',
    password: 'Lösenord',
    createPasswordPlaceholder: 'Skapa ett lösenord',
    passwordPlaceholder: 'Skriv ditt lösenord',
    passwordHint: 'Minst 8 tecken för säkerhetens skull',
    forgotPassword: 'Glömt lösenordet?',
    code: 'Kod från ditt mejl',
    codePlaceholder: '12345678',
    newPassword: 'Nytt lösenord',
    newPasswordPlaceholder: 'Välj ett nytt lösenord',
  },
  switchMode: {
    haveAccount: 'Har du redan ett konto? ',
    signIn: 'Logga in',
    newHere: 'Ny inom medkännande kommunikation? ',
    createAccount: 'Skapa konto',
  },
  reset: {
    noCode: 'Kom ingen kod?',
    sendAnother: 'Skicka en ny',
    backToSignIn: 'Tillbaka till inloggningen',
  },
}
