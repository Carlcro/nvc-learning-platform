/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, progress steps, and coaching feedback.
 *
 * The header holds the live "how the character feels" meter; mood is carried by
 * the chip and the bar fill, warm and gentle, never an alarming red. The turn's
 * score arrives inside a warm halo that breathes once and settles. Everything
 * holds still and legible under reduced motion.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Check,
  Ear,
  Handshake,
  Heart,
  MessageCircle,
  Sprout,
  Star,
} from 'lucide-react'
import type { Milestones } from './MilestoneProgress'
import type { FeedbackData, NVCScore } from './types'
import type { SkillHint } from '~/hooks/useConversation'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  skillHint?: SkillHint | null
  isLoading?: boolean
  messageCount?: number
  learningObjectives?: Array<string>
  characterMood?: number
  characterName?: string
  milestones?: Milestones
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

function getMoodLabel(mood: number): { label: string; color: string } {
  if (mood >= 6)
    return {
      label: 'Open',
      color: 'bg-empathy-high/25 text-brown-900 border-empathy-high/50',
    }
  if (mood >= 3)
    return {
      label: 'Warming',
      color: 'bg-white/70 text-brown-800 border-giraffe-500/40',
    }
  if (mood >= 0)
    return {
      label: 'Neutral',
      color: 'bg-white/60 text-brown-800 border-brown-900/15',
    }
  if (mood >= -6)
    return {
      label: 'Guarded',
      color: 'bg-empathy-low/20 text-brown-900 border-empathy-low/40',
    }
  return {
    label: 'Defensive',
    color: 'bg-empathy-low/30 text-brown-900 border-empathy-low/55',
  }
}

// Mood bar fill, warm and gentle: green when open, gold while warming, soft
// coral when guarded - never an alarming red.
function getMoodFill(mood: number): string {
  if (mood >= 6) return 'bg-empathy-high'
  if (mood >= 3) return 'bg-giraffe-500'
  if (mood >= 0) return 'bg-giraffe-400'
  if (mood >= -6) return 'bg-empathy-low/70'
  return 'bg-empathy-low'
}

/**
 * The panel header: holds the live connection meter, so this whole strip is
 * "how the conversation feels right now". A calm, flat gold surface; the mood
 * itself is carried by the chip and the bar fill.
 */
