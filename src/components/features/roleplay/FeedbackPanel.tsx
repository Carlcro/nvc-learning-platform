/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, progress steps, and coaching feedback.
 *
 * One calm column: the header holds the live "how the character feels" track,
 * then how the message landed, the four-piece arc, and the single next step,
 * which is the only highlighted surface. Mood and score colours stay warm and
 * gentle, never an alarming red, and everything holds still and legible under
 * reduced motion.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Check,
  Ear,
  Eye,
  Heart,
  MessageCircleQuestion,
  RotateCcw,
  Sprout,
  Star,
} from 'lucide-react'
import type { Milestones } from './milestones'
import type { FeedbackData, NVCScore } from './types'
import type { SkillHint } from '~/hooks/useConversation'
import type { NVCComponent } from '~/lib/conversationInsights'
import { SKILL_RESOURCES } from '~/lib/conversationInsights'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  skillHint?: SkillHint | null
  isLoading?: boolean
  messageCount?: number
  learningObjectives?: Array<string>
  /** The scenario's focus area, shown before the first message. */
  focusArea?: string
  /** Carried over from the last attempt's results: the piece to work on. */
  retryFocus?: NVCComponent | null
  characterMood?: number
  characterName?: string
  milestones?: Milestones
  /** Offer to take back a turn that landed roughly. Omit to hide the offer. */
  onRetryLastTurn?: () => void
  rewindsRemaining?: number
}

/**
 * Honours the user's reduced-motion preference and keeps reacting if they
 * change it mid-session. Used to swap every ambient animation for a calm,
 * fully-formed static state.
 */
function usePrefersReducedMotion(): boolean {
  // Read synchronously on first render so a reduced-motion user never sees a
  // count-up begin before the preference is known.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Gently counts up to the latest score so the number feels like it lands rather
 * than snapping into place. Re-runs whenever a new turn arrives (keyed by the
 * turn id). Reduced motion shows the final value immediately.
 */
function useCountUp(target: number, turnKey: number): number {
  const reduced = usePrefersReducedMotion()
  // Start where the animation starts, so the final value never flashes for a
  // frame before the count begins. Reduced motion starts (and stays) at the
  // final value.
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }

    let raf = 0
    let start = 0
    const duration = 750

    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // turnKey forces a fresh count each new turn, even if the score repeats.
  }, [target, turnKey, reduced])

  return value
}

type MoodTone = 'low' | 'mid' | 'high'

function getMood(mood: number): { label: string; tone: MoodTone } {
  if (mood >= 6) return { label: 'Open', tone: 'high' }
  if (mood >= 3) return { label: 'Warming', tone: 'mid' }
  if (mood >= 0) return { label: 'Neutral', tone: 'mid' }
  if (mood >= -6) return { label: 'Guarded', tone: 'low' }
  return { label: 'Defensive', tone: 'low' }
}

// Warm and gentle at every step: sage when open, gold in between, soft coral
// when guarded. Never an alarming red.
const MOOD_FILL: Record<MoodTone, string> = {
  low: 'bg-empathy-low',
  mid: 'bg-giraffe-400',
  high: 'bg-empathy-high',
}
const MOOD_RING: Record<MoodTone, string> = {
  low: 'border-empathy-low',
  mid: 'border-giraffe-500',
  high: 'border-empathy-high',
}

/**
 * The panel header: who the user is talking to and how they feel right now.
 * The track runs from guarded to open and ends at the star, which lights when
 * the character really opens up, so the meter reads as the goal.
 */
