interface QuizFeedbackProps {
  isCorrect: boolean
  explanation: string
  correctFeelings?: Array<string>
  onNext: () => void
}

export function QuizFeedback({
  isCorrect,
  explanation,
  correctFeelings,
  onNext,
}: QuizFeedbackProps) {
  return (
    <div
      className={`
      bg-white rounded-lg border-2 shadow-md p-6 max-w-2xl mx-auto
      ${isCorrect ? 'border-green-500' : 'border-amber-500'}
    `}
    >
      <div className="mb-6">
        <div
          className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg mb-4
          ${
            isCorrect
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }
        `}
        >
          {isCorrect ? (
            <>
              <span className="text-2xl">✓</span>
              <span>That's right!</span>
            </>
          ) : (
            <>
              <span className="text-2xl">•</span>
              <span>Not quite</span>
            </>
          )}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-3">
          {isCorrect
            ? 'Great work recognizing that!'
            : 'This is a learning opportunity'}
        </h2>
        <p className="text-slate-700 leading-relaxed">{explanation}</p>
      </div>

      {correctFeelings && correctFeelings.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2">
            Real feelings you could use instead:
          </h3>
          <div className="flex flex-wrap gap-2">
            {correctFeelings.map((feeling) => (
              <span
                key={feeling}
                className="inline-block bg-white text-amber-900 px-3 py-1 rounded-full text-sm font-medium border border-amber-300"
              >
                {feeling}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={onNext}
          className="w-full py-3 px-6 bg-amber-500 text-white rounded-lg font-semibold text-lg hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg"
        >
          Continue to Next Question
        </button>
      </div>

      {!isCorrect && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 text-center">
            Remember, you're building a valuable skill. Each question helps you
            recognize authentic feelings more clearly.
          </p>
        </div>
      )}
    </div>
  )
}
