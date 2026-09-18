import { ConvexError } from 'convex/values'

/**
 * Throw an error whose message is meant to be read by the person using the app.
 *
 * Convex redacts plain `Error` messages on production deployments, replacing
 * them with an opaque request id. `ConvexError` data survives, so anything a
 * user is supposed to read has to go through here. Internal invariants and
 * upstream failures should stay as plain `Error`: their details help us, not
 * the user, and the UI shows warm generic copy for them instead.
 */
export function userError(message: string): never {
  throw new ConvexError({ kind: 'user', message })
}