function MoodHeader({
  mood,
  characterName,
  opened,
}: {
  mood: number
  characterName?: string
  opened: boolean
}) {
  const clampedMood = Math.max(-10, Math.min(10, mood))
  const percent = ((clampedMood + 10) / 20) * 100
  const { label, tone } = getMood(clampedMood)
  const who = characterName || 'They'

  return (
    <div className="shrink-0 bg-giraffe-50 border-b border-giraffe-100 px-5 pt-4 pb-4">
      <h2 className="sr-only">Feedback</h2>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-brown-600">
          How <span className="font-semibold text-brown-900">{who}</span>{' '}
          feels
        </p>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-brown-900">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${MOOD_FILL[tone]} transition-colors duration-700`}
          />
          {label}
        </p>
      </div>

      <div
        className="mt-3 flex items-center gap-2.5"
        role="img"
        aria-label={`How ${who} feels: ${label}${
          opened ? `. ${who} has opened up.` : ''
        }`}
      >
        {/* Inset by the marker's radius so it never pokes past either end */}
        <div className="relative flex-1 h-1.5 rounded-full bg-brown-900/10">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${MOOD_FILL[tone]} opacity-60 transition-[width,background-color] duration-700 ease-out`}
            style={{ width: `${percent}%` }}
          />
          <div className="absolute inset-y-0 left-1.5 right-1.5">
            <div
              className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white shadow-[0_1px_2px_rgba(45,30,17,0.2)] ${MOOD_RING[tone]} transition-[left,border-color] duration-700 ease-out`}
              style={{ left: `${percent}%` }}
            />
          </div>
        </div>
        <Star
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-colors duration-500 ${
            opened
              ? 'fill-giraffe-400 text-giraffe-600'
              : 'text-brown-300'
          }`}
        />
      </div>

      {!opened && (
        <p className="mt-2 text-xs text-brown-500 text-pretty">
          The star lights when {characterName || 'they'} opens up. People open
          up when they feel heard.
        </p>
      )}
    </div>
  )
}

// Follows the scoring anchors (0-49, 50-69, 70-89, 90+) so the words and the
// number always tell the same story, and stays kind at every band.
export function getScoreMessage(score: number): string {
  if (score < 50) return 'Keep going'
  if (score < 70) return 'Getting there'
  if (score < 90) return 'Landing well'
  return 'Beautifully said'
}

function scoreBand(score: number): number {
  if (score < 50) return 0
  if (score < 70) return 1
  if (score < 90) return 2
  return 3
}

// One colour per band, in the same warm language as the mood track.
const BAND_FILL = [
  'bg-empathy-low',
  'bg-giraffe-400',
  'bg-giraffe-500',
  'bg-empathy-high',
]

/**
 * How the message landed: the band's words lead, the number follows quietly,
 * and four steps show which stage of the journey this turn reached, so it
 * reads as a place on a path rather than a grade.
 */
function ScoreSection({ score, turnKey }: { score: NVCScore; turnKey: number }) {
  const shown = useCountUp(score.total, turnKey)
  const band = scoreBand(score.total)

  return (
    <section className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-brown-900 text-balance">
            {getScoreMessage(score.total)}
          </h3>
          <p className="text-xs text-brown-500 mt-0.5">
            How this message landed
          </p>
        </div>
        <p className="shrink-0 pt-1 text-brown-600 tabular-nums">
          <span className="text-base font-semibold text-brown-800">{shown}</span>
          <span className="text-xs">/100</span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {BAND_FILL.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-colors duration-500 ${
              i <= band ? BAND_FILL[band] : 'bg-giraffe-100'
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </section>
  )
}

const ARC = [
  { key: 'observationMade', scoreKey: 'observation', label: 'Observe', Icon: Eye },
  { key: 'feelingExpressed', scoreKey: 'feeling', label: 'Feeling', Icon: Heart },
  { key: 'needIdentified', scoreKey: 'need', label: 'Need', Icon: Sprout },
  { key: 'requestMade', scoreKey: 'request', label: 'Request', Icon: MessageCircleQuestion },
] as const

/**
 * The four NVC pieces as one connected arc. A green node with a check is a
 * piece reached over the conversation; the gold ring is the next to reach for. The
 * small number under a piece is what this message gave it. Pieces a message
 * did not attempt show nothing, because that is healthy, not a gap.
 */
function ArcSection({
  milestones,
  score,
  freshKeys,
}: {
  milestones: Milestones
  score: NVCScore
  freshKeys: ReadonlyArray<string>
}) {
  const reached = ARC.filter((p) => milestones[p.key]).length
  const nextIndex = ARC.findIndex((p) => !milestones[p.key])

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-brown-800">Your arc</h3>
        <span className="text-xs text-brown-500 tabular-nums">
          {reached} of {ARC.length} reached
        </span>
      </div>

      <ol className="grid grid-cols-4">
        {ARC.map((piece, index) => {
          const isReached = !!milestones[piece.key]
          const isNext = index === nextIndex
          const isFresh = isReached && freshKeys.includes(piece.key)
          const value = score[piece.scoreKey]
          const following = index < ARC.length - 1 ? ARC[index + 1] : null
          const linkLit = isReached && !!following && !!milestones[following.key]
          const PieceIcon = piece.Icon

          return (
            <li
              key={piece.key}
              className="relative flex flex-col items-center text-center"
              aria-label={`${piece.label}: ${
                isReached ? 'reached' : isNext ? 'next to reach' : 'not yet'
              }${value > 0 ? `, ${value} of 25 in this message` : ''}`}
            >
              {index < ARC.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-500 ${
                    linkLit ? 'bg-empathy-high' : 'bg-brown-100'
                  }`}
                />
              )}
              <div
                aria-hidden="true"
                className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isReached
                    ? 'bg-[color-mix(in_srgb,var(--color-empathy-high)_22%,white)] text-brown-800 border-2 border-empathy-high'
                    : isNext
                      ? 'bg-giraffe-50 text-brown-800 border-2 border-giraffe-400 ring-4 ring-giraffe-100'
                      : 'bg-white text-brown-400 border-[1.5px] border-brown-200'
                } ${isFresh ? 'animate-node-ignite' : ''}`}
              >
                <PieceIcon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {isReached && (
                  <span className="absolute -right-1 -bottom-1 h-4.5 w-4.5 rounded-full bg-empathy-high ring-2 ring-white flex items-center justify-center">
                    <Check className="h-3 w-3 text-brown-900" strokeWidth={3} />
                  </span>
                )}
              </div>
              <span
                aria-hidden="true"
                className={`mt-1.5 text-xs font-medium ${
                  isReached || isNext ? 'text-brown-800' : 'text-brown-500'
                }`}
              >
                {piece.label}
              </span>
              <span
                aria-hidden="true"
                className="h-4 text-xs font-semibold text-giraffe-700 tabular-nums"
                title={value > 0 ? `This message: ${value} of 25` : undefined}
              >
                {value > 0 ? `${value}/25` : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/**
 * The empathy milestone has no place in the arc's order: it lights whenever
 * the user tunes into the character's side, and hints at the mechanic until
 * then. A quiet line, not another card.
 */
function EmpathyLine({
  earned,
  justEarned = false,
  characterName,
}: {
  earned: boolean
  justEarned?: boolean
  characterName?: string
}) {
  const who = characterName || 'they'
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`shrink-0 mt-px h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
          earned
            ? 'bg-empathy-high text-brown-900'
            : 'bg-giraffe-100 text-brown-600'
        } ${justEarned ? 'animate-node-ignite' : ''}`}
      >
        <Ear className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <p className="text-sm text-brown-700 leading-snug pt-0.5">
        {earned ? (
          <span className="font-semibold text-brown-800">
            You heard them. You tuned into{' '}
            {who === 'they' ? 'their' : `${who}'s`} side.
          </span>
        ) : (
          <>Wondering what {who} might be feeling? Asking counts too.</>
        )}
      </p>
    </div>
  )
}

