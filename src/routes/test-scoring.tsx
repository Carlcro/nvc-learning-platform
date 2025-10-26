import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'
import { Badge } from '~/components/ui/Badge'

export const Route = createFileRoute('/test-scoring')({
  component: TestScoringPage,
})

interface ScoringResult {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
  feedback: string
  isJackalLanguage: boolean
  jackalPhrases: Array<string>
  giraffeAlternative: string
  whatWentWell: string
}

function TestScoringPage() {
  const [userInput, setUserInput] = useState('')
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeNVC = useAction(api.ai.analyzeNVCResponse)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const analysis = await analyzeNVC({
        userMessage: userInput,
      })
      setResult(analysis as ScoringResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze message')
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalStatus = (total: number) => {
    if (total >= 90) return 'Excellent NVC (Pure Giraffe)'
    if (total >= 70) return 'Good NVC (Minor improvements)'
    if (total >= 50) return 'Partial NVC (Significant jackal)'
    return 'Needs practice (Mostly jackal)'
  }

  return (
    <main className="min-h-screen bg-giraffe-50 dark:bg-brown-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brown-800 dark:text-white mb-2">
            NVC Scoring Test Page
          </h1>
          <p className="text-brown-600 dark:text-brown-400">
            Enter text below to test the NVC analysis. This is for development
            testing only.
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-8">
          <CardBody>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label
                  htmlFor="userInput"
                  className="block text-sm font-medium text-brown-700 dark:text-brown-400 mb-2"
                >
                  Enter a message to analyze:
                </label>
                <textarea
                  id="userInput"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., 'When you arrive late without telling me, I feel frustrated because reliability is important to me. Would you be willing to text me if you're running late?'"
                  className="w-full h-32 p-3 border border-giraffe-200 dark:border-brown-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-brown-800 dark:text-white"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Message'}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border border-empathy-low bg-empathy-low dark:bg-empathy-low dark:border-empathy-low">
            <CardBody>
              <p className="text-empathy-low dark:text-empathy-low">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-brown-800 dark:text-white">
                    Overall Score
                  </h2>
                  <div
                    className={`text-5xl font-bold px-6 py-3 rounded-lg ${
                      result.total >= 90
                        ? 'bg-empathy-high text-empathy-high'
                        : result.total >= 70
                          ? 'bg-giraffe-100 text-giraffe-800'
                          : result.total >= 50
                            ? 'bg-giraffe-100 text-giraffe-800'
                            : 'bg-empathy-low text-empathy-low'
                    }`}
                  >
                    {result.total}/100
                  </div>
                </div>
                <p
                  className={`text-lg mt-4 font-semibold ${result.total >= 70 ? 'text-empathy-high' : 'text-giraffe-600'}`}
                >
                  {getTotalStatus(result.total)}
                </p>
              </CardBody>
            </Card>

            {/* Component Scores */}
            <Card>
              <CardBody>
                <h3 className="text-xl font-bold text-brown-800 dark:text-white mb-4">
                  NVC Component Scores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ScoreComponent
                    name="Observation"
                    score={result.observation}
                    description="Facts without judgment"
                  />
                  <ScoreComponent
                    name="Feeling"
                    score={result.feeling}
                    description="Actual emotions expressed"
                  />
                  <ScoreComponent
                    name="Need"
                    score={result.need}
                    description="Universal human need identified"
                  />
                  <ScoreComponent
                    name="Request"
                    score={result.request}
                    description="Clear, positive, doable action"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Language Classification */}
            <Card>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">
                    {result.isJackalLanguage ? '🐺' : '🦒'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brown-800 dark:text-white">
                      {result.isJackalLanguage
                        ? 'Jackal Language'
                        : 'Giraffe Language'}
                    </h3>
                    <p className="text-brown-600 dark:text-brown-400">
                      {result.isJackalLanguage
                        ? 'This message contains judgmental or reactive language'
                        : 'This message uses compassionate, empathetic communication'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Jackal Phrases */}
            {result.jackalPhrases.length > 0 && (
              <Card className="border border-empathy-low bg-empathy-low dark:bg-empathy-low dark:border-empathy-low">
                <CardBody>
                  <h3 className="text-lg font-bold text-empathy-low dark:text-empathy-low mb-3">
                    Potential Jackal Phrases Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.jackalPhrases.map((phrase, idx) => (
                      <Badge key={idx} variant="warning">
                        "{phrase}"
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* What Went Well */}
            <Card className="border border-empathy-high bg-empathy-high dark:bg-empathy-high dark:border-empathy-high">
              <CardBody>
                <h3 className="text-lg font-bold text-empathy-high dark:text-empathy-high mb-2">
                  ✨ What Went Well
                </h3>
                <p className="text-empathy-high dark:text-empathy-high">
                  {result.whatWentWell}
                </p>
              </CardBody>
            </Card>

            {/* Feedback */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-bold text-brown-800 dark:text-white mb-3">
                  💭 Coaching Feedback
                </h3>
                <p className="text-brown-700 dark:text-brown-400 leading-relaxed">
                  {result.feedback}
                </p>
              </CardBody>
            </Card>

            {/* Giraffe Alternative */}
            <Card className="border border-giraffe-300 bg-giraffe-50 dark:bg-brown-900 dark:border-giraffe-700">
              <CardBody>
                <h3 className="text-lg font-bold text-brown-900 dark:text-giraffe-200 mb-2">
                  🦒 Giraffe Alternative
                </h3>
                <p className="text-brown-800 dark:text-giraffe-200 italic">
                  "{result.giraffeAlternative}"
                </p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Example Prompts */}
        {!result && (
          <Card>
            <CardBody>
              <h3 className="text-lg font-bold text-brown-800 dark:text-white mb-4">
                Try These Examples:
              </h3>
              <div className="space-y-3">
                <ExamplePrompt
                  label="Pure Jackal (Score: ~0-20)"
                  text="You're always late and you don't care about anyone else. You're irresponsible and selfish."
                  onSelect={() =>
                    setUserInput(
                      "You're always late and you don't care about anyone else. You're irresponsible and selfish.",
                    )
                  }
                />
                <ExamplePrompt
                  label="Partial NVC (Score: ~50-70)"
                  text="You arrived late again. I feel upset because you're not being responsible."
                  onSelect={() =>
                    setUserInput(
                      "You arrived late again. I feel upset because you're not being responsible.",
                    )
                  }
                />
                <ExamplePrompt
                  label="Excellent NVC (Score: 90-100)"
                  text="When you arrive late without letting me know, I feel worried because I value reliability and care about you. Would you be willing to send me a text if you're running late?"
                  onSelect={() =>
                    setUserInput(
                      "When you arrive late without letting me know, I feel worried because I value reliability and care about you. Would you be willing to send me a text if you're running late?",
                    )
                  }
                />
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  )
}

interface ScoreComponentProps {
  name: string
  score: number
  description: string
}

function ScoreComponent({ name, score, description }: ScoreComponentProps) {
  const percentage = (score / 25) * 100
  const color =
    score >= 20
      ? 'bg-empathy-high'
      : score >= 15
        ? 'bg-giraffe-500'
        : score >= 10
          ? 'bg-giraffe-500'
          : 'bg-empathy-low'

  return (
    <div className="p-4 border border-giraffe-100 dark:border-brown-700 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-brown-800 dark:text-white">{name}</h4>
        <span className="text-lg font-bold text-brown-700 dark:text-brown-400">
          {score}/25
        </span>
      </div>
      <p className="text-sm text-brown-600 dark:text-brown-400 mb-3">
        {description}
      </p>
      <div className="w-full bg-giraffe-200 dark:bg-brown-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface ExamplePromptProps {
  label: string
  text: string
  onSelect: () => void
}

function ExamplePrompt({ label, text, onSelect }: ExamplePromptProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 border border-giraffe-200 dark:border-brown-600 rounded-lg hover:bg-giraffe-100 dark:hover:bg-brown-800 transition-colors"
    >
      <p className="font-semibold text-brown-800 dark:text-white mb-1">
        {label}
      </p>
      <p className="text-sm text-brown-600 dark:text-brown-400 line-clamp-2">
        {text}
      </p>
    </button>
  )
}
