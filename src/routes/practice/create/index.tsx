import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAction, useMutation, useQuery } from 'convex/react'
import { useEffect, useId, useRef, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import type { ReactNode } from 'react'
import { pageMeta } from '~/lib/seo'
import { userFacingMessage } from '~/lib/errorMessage'
import { Button } from '~/components/ui/Button'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/practice/create/')({
  head: () => ({
    meta: pageMeta({
      title: 'Build a Scenario',
      description:
        'Shape a scenario from a real situation in your life, then rehearse it.',
    }),
  }),
  component: ProtectedCreate,
})

function ProtectedCreate() {
  return (
    <ProtectedRoute>
      <ScenarioCreate />
    </ProtectedRoute>
  )
}

// ============================================================================
// SHAPE OF THE GENERATED SCENARIO (mirrors scenarios.createCustom)
// ============================================================================

interface GeneratedScenario {
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  situation: string
  characterName: string
  characterPersonality: string
  characterInitialMood: number
  characterBackground: string
  characterHiddenNeeds: Array<string>
  aiOpeningMessage: string
  learningObjectives: Array<string>
  focusArea: string
  estimatedDuration: number
  tags: Array<string>
}

// ============================================================================
// WIZARD INPUTS
// ============================================================================

type Step = 'situation' | 'person' | 'you' | 'refine' | 'review'

interface DraftAnswers {
  // Step 1 - the situation
  otherPersonName: string
  relationship: string
  whatsGoingOn: string
  whatWasSaid: string
  // Step 2 - the other person
  howTheyReact: Array<string>
  whatMattersToThem: string
  openness: 'guarded' | 'mixed' | 'open' | ''
  history: string
  // Step 3 - you
  feelings: Array<string>
  goodOutcome: string
  whatToPractice: Array<string>
  challenge: 'gentle' | 'true' | 'tougher' | ''
}

const EMPTY_DRAFT: DraftAnswers = {
  otherPersonName: '',
  relationship: '',
  whatsGoingOn: '',
  whatWasSaid: '',
  howTheyReact: [],
  whatMattersToThem: '',
  openness: '',
  history: '',
  feelings: [],
  goodOutcome: '',
  whatToPractice: [],
  challenge: '',
}

const RELATIONSHIPS = [
  'Partner',
  'Family member',
  'Friend',
  'Manager',
  'Coworker',
  'Roommate',
  'Other',
]

const REACTIONS = [
  'Gets defensive',
  'Shuts down or goes quiet',
  'Gets louder',
  'Deflects with humor',
  'Stays calm',
  'Apologizes quickly',
  'Brings up the past',
  'Not sure yet',
]

const OPENNESS: Array<{ value: DraftAnswers['openness']; label: string }> = [
  { value: 'guarded', label: 'Pretty guarded' },
  { value: 'mixed', label: 'Guarded but willing' },
  { value: 'open', label: 'Fairly open' },
]

// Common feelings in a hard conversation, drawn from the app's feelings
// library vocabulary. Kept short so naming a feeling stays calm, not clinical.
const FEELINGS = [
  'frustrated',
  'angry',
  'irritated',
  'upset',
  'sad',
  'disappointed',
  'lonely',
  'discouraged',
  'anxious',
  'worried',
  'overwhelmed',
  'resentful',
]

const PRACTICE_FOCUS = [
  'Stating what I observed without blame',
  'Naming my feelings',
  'Connecting to what I need',
  'Making a clear request',
  'Staying grounded if it gets heated',
]

const CHALLENGE: Array<{ value: DraftAnswers['challenge']; label: string }> = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'true', label: 'True to life' },
  { value: 'tougher', label: 'Tougher than usual' },
]

const categoryLabels: Record<string, string> = {
  workplace: 'Workplace',
  family: 'Family',
  friendship: 'Friendship',
  self_expression: 'Self-Expression',
}

const difficultyChip: Record<string, string> = {
  beginner: 'bg-empathy-high text-brown-900',
  intermediate: 'bg-giraffe-300 text-brown-900',
  advanced: 'bg-empathy-low text-brown-900',
}

