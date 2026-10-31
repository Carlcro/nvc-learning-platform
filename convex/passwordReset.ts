import { Email } from '@convex-dev/auth/providers/Email'
import { Resend } from 'resend'
import { internal } from './_generated/api'
import { passwordResetEmail } from './lib/emailCopy'
import type { EmailConfig } from '@convex-dev/auth/server'
import type { ActionCtx } from './_generated/server'

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

  // Convex Auth passes the action context as a second argument to email
  // providers too, but its types only declare it for phone providers (a known
  // gap marked TODO in the library). The context is what lets the email look
  // up the account's language.
  sendVerificationRequest: (async (
    { identifier: email, token }: { identifier: string; token: string },
    ctx: ActionCtx,
  ) => {
    // Read directly rather than through provider.apiKey: Convex Auth fills
    // that from AUTH_<PROVIDER_ID>_KEY, which would never match the plainly
    // named variable this deployment actually sets.
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set on the Convex deployment')
    }
    const from = process.env.AUTH_EMAIL_FROM
    if (!from) {
      throw new Error('AUTH_EMAIL_FROM is not set on the Convex deployment')
    }

    // Written in the account's saved language. A lookup that fails only
    // means the code arrives in English, never that it does not arrive.
    const locale = await ctx
      .runQuery(internal.users.localeForEmail, { email })
      .catch(() => null)
    const { subject, text } = passwordResetEmail(
      locale ?? 'en',
      token,
      CODE_TTL_MINUTES,
    )

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject,
      text,
    })

    // Surfaced rather than swallowed: a silent failure here looks to the user
    // like an email that never arrives, with nothing to act on.
    if (error) {
      throw new Error(`Could not send the reset email: ${error.message}`)
    }
  }) as unknown as EmailConfig['sendVerificationRequest'],
})
