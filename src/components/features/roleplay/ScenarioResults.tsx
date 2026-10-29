/**
 * ScenarioResults Component
 *
 * The moment after finishing a scenario, told as a journey: a trail draws
 * itself through the NVC steps the user walked and ends where the conversation
 * actually ended. When the character opened up, that connection is the
 * celebration. When they did not, the screen says so kindly and points at the
 * next piece to try, because praise only means something if it is honest.
 *
 * Below the trail: how this run compares with the last one, what it earned,
 * one thing to carry into the next attempt, one message said another way, and
 * a concrete next step. "Show growth, not grades."
 */

import { useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Award, BookOpen, Ear, Flame, Repeat2, TrendingUp } from 'lucide-react'
import { EmpathyMeter } from './EmpathyMeter'
import type { Message } from './ConversationView'
import type { Milestones } from './milestones'
import type {
  CompletionSummary,
  EarnedAchievement,
} from '~/hooks/useConversation'
import type { NVCComponent } from '~/lib/conversationInsights'
import { Button } from '~/components/ui/Button'
import { StarIcon } from '~/components/ui/Icons'
import {
  SKILL_RESOURCES,
  pickRecommendedScenario,
  summarizeConversation,
} from '~/lib/conversationInsights'

interface ScenarioResultsProps {
  finalScore: number
  stars: number
  pointsEarned?: number
  newAchievements?: Array<EarnedAchievement>
  /** What completing changed (previous best, level, streak). */
  summary?: CompletionSummary | null
  /** One of the user's messages said another way, once it has been written. */
  reflection?: { original: string; rewrite: string; why: string } | null
  scenarioId: string
  scenarioTitle: string
  characterName: string
  characterHiddenNeeds?: Array<string>
  /** Where the character's mood stood when the conversation ended. */
  finalMood: number
  messages: Array<Message>
  milestones?: Milestones
  onRetry: (focus?: NVCComponent) => void
  onNext: () => void
  onViewTranscript: () => void
}

// Below this the scenario has not been passed (no star), so another run at it
// is the most useful next step.
const PASSING_SCORE = 60

function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Getting there'
  return 'Keep practicing'
}

/** How this run compares with the best one before it, said plainly. */
function comparisonLine(finalScore: number, previousBest?: number): string {
  if (previousBest === undefined) {
    return 'Your first finished run of this scenario. Now there is something to build on.'
  }
  if (finalScore > previousBest) {
    return `Up from ${previousBest} last time. That is your new best here.`
  }
  if (finalScore === previousBest) {
    return `Level with your best of ${previousBest}. Steady is a skill too.`
  }
  return `Your best here is still ${previousBest}. Every run teaches something different.`
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 20.364l-7.682-7.682a4.5 4.5 0 016.364-6.364L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364z" />
    </svg>
  )
}

/**
 * Warm light motes drifting gently upward behind the celebration. Purely
 * decorative; the keyframe keeps them invisible under reduced-motion.
 */
