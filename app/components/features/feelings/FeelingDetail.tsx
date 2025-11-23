interface FeelingData {
  word: string
  intensity: number
  category: 'pleasant' | 'unpleasant'
  definition: string
  examples: Array<string>
  synonyms: Array<string>
  relatedFeelings: Array<string>
}

interface FeelingDetailProps {
  feeling: FeelingData | null
  isSaved?: boolean
  onSave?: () => void
  onRemove?: () => void
  onClose?: () => void
}

export function FeelingDetail({
  feeling,
  isSaved = false,
  onSave,
  onRemove,
  onClose,
}: FeelingDetailProps) {
  if (!feeling) {
    return null
  }

  const intensityLabels = ['', 'Mild', 'Light', 'Moderate', 'Strong', 'Intense']

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-6 max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 capitalize">
            {feeling.word}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {intensityLabels[feeling.intensity]} intensity -{' '}
            <span className="capitalize">{feeling.category}</span>
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Definition</h3>
          <p className="text-slate-700">{feeling.definition}</p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Examples</h3>
          <ul className="space-y-2">
            {feeling.examples.map((example, idx) => (
              <li key={idx} className="text-slate-700 flex gap-3">
                <span className="text-amber-600 font-semibold flex-shrink-0">
                  •
                </span>
                <span className="italic">{example}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Synonyms</h3>
          <div className="flex flex-wrap gap-2">
            {feeling.synonyms.map((synonym) => (
              <span
                key={synonym}
                className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm"
              >
                {synonym}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Related Feelings
          </h3>
          <div className="flex flex-wrap gap-2">
            {feeling.relatedFeelings.map((related) => (
              <span
                key={related}
                className="inline-block bg-slate-200 text-slate-900 px-3 py-1 rounded-full text-sm"
              >
                {related}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
        {onSave && (
          <button
            onClick={onSave}
            className={`
              flex-1 px-4 py-2 rounded-lg font-semibold transition-colors
              ${
                isSaved
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }
            `}
          >
            {isSaved ? 'Already Saved' : 'Save to Library'}
          </button>
        )}
        {isSaved && onRemove && (
          <button
            onClick={onRemove}
            className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
          >
            Remove from Library
          </button>
        )}
      </div>
    </div>
  )
}
