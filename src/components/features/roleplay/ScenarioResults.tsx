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
import type { Messages } from '~/i18n/messages'
import { Button } from '~/components/ui/Button'
import { StarIcon } from '~/components/ui/Icons'
import {
  NVC_COMPONENTS,
  pickRecommendedScenario,
  skillResource,
  summarizeConversation,
} from '~/lib/conversationInsights'
import { useLocale, useT } from '~/i18n/useT'

type ScreenCopy = Messages['results']['screen']

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

function scoreLabel(score: number, labels: ScreenCopy['scoreLabel']): string {
  if (score >= 90) return labels.excellent
  if (score >= 70) return labels.good
  if (score >= 50) return labels.gettingThere
  return labels.keepPracticing
}

/** How this run compares with the best one before it, said plainly. */
function comparisonLine(
  finalScore: number,
  previousBest: number | undefined,
  copy: ScreenCopy['comparison'],
): string {
  if (previousBest === undefined) {
    return copy.firstRun
  }
  if (finalScore > previousBest) {
    return copy.newBest(previousBest)
  }
  if (finalScore === previousBest) {
    return copy.levelWithBest(previousBest)
  }
  return copy.belowBest(previousBest)
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
  copy: ScreenCopy['ending']
}): { connected: boolean; headline: string; label: string; sub: string } {
  const { characterName, finalMood, milestones, focus, copy } = args
  const connected = !!milestones?.resolutionReached || finalMood >= 5

  if (connected) {
    return {
      connected,
      headline: copy.connected.headline,
      label: copy.connected.label(characterName),
      sub: copy.connected.sub,
    }
  }

  // What they did manage, and the earliest piece still to come.
  const reachedByComponent: Record<NVCComponent, boolean> = {
    observation: !!milestones?.observationMade,
    feeling: !!milestones?.feelingExpressed,
    need: !!milestones?.needIdentified,
    request: !!milestones?.requestMade,
  }
  const managed = NVC_COMPONENTS.filter((c) => reachedByComponent[c]).map(
    (c) => copy.managed[c],
  )
  const nextPiece = focus
    ? copy.nextPiece[focus]
    : !milestones?.empathyShown
      ? copy.nextPieceEmpathy(characterName)
      : copy.nextPieceTime
  const didManage =
    managed.length > 0 ? copy.didManage(managed) : copy.didManageNothing

  if (finalMood >= 0) {
    return {
      connected,
      headline: copy.listening.headline,
      label: copy.listening.label(characterName),
      sub: copy.listening.sub(didManage, nextPiece),
    }
  }
  return {
    connected,
    headline: copy.guarded.headline,
    label: copy.guarded.label(characterName),
    sub: copy.guarded.sub(didManage, nextPiece),
  }
}

