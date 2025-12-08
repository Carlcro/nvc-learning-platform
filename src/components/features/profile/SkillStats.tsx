import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface SkillStatsProps {
  stats: UserStats
}

export function SkillStats({ stats }: SkillStatsProps) {
  const skills = [
    {
      label: 'Observation',
      score: stats.averageScores.observation,
      color: 'from-blue-400 to-blue-500',
    },
    {
      label: 'Feeling',
      score: stats.averageScores.feeling,
      color: 'from-rose-400 to-rose-500',
    },
    {
      label: 'Need',
      score: stats.averageScores.need,
      color: 'from-emerald-400 to-emerald-500',
    },
    {
      label: 'Request',
      score: stats.averageScores.request,
      color: 'from-purple-400 to-purple-500',
    },
  ]

  return (
    <Card className="overflow-hidden h-full">
      {/* Header */}
      <div className="bg-linear-to-r from-giraffe-500 to-giraffe-400 px-6 py-3 text-white">
        <div className="text-sm font-semibold uppercase tracking-wider">
          Skill Breakdown
        </div>
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
              <div className="h-3 bg-giraffe-100 rounded-full overflow-hidden border border-giraffe-200">
                <div
                  className={`h-full rounded-full transition-all duration-1000 bg-linear-to-r ${skill.color}`}
                  style={{ width: `${(skill.score / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-giraffe-100">
          <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-brown-700">Overall Average</span>
              <span className="text-2xl font-bold text-giraffe-600">
                {Math.round(stats.averageScores.overall)}/100
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
