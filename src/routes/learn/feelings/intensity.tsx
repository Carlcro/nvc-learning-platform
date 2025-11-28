import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/feelings/intensity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/learn/feelings/intensity"!</div>
}