function Stars({ stars }: { stars: number }) {
  const t = useT()
  return (
    <span
      className="inline-flex gap-1"
      role="img"
      aria-label={t.results.screen.starsAria(stars)}
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
  const locale = useLocale()
  const scenarios = useQuery(api.scenarios.listByOrder, { locale })
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
  const t = useT()
  const copy = t.results.screen
  const navigate = useNavigate()
  const nextScenario = useNextScenario(scenarioId)
  const insights = useMemo(() => summarizeConversation(messages), [messages])
  const ending = describeEnding({
    characterName,
    finalMood,
    milestones,
    focus: insights.focus,
    copy: copy.ending,
  })

  // Each station is read from the milestones, so a partial path renders
  // honestly: wrapping up is open to everyone after a few turns, not only to
  // those who completed the arc.
  const stations = [
    { label: copy.stations.opened, reached: true },
    {
      label: copy.stations.observation,
      reached: !!milestones?.observationMade,
    },
    { label: copy.stations.feeling, reached: !!milestones?.feelingExpressed },
    {
      label: copy.stations.need,
      reached: !!milestones?.needIdentified,
    },
    { label: copy.stations.request, reached: !!milestones?.requestMade },
    {
      label: ending.label,
      sub: ending.sub,
      reached: ending.connected,
      final: true as const,
    },
  ]

  const focus = insights.focus
  const focusResource = focus ? skillResource(focus, t.results.skills) : null
  const strongestResource = insights.strongest
    ? skillResource(insights.strongest, t.results.skills)
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
        ? copy.actions.practiceAgainFocus(focusResource.plural)
        : copy.actions.practiceAgain}
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
                        <span className="sr-only">{copy.stations.notYet}</span>
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
                {copy.scoreLine.empathy}{' '}
                <span className="font-semibold text-brown-700">
                  {finalScore}
                </span>{' '}
                {copy.scoreLine.afterScore(
                  scoreLabel(finalScore, copy.scoreLabel),
                  userMessageCount,
                )}
              </p>
            </div>
            <EmpathyMeter score={finalScore} showLabel={false} size="sm" />
            {summary && (
              <p className="mt-3 flex items-start gap-2 text-sm text-brown-700 leading-relaxed text-pretty">
                <TrendingUp
                  className="w-4 h-4 mt-0.5 shrink-0 text-giraffe-700"
                  aria-hidden="true"
                />
                {comparisonLine(
                  finalScore,
                  summary.previousBestScore,
                  copy.comparison,
                )}
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
                  {copy.earned.points(pointsEarned)}
                </p>
                <p className="text-xs text-brown-600">
                  {copy.earned.pointsLabel}
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-brown-800 tabular-nums">
                  {summary.levelAfter}
                </p>
                <p className="text-xs text-brown-600">
                  {leveledUp
                    ? copy.earned.newLevelLabel
                    : copy.earned.levelLabel}
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
                  {copy.earned.streakLabel(summary.currentStreak)}
                </p>
              </div>
            </div>
            <p className="mt-3 pt-3 border-t border-giraffe-100 text-xs text-brown-600 leading-relaxed text-center text-pretty">
              {leveledUp
                ? copy.earned.reachedLevel(summary.levelAfter)
                : copy.earned.toNextLevel(
                    summary.pointsToNextLevel,
                    summary.levelAfter + 1,
                  )}
              {pointsEarned === 0
                ? copy.earned.noPoints
                : summary.challengeBonus > 0
                  ? copy.earned.challengeBonus(summary.challengeBonus)
                  : summary.streakExtended
                    ? copy.earned.streakExtended
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
              {copy.takeaway.title}
            </h2>
            <div className="space-y-4">
              {insights.bestMessage && (
                <div>
                  <p className="text-xs font-semibold text-brown-600 mb-1">
                    {copy.takeaway.bestMessage}
                  </p>
                  <blockquote className="border-l-4 border-empathy-high pl-3 text-sm text-brown-800 leading-relaxed text-pretty">
                    {insights.bestMessage.content}
                  </blockquote>
                </div>
              )}
              {strongestResource && (
                <p className="text-sm text-brown-700 leading-relaxed text-pretty">
                  <span className="font-semibold text-brown-800">
                    {copy.takeaway.strongest(strongestResource.plural)}
                  </span>{' '}
                  {copy.takeaway.strongestAfter}
                </p>
              )}
              {focusResource && (
                <div className="p-3 bg-giraffe-100/70 rounded-lg border border-giraffe-200">
                  <p className="text-xs font-semibold text-brown-600 mb-1">
                    {insights.focusUntried
                      ? copy.takeaway.stillToTry(focusResource.plural)
                      : copy.takeaway.worthAttention(focusResource.plural)}
                  </p>
                  <p className="text-sm text-brown-800 leading-relaxed font-medium text-pretty">
                    {focusResource.nudge}
                  </p>
                  <Link
                    to={focusResource.to}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-giraffe-800 hover:text-giraffe-900 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    {copy.takeaway.openResource(focusResource.label)}
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
          <div className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-giraffe-100 text-brown-700">
                <Repeat2 className="w-4 h-4" aria-hidden="true" />
              </span>
              <h2 className="font-bold text-brown-800">
                {copy.reflection.title}
              </h2>
            </div>
            <p className="text-xs font-semibold text-brown-600 mb-1">
              {copy.reflection.youSaid}
            </p>
            <p className="text-sm text-brown-600 leading-relaxed text-pretty mb-3">
              {reflection.original}
            </p>
            <p className="text-xs font-semibold text-brown-600 mb-1">
              {copy.reflection.couldSound}
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
                {copy.hiddenNeeds.title(characterName)}
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
                  ? copy.hiddenNeeds.reachedConnected(characterName)
                  : copy.hiddenNeeds.reachedNotConnected
                : copy.hiddenNeeds.nextTime(characterName)}
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
              {copy.badges(newAchievements.length)}
            </h2>
            <ul className="space-y-3">
              {newAchievements.map((achievement) => (
                <li key={achievement.id} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-giraffe-100 text-giraffe-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-brown-800 leading-tight">
                      {t.achievements[achievement.id]?.title ??
                        achievement.title}
                    </p>
                    <p className="text-sm text-brown-600">
                      {t.achievements[achievement.id]?.description ??
                        achievement.description}
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
            {copy.encouragement}
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
              <span className="text-balance">
                {copy.actions.nextUp(nextScenario.title)}
              </span>
            </Button>
          ) : (
            <Button variant="primary" onClick={onNext} className="w-full">
              {copy.actions.backToScenarios}
            </Button>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onViewTranscript}
              className="flex-1 whitespace-nowrap"
            >
              {copy.actions.reviewTranscript}
            </Button>
            {retryLeads
              ? nextScenario && (
                  <Button
                    variant="secondary"
                    onClick={goToNextScenario}
                    className="flex-1 whitespace-nowrap"
                  >
                    {copy.actions.tryAnother}
                  </Button>
                )
              : retryButton(false)}
          </div>
          {(retryLeads || nextScenario) && (
            <button
              type="button"
              onClick={onNext}
              className="block mx-auto text-sm font-semibold text-brown-600 hover:text-brown-900 underline underline-offset-2 cursor-pointer rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
            >
              {copy.actions.backToScenarios}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