/**
 * When one NVC component has been consistently rough over the last few turns,
 * point to the matching lesson or the feelings library. Opens in a new tab so
 * the conversation stays right where it is.
 */
function SkillHintLine({ hint }: { hint: SkillHint }) {
  const resource = SKILL_RESOURCES[hint.component]
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 mt-px h-6 w-6 rounded-full bg-giraffe-100 flex items-center justify-center">
        <BookOpen className="h-3.5 w-3.5 text-brown-600" aria-hidden="true" />
      </div>
      <p className="text-sm text-brown-700 leading-snug pt-0.5">
        {resource.invite}{' '}
        <Link
          to={resource.to}
          target="_blank"
          className="font-semibold text-giraffe-800 hover:text-giraffe-900 underline underline-offset-2 decoration-giraffe-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400"
        >
          Open the {resource.label}
        </Link>{' '}
        in a new tab; this conversation will wait for you.
      </p>
    </div>
  )
}

/**
 * The model is told to write plain text, but as a safety net we strip any stray
 * markdown so the panel never shows literal ** or backticks to the user.
 */
function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1$2')
    .replace(/(^|[\s(])_([^_\n]+)_/g, '$1$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s*[–—]\s*/g, ', ')
    .trim()
}

interface RetryProps {
  onRetry: () => void
  rewindsRemaining: number
}

/**
 * When a turn lands roughly, trying it again is the most instructive thing
 * there is, so the offer sits right under the next step it would act on.
 */
function RetryRow({ onRetry, rewindsRemaining }: RetryProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 inline-flex items-center gap-1.5 min-h-9 px-3.5 py-1.5 rounded-lg bg-giraffe-400 hover:bg-giraffe-500 text-brown-900 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-500 focus-visible:ring-offset-2 focus-visible:ring-offset-giraffe-50"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </button>
      <p className="text-xs text-brown-600 leading-snug text-pretty">
        Your words come back to the box.{' '}
        {rewindsRemaining === 1
          ? 'One rewind left.'
          : `${rewindsRemaining} rewinds left.`}
      </p>
    </div>
  )
}

function PraiseLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 mt-px h-6 w-6 rounded-full bg-empathy-high flex items-center justify-center">
        <Check
          className="h-3.5 w-3.5 text-brown-900"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>
      <p className="text-sm text-brown-700 leading-snug pt-0.5">{text}</p>
    </div>
  )
}

/**
 * The single next step is the heart of the coaching, so it is the one
 * highlighted surface in the panel, and carries the retry offer with it.
 */
function NextStepCard({
  text,
  retry,
}: {
  text: string
  retry: RetryProps | null
}) {
  return (
    <div className="rounded-xl bg-giraffe-50 border border-giraffe-200 p-4">
      <p className="text-xs font-semibold text-giraffe-800">Try next</p>
      <p className="mt-1 text-base leading-relaxed font-medium text-brown-900 text-pretty">
        {text}
      </p>
      {retry && (
        <div className="mt-3.5 pt-3.5 border-t border-giraffe-200">
          <RetryRow {...retry} />
        </div>
      )}
    </div>
  )
}

function FeedbackNotes({
  feedback,
  retry,
}: {
  feedback: FeedbackData
  retry: RetryProps | null
}) {
  const strength = cleanText(feedback.whatWentWell)
  const nextStep =
    cleanText(feedback.feedback) ||
    (strength ? '' : 'Try naming a feeling and the need underneath it.')

  return (
    <div className="space-y-4">
      {strength && <PraiseLine text={strength} />}
      {nextStep ? (
        <NextStepCard text={nextStep} retry={retry} />
      ) : (
        retry && <RetryRow {...retry} />
      )}
    </div>
  )
}

/**
 * Before the first message: the blank page is the hardest moment, so the
 * guide says what this scenario is for and suggests a first move.
 */
