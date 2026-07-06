/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, progress steps, and coaching feedback.
 *
 * "Ambient warmth": the header is a small piece of mood-reactive weather. Three
 * soft light washes drift behind it and warm toward gold and green as the
 * character opens up, cooling to a gentle coral when they grow guarded - never
 * an alarming red. Light motes rise through it, and the turn's score arrives
 * inside a warm halo that breathes once and settles. Everything holds still and
 * legible under reduced motion; the mood colour and the score still read.
 */

import { useEffect, useMemo, useState } from 'react'
import { Check, Handshake, Heart, MessageCircle, Sprout, Star } from 'lucide-react'
import type { Milestones } from './MilestoneProgress'
import type { FeedbackData, NVCScore } from './types'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
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
  const [reduced, setReduced] = useState(false)

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
  const [value, setValue] = useState(target)

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
 * The three drifting light washes behind the header, tinted by mood. Kept as
 * soft, luminous warm tones so dark-brown text on top always stays well above
 * AA contrast - the weather changes hue, never brightness enough to threaten
 * legibility.
 */
function auroraColors(mood: number): [string, string, string] {
  if (mood >= 6)
    return [
      'rgba(127, 176, 105, 0.55)', // growth green
      'rgba(255, 217, 109, 0.62)', // warm gold
      'rgba(255, 244, 214, 0.55)', // pale gold light
    ]
  if (mood >= 3)
    return [
      'rgba(255, 217, 109, 0.66)',
      'rgba(245, 184, 65, 0.55)',
      'rgba(255, 244, 214, 0.55)',
    ]
  if (mood >= 0)
    return [
      'rgba(255, 227, 144, 0.6)',
      'rgba(255, 237, 179, 0.62)',
      'rgba(255, 244, 214, 0.55)',
    ]
  if (mood >= -6)
    return [
      'rgba(224, 120, 86, 0.4)', // gentle coral wash
      'rgba(255, 208, 138, 0.58)',
      'rgba(255, 244, 214, 0.55)',
    ]
  return [
    'rgba(224, 120, 86, 0.5)',
    'rgba(232, 155, 122, 0.5)',
    'rgba(255, 228, 200, 0.55)',
  ]
}

/**
 * Soft light motes rising through the header. Reuses the celebration's
 * mote-rise keyframe, which keeps them invisible under reduced motion.
 */
function HeaderMotes() {
  const motes = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.round((i / 10) * 100 + (i % 3) * 6),
        bottom: (i % 4) * 18,
        size: (i % 3) + 4,
        dur: (6 + (i % 4)).toFixed(2),
        delay: ((i % 5) * 1.1).toFixed(2),
        opacity: (0.35 + (i % 3) * 0.12).toFixed(2),
      })),
    [],
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full bg-white animate-mote-rise"
          style={
            {
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.6)',
              '--mote-dur': `${m.dur}s`,
              '--mote-delay': `${m.delay}s`,
              '--mote-opacity': m.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * Ambient, mood-reactive header. Absorbs the live connection meter so the
 * drifting colour behind it has real meaning: this whole strip is "how the
 * conversation feels right now".
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
  const [c1, c2, c3] = auroraColors(clampedMood)
  const who = characterName || 'They'

  const blobBase =
    'absolute rounded-full blur-2xl transition-[background-color] duration-700 ease-out'

  return (
    <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-giraffe-300 to-giraffe-400">
      {/* Drifting mood washes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className={`${blobBase} animate-aurora-a -top-10 -left-8 h-40 w-40`}
          style={{ backgroundColor: c1 }}
        />
        <div
          className={`${blobBase} animate-aurora-b -top-6 right-0 h-44 w-44`}
          style={{ backgroundColor: c2 }}
        />
        <div
          className={`${blobBase} animate-aurora-c -bottom-12 left-1/3 h-36 w-44`}
          style={{ backgroundColor: c3 }}
        />
      </div>

      <HeaderMotes />

      {/* Content */}
      <div className="relative px-5 pt-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-brown-900">Feedback</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${moodInfo.color}`}
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
              )} transition-all duration-700 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-brown-700">
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
// low band is the gentle coral, never an alarming red.
function scoreGlow(score: number): string {
  if (score >= 80) return 'rgba(127, 176, 105, 0.6)' // growth green
  if (score >= 60) return 'rgba(245, 184, 65, 0.62)' // giraffe gold
  if (score >= 30) return 'rgba(255, 217, 109, 0.58)' // warm gold
  return 'rgba(224, 120, 86, 0.45)' // gentle coral
}

const steps = [
  { key: 'conversationStarted', label: 'Start', Icon: MessageCircle },
  { key: 'feelingExpressed', label: 'Feeling', Icon: Heart },
  { key: 'needIdentified', label: 'Need', Icon: Sprout },
  { key: 'requestMade', label: 'Request', Icon: Handshake },
  { key: 'resolutionReached', label: 'Done', Icon: Star },
] as const

function ProgressSteps({ milestones }: { milestones: Milestones }) {
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
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-giraffe-100 mx-6" />
        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-empathy-high transition-all duration-500"
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
          const StepIcon = step.Icon

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-empathy-high text-brown-900 shadow-sm'
                    : isCurrent
                      ? 'bg-giraffe-100 text-brown-800 border-2 border-giraffe-400'
                      : 'bg-giraffe-50 text-brown-400'
                }`}
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

      <div className="relative bg-giraffe-50/60 backdrop-blur-sm rounded-lg p-3.5 space-y-3 border border-giraffe-100">
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
            className="h-full bg-gradient-to-r from-giraffe-400 to-giraffe-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${scorePercentage}%` }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-giraffe-100"
            >
              <span className="text-xs text-brown-500">{metric.label}</span>
              <span className="font-semibold text-sm text-brown-800">
                {metric.value}
              </span>
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
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brown-600 mb-1">
            Try next
          </p>
          <p className="text-sm text-brown-800 leading-relaxed font-medium">
            {nextStep}
          </p>
        </div>
      )}
    </div>
  )
}

export function FeedbackPanel({
  feedback,
  isLoading = false,
  messageCount = 0,
  learningObjectives: _learningObjectives = [],
  characterMood = 0,
  characterName,
  milestones,
}: FeedbackPanelProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-giraffe-50 shadow-lg border border-giraffe-100 flex flex-col max-h-full">
      <AmbientHeader mood={characterMood} characterName={characterName} />

      {/* Content - hugs its content, scrolls internally only when it would
          otherwise run past the available height */}
      <div className="min-h-0 p-4 space-y-4 overflow-y-auto">
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
                className="animate-step-in"
                style={{ animationDelay: '90ms' }}
              >
                <ProgressSteps milestones={milestones} />
              </div>
            )}

            <div className="animate-step-in" style={{ animationDelay: '180ms' }}>
              <FeedbackNotes feedback={feedback} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 flex-1 ">
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
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
