import { createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { safeReturnPath } from '~/lib/onboarding'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { WelcomeTour } from '~/components/features/onboarding/WelcomeTour'
import { getMessages } from '~/i18n/messages'

export const Route = createFileRoute('/welcome')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.onboarding.meta) }
  },
  // Where the person was headed when the tour stepped in, so skipping it
  // takes them straight there.
  validateSearch: (search: Record<string, unknown>) => ({
    from: safeReturnPath(search.from),
  }),
  component: WelcomePage,
})

function WelcomePage() {
  const { from } = Route.useSearch()
  return (
    <ProtectedRoute>
      <WelcomeTour returnTo={from} />
    </ProtectedRoute>
  )
}
