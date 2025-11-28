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
      color: 'bg-blue-400',
    },
    {
      label: 'Feeling',
      score: stats.averageScores.feeling,
      color: 'bg-red-400',
    },
    { label: 'Need', score: stats.averageScores.need, color: 'bg-green-400' },
    {
      label: 'Request',
      score: stats.averageScores.request,
      color: 'bg-purple-400',
    },
  ]

  return (
    <Card className="border-2 border-giraffe-200">
      <CardBody>
        <h3 className="text-lg font-bold text-brown-800 mb-6">
          Skill Breakdown
        </h3>

        <div className="space-y-6">
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
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${skill.color}`}
                  style={{ width: `${(skill.score / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-bold text-brown-800">Overall Average</span>
            <span className="text-2xl font-bold text-giraffe-600">
              {Math.round(stats.averageScores.overall)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