// The journey the user travels, named so the guide rail can show where they are.
const STAGES = [
  'The situation',
  'The other person',
  'What you hope for',
  'Your space',
]

const opennessLabel = (value: DraftAnswers['openness']) =>
  OPENNESS.find((o) => o.value === value)?.label ?? 'Unsure'

const challengeLabel = (value: DraftAnswers['challenge']) =>
  CHALLENGE.find((c) => c.value === value)?.label ?? 'True to life'

/**
 * Turn the wizard answers into a plain Q&A list the builder can reason over.
 * Only includes the things the person actually shared.
 */
function buildSeedAnswers(a: DraftAnswers): Array<{
  question: string
  answer: string
}> {
  const seed: Array<{ question: string; answer: string }> = []
  const name = a.otherPersonName.trim() || 'the other person'
  const relationship = a.relationship || 'someone in my life'
  seed.push({
    question: 'Who is this conversation with and what is your relationship?',
    answer: `${name}, ${relationship}`,
  })
  if (a.whatWasSaid.trim()) {
    seed.push({
      question: 'What happened, specifically?',
      answer: a.whatWasSaid.trim(),
    })
  }
  if (a.howTheyReact.length > 0) {
    seed.push({
      question: 'How does this person usually react when things get tense?',
      answer: a.howTheyReact.join(', '),
    })
  }
  if (a.whatMattersToThem.trim()) {
    seed.push({
      question: 'What matters most to them in this situation?',
      answer: a.whatMattersToThem.trim(),
    })
  }
  if (a.openness) {
    seed.push({
      question: 'How open do you expect them to be at the start?',
      answer: opennessLabel(a.openness),
    })
  }
  if (a.history.trim()) {
    seed.push({
      question: 'Anything about them or your history that helps picture it?',
      answer: a.history.trim(),
    })
  }
  if (a.feelings.length > 0) {
    seed.push({
      question: 'How does this situation leave you feeling?',
      answer: a.feelings.join(', '),
    })
  }
  if (a.goodOutcome.trim()) {
    seed.push({
      question: 'What would feel like a good outcome for you?',
      answer: a.goodOutcome.trim(),
    })
  }
  if (a.whatToPractice.length > 0) {
    seed.push({
      question: 'What do you most want to practice?',
      answer: a.whatToPractice.join(', '),
    })
  }
  if (a.challenge) {
    seed.push({
      question: 'How challenging should they be?',
      answer: challengeLabel(a.challenge),
    })
  }
  return seed
}

// ============================================================================
// THE WIZARD
// ============================================================================

