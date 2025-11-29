interface QuizQuestionProps {
  sentence: string
  questionNumber: number
  totalQuestions: number
  isLoading: boolean
  onAnswer: (isRealFeeling: boolean) => void
}

export function QuizQuestion({
  sentence,
  questionNumber,
  totalQuestions,
  isLoading,
  onAnswer,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-slate-200 shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`
                  h-2 w-8 rounded-full transition-colors
                  ${
                    idx < questionNumber
                      ? 'bg-amber-500'
                      : idx === questionNumber - 1
                        ? 'bg-amber-300'
                        : 'bg-slate-200'
                  }
                `}
              />
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Is this expressing a real feeling?
        </h2>
        <p className="text-sm text-slate-600">
          Real feelings describe your emotional state. Pseudo-feelings often
          include "that" or "like" and describe thoughts about others.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
        <p className="text-lg text-slate-900 italic leading-relaxed">
          "{sentence}"
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 py-4 px-6 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
          >
            Real Feeling
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 py-4 px-6 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
          >
            Pseudo-Feeling
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-amber-900">Tip:</span> Real
            feelings are one word emotions like "frustrated," "excited," or
            "anxious." Pseudo-feelings often sound like "I feel that you..." or
            "I feel like..."
          </p>
        </div>
      </div>
    </div>
  )
}
