import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/learn/feelings/quiz')({
  component: ProtectedQuiz,
})

type QuizState = 'level-select' | 'question' | 'feedback' | 'complete'

function ProtectedQuiz() {
  return (
    <ProtectedRoute>
      <QuizGame />
    </ProtectedRoute>
  )
}

function QuizGame() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const [quizState, setQuizState] = useState<QuizState>('level-select')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false)

  // Queries - only fetch when in question state
  const quizBatch =
    quizState === 'question'
      ? useQuery(api.feelingsQuiz.getRandomQuizBatch, {
          level: selectedLevel,
          count: 10,
        })
      : undefined

  // Mutations
  const updateProgressMutation = useMutation(
    api.feelingsProgress.updateQuizProgress,
  )

  const currentQuestionData =
    quizBatch && currentQuestion < quizBatch.length
      ? quizBatch[currentQuestion]
      : null

  const handleStartQuiz = (level: number) => {
    setSelectedLevel(level)
    setCurrentQuestion(0)
    setCorrectCount(0)
    setQuizState('question')
  }

  const handleAnswer = async (userAnswer: boolean) => {
    if (!currentQuestionData) return

    const isCorrect = userAnswer === currentQuestionData.isRealFeeling
    setFeedbackIsCorrect(isCorrect)

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
    }

    if (currentUser) {
      updateProgressMutation({
        userId: currentUser._id,
        correct: isCorrect,
      })
    }

    setQuizState('feedback')
  }

  const handleNextQuestion = () => {
    if (quizBatch && currentQuestion < quizBatch.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setQuizState('question')
    } else {
      setQuizState('complete')
    }
  }

  const handleRetryLevel = () => {
    setCurrentQuestion(0)
    setCorrectCount(0)
    setQuizState('question')
  }

  const handleReturnToHome = () => {
    setQuizState('level-select')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-giraffe-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-giraffe-900 mb-2">
            Feelings Quiz Game
          </h1>
          <p className="text-giraffe-800">
            Test your ability to identify real feelings vs pseudo-feelings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {quizState === 'level-select' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="bg-white rounded-lg border-2 border-giraffe-200 p-6 hover:border-giraffe-400 transition-colors cursor-pointer"
                  onClick={() => handleStartQuiz(level)}
                >
                  <div className="text-3xl mb-3">{level}</div>
                  <h3 className="text-lg font-bold text-giraffe-900 mb-2">
                    {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
                  </h3>
                  <p className="text-sm text-giraffe-800 mb-4">
                    {level === 1
                      ? 'Obvious pseudo-feelings'
                      : level === 2
                        ? 'Evaluative words disguised as feelings'
                        : 'Subtle and tricky cases'}
                  </p>
                  <button className="w-full py-2 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors">
                    Start Level {level}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {quizState === 'question' && !quizBatch && (
          <div className="flex items-center justify-center min-h-80">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-giraffe-200 border-t-giraffe-600 rounded-full mx-auto" />
              <p className="text-giraffe-700">Loading quiz questions...</p>
            </div>
          </div>
        )}

        {quizState === 'question' && quizBatch && quizBatch.length === 0 && (
          <div className="bg-white rounded-lg border-2 border-giraffe-200 p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-giraffe-900 mb-4">
              No questions available
            </h2>
            <p className="text-giraffe-800 mb-6">
              There are no quiz questions available for this level yet.
            </p>
            <button
              onClick={handleReturnToHome}
              className="px-6 py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors"
            >
              Back to Levels
            </button>
          </div>
        )}

        {quizState === 'question' && currentQuestionData && (
          <div className="bg-white rounded-lg border-2 border-giraffe-200 shadow-md p-6 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-giraffe-600 uppercase tracking-wide">
                  Question {currentQuestion + 1} of {quizBatch?.length}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: quizBatch?.length || 10 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className={`
                          h-2 w-8 rounded-full transition-colors
                          ${
                            idx < currentQuestion
                              ? 'bg-giraffe-500'
                              : idx === currentQuestion
                                ? 'bg-giraffe-300'
                                : 'bg-giraffe-100'
                          }
                        `}
                      />
                    ),
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-giraffe-900 mb-2">
                Is this expressing a real feeling?
              </h2>
              <p className="text-sm text-giraffe-800">
                Real feelings describe your emotional state. Pseudo-feelings
                often include "that" or "like" and describe thoughts about
                others.
              </p>
            </div>

            <div className="bg-giraffe-50 border-l-4 border-giraffe-500 p-4 rounded-r-lg mb-6">
              <p className="text-lg text-giraffe-900 italic leading-relaxed">
                "{currentQuestionData.sentence}"
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-4 px-6 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
              >
                Real Feeling
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-4 px-6 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
              >
                Pseudo-Feeling
              </button>
            </div>
          </div>
        )}

        {quizState === 'feedback' && currentQuestionData && (
          <div className="bg-white rounded-lg border-2 shadow-md p-6 max-w-2xl mx-auto border-giraffe-200">
            <div className="mb-6">
              <div
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg mb-4
                  ${
                    feedbackIsCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }
                `}
              >
                {feedbackIsCorrect ? "That's right!" : 'Not quite'}
              </div>

              <h2 className="text-xl font-bold text-giraffe-900 mb-3">
                {feedbackIsCorrect
                  ? 'Great work recognizing that!'
                  : 'This is a learning opportunity'}
              </h2>
              <p className="text-giraffe-800 leading-relaxed">
                {currentQuestionData.explanation}
              </p>
            </div>

            {currentQuestionData.correctFeelings &&
              currentQuestionData.correctFeelings.length > 0 && (
                <div className="mb-6 p-4 bg-giraffe-50 rounded-lg border border-giraffe-200">
                  <h3 className="font-semibold text-giraffe-900 mb-2">
                    Real feelings you could use instead:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestionData.correctFeelings.map((feeling) => (
                      <span
                        key={feeling}
                        className="inline-block bg-white text-giraffe-900 px-3 py-1 rounded-full text-sm font-medium border border-giraffe-300"
                      >
                        {feeling}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="pt-6 border-t border-giraffe-200">
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 px-6 bg-giraffe-500 text-white rounded-lg font-semibold text-lg hover:bg-giraffe-600 transition-colors shadow-md hover:shadow-lg"
              >
                Continue to Next Question
              </button>
            </div>
          </div>
        )}

        {quizState === 'complete' && quizBatch && (
          <div className="bg-white rounded-lg border-2 border-giraffe-200 p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">
              {correctCount === quizBatch.length
                ? 'Perfect!'
                : correctCount > quizBatch.length / 2
                  ? 'Great Job!'
                  : 'Good Effort!'}
            </div>
            <h2 className="text-3xl font-bold text-giraffe-900 mb-2">
              Quiz Complete
            </h2>
            <p className="text-2xl text-giraffe-600 font-semibold mb-6">
              {correctCount} out of {quizBatch.length} correct
              <br />
              {Math.round((correctCount / quizBatch.length) * 100)}% Accuracy
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryLevel}
                className="px-6 py-3 bg-giraffe-500 text-white rounded-lg font-semibold hover:bg-giraffe-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleReturnToHome}
                className="px-6 py-3 bg-giraffe-100 text-giraffe-900 rounded-lg font-semibold hover:bg-giraffe-200 transition-colors"
              >
                Back to Levels
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
