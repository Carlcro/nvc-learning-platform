import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

/** Visible keyboard focus, shared by every control in the feelings area. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-2'

/** A quiet secondary action, written as an underlined text link. */
export const textLinkClass = `font-semibold text-brown-800 underline decoration-giraffe-400 decoration-2 underline-offset-4 hover:decoration-brown-700 rounded-sm ${focusRing}`

/** The single gold action on a view, for links that act as the main button. */
export const primaryLinkClass = `inline-flex items-center justify-center min-h-12 px-8 py-3 rounded-lg bg-giraffe-400 text-brown-800 text-lg font-semibold transition-colors duration-200 hover:bg-giraffe-500 ${focusRing}`

/** Text inputs and the note field. */
export const fieldClass = `w-full min-h-11 px-4 py-2.5 rounded-lg border-2 border-giraffe-200 bg-white text-brown-900 placeholder:text-brown-500 focus:border-giraffe-500 ${focusRing}`

/**
 * One header and body width for all six feelings pages, so moving between
 * them never shifts the layout.
 */
const WIDTH = 'max-w-5xl mx-auto'

interface FeelingsPageProps {
  title: string
  intro: ReactNode
  /** Show the link back to the feelings hub. Off on the hub itself. */
  back?: boolean
  /** Optional content beside the heading on wider screens. */
  aside?: ReactNode
  children: ReactNode
}

/**
 * The shell every feelings page shares: a warm header band with a single
 * colour heading and a short intro, then the page body on paper.
 */
export function FeelingsPage({
  title,
  intro,
  back = true,
  aside,
  children,
}: FeelingsPageProps) {
  return (
    <main className="min-h-screen bg-paper">
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
        <div
          className={`${WIDTH} ${aside ? 'grid md:grid-cols-[1.4fr_1fr] gap-8 items-center' : ''}`}
        >
          <div>
            {back && (
              <Link
                to="/feelings"
                className={`inline-flex items-center gap-1.5 min-h-11 mb-3 text-sm font-semibold text-brown-700 hover:text-brown-900 rounded-sm ${focusRing}`}
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Feelings
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight leading-[1.1]">
              {title}
            </h1>
            <div className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
              {intro}
            </div>
          </div>
          {aside}
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className={WIDTH}>{children}</div>
      </div>
    </main>
  )
}
