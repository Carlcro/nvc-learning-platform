import type { Locale } from './locale'

/**
 * The password reset email in each language. Plain text, short, and calm:
 * it reaches someone who is locked out and possibly worried.
 */
export function passwordResetEmail(
  locale: Locale,
  code: string,
  minutes: number,
): { subject: string; text: string } {
  const lines: Record<Locale, { subject: string; body: Array<string> }> = {
    en: {
      subject: 'Reset your password',
      body: [
        'Hi,',
        '',
        'Here is the code to reset your password:',
        '',
        code,
        '',
        `The code works for the next ${minutes} minutes.`,
        '',
        'If you did not ask to reset your password, you can ignore this',
        'message and nothing will change.',
      ],
    },
    fr: {
      subject: 'Réinitialiser ton mot de passe',
      body: [
        'Bonjour,',
        '',
        'Voici le code pour réinitialiser ton mot de passe :',
        '',
        code,
        '',
        `Ce code reste valable pendant ${minutes} minutes.`,
        '',
        "Si tu n'as pas demandé à réinitialiser ton mot de passe, tu peux",
        'ignorer ce message : rien ne changera.',
      ],
    },
    es: {
      subject: 'Restablece tu contraseña',
      body: [
        'Hola:',
        '',
        'Este es el código para restablecer tu contraseña:',
        '',
        code,
        '',
        `El código funciona durante los próximos ${minutes} minutos.`,
        '',
        'Si no pediste restablecer tu contraseña, puedes ignorar este',
        'mensaje y no cambiará nada.',
      ],
    },
    sv: {
      subject: 'Återställ ditt lösenord',
      body: [
        'Hej!',
        '',
        'Här är koden för att återställa ditt lösenord:',
        '',
        code,
        '',
        `Koden gäller i ${minutes} minuter.`,
        '',
        'Om du inte har bett om att återställa ditt lösenord kan du',
        'strunta i det här meddelandet. Ingenting ändras.',
      ],
    },
  }
  const copy = lines[locale]
  return { subject: copy.subject, text: copy.body.join('\n') }
}
