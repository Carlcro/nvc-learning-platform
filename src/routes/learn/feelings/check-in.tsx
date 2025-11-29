import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/feelings/check-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/learn/feelings/check-in"!</div>
}
