import { Email } from '@convex-dev/auth/providers/Email'
import { Resend } from 'resend'

/**
 * Password reset by emailed code.
 *
 * Without this a learner who forgets their password is locked out for good,
 * with no path back to their progress. The code is generated here rather than
 * by the caller so it never passes through the browser.
 */

const CODE_LENGTH = 8
const CODE_TTL_MINUTES = 20

/** A short numeric code, drawn from the platform's cryptographic source. */
function generateCode(): string {
  const digits = new Uint32Array(CODE_LENGTH)
  crypto.getRandomValues(digits)
  return Array.from(digits, (d) => (d % 10).toString()).join('')
}

export const ResendPasswordReset = Email({
  id: 'resend-password-reset',
  maxAge: CODE_TTL_MINUTES * 60,

  generateVerificationToken: () => Promise.resolve(generateCode()),

  sendVerificationRequest: async ({ identifier: email, provider, token }) => {
    if (!provider.apiKey) {
      throw new Error('RESEND_API_KEY is not set on the Convex deployment')
    }
    const from = process.env.AUTH_EMAIL_FROM
    if (!from) {
      throw new Error('AUTH_EMAIL_FROM is not set on the Convex deployment')
    }

    const resend = new Resend(provider.apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: 'Reset your password',
      text: [
        'Hi,',
        '',
        'Here is the code to reset your password:',
        '',
        token,
        '',
        `The code works for the next ${CODE_TTL_MINUTES} minutes.`,
        '',
        'If you did not ask to reset your password, you can ignore this',
        'message and nothing will change.',
      ].join('\n'),
    })

    // Surfaced rather than swallowed: a silent failure here looks to the user
    // like an email that never arrives, with nothing to act on.
    if (error) {
      throw new Error(`Could not send the reset email: ${error.message}`)
    }
  },
})
