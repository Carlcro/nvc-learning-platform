interface FeelingCardProps {
  word: string
  intensity: number
  category: 'pleasant' | 'unpleasant'
  isSelected?: boolean
  isSaved?: boolean
  onClick?: () => void
  onSave?: () => void
}

export function FeelingCard({
  word,
  intensity,
  category,
  isSelected = false,
  isSaved = false,
  onClick,
  onSave,
}: FeelingCardProps) {
  const intensityColor =
    intensity <= 2
      ? 'bg-blue-100 text-blue-900'
      : intensity === 3
        ? 'bg-purple-100 text-purple-900'
        : 'bg-red-100 text-red-900'

  const baseColor =
    category === 'pleasant'
      ? 'border-amber-200 hover:bg-amber-50'
      : 'border-slate-300 hover:bg-slate-100'

  const selectedColor = isSelected ? 'ring-2 ring-amber-400 bg-amber-50' : ''

  return (
    <div
      className={`
        p-3 rounded-lg border-2 transition-all cursor-pointer
        ${baseColor} ${selectedColor}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm capitalize text-slate-900">
            {word}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`
                text-xs px-2 py-0.5 rounded-full font-medium
                ${intensityColor}
              `}
            >
              {intensity === 1 && 'Mild'}
              {intensity === 2 && 'Light'}
              {intensity === 3 && 'Moderate'}
              {intensity === 4 && 'Strong'}
              {intensity === 5 && 'Intense'}
            </span>
          </div>
        </div>

        {onSave && (
          <button
            className={`
              shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors
              ${
                isSaved
                  ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }
            `}
            onClick={(e) => {
              e.stopPropagation()
              onSave()
            }}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </div>
  )
}
