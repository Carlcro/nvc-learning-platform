import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/anotherPage')({
  component: AnotherPage,
})

function AnotherPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto flex flex-col gap-8 text-center">
        <h1 className="text-4xl font-bold text-brown-800">
          NVC Learning Platform
        </h1>
        <p className="text-brown-700">
          Welcome! This page is under construction.
        </p>
        <Link to="/">
          <span className="text-giraffe-700 font-medium underline hover:no-underline">
            Back to home
          </span>
        </Link>
      </div>
    </main>
  )
}
