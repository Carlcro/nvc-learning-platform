import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface SkillStatsProps {
  stats: UserStats
}

// Warm, on-palette band color for a skill score (0-25), mirroring the
// EmpathyMeter: the hue reflects how close the skill is to giraffe, never an
// arbitrary per-skill color. Coral signals "keep practicing", never alarm.
function bandColor(score: number): string {
  const pct = (score / 25) * 100
  if (pct >= 90) return 'bg-empathy-high'
  if (pct >= 70) return 'bg-giraffe-400'
  if (pct >= 50) return 'bg-giraffe-300'
  return 'bg-empathy-low'
}

export function SkillStats({ stats }: SkillStatsProps) {
  const skills = [
    { label: 'Observation', score: stats.averageScores.observation },
    { label: 'Feeling', score: stats.averageScores.feeling },
    { label: 'Need', score: stats.averageScores.need },
    { label: 'Request', score: stats.averageScores.request },
  ]

  return (
    <Card className="overflow-hidden h-full">
      {/* Header */}
      <div className="bg-giraffe-50 px-6 py-3 border-b border-giraffe-100">
        <h2 className="text-sm font-semibold text-brown-700">
          Skill breakdown
        </h2>
      </div>

      <CardBody>
        <div className="space-y-5">
          {skills.map((skill) => (
            <div key={skill.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-brown-700">
                  {skill.label}
                </span>
                <span className="font-bold text-brown-800">
                  {Math.round(skill.score)}/25
                </span>
              </div>
              <div
                className="h-3 bg-giraffe-100 rounded-full overflow-hidden border border-giraffe-200"
                role="progressbar"
                aria-valuenow={Math.round(skill.score)}
                aria-valuemin={0}
                aria-valuemax={25}
                aria-label={`${skill.label} score`}
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${bandColor(skill.score)}`}
                  style={{ width: `${(skill.score / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
