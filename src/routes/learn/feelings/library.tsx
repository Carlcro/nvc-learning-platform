import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/feelings/library')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/learn/feelings/library"!</div>
}
