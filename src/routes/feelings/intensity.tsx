import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { FeelingsPage } from '~/components/features/feelings/FeelingsPage'
import { OptionButton } from '~/components/features/feelings/OptionButton'
import {
  INTENSITY_WORDS,
  intensityWord,
} from '~/components/features/feelings/feelingScale'

export const Route = createFileRoute('/feelings/intensity')({
  head: () => ({
    meta: pageMeta({
      title: 'Feeling intensity',
      description:
        'See how a feeling shifts as its intensity rises and falls.',
    }),
  }),
  component: IntensityExplorer,
})

function IntensityExplorer() {
  const [selectedFamily, setSelectedFamily] = useState('angry')
  const [intensityLevel, setIntensityLevel] = useState(3)
  // A word chosen from the spectrum list, when several share one step.
  const [chosenWord, setChosenWord] = useState<string | null>(null)

  const families = useQuery(api.feelings.getFamilies)
  const familyFeelings = useQuery(api.feelings.listByFamily, {
    family: selectedFamily,
  })

  const sortedFeelings = useMemo(() => {
    if (!familyFeelings) return []
    return [...familyFeelings].sort((a, b) => a.intensity - b.intensity)
  }, [familyFeelings])

  const currentFeeling = useMemo(() => {
    const atLevel = sortedFeelings.filter((f) => f.intensity === intensityLevel)
    if (atLevel.length === 0) return null
    return atLevel.find((f) => f.word === chosenWord) ?? atLevel[0]
  }, [sortedFeelings, intensityLevel, chosenWord])

  if (families === undefined) {
    return <GiraffeLoader message="Gathering feelings..." />
  }

  const levelWord = intensityWord(intensityLevel)

  return (
    <FeelingsPage
      title="How strong is it?"
      intro={
        <p>
          The same feeling can be faint or intense. Choose a family, then move
          along the scale to find the word that matches how much you feel.
        </p>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2
            id="family-heading"
            className="text-sm font-semibold text-brown-700 mb-2"
          >
            Families
          </h2>
          <div
            role="group"
            aria-labelledby="family-heading"
            className="grid grid-cols-2 md:grid-cols-1 gap-2"
          >
            {families.map((family) => (
              <OptionButton
                key={family}
                pressed={selectedFamily === family}
                onClick={() => {
                  setSelectedFamily(family)
                  setChosenWord(null)
                }}
                className="capitalize"
              >
                {family}
              </OptionButton>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <section
            aria-labelledby="scale-heading"
            className="rounded-lg border-2 border-giraffe-200 bg-white p-5 sm:p-8"
          >
            <h2
              id="scale-heading"
              className="text-xl font-bold text-brown-800 mb-6"
            >
              {selectedFamily.charAt(0).toUpperCase() + selectedFamily.slice(1)}
              , from faint to intense
            </h2>

            <label
              htmlFor="intensity-slider"
              className="block text-sm font-semibold text-brown-700 mb-3"
            >
              How strong
            </label>
            <input
              id="intensity-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={intensityLevel}
              aria-valuetext={
                currentFeeling
                  ? `${levelWord}: ${currentFeeling.word}`
                  : levelWord
              }
              onChange={(e) => {
                setIntensityLevel(parseInt(e.target.value, 10))
                setChosenWord(null)
              }}
              className="w-full h-3 rounded-full bg-giraffe-200 appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brown-700 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brown-700 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white"
            />
            <div
              aria-hidden="true"
              className="mt-3 flex justify-between text-xs sm:text-sm text-brown-700"
            >
              {INTENSITY_WORDS.map((word, index) => (
                <span
                  key={word}
                  className={
                    index + 1 === intensityLevel
                      ? 'font-bold text-brown-900'
                      : ''
                  }
                >
                  {word}
                </span>
              ))}
            </div>

            <div aria-live="polite" className="mt-10">
              {currentFeeling ? (
                <div className="max-w-prose">
                  <p className="text-sm font-semibold text-brown-700">
                    {levelWord}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-brown-800 capitalize tracking-tight">
                    {currentFeeling.word}
                  </p>
                  <p className="mt-4 text-lg text-brown-700 text-pretty">
                    {currentFeeling.definition}
                  </p>
                  {currentFeeling.examples.length > 0 && (
                    <p className="mt-4 text-brown-700 text-pretty">
                      <span className="font-semibold text-brown-800">
                        In a sentence:{' '}
                      </span>
                      {currentFeeling.examples[0]}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-brown-700 text-pretty">
                  No word in this family sits at {levelWord.toLowerCase()} yet.
                  Try a step softer or stronger.
                </p>
              )}
            </div>
          </section>

          {sortedFeelings.length > 0 && (
            <section aria-labelledby="spectrum-heading">
              <h2
                id="spectrum-heading"
                className="text-lg font-bold text-brown-800 mb-3"
              >
                Every word in this family, softest first
              </h2>
              <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {sortedFeelings.map((feeling, idx) => (
                  <li key={feeling.word} className="flex items-center gap-1">
                    <OptionButton
                      pressed={currentFeeling?.word === feeling.word}
                      onClick={() => {
                        setIntensityLevel(feeling.intensity)
                        setChosenWord(feeling.word)
                      }}
                      aria-label={`${feeling.word}, ${intensityWord(feeling.intensity).toLowerCase()}`}
                      className="capitalize"
                    >
                      {feeling.word}
                    </OptionButton>
                    {idx < sortedFeelings.length - 1 && (
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 text-brown-500"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </FeelingsPage>
  )
}
