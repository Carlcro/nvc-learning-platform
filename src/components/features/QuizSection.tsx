import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardBody, CardHeader } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { CheckIcon, XIcon } from '~/components/ui/Icons'
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
  // Questions whose answer the learner has revealed. Revealing locks that
  // question, so peeking is a choice rather than a way past the quiz.
  revealed: Array<boolean>
}

export function QuizSection({
  questions,
  passingScore,
  title = 'Review Your Learning',
  lessonId,
}: QuizSectionProps) {
  const { submitQuiz, isLessonCompleted } = useLessonProgress()
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: Array(questions.length).fill(null),
    submitted: false,
    showFeedback: false,
    revealed: Array(questions.length).fill(false),
  })

  const handleSelectAnswer = (optionIndex: number) => {
    if (!quizState.submitted && !quizState.revealed[quizState.currentQuestion]) {
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
    // The lesson counts as complete at its passing threshold, not only at a
    // perfect score. Growth over grades. The server re-grades these answers
    // and owns the recorded result.
    if (lessonId && score >= passingScore) {
      submitQuiz(lessonId, quizState.selectedAnswers, score)
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
      revealed: prev.revealed.map((wasRevealed, index) =>
        index === prev.currentQuestion ? true : wasRevealed,
      ),
    }))
  }

  const handleRestart = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: Array(questions.length).fill(null),
      submitted: false,
      showFeedback: false,
      revealed: Array(questions.length).fill(false),
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
    const passed = score >= passingScore
    const lessonCompleted = lessonId && isLessonCompleted(lessonId)

    return (
      <Card className="mb-12">
        <CardHeader
          className={`bg-linear-to-r ${
            passed
              ? 'from-giraffe-50 to-empathy-high/20'
              : 'from-giraffe-50 to-empathy-medium/20'
          }`}
        >
          <h2 className="text-2xl font-bold text-brown-800">Quiz Complete!</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            {/* Lesson Completion Banner */}
            {passed && lessonCompleted && (
              <div className="mb-8 p-6 rounded-lg bg-linear-to-r from-giraffe-100 to-empathy-high/30 border-2 border-giraffe-300">
                <h3 className="text-2xl font-bold text-giraffe-700 mb-2">
                  Lesson Complete!
                </h3>
                <p className="text-giraffe-600">
                  {score === 100
                    ? "Perfect score! You've mastered this lesson and it's been saved to your progress."
                    : "You passed! This lesson has been saved to your progress."}
                </p>
              </div>
            )}

            {/* Score Display */}
            <div className="mb-8">
              <div className="text-5xl font-bold text-brown-800 mb-2">
                {score}%
              </div>
              <div className="text-lg text-brown-600">
                {score === 100
                  ? 'Outstanding! You answered every question correctly!'
                  : passed
                    ? 'Excellent! You passed the quiz and completed this lesson.'
                    : `You're getting there. Reach ${passingScore}% to complete this lesson, and feel free to revisit the examples above first.`}
              </div>
            </div>

            {/* Score Details */}
            <div className="bg-giraffe-50 rounded-lg p-6 mb-8">
              <div className="flex justify-around">
                <div>
                  <div className="text-3xl font-bold text-empathy-high">
                    {
                      quizState.selectedAnswers.filter(
                        (answer, index) =>
                          answer === questions[index].correctAnswer,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-brown-600 mt-1">Correct</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-empathy-low">
                    {
                      quizState.selectedAnswers.filter(
                        (answer, index) =>
                          answer !== questions[index].correctAnswer,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-brown-600 mt-1">Incorrect</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-giraffe-600">
                    {questions.length}
                  </div>
                  <div className="text-sm text-brown-600 mt-1">Total</div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brown-800 mb-4">
                Review Your Answers
              </h3>
              <div className="space-y-3 mb-6 text-left">
                {questions.map((question, index) => {
                  const chosen = quizState.selectedAnswers[index]
                  const isAnswerCorrect = chosen === question.correctAnswer
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-giraffe-50 border border-giraffe-200"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            isAnswerCorrect
                              ? 'text-empathy-high shrink-0 mt-0.5'
                              : 'text-empathy-low shrink-0 mt-0.5'
                          }
                          aria-label={isAnswerCorrect ? 'Correct' : 'Incorrect'}
                        >
                          {isAnswerCorrect ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <XIcon className="w-5 h-5" />
                          )}
                        </span>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-semibold text-brown-800">
                            {index + 1}. {question.question}
                          </p>
                          {!isAnswerCorrect && (
                            <p className="text-sm text-brown-600">
                              <span className="font-medium">You chose:</span>{' '}
                              {chosen === null
                                ? 'nothing yet'
                                : question.options[chosen]}
                            </p>
                          )}
                          <p className="text-sm text-brown-700">
                            <span className="font-medium">
                              {isAnswerCorrect ? 'You said:' : 'A closer fit:'}
                            </span>{' '}
                            {question.options[question.correctAnswer]}
                          </p>
                          <p className="text-sm text-brown-600 italic">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
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
              <Link to="/learn">
                <Button variant="outline" size="lg">
                  Continue Learning
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="mb-12">
      <CardHeader className="bg-linear-to-r from-giraffe-50 to-giraffe-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brown-800">{title}</h2>
            <p className="text-brown-600 mt-1">
              Test your understanding of the lesson
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-brown-600">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </div>
            <div className="mt-2 bg-giraffe-200 rounded-full h-2 w-48">
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
          <h3 className="text-xl font-semibold text-brown-800 mb-6">
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
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all shadow-sm ${
                    showCorrect
                      ? 'bg-empathy-high/15 border-empathy-high border-2 shadow-md'
                      : showIncorrect
                        ? 'bg-empathy-low/15 border-empathy-low border-2 shadow-md'
                        : isSelected
                          ? 'bg-giraffe-100 border-giraffe-600 shadow-md'
                          : 'bg-white border-giraffe-400'
                  } ${quizState.submitted ? 'cursor-default' : 'cursor-pointer hover:border-giraffe-500 hover:shadow-md'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        showCorrect
                          ? 'bg-empathy-high border-empathy-high'
                          : showIncorrect
                            ? 'bg-empathy-low border-empathy-low'
                            : isSelected
                              ? 'bg-giraffe-500 border-giraffe-600'
                              : 'border-giraffe-400 bg-white'
                      }`}
                    >
                      {showCorrect && (
                        <CheckIcon className="w-3.5 h-3.5 text-white" />
                      )}
                      {showIncorrect && (
                        <XIcon className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span
                      className={
                        showCorrect
                          ? 'text-empathy-high font-medium'
                          : showIncorrect
                            ? 'text-empathy-low font-medium'
                            : isSelected
                              ? 'text-giraffe-700 font-medium'
                              : 'text-brown-800'
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
                  ? 'bg-empathy-high/10 border border-empathy-high/30'
                  : 'bg-empathy-low/10 border border-empathy-low/30'
              }`}
            >
              <div className="flex gap-3">
                <span
                  className={`shrink-0 ${
                    isCorrect ? 'text-empathy-high' : 'text-empathy-low'
                  }`}
                  aria-hidden="true"
                >
                  {isCorrect ? (
                    <CheckIcon className="w-7 h-7" />
                  ) : (
                    <XIcon className="w-7 h-7" />
                  )}
                </span>
                <div>
                  <h4
                    className={`font-semibold mb-2 ${
                      isCorrect ? 'text-empathy-high' : 'text-empathy-low'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </h4>
                  <p
                    className={
                      isCorrect ? 'text-empathy-high/80' : 'text-empathy-low/80'
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
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-giraffe-200">
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
          <p className="text-sm text-brown-500 mt-4">
            Please select an answer to continue
          </p>
        )}
        {quizState.revealed[quizState.currentQuestion] && (
          <p className="text-sm text-brown-500 mt-4">
            You have seen the answer to this one, so it stays as you left it.
            You can always retake the quiz.
          </p>
        )}
      </CardBody>
    </Card>
  )
}