function LightMotes() {
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 80,
        size: Math.round(Math.random() * 5 + 4),
        dur: (Math.random() * 3 + 5).toFixed(2),
        delay: (Math.random() * 5).toFixed(2),
        opacity: (Math.random() * 0.3 + 0.3).toFixed(2),
      })),
    [],
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full bg-giraffe-300 animate-mote-rise"
          style={
            {
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
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
 * How the conversation actually ended, for the last station of the trail.
 * Connection is only claimed when the character really opened up.
 */
function describeEnding(args: {
  characterName: string
  finalMood: number
  milestones?: Milestones
  /** The piece to work on next, shared with the takeaway card below. */
  focus: NVCComponent | null
}): { connected: boolean; headline: string; label: string; sub: string } {
  const { characterName, finalMood, milestones, focus } = args
  const connected = !!milestones?.resolutionReached || finalMood >= 5

  if (connected) {
    return {
      connected,
      headline: 'Look how far you came',
      label: `You connected with ${characterName}`,
      sub: 'You expressed yourself and were heard.',
    }
  }

  // What they did manage, and the earliest piece still to come.
  const managed = [
    milestones?.observationMade && 'a clear observation',
    milestones?.feelingExpressed && 'a feeling',
    milestones?.needIdentified && 'a need',
    milestones?.requestMade && 'a request',
  ].filter(Boolean) as Array<string>
  const nextPieceByFocus: Record<NVCComponent, string> = {
    observation:
      'Describing what happened, with no verdict on it, is the piece to try next time.',
    feeling: 'Naming a feeling is the piece to try next time.',
    need: 'The need beneath the feeling is the piece to try next time.',
    request: 'A clear request is the piece to try next time.',
  }
  const nextPiece = focus
    ? nextPieceByFocus[focus]
    : !milestones?.empathyShown
      ? `Wondering aloud what ${characterName} was feeling is the piece to try next time.`
      : 'A little more time might have been all it needed.'
  const didManage =
    managed.length > 0
      ? `You brought ${managed.join(' and ')}, which is the hard part.`
      : 'You stayed in a hard conversation, which is where it starts.'

  if (finalMood >= 0) {
    return {
      connected,
      headline: 'A real step forward',
      label: `${characterName} was starting to listen`,
      sub: `Not fully open yet. ${didManage} ${nextPiece}`,
    }
  }
  return {
    connected,
    headline: 'That was a hard one, and you stayed with it',
    label: `${characterName} was still guarded at the end`,
    sub: `That happens in real conversations too. ${didManage} ${nextPiece}`,
  }
}

function Stars({ stars }: { stars: number }) {
  return (
    <span
      className="inline-flex gap-1"
      role="img"
      aria-label={`${stars} of 3 stars`}
    >
      {[0, 1, 2].map((i) => (
        <StarIcon
          key={i}
          className={`w-6 h-6 ${i < stars ? 'text-giraffe-700' : 'text-brown-200'}`}
        />
      ))}
    </span>
  )
}

/**
 * The concrete next step. Reads the ladder and the user's progress itself so
 * the results screen can name a scenario rather than drop people at the hub.
 */
function useNextScenario(currentScenarioId: string) {
  const scenarios = useQuery(api.scenarios.listByOrder)
  const progress = useQuery(api.scenarioProgress.getUserProgress)
  const overall = useQuery(api.userProgress.getByUserId)
  if (!scenarios || !progress) return null
  return pickRecommendedScenario(
    scenarios,
    progress,
    overall?.level ?? 1,
    currentScenarioId,
  )
}

export function ScenarioResults({
  finalScore,
  stars,
  pointsEarned = 0,
  newAchievements = [],
  summary = null,
  reflection = null,
  scenarioId,
  scenarioTitle,
  characterName,
  characterHiddenNeeds = [],
  finalMood,
  messages,
  milestones,
  onRetry,
  onNext,
  onViewTranscript,
}: ScenarioResultsProps) {
  const navigate = useNavigate()
  const nextScenario = useNextScenario(scenarioId)
  const insights = useMemo(() => summarizeConversation(messages), [messages])
  const ending = describeEnding({
    characterName,
    finalMood,
    milestones,
    focus: insights.focus,
  })

  // Each station is read from the milestones, so a partial path renders
  // honestly: wrapping up is open to everyone after a few turns, not only to
  // those who completed the arc.
  const stations = [
    { label: 'You opened the conversation', reached: true },
    {
      label: 'You described what happened',
      reached: !!milestones?.observationMade,
    },
    { label: 'You named what you felt', reached: !!milestones?.feelingExpressed },
    {
      label: 'You uncovered the need beneath it',
      reached: !!milestones?.needIdentified,
    },
    { label: 'You made a clear request', reached: !!milestones?.requestMade },
    {
      label: ending.label,
      sub: ending.sub,
      reached: ending.connected,
      final: true as const,
    },
  ]

  const focus = insights.focus
  const focusResource = focus ? SKILL_RESOURCES[focus] : null
  const strongestResource = insights.strongest
    ? SKILL_RESOURCES[insights.strongest]
    : null
  const hasTakeaway =
    !!focusResource || !!strongestResource || !!insights.bestMessage

  // Below a pass, another run at this scenario is the most useful next step,
  // so it leads. Otherwise the next scenario on the ladder does.
  const retryLeads = finalScore < PASSING_SCORE
  const leveledUp = !!summary && summary.levelAfter > summary.levelBefore
  const userMessageCount = messages.filter((m) => m.role === 'user').length

  const goToNextScenario = () => {
    if (!nextScenario) return
    navigate({ to: `/practice/${nextScenario._id}/brief` })
  }

  const retryButton = (primary: boolean) => (
    <Button
      variant={primary ? 'primary' : 'secondary'}
      onClick={() => onRetry(focus ?? undefined)}
      className={primary ? 'w-full' : 'flex-1 whitespace-nowrap'}
    >
      {primary && focusResource
        ? `Practice again, with an eye on ${focusResource.plural}`
        : 'Practice again'}
    </Button>
  )

  return (
    <div className="relative min-h-screen bg-linear-to-b from-giraffe-50 to-paper px-4 pt-24 pb-12">
      {ending.connected && <LightMotes />}

      <div className="relative z-10 mx-auto max-w-md animate-step-in">
        {/* Header - warm and relational, never a grade */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-brown-500">{scenarioTitle}</p>
          <h1 className="mt-1 text-3xl font-bold text-brown-800 text-balance">
            {ending.headline}
          </h1>
        </div>

        {/* The journey path - the hero */}
        <div className="rounded-2xl bg-white border border-giraffe-100 shadow-sm p-6 sm:p-8">
          <ol className="relative">
            {stations.map((s, i) => {
              const last = 'final' in s && s.final
              const dotDelay = 0.15 + i * 0.4

              return (
                <li key={i} className="flex gap-4 items-stretch">
                  {/* Rail column: the node, and the trail down to the next */}
                  <div className="flex flex-col items-center w-14 shrink-0">
                    {last ? (
                      <span
                        className="inline-block animate-node-ignite"
                        style={{ animationDelay: `${dotDelay}s` }}
                      >
                        {s.reached ? (
                          <span className="animate-connect-glow flex items-center justify-center w-14 h-14 rounded-full bg-empathy-high text-white">
                            <HeartIcon className="w-6 h-6" />
                          </span>
                        ) : (
                          // Not there yet: the same heart, waiting rather
                          // than glowing.
                          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-giraffe-50 border-2 border-dashed border-giraffe-300 text-giraffe-400">
                            <HeartIcon className="w-6 h-6" />
                          </span>
                        )}
                      </span>
                    ) : (
                      <span
                        className={`animate-node-ignite flex items-center justify-center w-9 h-9 rounded-full ${
                          s.reached
                            ? 'bg-giraffe-400 text-brown-900 shadow-sm'
                            : 'bg-giraffe-100 text-brown-400'
                        }`}
                        style={{ animationDelay: `${dotDelay}s` }}
                      >
                        {s.reached && <CheckMark />}
                      </span>
                    )}

                    {!last && (
                      <span className="relative w-0.5 flex-1 my-1 overflow-hidden rounded-full bg-giraffe-100">
                        {s.reached && (
                          <span
                            className={`animate-connector absolute inset-0 ${
                              i === stations.length - 2 && ending.connected
                                ? 'bg-linear-to-b from-giraffe-400 to-empathy-high'
                                : 'bg-linear-to-b from-giraffe-300 to-giraffe-400'
                            }`}
                            style={{ animationDelay: `${dotDelay + 0.3}s` }}
                          />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`animate-step-in ${last ? 'pt-1.5 pb-1' : 'pt-2 pb-6'}`}
                    style={{ animationDelay: `${dotDelay + 0.05}s` }}
                  >
                    <p
                      className={`leading-snug ${
                        last
                          ? 'text-xl font-bold text-brown-800 text-balance'
                          : s.reached
                            ? 'text-brown-700 font-medium'
                            : 'text-brown-400 font-medium'
                      }`}
                    >
                      {s.label}
                      {!last && !s.reached && (
                        <span className="sr-only"> (not yet)</span>
                      )}
                    </p>
                    {'sub' in s && s.sub && (
                      <p className="text-sm text-brown-600 mt-1 leading-relaxed text-pretty">
                        {s.sub}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* The score, with the comparison that makes it mean something */}
          <div className="mt-2 pt-5 border-t border-giraffe-100">
            <div className="flex items-center justify-between gap-3 mb-3">
              <Stars stars={stars} />
              <p className="text-xs text-brown-500 text-right">
                Empathy{' '}
                <span className="font-semibold text-brown-700">
                  {finalScore}
                </span>{' '}
                · {scoreLabel(finalScore)} · {userMessageCount}{' '}
                {userMessageCount === 1 ? 'message' : 'messages'}
              </p>
            </div>
            <EmpathyMeter score={finalScore} showLabel={false} size="sm" />
            {summary && (
              <p className="mt-3 flex items-start gap-2 text-sm text-brown-700 leading-relaxed text-pretty">
                <TrendingUp
                  className="w-4 h-4 mt-0.5 shrink-0 text-giraffe-700"
                  aria-hidden="true"
                />
                {comparisonLine(finalScore, summary.previousBestScore)}
              </p>
            )}
          </div>
        </div>

        {/* What this run added up to: points, level, streak */}
        {summary && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '2.4s' }}
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-brown-800 tabular-nums">
                  +{pointsEarned}
                </p>
                <p className="text-xs text-brown-600">points</p>
              </div>
              <div>
                <p className="text-xl font-bold text-brown-800 tabular-nums">
                  {summary.levelAfter}
                </p>
                <p className="text-xs text-brown-600">
                  {leveledUp ? 'new level' : 'level'}
                </p>
              </div>
              <div>
                <p className="inline-flex items-center gap-1 text-xl font-bold text-brown-800 tabular-nums">
                  <Flame
                    className="w-4 h-4 text-giraffe-700"
                    aria-hidden="true"
                  />
                  {summary.currentStreak}
                </p>
                <p className="text-xs text-brown-600">
                  day streak
                </p>
              </div>
            </div>
            <p className="mt-3 pt-3 border-t border-giraffe-100 text-xs text-brown-600 leading-relaxed text-center text-pretty">
              {leveledUp
                ? `You reached Level ${summary.levelAfter}. `
                : `${summary.pointsToNextLevel} points to Level ${summary.levelAfter + 1}. `}
              {pointsEarned === 0
                ? 'Points come from new stars on a scenario, so beating your best here is what earns more.'
                : summary.challengeBonus > 0
                  ? `That includes ${summary.challengeBonus} for today's challenge.`
                  : summary.streakExtended
                    ? 'Today now counts toward your streak.'
                    : ''}
            </p>
          </div>
        )}

        {/* One thing to carry into the next conversation */}
        {hasTakeaway && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '2.6s' }}
          >
            <h2 className="font-bold text-brown-800 mb-3">
              What to take with you
            </h2>
            <div className="space-y-4">
              {insights.bestMessage && (
                <div>
                  <p className="text-xs font-semibold text-brown-600 mb-1">
                    Your message that landed best
                  </p>
                  <blockquote className="border-l-4 border-empathy-high pl-3 text-sm text-brown-800 leading-relaxed text-pretty">
                    {insights.bestMessage.content}
                  </blockquote>
                </div>
              )}
              {strongestResource && (
                <p className="text-sm text-brown-700 leading-relaxed text-pretty">
                  <span className="font-semibold text-brown-800">
                    Your {strongestResource.plural} were the strongest part.
                  </span>{' '}
                  That is a skill you can lean on now.
                </p>
              )}
              {focusResource && (
                <div className="p-3 bg-giraffe-100/70 rounded-lg border border-giraffe-200">
                  <p className="text-xs font-semibold text-brown-600 mb-1">
                    {insights.focusUntried
                      ? `Still to try: ${focusResource.plural}`
                      : `Worth a little attention: ${focusResource.plural}`}
                  </p>
                  <p className="text-sm text-brown-800 leading-relaxed font-medium text-pretty">
                    {focusResource.nudge}
                  </p>
                  <Link
                    to={focusResource.to}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-giraffe-800 hover:text-giraffe-900 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    Open the {focusResource.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* One message said another way. During the conversation the coaching
            only hints, so people find their own words; afterwards a worked
            example is what helps it stick. */}
        {reflection && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-giraffe-100 text-brown-700">
                <Repeat2 className="w-4 h-4" aria-hidden="true" />
              </span>
              <h2 className="font-bold text-brown-800">
                One message, another way
              </h2>
            </div>
            <p className="text-xs font-semibold text-brown-600 mb-1">You said</p>
            <p className="text-sm text-brown-600 leading-relaxed text-pretty mb-3">
              {reflection.original}
            </p>
            <p className="text-xs font-semibold text-brown-600 mb-1">
              It could also sound like
            </p>
            <blockquote className="border-l-4 border-empathy-high pl-3 text-sm text-brown-800 font-medium leading-relaxed text-pretty">
              {reflection.rewrite}
            </blockquote>
            <p className="mt-3 text-sm text-brown-600 leading-relaxed text-pretty">
              {reflection.why}
            </p>
          </div>
        )}

        {/* What was underneath - the empathy payoff. Revealing the character's
            hidden needs turns every conversation into a small mystery solved. */}
        {characterHiddenNeeds.length > 0 && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '2.8s' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-giraffe-100 text-brown-700">
                <Ear className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-brown-800">
                What {characterName} needed underneath
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {characterHiddenNeeds.map((need) => (
                <span
                  key={need}
                  className="px-3 py-1 rounded-full bg-giraffe-50 border border-giraffe-200 text-sm text-brown-700"
                >
                  {need}
                </span>
              ))}
            </div>
            <p className="text-sm text-brown-600 leading-relaxed text-pretty">
              {milestones?.empathyShown
                ? ending.connected
                  ? `You reached toward this during the conversation. That is what helped ${characterName} open up.`
                  : `You reached toward this during the conversation. Keep doing that. It is what opens people up, even when it takes longer than one talk.`
                : `Next time, try wondering out loud what ${characterName} might be feeling or needing. Guessing at this is what opens people up.`}
            </p>
          </div>
        )}

        {/* Newly earned badges */}
        {newAchievements.length > 0 && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '3s' }}
          >
            <h2 className="font-bold text-brown-800 mb-3">
              {newAchievements.length === 1 ? 'New badge' : 'New badges'}
            </h2>
            <ul className="space-y-3">
              {newAchievements.map((achievement) => (
                <li key={achievement.id} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-giraffe-100 text-giraffe-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-brown-800 leading-tight">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-brown-600">
                      {achievement.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Encouragement from the guide */}
        <div className="mt-6 flex items-center gap-4 px-2">
          <img
            src="/giraff.png"
            alt=""
            aria-hidden="true"
            className="w-16 h-16 object-contain shrink-0"
          />
          <p className="text-sm text-brown-600 leading-relaxed">
            Growth, not perfection. Every conversation like this one makes the
            real ones a little easier.
          </p>
        </div>

        {/* Actions: one clear next step leads. Below a pass that is another
            run at this scenario; otherwise the next one on the ladder. */}
        <div className="mt-6 space-y-3">
          {retryLeads ? (
            retryButton(true)
          ) : nextScenario ? (
            <Button
              variant="primary"
              onClick={goToNextScenario}
              className="w-full"
            >
              <span className="text-balance">Next up: {nextScenario.title}</span>
            </Button>
          ) : (
            <Button variant="primary" onClick={onNext} className="w-full">
              Back to all scenarios
            </Button>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onViewTranscript}
              className="flex-1 whitespace-nowrap"
            >
              Review it turn by turn
            </Button>
            {retryLeads ? (
              nextScenario && (
                <Button
                  variant="secondary"
                  onClick={goToNextScenario}
                  className="flex-1 whitespace-nowrap"
                >
                  Try another
                </Button>
              )
            ) : (
              retryButton(false)
            )}
          </div>
          {(retryLeads || nextScenario) && (
            <button
              type="button"
              onClick={onNext}
              className="block mx-auto text-sm font-semibold text-brown-600 hover:text-brown-900 underline underline-offset-2 cursor-pointer rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
            >
              Back to all scenarios
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
