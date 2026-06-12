import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/feelings/intensity')({
  component: ProtectedIntensityExplorer,
})

function ProtectedIntensityExplorer() {
  return (
    <ProtectedRoute>
      <IntensityExplorer />
    </ProtectedRoute>
  )
}

function IntensityExplorer() {
  const [selectedFamily, setSelectedFamily] = useState('angry')
  const [intensityLevel, setIntensityLevel] = useState(3)

  // Queries
  const families = useQuery(api.feelings.getFamilies)
  const familyFeelings = useQuery(api.feelings.listByFamily, {
    family: selectedFamily,
  })

  // Find feeling at current intensity
  const currentFeeling = useMemo(() => {
    if (!familyFeelings) return null
    // Find feeling with closest intensity to selected level
    // If multiple exist, pick the first one (or could be random)
    return (
      familyFeelings.find((f) => f.intensity === intensityLevel) ||
      familyFeelings.find(
        (f) => Math.abs(f.intensity - intensityLevel) === 0.5,
      ) || // Handle potential half steps if any
      null
    )
  }, [familyFeelings, intensityLevel])

  // Get all feelings in this family sorted by intensity for the spectrum view
  const sortedFeelings = useMemo(() => {
    if (!familyFeelings) return []
    return [...familyFeelings].sort((a, b) => a.intensity - b.intensity)
  }, [familyFeelings])

  if (families === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream flex items-center justify-center">
        <p className="text-giraffe-800">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b-2 border-giraffe-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-giraffe-900 mb-2">
              Intensity Explorer
            </h1>
            <p className="text-giraffe-800">
              Understand how feelings exist on a spectrum from mild to intense
            </p>
          </div>
          <Link
            to="/feelings/wheel"
            className="px-4 py-2 bg-giraffe-100 text-giraffe-900 rounded-lg font-semibold hover:bg-giraffe-200 transition-colors"
          >
            ← Back to Wheel
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Family Selector */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-giraffe-900">
              Select a Family
            </h3>
            <div className="flex flex-col gap-2">
              {families.map((family) => (
                <button
                  key={family}
                  onClick={() => setSelectedFamily(family)}
                  className={`
                    px-4 py-3 rounded-lg font-medium capitalize text-left transition-all
                    ${
                      selectedFamily === family
                        ? 'bg-giraffe-400 text-brown-800 shadow-md transform scale-105'
                        : 'bg-white text-giraffe-800 border-2 border-giraffe-200 hover:border-giraffe-300 hover:bg-giraffe-50'
                    }
                  `}
                >
                  {family}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Intensity Slider & Display */}
          <div className="md:col-span-2 space-y-8">
            {/* Visualization of Spectrum */}
            <div className="bg-white rounded-xl border-2 border-giraffe-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-giraffe-900 mb-8 capitalize text-center">
                {selectedFamily} Spectrum
              </h2>

              {/* Slider Component */}
              <div className="relative mb-12 px-4">
                <div className="h-4 bg-gradient-to-r from-giraffe-100 via-giraffe-300 to-empathy-low rounded-full w-full absolute top-1/2 -translate-y-1/2 left-0 right-0 -z-0" />
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={intensityLevel}
                  onChange={(e) => setIntensityLevel(parseInt(e.target.value))}
                  className="w-full h-4 bg-transparent appearance-none cursor-pointer relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-giraffe-500 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <div className="flex justify-between mt-4 text-sm font-semibold text-giraffe-600 uppercase tracking-wide">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              {/* Selected Feeling Display */}
              <div className="text-center transition-all duration-300">
                {currentFeeling ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="inline-block px-6 py-2 bg-giraffe-100 rounded-full text-giraffe-800 font-semibold mb-2">
                      Intensity Level: {intensityLevel}
                    </div>
                    <h3 className="text-5xl font-bold text-giraffe-900 capitalize mb-4">
                      {currentFeeling.word}
                    </h3>
                    <p className="text-xl text-giraffe-800 italic max-w-lg mx-auto">
                      "{currentFeeling.definition}"
                    </p>
                    {currentFeeling.examples.length > 0 && (
                      <div className="mt-6 p-4 bg-giraffe-50 rounded-lg border border-giraffe-100 text-left">
                        <p className="font-semibold text-giraffe-900 mb-2">
                          Example:
                        </p>
                        <p className="text-giraffe-800">
                          "{currentFeeling.examples[0]}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-giraffe-400 italic">
                    No feeling found for this intensity level.
                    <br />
                    Try moving the slider!
                  </div>
                )}
              </div>
            </div>

            {/* Full Spectrum List */}
            <div className="bg-white rounded-xl border-2 border-giraffe-200 p-6">
              <h3 className="font-bold text-giraffe-900 mb-4">
                Full Spectrum for {selectedFamily}
              </h3>
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {sortedFeelings.map((feeling, idx) => (
                  <div
                    key={feeling.word}
                    className="flex items-center"
                    onClick={() => setIntensityLevel(feeling.intensity)}
                  >
                    <div
                      className={`
                        cursor-pointer px-3 py-1.5 rounded-lg transition-all
                        ${
                          feeling.intensity === intensityLevel
                            ? 'bg-giraffe-400 text-brown-800 font-bold shadow-md transform scale-110'
                            : 'bg-giraffe-50 text-giraffe-800 hover:bg-giraffe-100'
                        }
                      `}
                    >
                      {feeling.word}
                    </div>
                    {idx < sortedFeelings.length - 1 && (
                      <span className="mx-2 text-giraffe-300">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
