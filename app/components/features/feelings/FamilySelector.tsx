interface FamilySelectorProps {
  families: Array<string>
  selectedFamily: string
  onSelect: (family: string) => void
  showCategory: 'all' | 'pleasant' | 'unpleasant'
  onCategoryChange: (category: 'all' | 'pleasant' | 'unpleasant') => void
}

export function FamilySelector({
  families,
  selectedFamily,
  onSelect,
  showCategory,
  onCategoryChange,
}: FamilySelectorProps) {
  const categoryOptions: Array<{
    value: 'all' | 'pleasant' | 'unpleasant'
    label: string
  }> = [
    { value: 'all', label: 'All Feelings' },
    { value: 'pleasant', label: 'Pleasant' },
    { value: 'unpleasant', label: 'Unpleasant' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onCategoryChange(option.value)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                showCategory === option.value
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
          Feeling Families
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {families.map((family) => (
            <button
              key={family}
              onClick={() => onSelect(family)}
              className={`
                px-4 py-3 rounded-lg font-medium capitalize transition-all
                ${
                  selectedFamily === family
                    ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-sm'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                }
              `}
            >
              {family}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
