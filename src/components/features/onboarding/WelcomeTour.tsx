import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { LOCALE_NAMES } from '../../../../convex/lib/locale'
import type { Locale } from '../../../../convex/lib/locale'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/Button'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import {
  BookIcon,
  ChatIcon,
  CheckIcon,
  HeartIcon,
  PersonIcon,
  TargetIcon,
} from '~/components/ui/Icons'
import { SELECTABLE_LOCALES } from '~/i18n/config'
import { useLocale, useSetLocale, useT } from '~/i18n/useT'

type StepId = 'language' | 'areas' | 'practice' | 'start'

/** A greeting in each language, written in that language. */
const GREETINGS: Record<Locale, string> = {
  en: 'Hello',
  fr: 'Bonjour',
  es: 'Hola',
  sv: 'Hej',
}

interface WelcomeTourProps {
  /** Where the person was headed before the tour stepped in. */
  returnTo?: string
}

/**
 * The welcome tour a new account sees once: pick a language, see each part
 * of the app, learn how a practice conversation goes, then choose where to
 * begin. Finishing or skipping marks it done on the account.
 */
export function WelcomeTour({ returnTo }: WelcomeTourProps) {
  const t = useT()
  const navigate = useNavigate()
  const completeOnboarding = useMutation(api.users.completeOnboarding)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)
  const [leaving, setLeaving] = useState(false)

  // With a single language on offer there is nothing to choose.
  const steps: Array<StepId> =
    SELECTABLE_LOCALES.length > 1
      ? ['language', 'areas', 'practice', 'start']
      : ['areas', 'practice', 'start']
  const [index, setIndex] = useState(0)
  const step = steps[index]

  // Moving between steps brings the new heading into view and gives it focus,
  // so keyboard and screen reader users land on the new content.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [index])

  const finish = async (to: string) => {
    setLeaving(true)
    try {
      await completeOnboarding()
    } catch {
      // Not being able to save this only means the tour may show once more.
    }
    navigate({ to, replace: true })
  }

  const bubble = {
    language: t.onboarding.language.bubble,
    areas: t.onboarding.areas.bubble,
    practice: t.onboarding.practice.bubble,
    start: t.onboarding.start.bubble,
  }[step]

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        {/* Progress and the way out */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ol className="flex items-center gap-2" aria-hidden="true">
              {steps.map((id, i) => (
                <li
                  key={id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-8 bg-giraffe-500'
                      : i < index
                        ? 'w-2 bg-giraffe-400'
                        : 'w-2 bg-giraffe-200'
                  }`}
                />
              ))}
            </ol>
            <p className="text-sm font-medium text-brown-600">
              {t.onboarding.stepOf(index + 1, steps.length)}
            </p>
          </div>
          {step !== 'start' && (
            <button
              type="button"
              onClick={() => void finish(returnTo ?? '/practice')}
              disabled={leaving}
              className="text-sm font-semibold text-brown-600 hover:text-brown-800 underline-offset-2 hover:underline transition-colors"
            >
              {t.onboarding.skip}
            </button>
          )}
        </div>

        {/* The guide */}
        <div className="mt-8 flex items-end gap-4 sm:gap-6">
          <img
            src="/giraff.png"
            alt={t.common.giraffeAlt}
            className="h-24 sm:h-32 w-auto object-contain shrink-0"
          />
          <SpeechBubble tail="left" className="flex-1 mb-4">
            <p className="text-brown-800 font-medium leading-relaxed sm:text-lg">
              {bubble}
            </p>
          </SpeechBubble>
        </div>

        <section className="mt-10" aria-labelledby="welcome-step-title">
          {step === 'language' && (
            <LanguageStep headingRef={headingRef} />
          )}
          {step === 'areas' && <AreasStep headingRef={headingRef} />}
          {step === 'practice' && <PracticeStep headingRef={headingRef} />}
          {step === 'start' && (
            <StartStep
              headingRef={headingRef}
              disabled={leaving}
              onChoose={(to) => void finish(to)}
            />
          )}
        </section>

        {/* Step navigation */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {index > 0 ? (
            <Button
              variant="outline"
              onClick={() => setIndex(index - 1)}
              disabled={leaving}
            >
              {t.onboarding.back}
            </Button>
          ) : (
            <span />
          )}
          {step !== 'start' && (
            <Button size="lg" onClick={() => setIndex(index + 1)}>
              {t.onboarding.next}
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

interface StepProps {
  headingRef: React.RefObject<HTMLHeadingElement | null>
}

function StepHeading({
  headingRef,
  title,
  subtitle,
}: StepProps & { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1
        id="welcome-step-title"
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl sm:text-4xl font-bold text-brown-800 text-balance tracking-tight focus:outline-none"
      >
        {title}
      </h1>
      <p className="mt-3 text-lg text-brown-700 text-pretty">{subtitle}</p>
    </div>
  )
}

function LanguageStep({ headingRef }: StepProps) {
  const t = useT()
  const locale = useLocale()
  const setLocale = useSetLocale()

  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title={t.onboarding.language.title}
        subtitle={t.onboarding.language.subtitle}
      />
      <div
        role="radiogroup"
        aria-labelledby="welcome-step-title"
        className="grid gap-3 sm:grid-cols-2"
      >
        {SELECTABLE_LOCALES.map((code) => {
          const selected = code === locale
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={selected}
              lang={code}
              onClick={() => {
                if (!selected) void setLocale(code)
              }}
              className={`flex items-center justify-between gap-4 rounded-lg border-2 bg-white p-5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-2 ${
                selected
                  ? 'border-giraffe-500 shadow-md'
                  : 'border-giraffe-100 shadow-sm hover:border-giraffe-300'
              }`}
            >
              <span>
                <span className="block text-xl font-bold text-brown-800">
                  {LOCALE_NAMES[code]}
                </span>
                <span className="block text-brown-600">{GREETINGS[code]}</span>
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected
                    ? 'border-giraffe-500 bg-giraffe-400 text-brown-800'
                    : 'border-giraffe-200'
                }`}
                aria-hidden="true"
              >
                {selected && <CheckIcon className="w-4 h-4" />}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-5 text-sm text-brown-600">
        {t.onboarding.language.changeLater}
      </p>
    </>
  )
}

function AreasStep({ headingRef }: StepProps) {
  const t = useT()
  const areas = t.onboarding.areas
  const items: Array<{ key: string; icon: ReactNode; title: string; body: string }> = [
    { key: 'lessons', icon: <BookIcon />, ...areas.lessons },
    { key: 'practice', icon: <ChatIcon />, ...areas.practice },
    { key: 'daily', icon: <TargetIcon />, ...areas.daily },
    { key: 'feelings', icon: <HeartIcon />, ...areas.feelings },
    { key: 'profile', icon: <PersonIcon />, ...areas.profile },
  ]

  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title={areas.title}
        subtitle={areas.subtitle}
      />
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex gap-4 rounded-lg border-2 border-giraffe-100 bg-white p-5 shadow-sm"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-giraffe-100 text-brown-700"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div>
              <h2 className="text-lg font-bold text-brown-800">{item.title}</h2>
              <p className="mt-1 text-brown-700 leading-relaxed">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function PracticeStep({ headingRef }: StepProps) {
  const t = useT()
  const p = t.onboarding.practice
  const tips = [p.brief, p.oneStep, p.hints, p.rewind, p.wrapUp]

  return (
    <>
      <StepHeading headingRef={headingRef} title={p.title} subtitle={p.subtitle} />
      <ol className="space-y-3">
        {tips.map((tip, i) => (
          <li
            key={tip.title}
            className="flex gap-4 rounded-lg border-2 border-giraffe-100 bg-white p-5 shadow-sm"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-giraffe-400 font-bold text-brown-800"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <h2 className="text-lg font-bold text-brown-800">{tip.title}</h2>
              <p className="mt-1 text-brown-700 leading-relaxed">{tip.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}

function StartStep({
  headingRef,
  disabled,
  onChoose,
}: StepProps & { disabled: boolean; onChoose: (to: string) => void }) {
  const t = useT()
  const s = t.onboarding.start
  const choiceClasses =
    'group flex w-full flex-col items-start rounded-lg border-2 bg-white p-6 text-left shadow-sm transition-colors duration-200 hover:border-giraffe-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-wait'

  return (
    <>
      <StepHeading headingRef={headingRef} title={s.title} subtitle={s.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChoose('/learn/introduction')}
          className={`${choiceClasses} border-giraffe-400`}
        >
          <span className="rounded-full bg-giraffe-100 px-3 py-1 text-xs font-semibold text-brown-700">
            {s.lessons.tag}
          </span>
          <span className="mt-4 text-xl font-bold text-brown-800">
            {s.lessons.title}
          </span>
          <span className="mt-2 text-brown-700 leading-relaxed">
            {s.lessons.body}
          </span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChoose('/practice')}
          className={`${choiceClasses} border-giraffe-100`}
        >
          <span className="text-xl font-bold text-brown-800 sm:mt-11">
            {s.practice.title}
          </span>
          <span className="mt-2 text-brown-700 leading-relaxed">
            {s.practice.body}
          </span>
        </button>
      </div>
    </>
  )
}
