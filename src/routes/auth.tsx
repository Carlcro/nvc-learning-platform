import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '~/components/auth/SignInForm'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  return <SignInForm />
}
