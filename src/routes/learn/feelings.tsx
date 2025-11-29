import { Outlet, createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/learn/feelings')({
  component: ProtectedFeelingHub,
})

function ProtectedFeelingHub() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
