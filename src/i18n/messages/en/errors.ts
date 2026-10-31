import { USER_ERRORS } from '../../../../convex/lib/errors'
import type { UserErrorCode } from '../../../../convex/lib/errors'

/**
 * Messages for errors the server raises with `userError(code)`. The English
 * text lives with the server so there is one source; translations override
 * it code by code.
 */
export const errors: Record<UserErrorCode, string> = { ...USER_ERRORS }