function FirstTurnGuide({
  focusArea,
  learningObjectives,
  retryFocus,
}: {
  focusArea?: string
  learningObjectives: Array<string>
  retryFocus?: NVCComponent | null
}) {
  const focus = retryFocus ? SKILL_RESOURCES[retryFocus] : null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img
          src="/giraff.png"
          alt=""
          aria-hidden="true"
          width={232}
          height={512}
          className="h-24 w-auto object-contain shrink-0"
        />
        <p className="text-sm text-brown-700 leading-relaxed text-pretty">
          Take your time. After each message I will tell you how it landed and
          suggest one next step.
        </p>
      </div>

      {focus && (
        <div className="p-3 bg-giraffe-100/70 rounded-lg border border-giraffe-200">
          <p className="text-xs font-semibold text-brown-600 mb-1">
            Your focus this time: {focus.plural}
          </p>
          <p className="text-sm text-brown-800 leading-relaxed font-medium text-pretty">
            {focus.nudge}
          </p>
        </div>
      )}

      <div className="p-3 bg-white rounded-lg border border-giraffe-200">
        <p className="text-xs font-semibold text-brown-600 mb-1">
          A good opening
        </p>
        <p className="text-sm text-brown-800 leading-relaxed text-pretty">
          Describe what happened, just the facts, with no verdict on it yet.
          One piece is plenty. Feelings, needs, and a request can each have
          their own message.
        </p>
      </div>

      {(focusArea || learningObjectives.length > 0) && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-brown-600">
            What this conversation practices
            {focusArea && (
              <span className="font-normal text-brown-500">
                {' '}
                ({focusArea.replace(/_/g, ' ')})
              </span>
            )}
          </p>
          <ul className="space-y-1">
            {learningObjectives.map((objective) => (
              <li
                key={objective}
                className="flex items-start gap-2 text-xs text-brown-700 leading-relaxed"
              >
                <span aria-hidden="true" className="text-giraffe-700">
                  •
                </span>
                <span className="first-letter:uppercase">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const MILESTONE_KEYS = [
  'conversationStarted',
  'observationMade',
  'feelingExpressed',
  'needIdentified',
  'requestMade',
  'resolutionReached',
  'empathyShown',
] as const

export function FeedbackPanel({
  feedback,
  skillHint = null,
  isLoading = false,
  messageCount = 0,
  learningObjectives = [],
  focusArea,
  retryFocus = null,
  characterMood = 0,
  characterName,
  milestones,
  onRetryLastTurn,
  rewindsRemaining = 0,
}: FeedbackPanelProps) {
  // Milestones earned just now get a one-time ignite pop. The memory lives up
  // here because the turn block below remounts every turn (keyed by
  // messageCount) and would otherwise forget what was already lit. A signature
  // change marks the freshly earned keys; a new turn without one clears them,
  // so a milestone never re-pops on later turns or on reload.
  const signature = MILESTONE_KEYS.map((k) =>
    milestones?.[k] ? '1' : '0',
  ).join('')
  const milestoneMemory = useRef({
    signature,
    turn: messageCount,
    previous: milestones,
    fresh: [] as Array<string>,
  })
  if (
    signature !== milestoneMemory.current.signature ||
    messageCount !== milestoneMemory.current.turn
  ) {
    const previous = milestoneMemory.current.previous
    milestoneMemory.current = {
      signature,
      turn: messageCount,
      previous: milestones,
      fresh:
        // No `previous` means the query just filled in (a reload), where
        // nothing was earned "just now" and nothing should pop.
        signature !== milestoneMemory.current.signature && milestones && previous
          ? MILESTONE_KEYS.filter((k) => milestones[k] && !previous[k])
          : [],
    }
  }
  const freshMilestones = milestoneMemory.current.fresh

  const retry: RetryProps | null =
    feedback &&
    onRetryLastTurn &&
    rewindsRemaining > 0 &&
    (feedback.score.total < 50 || feedback.isJackalLanguage)
      ? { onRetry: onRetryLastTurn, rewindsRemaining }
      : null

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-giraffe-100 flex flex-col max-h-full">
      <MoodHeader
        mood={characterMood}
        characterName={characterName}
        opened={!!milestones?.resolutionReached}
      />

      {/* Content - hugs its content, scrolls internally only when it would
          otherwise run past the available height */}
      <div className="min-h-0 px-5 py-5 overflow-y-auto">
        {/* Persistent status line for assistive tech: the loading state below
            announces itself, but the result would otherwise arrive silently.
            This sentence updates when a new score lands. */}
        <div role="status" className="sr-only">
          {feedback && !isLoading
            ? `${getScoreMessage(feedback.score.total)}. Your message scored ${
                feedback.score.total
              } out of 100. ${cleanText(feedback.feedback)}`
            : null}
        </div>
        {isLoading ? (
          // The guide "thinking" - the same calm typing-dot idiom used while the
          // character composes a reply (ConversationView) and in GiraffeLoader,
          // rather than a one-off spinner.
          <div
            className="flex flex-col items-center justify-center gap-4 py-10"
            role="status"
            aria-live="polite"
          >
            <img
              src="/giraff.png"
              alt=""
              aria-hidden="true"
              width={232}
              height={512}
              className="h-40 w-auto object-contain"
            />
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-giraffe-400 animate-typing-dot"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-brown-600">Reading your message…</p>
          </div>
        ) : feedback ? (
          // Keyed by turn so each new result eases up the panel as it arrives.
          <div key={messageCount} className="space-y-6">
            <div className="animate-step-in">
              <ScoreSection score={feedback.score} turnKey={messageCount} />
            </div>

            {milestones && (
              <div className="animate-step-in" style={{ animationDelay: '90ms' }}>
                <ArcSection
                  milestones={milestones}
                  score={feedback.score}
                  freshKeys={freshMilestones}
                />
              </div>
            )}

            <div className="animate-step-in" style={{ animationDelay: '180ms' }}>
              <FeedbackNotes feedback={feedback} retry={retry} />
            </div>

            {(milestones || skillHint) && (
              <div
                className="animate-step-in space-y-3 pt-5 border-t border-giraffe-100"
                style={{ animationDelay: '270ms' }}
              >
                {milestones && (
                  <EmpathyLine
                    earned={!!milestones.empathyShown}
                    justEarned={freshMilestones.includes('empathyShown')}
                    characterName={characterName}
                  />
                )}
                {skillHint && <SkillHintLine hint={skillHint} />}
              </div>
            )}
          </div>
        ) : (
          <FirstTurnGuide
            focusArea={focusArea}
            learningObjectives={learningObjectives}
            retryFocus={retryFocus}
          />
        )}
      </div>
    </div>
  )
}
