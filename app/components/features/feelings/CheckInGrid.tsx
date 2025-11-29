interface CheckInGridProps {
  feelings: Array<{ word: string; category: 'pleasant' | 'unpleasant' }>
  selected: Array<string>
  onToggle: (feeling: string) => void
  onAddMore: () => void
}

export function CheckInGrid({
  feelings,
  selected,
  onToggle,
  onAddMore,
}: CheckInGridProps) {
  const pleasantFeelings = feelings.filter((f) => f.category === 'pleasant')
  const unpleasantFeelings = feelings.filter((f) => f.category === 'unpleasant')

  const renderFeelingButton = (feeling: {
    word: string
    category: 'pleasant' | 'unpleasant'
  }) => {
    const isSelected = selected.includes(feeling.word)

    return (
      <button
        key={feeling.word}
        onClick={() => onToggle(feeling.word)}
        className={`
          px-4 py-3 rounded-lg font-medium capitalize transition-all text-left
          ${
            isSelected
              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400 ring-offset-2'
              : feeling.category === 'pleasant'
                ? 'bg-amber-50 text-amber-900 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-900 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-200'
          }
        `}
      >
        {feeling.word}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How are you feeling today?
          </h2>
          <p className="text-slate-600">
            Select all the feelings that resonate with you right now. There are
            no wrong answers.
          </p>
        </div>

        {selected.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              You've selected {selected.length}{' '}
              {selected.length === 1 ? 'feeling' : 'feelings'}:
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((feeling) => (
                <span
                  key={feeling}
                  className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {feeling}
                </span>
              ))}
            </div>
          </div>
        )}

        {pleasantFeelings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Pleasant Feelings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {pleasantFeelings.map(renderFeelingButton)}
            </div>
          </div>
        )}

        {unpleasantFeelings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Unpleasant Feelings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {unpleasantFeelings.map(renderFeelingButton)}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={onAddMore}
            className="w-full py-3 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400"
          >
            Explore More Feelings
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-amber-900">
              Practice connecting to needs:
            </span>{' '}
            For each feeling you selected, try asking yourself: "What need of
            mine is being met or not met that connects to this feeling?"
          </p>
        </div>
      )}
    </div>
  )
}