function AmbientHeader({
  mood,
  characterName,
}: {
  mood: number
  characterName?: string
}) {
  const clampedMood = Math.max(-10, Math.min(10, mood))
  const percent = ((clampedMood + 10) / 20) * 100
  const moodInfo = getMoodLabel(clampedMood)
  const who = characterName || 'They'

  return (
    <div className="shrink-0 bg-giraffe-300">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-brown-900">Feedback</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${moodInfo.color}`}
          >
            {moodInfo.label}
          </span>
        </div>

        <div
          className="mt-3 space-y-1.5"
          role="img"
          aria-label={`How ${who} feels: ${moodInfo.label}`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-brown-800/90">
            <span>How {who} feels</span>
          </div>
          <div className="relative h-2.5 rounded-full bg-brown-900/12 overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${getMoodFill(
                clampedMood,
              )} transition-[width,background-color] duration-700 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-brown-700">
            <span>Guarded</span>
            <span>Open</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getScoreMessage(score: number): string {
  if (score < 30) return 'Keep Going'
  if (score < 60) return 'Good Progress'
  if (score < 80) return 'Great Work'
  return 'Excellent!'
}

// Warm halo colour behind the score, by band. Mirrors the empathy bands; the
// low band is the gentle coral, never an alarming red. Built from the theme
// tokens so a palette change carries through.
function scoreGlow(score: number): string {
  if (score >= 80)
    return 'color-mix(in srgb, var(--color-empathy-high) 60%, transparent)'
  if (score >= 60)
    return 'color-mix(in srgb, var(--color-giraffe-400) 62%, transparent)'
  if (score >= 30)
    return 'color-mix(in srgb, var(--color-giraffe-300) 58%, transparent)'
  return 'color-mix(in srgb, var(--color-empathy-low) 45%, transparent)'
}

// The score bar speaks the same band language as the halo and the
// EmpathyMeter: green when it lands, gold in the middle, gentle coral when
// there is more jackal than giraffe.
function scoreBarFill(score: number): string {
  if (score >= 80) return 'bg-empathy-high'
  if (score >= 60) return 'bg-giraffe-500'
  if (score >= 30) return 'bg-giraffe-400'
  return 'bg-empathy-low'
}

const steps = [
  { key: 'conversationStarted', label: 'Start', Icon: MessageCircle },
  { key: 'feelingExpressed', label: 'Feeling', Icon: Heart },
  { key: 'needIdentified', label: 'Need', Icon: Sprout },
  { key: 'requestMade', label: 'Request', Icon: Handshake },
  { key: 'resolutionReached', label: 'Done', Icon: Star },
] as const

/**
 * Standing chip under the progress rail for the empathy milestone. Unlike the
 * arc steps it has no fixed order - it lights up whenever the user tunes into
 * the character's side, and hints at the mechanic until then.
 */
function EmpathyChip({
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
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-300 ${
        earned
          ? 'bg-empathy-high/15 border-empathy-high/40'
          : 'bg-giraffe-50 border-giraffe-100'
      }`}
    >
      <div
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          earned ? 'bg-empathy-high text-brown-900' : 'bg-giraffe-100 text-brown-400'
        } ${justEarned ? 'animate-node-ignite' : ''}`}
      >
        <Ear className="h-3.5 w-3.5" />
      </div>
      <p className="text-xs text-brown-700 leading-snug">
        {earned ? (
          <span className="font-semibold">
            You heard them. You tuned into {who === 'they' ? 'their' : `${who}'s`}{' '}
            side.
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
const SKILL_RESOURCES: Record<
  SkillHint['component'],
  { to: string; label: string; invite: string }
> = {
  observation: {
    to: '/learn/observation',
    label: 'Observations lesson',
    invite:
      'Separating what happened from what we think about it is its own skill.',
  },
  feeling: {
    to: '/feelings',
    label: 'Feelings library',
    invite: 'Finding the exact feeling word gets easier with a bigger vocabulary.',
  },
  need: {
    to: '/learn/need',
    label: 'Needs lesson',
    invite: 'Connecting feelings to the universal needs beneath them takes practice.',
  },
  request: {
    to: '/learn/request',
    label: 'Requests lesson',
    invite: 'Shaping clear, doable requests is worth a short refresher.',
  },
}

function SkillHintCard({ hint }: { hint: SkillHint }) {
  const resource = SKILL_RESOURCES[hint.component]
  return (
    <div className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-giraffe-200">
      <div className="shrink-0 w-5 h-5 rounded-full bg-giraffe-100 flex items-center justify-center mt-0.5">
        <BookOpen className="h-3 w-3 text-brown-700" />
      </div>
      <p className="text-xs text-brown-700 leading-relaxed">
        {resource.invite}{' '}
        <Link
          to={resource.to}
          target="_blank"
          className="font-semibold text-giraffe-800 hover:text-giraffe-900 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300"
        >
          Open the {resource.label}
        </Link>{' '}
        in a new tab; this conversation will wait for you.
      </p>
    </div>
  )
}

function ProgressSteps({
  milestones,
  freshKeys,
}: {
  milestones: Milestones
  freshKeys: ReadonlyArray<string>
}) {
  const completedCount = steps.filter((s) => milestones[s.key]).length
  const totalSteps = steps.length

  // Find current step (first incomplete one)
  let currentStepIndex = steps.findIndex((s) => !milestones[s.key])
  if (currentStepIndex === -1) currentStepIndex = steps.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brown-800">Progress</span>
        <span className="text-xs text-brown-500">
          {completedCount}/{totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Background Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 rounded-full bg-giraffe-200 mx-6" />
        {/* Active Progress Line - traces the contiguous journey from the
            start; steps earned out of order still read from their circles */}
        <div
          className="absolute top-5 left-6 h-1 rounded-full bg-empathy-high transition-[width] duration-500"
          style={{
            width:
              currentStepIndex > 0
                ? `calc(${((currentStepIndex - 1) / (totalSteps - 1)) * 100}% - 0px)`
                : '0%',
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = milestones[step.key]
          const isCurrent = index === currentStepIndex
          const isFresh = isCompleted && freshKeys.includes(step.key)
          const StepIcon = step.Icon

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-empathy-high text-brown-900 shadow-sm'
                    : isCurrent
                      ? 'bg-giraffe-100 text-brown-800 border-2 border-giraffe-400'
                      : 'bg-giraffe-50 text-brown-400'
                } ${isFresh ? 'animate-node-ignite' : ''}`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isCompleted
                    ? 'text-brown-700'
                    : isCurrent
                      ? 'text-brown-700'
                      : 'text-brown-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScoreSection({ score, turnKey }: { score: NVCScore; turnKey: number }) {
  const scorePercentage = score.total
  const shown = useCountUp(score.total, turnKey)
  const glow = scoreGlow(score.total)

  const metrics = [
    { label: 'Observation', value: score.observation },
    { label: 'Feeling', value: score.feeling },
    { label: 'Need', value: score.need },
    { label: 'Request', value: score.request },
  ]

  return (
    <div className="relative">
      {/* Warm, band-coloured halo breathing softly behind the score */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-2xl opacity-50 animate-score-bloom"
        style={{
          background: `radial-gradient(60% 60% at 50% 40%, ${glow}, transparent 70%)`,
        }}
      />

      <div className="relative bg-giraffe-50 rounded-lg p-3.5 space-y-3 border border-giraffe-100">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-giraffe-700">
              {getScoreMessage(score.total)}
            </p>
            <p className="text-xs text-brown-500 mt-0.5">
              How this message landed
            </p>
          </div>
          <div className="flex items-baseline gap-0.5 text-brown-700">
            <span className="text-2xl font-bold tabular-nums">{shown}</span>
            <span className="text-xs text-brown-500">/100</span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="h-2.5 bg-giraffe-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width,background-color] duration-700 ease-out ${scoreBarFill(
              score.total,
            )}`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>

        {/* Metrics Grid. A zero simply means the component was not part of
            this message (which is healthy), so it renders as a quiet dot
            rather than a failing number. */}
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-giraffe-100"
            >
              <span className="text-xs text-brown-500">{metric.label}</span>
              {metric.value > 0 ? (
                <span className="font-semibold text-sm text-brown-800">
                  {metric.value}
                </span>
              ) : (
                <span
                  className="text-sm text-brown-400"
                  title="Not part of this message"
                  aria-label={`${metric.label}: not part of this message`}
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
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

function FeedbackNotes({ feedback }: { feedback: FeedbackData }) {
  const strength = cleanText(feedback.whatWentWell)
  const nextStep = cleanText(feedback.feedback)

  if (!strength && !nextStep) {
    return (
      <div className="p-3 bg-giraffe-50 rounded border border-giraffe-100">
        <p className="text-sm text-brown-600 text-center">
          Keep going. Try naming a feeling and the need underneath it.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* What they did well this turn - a light, affirming line */}
      {strength && (
        <div className="flex gap-2.5 items-start">
          <div className="shrink-0 w-5 h-5 rounded-full bg-empathy-high flex items-center justify-center mt-0.5">
            <Check className="h-3 w-3 text-brown-900" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-brown-700 leading-relaxed">{strength}</p>
        </div>
      )}

      {/* The single next step - the heart of the coaching, given prominence */}
      {nextStep && (
        <div className="p-3 bg-giraffe-100/70 rounded-lg border border-giraffe-200">
          <p className="text-xs font-semibold text-brown-600 mb-1">Try next</p>
          <p className="text-sm text-brown-800 leading-relaxed font-medium">
            {nextStep}
          </p>
        </div>
      )}
    </div>
  )
}

const MILESTONE_KEYS = [
  'conversationStarted',
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
  learningObjectives: _learningObjectives = [],
  characterMood = 0,
  characterName,
  milestones,
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

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-giraffe-50 shadow-lg border border-giraffe-100 flex flex-col max-h-full">
      <AmbientHeader mood={characterMood} characterName={characterName} />

      {/* Content - hugs its content, scrolls internally only when it would
          otherwise run past the available height */}
      <div className="min-h-0 p-4 space-y-4 overflow-y-auto">
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
          <div key={messageCount} className="space-y-4">
            <div className="animate-step-in">
              <ScoreSection score={feedback.score} turnKey={messageCount} />
            </div>

            {milestones && (
              <div
                className="animate-step-in space-y-3"
                style={{ animationDelay: '90ms' }}
              >
                <ProgressSteps
                  milestones={milestones}
                  freshKeys={freshMilestones}
                />
                <EmpathyChip
                  earned={!!milestones.empathyShown}
                  justEarned={freshMilestones.includes('empathyShown')}
                  characterName={characterName}
                />
              </div>
            )}

            <div className="animate-step-in" style={{ animationDelay: '180ms' }}>
              <FeedbackNotes feedback={feedback} />
            </div>

            {skillHint && (
              <div
                className="animate-step-in"
                style={{ animationDelay: '270ms' }}
              >
                <SkillHintCard hint={skillHint} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 flex-1 ">
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
              width={232}
              height={512}
              className="mx-auto object-contain h-48 w-auto"
            />
            <p className="text-center text-brown-600 text-sm px-2">
              Send a message and I will give you feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
