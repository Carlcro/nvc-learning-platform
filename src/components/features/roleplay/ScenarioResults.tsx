/**
 * ScenarioResults Component
 *
 * The success moment after finishing a scenario, told as a journey: a trail
 * draws itself through the four NVC steps the user walked and ends at the
 * connection they made - expressing themselves and being heard. The relational
 * payoff leads; the numeric score is a quiet supporting detail, in keeping with
 * "show growth, not grades."
 */

import { useMemo } from 'react'
import { Award, Ear } from 'lucide-react'
import { EmpathyMeter } from './EmpathyMeter'
import type { Milestones } from './MilestoneProgress'
import type { EarnedAchievement } from '~/hooks/useConversation'
import { Button } from '~/components/ui/Button'

interface ScenarioResultsProps {
  finalScore: number
  stars: number
  pointsEarned?: number
  newAchievements?: Array<EarnedAchievement>
  scenarioTitle: string
  characterName: string
  characterHiddenNeeds?: Array<string>
  messageCount: number
  milestones?: Milestones
  onRetry: () => void
  onNext: () => void
  onViewTranscript: () => void
}

function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Partial'
  return 'Keep practicing'
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

export function ScenarioResults({
  finalScore,
  stars: _stars,
  pointsEarned = 0,
  newAchievements = [],
  scenarioTitle,
  characterName,
  characterHiddenNeeds = [],
  messageCount,
  milestones,
  onRetry,
  onNext,
  onViewTranscript,
}: ScenarioResultsProps) {
  // The four steps walked, then the connection reached. Reaching the results screen
  // requires completing the arc, so these are normally all true; we still read
  // the milestones so a partial path would render honestly.
  const stations = [
    { label: 'You opened the conversation', reached: true },
    { label: 'You named what you felt', reached: !!milestones?.feelingExpressed },
    {
      label: 'You uncovered the need beneath it',
      reached: !!milestones?.needIdentified,
    },
    { label: 'You made a clear request', reached: !!milestones?.requestMade },
    {
      label: `You connected with ${characterName}`,
      sub: 'You expressed yourself and were heard.',
      reached: true,
      final: true as const,
    },
  ]

  return (
    <div className="relative min-h-screen bg-linear-to-b from-giraffe-50 to-cream px-4 pt-24 pb-12">
      <LightMotes />

      <div className="relative z-10 mx-auto max-w-md animate-step-in">
        {/* Header - warm and relational, never a grade */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-brown-500">{scenarioTitle}</p>
          <h1 className="mt-1 text-3xl font-bold text-brown-800 text-balance">
            Look how far you came
          </h1>
        </div>

        {/* The journey path - the hero */}
        <div className="rounded-2xl bg-white border border-giraffe-100 shadow-sm p-6 sm:p-8">
          <ol className="relative">
            {stations.map((s, i) => {
              const last = 'final' in s && s.final
              const dotDelay = 0.15 + i * 0.55

              return (
                <li key={i} className="flex gap-4 items-stretch">
                  {/* Rail column: the node, and the trail down to the next */}
                  <div className="flex flex-col items-center w-14 shrink-0">
                    {last ? (
                      <span
                        className="inline-block animate-node-ignite"
                        style={{ animationDelay: `${dotDelay}s` }}
                      >
                        <span className="animate-connect-glow flex items-center justify-center w-14 h-14 rounded-full bg-empathy-high text-white">
                          <HeartIcon className="w-6 h-6" />
                        </span>
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
                              i === stations.length - 2
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
                    className={`animate-step-in ${last ? 'pt-1.5 pb-1' : 'pt-2 pb-8'}`}
                    style={{ animationDelay: `${dotDelay + 0.05}s` }}
                  >
                    <p
                      className={`leading-snug ${
                        last
                          ? 'text-xl font-bold text-brown-800'
                          : s.reached
                            ? 'text-brown-700 font-medium'
                            : 'text-brown-400 font-medium'
                      }`}
                    >
                      {s.label}
                    </p>
                    {'sub' in s && s.sub && (
                      <p className="text-sm text-brown-500 mt-1">{s.sub}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* The score, woven in quietly at the end of the path */}
          <div className="mt-2 pt-5 border-t border-giraffe-100">
            <EmpathyMeter score={finalScore} showLabel={false} size="sm" />
            <p className="mt-2 text-xs text-brown-500">
              Empathy {finalScore} · {scoreLabel(finalScore)} · {messageCount}{' '}
              messages
              {pointsEarned > 0 && (
                <>
                  {' '}
                  ·{' '}
                  <span className="font-semibold text-brown-700">
                    +{pointsEarned} points
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* What was underneath - the empathy payoff. Revealing the character's
            hidden needs turns every conversation into a small mystery solved. */}
        {characterHiddenNeeds.length > 0 && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '2.6s' }}
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
                ? `You reached toward this during the conversation. That is what helped ${characterName} open up.`
                : `Next time, try wondering out loud what ${characterName} might be feeling or needing. Guessing at this is what opens people up.`}
            </p>
          </div>
        )}

        {/* Newly earned badges */}
        {newAchievements.length > 0 && (
          <div
            className="mt-6 rounded-2xl bg-white border border-giraffe-100 shadow-sm p-5 animate-step-in"
            style={{ animationDelay: '2.9s' }}
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

        {/* Actions: the forward step leads, the two lighter actions share a row */}
        <div className="mt-6 space-y-3">
          <Button
            variant="primary"
            onClick={onNext}
            className="w-full whitespace-nowrap"
          >
            Keep going
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onViewTranscript}
              className="flex-1 whitespace-nowrap"
            >
              View transcript
            </Button>
            <Button
              variant="secondary"
              onClick={onRetry}
              className="flex-1 whitespace-nowrap"
            >
              Practice again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
