import { useState } from 'react'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizSectionProps {
  questions: Question[]
  passingScore: number
  title?: string
}

interface QuizState {
  currentQuestion: number
  selectedAnswers: (number | null)[]
  submitted: boolean
  showFeedback: boolean
}

export function QuizSection({
  questions,
  passingScore,
  title = 'Review Your Learning',
}: QuizSectionProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: Array(questions.length).fill(null),
    submitted: false,
    showFeedback: false,
  })

  const handleSelectAnswer = (optionIndex: number) => {
    if (!quizState.submitted) {
      const updatedAnswers = [...quizState.selectedAnswers]
      updatedAnswers[quizState.currentQuestion] = optionIndex
      setQuizState((prev) => ({
        ...prev,
        selectedAnswers: updatedAnswers,
      }))
    }
  }

  const handleNext = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showFeedback: false,
      }))
    }
  }

  const handlePrevious = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showFeedback: false,
      }))
    }
  }

  const handleSubmit = () => {
    setQuizState((prev) => ({
      ...prev,
      submitted: true,
    }))
  }

  const handleShowFeedback = () => {
    setQuizState((prev) => ({
      ...prev,
      showFeedback: !prev.showFeedback,
    }))
  }

  const handleRestart = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: Array(questions.length).fill(null),
      submitted: false,
      showFeedback: false,
    })
  }

  const calculateScore = () => {
    let correct = 0
    quizState.selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const score = calculateScore()
  const allAnswered = quizState.selectedAnswers.every((a) => a !== null)
  const currentQ = questions[quizState.currentQuestion]
  const isCorrect =
    quizState.selectedAnswers[quizState.currentQuestion] ===
    currentQ.correctAnswer

  if (quizState.submitted) {
    return (
      <Card className="mb-12">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900 dark:to-emerald-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quiz Complete!
          </h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            {/* Score Display */}
            <div className="mb-8">
              <div className="text-6xl font-bold mb-4">
                {score >= passingScore ? '🎉' : '📚'}
              </div>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {score}%
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {score >= passingScore
                  ? 'Excellent! You passed the quiz!'
                  : `Keep practicing! You need ${passingScore}% to pass.`}
              </div>
            </div>

            {/* Score Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex justify-around">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {quizState.selectedAnswers.filter(
                      (answer, index) => answer === questions[index].correctAnswer
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Correct
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {quizState.selectedAnswers.filter(
                      (answer, index) => answer !== questions[index].correctAnswer
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Incorrect
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {questions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Review Your Answers
              </h3>
              <div className="space-y-2 mb-6">
                {questions.map((_, index) => {
                  const isAnswerCorrect =
                    quizState.selectedAnswers[index] ===
                    questions[index].correctAnswer
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <span
                        className={`text-lg ${
                          isAnswerCorrect
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {isAnswerCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        Question {index + 1}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={handleRestart}>
                Retake Quiz
              </Button>
              <Button variant="outline" size="lg">
                Continue Learning
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="mb-12">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900 dark:to-emerald-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Test your understanding of the lesson
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </div>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-48">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((quizState.currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => {
              const isSelected =
                quizState.selectedAnswers[quizState.currentQuestion] === index
              const isCorrectAnswer = index === currentQ.correctAnswer
              const showCorrect = quizState.showFeedback && isCorrectAnswer
              const showIncorrect =
                quizState.showFeedback && isSelected && !isCorrectAnswer

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={quizState.submitted}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900 dark:border-emerald-400'
                      : showIncorrect
                        ? 'bg-red-50 border-red-500 dark:bg-red-900 dark:border-red-400'
                        : isSelected
                          ? 'bg-blue-50 border-blue-600 dark:bg-blue-900 dark:border-blue-400'
                          : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500'
                  } ${quizState.submitted ? 'cursor-default' : 'cursor-pointer hover:border-gray-400'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'bg-emerald-500 border-emerald-500'
                          : showIncorrect
                            ? 'bg-red-500 border-red-500'
                            : isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-400'
                      }`}
                    >
                      {showCorrect && (
                        <span className="text-white text-sm">✓</span>
                      )}
                      {showIncorrect && (
                        <span className="text-white text-sm">✗</span>
                      )}
                    </div>
                    <span
                      className={
                        showCorrect
                          ? 'text-emerald-900 dark:text-emerald-100 font-medium'
                          : showIncorrect
                            ? 'text-red-900 dark:text-red-100 font-medium'
                            : isSelected
                              ? 'text-blue-900 dark:text-blue-100 font-medium'
                              : 'text-gray-900 dark:text-white'
                      }
                    >
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {quizState.showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-900 dark:border-emerald-700'
                  : 'bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700'
              }`}
            >
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">
                  {isCorrect ? '✓' : '💡'}
                </span>
                <div>
                  <h4
                    className={`font-semibold mb-2 ${
                      isCorrect
                        ? 'text-emerald-900 dark:text-emerald-100'
                        : 'text-red-900 dark:text-red-100'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </h4>
                  <p
                    className={
                      isCorrect
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-red-800 dark:text-red-200'
                    }
                  >
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrevious}
              disabled={quizState.currentQuestion === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleNext}
              disabled={
                quizState.currentQuestion === questions.length - 1 ||
                quizState.selectedAnswers[quizState.currentQuestion] === null
              }
            >
              Next →
            </Button>
          </div>

          {!quizState.showFeedback && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleShowFeedback}
              disabled={
                quizState.selectedAnswers[quizState.currentQuestion] === null
              }
            >
              Show Answer
            </Button>
          )}

          {quizState.showFeedback && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleShowFeedback}
            >
              Hide Answer
            </Button>
          )}

          {quizState.currentQuestion === questions.length - 1 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Answer Indicator */}
        {quizState.selectedAnswers[quizState.currentQuestion] === null && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Please select an answer to continue
          </p>
        )}
      </CardBody>
    </Card>
  )
}
