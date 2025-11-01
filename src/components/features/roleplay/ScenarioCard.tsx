import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

export interface ScenarioCardProps {
  id: string | { __id?: string }
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  estimatedDuration: number
  unlockLevel: number
  isLocked: boolean
  onStart: (scenarioId: string | unknown) => void
}

const categoryEmojis: Record<string, string> = {
  workplace: '💼',
  family: '👨‍👩‍👧‍👦',
  friendship: '🤝',
  self_expression: '🗣️',
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-giraffe-100 text-giraffe-800',
  advanced: 'bg-empathy-low text-white',
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function ScenarioCard({
  id,
  title,
  description,
  category,
  difficulty,
  characterName,
  estimatedDuration,
  unlockLevel,
  isLocked,
  onStart,
}: ScenarioCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-giraffe-500 to-giraffe-400 px-6 py-4 text-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold text-giraffe-50 mb-1">
              {categoryEmojis[category]} {category.replace('_', ' ').toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </div>
        </div>
      </div>

      {/* Body */}
      <CardBody className="flex-grow flex flex-col gap-4">
        {/* Description */}
        <p className="text-brown-700 text-sm leading-relaxed">{description}</p>

        {/* Character Info */}
        <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
          <div className="text-xs font-semibold text-giraffe-700 mb-1">Character</div>
          <div className="font-semibold text-brown-800">{characterName}</div>
        </div>

        {/* Duration and Level */}
        <div className="flex items-center justify-between text-sm text-brown-600 pt-2 border-t border-giraffe-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{estimatedDuration} min</span>
          </div>
          {isLocked && (
            <div className="flex items-center gap-1 text-empathy-low">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1C6.48 1 2 5.48 2 11v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm0 2c4.41 0 8 3.59 8 8v8H4v-8c0-4.41 3.59-8 8-8z" />
              </svg>
              <span className="text-xs font-semibold">Level {unlockLevel}</span>
            </div>
          )}
        </div>
      </CardBody>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-giraffe-100 bg-giraffe-50">
        {isLocked ? (
          <Button disabled className="w-full" variant="outline">
            Unlock at Level {unlockLevel}
          </Button>
        ) : (
          <Button onClick={() => onStart(id)} className="w-full" variant="primary">
            Start Scenario
          </Button>
        )}
      </div>
    </Card>
  )
}
