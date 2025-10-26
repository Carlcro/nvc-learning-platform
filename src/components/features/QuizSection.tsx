import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { useLessonProgress } from '~/hooks/useLessonProgress'

export interface Question {
  question: string
  options: Array<string>
  correctAnswer: number
  explanation: string
}

export interface QuizSectionProps {
  questions: Array<Question>
  passingScore: number
  title?: string
  lessonId?: string // Optional lesson ID for progress tracking
}

interface QuizState {
  currentQuestion: number
  selectedAnswers: Array<number | null>
  submitted: boolean
  showFeedback: boolean
}

export function QuizSection({
  questions,
  passingScore,
  title = 'Review Your Learning',
  lessonId,
}: QuizSectionProps) {
  const { completeLesson, isLessonCompleted } = useLessonProgress()
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
    const score = calculateScore()
    // Save lesson completion if user gets 100% (all correct)
    if (lessonId && score === 100) {
      completeLesson(lessonId, score)
    }
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
    const isPerfectScore = score === 100
    const lessonCompleted = lessonId && isLessonCompleted(lessonId)

    return (
      <Card className="mb-12">
        <CardHeader
          className={`bg-gradient-to-r ${
            isPerfectScore
              ? 'from-giraffe-50 to-empathy-high/20 dark:from-giraffe-900 dark:to-empathy-high/40'
              : 'from-giraffe-50 to-empathy-medium/20 dark:from-giraffe-900 dark:to-empathy-medium/40'
          }`}
        >
          <h2 className="text-2xl font-bold text-brown-800 dark:text-cream">
            Quiz Complete!
          </h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            {/* Perfect Score & Lesson Completion Banner */}
            {isPerfectScore && lessonCompleted && (
              <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-giraffe-100 to-empathy-high/30 dark:from-giraffe-800 dark:to-empathy-high/40 border-2 border-giraffe-300 dark:border-giraffe-600">
                <div className="text-5xl mb-3">🎓✨</div>
                <h3 className="text-2xl font-bold text-giraffe-700 dark:text-giraffe-100 mb-2">
                  Lesson Complete!
                </h3>
                <p className="text-giraffe-600 dark:text-giraffe-200">
                  Perfect score! You've mastered this lesson and it's been saved
                  to your progress.
                </p>
              </div>
            )}

            {/* Score Display */}
            <div className="mb-8">
              <div className="text-6xl font-bold mb-4">
                {score >= passingScore ? '🎉' : '📚'}
              </div>
              <div className="text-5xl font-bold text-brown-800 dark:text-cream mb-2">
                {score}%
              </div>
              <div className="text-lg text-brown-600 dark:text-brown-200">
                {isPerfectScore && lessonCompleted
                  ? 'Outstanding! You answered every question correctly!'
                  : score >= passingScore
                    ? 'Excellent! You passed the quiz!'
                    : `Keep practicing! You need ${passingScore}% to pass. Remember, you need a perfect score (100%) to complete this lesson.`}
              </div>
            </div>

            {/* Score Details */}
            <div className="bg-giraffe-50 dark:bg-brown-800 rounded-lg p-6 mb-8">
              <div className="flex justify-around">
                <div>
                  <div className="text-3xl font-bold text-empathy-high dark:text-empathy-high">
                    {
                      quizState.selectedAnswers.filter(
                        (answer, index) =>
                          answer === questions[index].correctAnswer,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-brown-600 dark:text-brown-200 mt-1">
                    Correct
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-empathy-low dark:text-empathy-low">
                    {
                      quizState.selectedAnswers.filter(
                        (answer, index) =>
                          answer !== questions[index].correctAnswer,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-brown-600 dark:text-brown-200 mt-1">
                    Incorrect
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-giraffe-600 dark:text-giraffe-300">
                    {questions.length}
                  </div>
                  <div className="text-sm text-brown-600 dark:text-brown-200 mt-1">
                    Total
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brown-800 dark:text-cream mb-4">
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
                      className="flex items-center gap-3 p-3 rounded-lg bg-giraffe-100 dark:bg-brown-700"
                    >
                      <span
                        className={`text-lg ${
                          isAnswerCorrect
                            ? 'text-empathy-high dark:text-empathy-high'
                            : 'text-empathy-low dark:text-empathy-low'
                        }`}
                      >
                        {isAnswerCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-sm text-brown-700 dark:text-brown-100 flex-1">
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
      <CardHeader className="bg-gradient-to-r from-giraffe-50 to-giraffe-100 dark:from-giraffe-900 dark:to-brown-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brown-800 dark:text-cream">
              {title}
            </h2>
            <p className="text-brown-600 dark:text-brown-200 mt-1">
              Test your understanding of the lesson
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-brown-600 dark:text-brown-200">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </div>
            <div className="mt-2 bg-giraffe-200 dark:bg-brown-700 rounded-full h-2 w-48">
              <div
                className="bg-giraffe-400 h-2 rounded-full transition-all duration-300"
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
          <h3 className="text-xl font-semibold text-brown-800 dark:text-cream mb-6">
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
                      ? 'bg-empathy-high/10 border-empathy-high dark:bg-empathy-high/20 dark:border-empathy-high'
                      : showIncorrect
                        ? 'bg-empathy-low/10 border-empathy-low dark:bg-empathy-low/20 dark:border-empathy-low'
                        : isSelected
                          ? 'bg-giraffe-50 border-giraffe-400 dark:bg-giraffe-900/50 dark:border-giraffe-400'
                          : 'bg-white border-giraffe-200 dark:bg-brown-900 dark:border-brown-700 dark:hover:border-brown-600'
                  } ${quizState.submitted ? 'cursor-default' : 'cursor-pointer hover:border-giraffe-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'bg-empathy-high border-empathy-high'
                          : showIncorrect
                            ? 'bg-empathy-low border-empathy-low'
                            : isSelected
                              ? 'bg-giraffe-400 border-giraffe-400'
                              : 'border-giraffe-200 dark:border-brown-600'
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
                          ? 'text-empathy-high dark:text-empathy-high font-medium'
                          : showIncorrect
                            ? 'text-empathy-low dark:text-empathy-low font-medium'
                            : isSelected
                              ? 'text-giraffe-700 dark:text-giraffe-100 font-medium'
                              : 'text-brown-800 dark:text-cream'
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
                  ? 'bg-empathy-high/10 border border-empathy-high/30 dark:bg-empathy-high/20 dark:border-empathy-high/40'
                  : 'bg-empathy-low/10 border border-empathy-low/30 dark:bg-empathy-low/20 dark:border-empathy-low/40'
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
                        ? 'text-empathy-high dark:text-empathy-high'
                        : 'text-empathy-low dark:text-empathy-low'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </h4>
                  <p
                    className={
                      isCorrect
                        ? 'text-empathy-high/80 dark:text-empathy-high/90'
                        : 'text-empathy-low/80 dark:text-empathy-low/90'
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
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-giraffe-200 dark:border-brown-700">
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
            <Button variant="ghost" size="md" onClick={handleShowFeedback}>
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
          <p className="text-sm text-brown-500 dark:text-brown-300 mt-4">
            Please select an answer to continue
          </p>
        )}
      </CardBody>
    </Card>
  )
}