function ScenarioCreate() {
  const navigate = useNavigate()
  const currentUser = useQuery(api.users.getCurrentUser)

  const assessReadiness = useAction(api.ai.assessScenarioReadiness)
  const generateScenario = useAction(api.ai.generateCustomScenario)
  const createCustom = useMutation(api.scenarios.createCustom)
  const initializeScenarioProgress = useMutation(
    api.scenarioProgress.initializeScenarioProgress,
  )
  const createConversation = useMutation(api.conversations.create)

  const [step, setStep] = useState<Step>('situation')
  const [answers, setAnswers] = useState<DraftAnswers>(EMPTY_DRAFT)

  // Clarifying conversation state
  const [clarifyThread, setClarifyThread] = useState<
    Array<{ question: string; answer: string }>
  >([])
  const [pendingQuestions, setPendingQuestions] = useState<Array<string>>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [refineLoading, setRefineLoading] = useState(false)

  // Generation / review state
  const [generated, setGenerated] = useState<GeneratedScenario | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [generating, setGenerating] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<DraftAnswers>) =>
    setAnswers((prev) => ({ ...prev, ...patch }))

  // Bumped whenever the user navigates backwards out of an async flow, so an
  // in-flight assess/generate response can never yank them forward to a step
  // they just left.
  const flowEpochRef = useRef(0)
  const isStale = (epoch: number) => epoch !== flowEpochRef.current

  const name = answers.otherPersonName.trim() || 'them'

  const userDescription = [answers.whatsGoingOn.trim(), answers.whatWasSaid.trim()]
    .filter(Boolean)
    .join('\n\n')

  // ---- Generation -----------------------------------------------------------

  const generateAndReview = async (
    clarify: Array<{ question: string; answer: string }>,
  ) => {
    const epoch = flowEpochRef.current
    setStep('review')
    setGenerating(true)
    setError(null)
    setGenerated(null)
    try {
      const scenario = (await generateScenario({
        userDescription,
        answers: [...buildSeedAnswers(answers), ...clarify],
      })) as GeneratedScenario
      if (isStale(epoch)) return
      setGenerated(scenario)
      setEditedTitle(scenario.title)
    } catch (err) {
      if (isStale(epoch)) return
      setError(
        userFacingMessage(
          err,
          "We couldn't shape this just now. Take a breath and try again.",
        ),
      )
    } finally {
      if (!isStale(epoch)) setGenerating(false)
    }
  }

  // ---- Clarifying step ------------------------------------------------------

  const startRefine = async () => {
    const epoch = flowEpochRef.current
    setStep('refine')
    setRefineLoading(true)
    setError(null)
    setClarifyThread([])
    setPendingQuestions([])
    setQuestionIndex(0)
    setRounds(0)
    try {
      const res = await assessReadiness({
        userDescription,
        priorAnswers: buildSeedAnswers(answers),
        roundsSoFar: 0,
      })
      if (isStale(epoch)) return
      setRounds(1)
      if (res.ready || res.questions.length === 0) {
        await generateAndReview([])
      } else {
        setPendingQuestions(res.questions.map((q) => q.question))
        setQuestionIndex(0)
      }
    } catch {
      // Fail open: go straight to shaping the scenario.
      if (!isStale(epoch)) await generateAndReview([])
    } finally {
      if (!isStale(epoch)) setRefineLoading(false)
    }
  }

  const submitClarifyAnswer = async (answer: string) => {
    const epoch = flowEpochRef.current
    const question = pendingQuestions[questionIndex]
    const newThread = [...clarifyThread, { question, answer }]
    setClarifyThread(newThread)

    // More questions queued in this round? Show the next one.
    if (questionIndex + 1 < pendingQuestions.length) {
      setQuestionIndex(questionIndex + 1)
      return
    }

    // Finished this round. Re-check (unless we've hit the cap).
    if (rounds >= 2) {
      await generateAndReview(newThread)
      return
    }

    setRefineLoading(true)
    try {
      const res = await assessReadiness({
        userDescription,
        priorAnswers: [...buildSeedAnswers(answers), ...newThread],
        roundsSoFar: rounds,
      })
      if (isStale(epoch)) return
      setRounds(rounds + 1)
      if (res.ready || res.questions.length === 0) {
        await generateAndReview(newThread)
      } else {
        setPendingQuestions(res.questions.map((q) => q.question))
        setQuestionIndex(0)
      }
    } catch {
      if (!isStale(epoch)) await generateAndReview(newThread)
    } finally {
      if (!isStale(epoch)) setRefineLoading(false)
    }
  }

  const skipRest = async () => {
    await generateAndReview(clarifyThread)
  }

  // ---- Start the conversation ----------------------------------------------

  const handleStart = async () => {
    if (!currentUser || !generated) return
    setStarting(true)
    setError(null)
    try {
      const { title: _title, ...rest } = generated
      const scenarioId = await createCustom({
        ...rest,
        title: editedTitle.trim() || generated.title,
      })

      await initializeScenarioProgress({ scenarioId })
      const conversationId = await createConversation({ scenarioId })

      navigate({
        to: `/practice/${scenarioId as Id<'scenarios'>}/conversation/${conversationId}`,
      })
    } catch (err) {
      setError(
        userFacingMessage(
          err,
          "That didn't go through. Take a breath and try again.",
        ),
      )
      setStarting(false)
    }
  }

  const keepEditing = () => {
    flowEpochRef.current += 1
    setGenerated(null)
    setGenerating(false)
    setRefineLoading(false)
    setError(null)
    setClarifyThread([])
    setPendingQuestions([])
    setRounds(0)
    setStep('situation')
  }

  // ---- Validation -----------------------------------------------------------

  const canLeaveSituation =
    answers.otherPersonName.trim().length > 0 &&
    answers.whatsGoingOn.trim().length > 0
  const canFinish = answers.goodOutcome.trim().length > 0

  // ---- Wayfinding -----------------------------------------------------------

  const stageIndex =
    step === 'situation' ? 0 : step === 'person' ? 1 : step === 'you' ? 2 : 3

  const railBubble =
    step === 'situation'
      ? "Let's start with what's on your mind. Share only what you'd like, and keep it simple."
      : step === 'person'
        ? `A little about ${name}, so they feel real to talk to.`
        : step === 'you'
          ? "Now the part that's about you, and what you're hoping for."
          : step === 'refine'
            ? `A couple of things, so this feels true to your situation with ${name}.`
            : "Here's your space. Make it yours, and adjust anything that doesn't fit."

  const backLabel = step === 'situation' ? 'Back to practice' : 'Back a step'
  const handleBack = () => {
    setError(null)
    if (step === 'situation') navigate({ to: '/practice' })
    else if (step === 'person') setStep('situation')
    else if (step === 'you') setStep('person')
    else if (step === 'refine') {
      // Leaving an async step: invalidate any in-flight assess/generate so
      // its response cannot pull the user forward again.
      flowEpochRef.current += 1
      setRefineLoading(false)
      setStep('you')
    } else keepEditing()
  }

  // Move focus to each phase's heading as it takes the stage, so keyboard and
  // screen-reader users land in the new content instead of dropping to <body>.
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const heading = contentRef.current?.querySelector('h1')
    if (heading) {
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
    }
  }, [step])

  // ---- Render ---------------------------------------------------------------

  if (step === 'review' && generating) {
    return <GiraffeLoader message="Shaping your practice space…" />
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <BackLink label={backLabel} onClick={handleBack} />

        <div className="grid md:grid-cols-[17rem_minmax(0,1fr)] gap-8 lg:gap-12 md:items-start">
          <RailGuide bubble={railBubble} stageIndex={stageIndex} />

          {/* Each phase fades up as it takes the stage */}
          <div ref={contentRef} key={step} className="animate-step-in min-w-0">
            {step === 'situation' && (
              <StepCard title="The situation">
                <TextField
                  label="Who is this conversation with?"
                  hint="A name or how you'll refer to them"
                  value={answers.otherPersonName}
                  onChange={(v) => update({ otherPersonName: v })}
                  placeholder="e.g. Sam"
                />
                <ChipGroup
                  label="What's your relationship?"
                  options={RELATIONSHIPS.map((r) => ({ value: r, label: r }))}
                  selected={answers.relationship ? [answers.relationship] : []}
                  onToggle={(v) =>
                    update({
                      relationship: answers.relationship === v ? '' : v,
                    })
                  }
                />
                <TextAreaField
                  label="In a sentence or two, what's going on?"
                  value={answers.whatsGoingOn}
                  onChange={(v) => update({ whatsGoingOn: v })}
                  placeholder="What's the situation you want to rehearse?"
                />
                <TextAreaField
                  label="What happened, specifically?"
                  optional
                  value={answers.whatWasSaid}
                  onChange={(v) => update({ whatWasSaid: v })}
                  placeholder="A specific thing that was said or done"
                />

                <StepActions
                  hint={
                    !canLeaveSituation
                      ? "Add who it's with and what's going on to continue."
                      : undefined
                  }
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-8"
                    disabled={!canLeaveSituation}
                    onClick={() => setStep('person')}
                  >
                    Continue
                  </Button>
                </StepActions>
              </StepCard>
            )}

            {step === 'person' && (
              <StepCard title={`About ${name}`}>
                <ChipGroup
                  label="How do they usually react when things get tense?"
                  hint="Choose any that fit"
                  options={REACTIONS.map((r) => ({ value: r, label: r }))}
                  selected={answers.howTheyReact}
                  onToggle={(v) =>
                    update({
                      howTheyReact: answers.howTheyReact.includes(v)
                        ? answers.howTheyReact.filter((x) => x !== v)
                        : [...answers.howTheyReact, v],
                    })
                  }
                />
                <TextAreaField
                  label="What do you think matters most to them here?"
                  optional
                  hint="For example: being respected, being heard, fairness"
                  value={answers.whatMattersToThem}
                  onChange={(v) => update({ whatMattersToThem: v })}
                  placeholder="What's underneath their reaction?"
                />
                <ChipGroup
                  label="How open do you expect them to be at the start?"
                  options={OPENNESS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                  selected={answers.openness ? [answers.openness] : []}
                  onToggle={(v) =>
                    update({
                      openness:
                        answers.openness === v
                          ? ''
                          : (v as DraftAnswers['openness']),
                    })
                  }
                />
                <TextAreaField
                  label="Anything else about them or your history?"
                  optional
                  value={answers.history}
                  onChange={(v) => update({ history: v })}
                  placeholder="Only if it helps picture the conversation"
                />

                <StepActions>
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-8"
                    onClick={() => setStep('you')}
                  >
                    Continue
                  </Button>
                </StepActions>
              </StepCard>
            )}

            {step === 'you' && (
              <StepCard title="What you're hoping for">
                <ChipGroup
                  label="How does this leave you feeling?"
                  optional
                  hint="Choose any that fit, or none"
                  options={FEELINGS.map((f) => ({
                    value: f,
                    label: f.charAt(0).toUpperCase() + f.slice(1),
                  }))}
                  selected={answers.feelings}
                  onToggle={(v) =>
                    update({
                      feelings: answers.feelings.includes(v)
                        ? answers.feelings.filter((x) => x !== v)
                        : [...answers.feelings, v],
                    })
                  }
                />
                <TextAreaField
                  label="What would feel like a good outcome for you?"
                  value={answers.goodOutcome}
                  onChange={(v) => update({ goodOutcome: v })}
                  placeholder="What you'd love to feel or hear by the end"
                />
                <ChipGroup
                  label="What do you most want to practice?"
                  hint="Choose any that fit"
                  options={PRACTICE_FOCUS.map((p) => ({ value: p, label: p }))}
                  selected={answers.whatToPractice}
                  onToggle={(v) =>
                    update({
                      whatToPractice: answers.whatToPractice.includes(v)
                        ? answers.whatToPractice.filter((x) => x !== v)
                        : [...answers.whatToPractice, v],
                    })
                  }
                />
                <ChipGroup
                  label="How challenging should they be?"
                  options={CHALLENGE.map((c) => ({
                    value: c.value,
                    label: c.label,
                  }))}
                  selected={answers.challenge ? [answers.challenge] : []}
                  onToggle={(v) =>
                    update({
                      challenge:
                        answers.challenge === v
                          ? ''
                          : (v as DraftAnswers['challenge']),
                    })
                  }
                />

                <StepActions
                  hint={
                    !canFinish
                      ? 'Share what a good outcome would look like to continue.'
                      : undefined
                  }
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-8"
                    disabled={!canFinish}
                    onClick={startRefine}
                  >
                    Continue
                  </Button>
                </StepActions>
              </StepCard>
            )}

            {step === 'refine' && (
              <RefineStep
                thread={clarifyThread}
                currentQuestion={
                  !refineLoading && questionIndex < pendingQuestions.length
                    ? pendingQuestions[questionIndex]
                    : null
                }
                loading={refineLoading}
                onAnswer={submitClarifyAnswer}
                onSkipRest={skipRest}
              />
            )}

            {step === 'review' && generated && (
              <ReviewStep
                scenario={generated}
                title={editedTitle}
                onTitleChange={setEditedTitle}
                onStart={handleStart}
                onKeepEditing={keepEditing}
                starting={starting}
                error={error}
              />
            )}

            {/* Generation failed: never leave the user on a blank screen */}
            {step === 'review' && !generating && !generated && (
              <div className="bg-white rounded-lg border-2 border-giraffe-100 shadow-sm overflow-hidden">
                <div className="px-6 sm:px-8 py-7 space-y-4">
                  <h1 className="text-2xl font-bold text-brown-800 tracking-tight">
                    Let's try that again
                  </h1>
                  <p className="text-brown-700 text-pretty">
                    {error ??
                      "We couldn't shape this just now. Your answers are safe."}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                      variant="primary"
                      onClick={() => generateAndReview(clarifyThread)}
                    >
                      Try again
                    </Button>
                    <Button variant="outline" onClick={keepEditing}>
                      Back to editing
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Errors that can surface outside the review bar */}
            {error && step !== 'review' && (
              <p className="mt-4 text-sm text-empathy-low font-medium">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================================
// THE GUIDE RAIL: the companion stays beside you the whole way
// ============================================================================

function RailGuide({
  bubble,
  stageIndex,
}: {
  bubble: string
  stageIndex: number
}) {
  return (
    <aside className="md:sticky md:top-28">
      {/* Desktop: the guide stands tall, speaking down to a vertical path */}
      <div className="hidden md:flex md:flex-col md:items-center">
        <SpeechBubble className="mb-5 w-full">
          <p className="text-base text-brown-800 text-center font-medium text-pretty">
            {bubble}
          </p>
        </SpeechBubble>
        <img
          src="/giraff.png"
          alt="Your guide"
          className="h-40 lg:h-48 w-auto object-contain drop-shadow-xl mb-7 -scale-x-100"
        />
        <JourneyPath stageIndex={stageIndex} />
      </div>

      {/* Mobile: a slim companion header above the form */}
      <div className="md:hidden mb-6">
        <div className="flex items-start gap-3">
          <img
            src="/giraff.png"
            alt="Your guide"
            className="h-20 w-auto object-contain drop-shadow-md flex-shrink-0 -scale-x-100"
          />
          <SpeechBubble tail="left" className="flex-1">
            <p className="text-sm text-brown-800 font-medium text-pretty">
              {bubble}
            </p>
          </SpeechBubble>
        </div>
        <JourneyPathCompact stageIndex={stageIndex} />
      </div>
    </aside>
  )
}

/**
 * The path the user is travelling, as a quiet vertical list. Completed stages
 * carry a check, the current one glows gold, the rest wait softly. Frames the
 * work as a gentle journey, never a graded checklist.
 */
function JourneyPath({ stageIndex }: { stageIndex: number }) {
  return (
    <ol className="w-full" aria-label="Your progress">
      {STAGES.map((label, i) => {
        const state =
          i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'upcoming'
        const isLast = i === STAGES.length - 1
        return (
          <li
            key={label}
            className="relative flex items-center gap-3 py-2"
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-[0.6875rem] top-[1.75rem] h-[calc(100%-0.75rem)] w-0.5 rounded-full ${
                  state === 'done' ? 'bg-giraffe-300' : 'bg-giraffe-100'
                }`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 grid place-items-center h-[1.375rem] w-[1.375rem] rounded-full border-2 transition-colors duration-200 ${
                state === 'done'
                  ? 'bg-giraffe-400 border-giraffe-400 text-brown-800'
                  : state === 'current'
                    ? 'bg-white border-giraffe-400 ring-4 ring-giraffe-100'
                    : 'bg-white border-giraffe-200'
              }`}
            >
              {state === 'done' ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    state === 'current' ? 'bg-giraffe-400' : 'bg-giraffe-200'
                  }`}
                />
              )}
            </span>
            <span
              className={`text-sm leading-tight ${
                state === 'current'
                  ? 'font-bold text-brown-800'
                  : state === 'done'
                    ? 'font-medium text-brown-600'
                    : 'text-brown-400'
              }`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Compact progress for the mobile companion header. */
function JourneyPathCompact({ stageIndex }: { stageIndex: number }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex items-center gap-1.5 flex-1">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              i <= stageIndex ? 'bg-giraffe-400' : 'bg-giraffe-100'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-brown-600 whitespace-nowrap">
        {STAGES[stageIndex]}
      </span>
    </div>
  )
}

// ============================================================================
// REFINE STEP
// ============================================================================

function RefineStep({
  thread,
  currentQuestion,
  loading,
  onAnswer,
  onSkipRest,
}: {
  thread: Array<{ question: string; answer: string }>
  currentQuestion: string | null
  loading: boolean
  onAnswer: (answer: string) => void
  onSkipRest: () => void
}) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim()) return
    const toSend = value
    setValue('')
    onAnswer(toSend)
  }

  return (
    <div className="bg-white rounded-lg border-2 border-giraffe-100 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-7 space-y-6">
        <h1 className="text-2xl font-bold text-brown-800 tracking-tight">
          A few details
        </h1>

        {/* Thread of answered questions */}
        <div className="space-y-4">
          {thread.map((qa, i) => (
            <div key={i} className="space-y-2">
              <div className="bg-giraffe-50 border-2 border-giraffe-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                <p className="text-sm text-brown-800 text-pretty">
                  {qa.question}
                </p>
              </div>
              {qa.answer && (
                <div className="bg-giraffe-300 rounded-2xl rounded-br-md px-4 py-3 max-w-[85%] ml-auto">
                  <p className="text-sm text-brown-900 text-pretty">
                    {qa.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Current question */}
          {currentQuestion && (
            <div className="bg-giraffe-50 border-2 border-giraffe-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
              <p className="text-sm text-brown-800 text-pretty">
                {currentQuestion}
              </p>
            </div>
          )}

          {/* Thinking dots */}
          {loading && (
            <div
              className="flex gap-1.5 px-2 py-1"
              role="status"
              aria-label="One moment"
            >
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-giraffe-400 animate-typing-dot"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Answer input */}
        {currentQuestion && !loading && (
          <div className="space-y-3">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Share what comes to mind…"
              maxLength={1000}
              className="w-full px-4 py-3 rounded-lg border-2 border-giraffe-200 bg-white text-brown-800 placeholder-brown-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-giraffe-400 focus:ring-offset-2 focus:border-giraffe-400 resize-none min-h-20"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={!value.trim()}
              >
                Send
              </Button>
              <Button variant="ghost" onClick={onSkipRest}>
                Skip and continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// REVIEW STEP
// ============================================================================

function ReviewStep({
  scenario,
  title,
  onTitleChange,
  onStart,
  onKeepEditing,
  starting,
  error,
}: {
  scenario: GeneratedScenario
  title: string
  onTitleChange: (v: string) => void
  onStart: () => void
  onKeepEditing: () => void
  starting: boolean
  error: string | null
}) {
  const titleId = useId()
  return (
    <>
      <div className="bg-white rounded-lg border-2 border-giraffe-100 overflow-hidden shadow-sm">
        <header className="bg-giraffe-400 px-6 sm:px-8 py-5">
          <label
            htmlFor={titleId}
            className="block text-xs font-semibold text-brown-800/80 mb-1"
          >
            Title
          </label>
          <input
            id={titleId}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={120}
            className="w-full bg-white/70 rounded-lg px-3 py-2 text-xl sm:text-2xl font-bold text-brown-800 border-2 border-transparent transition-colors duration-200 focus:outline-none focus:border-brown-700/30 focus:bg-white"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brown-700 text-cream">
              {categoryLabels[scenario.category] ?? scenario.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                difficultyChip[scenario.difficulty] ??
                'bg-giraffe-100 text-brown-900'
              }`}
            >
              {scenario.difficulty}
            </span>
          </div>
        </header>

        <div className="px-6 sm:px-8 py-6 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-brown-800 mb-2">Situation</h2>
            <p className="text-brown-700 leading-relaxed bg-giraffe-50 rounded-lg p-4 border border-giraffe-100 text-pretty">
              {scenario.situation}
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-lg font-bold text-brown-800 mb-2">
                About {scenario.characterName}
              </h2>
              <div className="space-y-3">
                <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
                  <p className="text-xs font-semibold text-brown-700 mb-1">
                    Personality
                  </p>
                  <p className="text-brown-700 text-sm leading-relaxed">
                    {scenario.characterPersonality}
                  </p>
                </div>
                {scenario.characterBackground && (
                  <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
                    <p className="text-xs font-semibold text-brown-700 mb-1">
                      Background
                    </p>
                    <p className="text-brown-700 text-sm leading-relaxed">
                      {scenario.characterBackground}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-brown-800 mb-2">
                What you'll practice
              </h2>
              <ol className="space-y-2">
                {scenario.learningObjectives.map((objective, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-giraffe-50 rounded-lg p-3 border border-giraffe-100"
                  >
                    <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-giraffe-400 text-brown-800 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-brown-700 text-sm capitalize">
                      {objective}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <p className="text-sm text-brown-600 bg-giraffe-50/70 border border-giraffe-100 rounded-lg px-4 py-3 text-pretty">
            {scenario.characterName}'s responses here are a practice stand-in, so
            you can try things out gently before the real conversation.
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        {error ? (
          <p className="flex-1 text-sm text-empathy-low font-medium">{error}</p>
        ) : (
          <p className="flex-1 hidden sm:block text-sm text-brown-600">
            Ready when you are. Take your time.
          </p>
        )}
        <Button variant="outline" onClick={onKeepEditing} disabled={starting}>
          Keep editing
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="px-8"
          onClick={onStart}
          isLoading={starting}
          disabled={starting}
        >
          {starting ? 'Starting…' : 'Start the conversation'}
        </Button>
      </div>
    </>
  )
}

// ============================================================================
// SHARED PIECES
// ============================================================================

function StepCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="bg-white rounded-lg border-2 border-giraffe-100 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-7 space-y-6">
        <h1 className="text-2xl font-bold text-brown-800 tracking-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

function StepActions({
  hint,
  children,
}: {
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="pt-5 border-t border-giraffe-100 -mx-6 sm:-mx-8 px-6 sm:px-8 flex flex-wrap items-center gap-3">
      {hint ? (
        <p className="text-sm text-brown-500 text-pretty flex-1 min-w-48">
          {hint}
        </p>
      ) : (
        <span aria-hidden="true" className="flex-1" />
      )}
      <div className="ml-auto">{children}</div>
    </div>
  )
}

function FieldLabel({
  label,
  hint,
  optional,
  htmlFor,
}: {
  label: string
  hint?: string
  optional?: boolean
  htmlFor?: string
}) {
  return (
    <div className="mb-2">
      <div className="flex items-baseline gap-2">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-brown-800">
          {label}
        </label>
        {optional && (
          <span className="text-xs font-normal text-brown-400">(optional)</span>
        )}
      </div>
      {hint && <p className="text-xs text-brown-500 mt-0.5">{hint}</p>}
    </div>
  )
}

function TextField({
  label,
  hint,
  optional,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint?: string
  optional?: boolean
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const id = useId()
  return (
    <div>
      <FieldLabel label={label} hint={hint} optional={optional} htmlFor={id} />
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        className="w-full px-4 py-3 rounded-lg border-2 border-giraffe-200 bg-white text-brown-800 placeholder-brown-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-giraffe-400 focus:ring-offset-2 focus:border-giraffe-400"
      />
    </div>
  )
}

function TextAreaField({
  label,
  hint,
  optional,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint?: string
  optional?: boolean
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const id = useId()
  return (
    <div>
      <FieldLabel label={label} hint={hint} optional={optional} htmlFor={id} />
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={1000}
        className="w-full px-4 py-3 rounded-lg border-2 border-giraffe-200 bg-white text-brown-800 placeholder-brown-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-giraffe-400 focus:ring-offset-2 focus:border-giraffe-400 resize-none min-h-20"
      />
    </div>
  )
}

function ChipGroup({
  label,
  hint,
  optional,
  options,
  selected,
  onToggle,
}: {
  label: string
  hint?: string
  optional?: boolean
  options: Array<{ value: string; label: string }>
  selected: Array<string>
  onToggle: (value: string) => void
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} optional={optional} />
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(opt.value)}
              className={`inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-giraffe-400 text-brown-800 border-2 border-giraffe-500'
                  : 'bg-white text-brown-700 border-2 border-giraffe-200 hover:border-giraffe-300 hover:bg-giraffe-50'
              }`}
            >
              {isSelected && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 -ml-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brown-700 hover:text-brown-900 mb-6 rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M12.7 4.3a1 1 0 0 1 0 1.4L8.42 10l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </button>
  )
}
