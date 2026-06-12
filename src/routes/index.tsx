import { Link, createFileRoute } from '@tanstack/react-router'
import { Unauthenticated } from 'convex/react'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import { DailyChallengeCard } from '~/components/features/dashboard/DailyChallengeCard'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="w-full">
      {/* Sign In Button - Top Right (only show when logged out) */}
      <Unauthenticated>
        <div className="fixed top-6 right-6 z-50">
          <Link to="/auth">
            <Button size="md" variant="primary">
              Sign In
            </Button>
          </Link>
        </div>
      </Unauthenticated>

      {/* Hero Section */}
      <section className="min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Giraffe Mascot */}
            <div className="flex flex-col items-center">
              <SpeechBubble className="mb-8 max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium text-pretty">
                  Hi there! I'm your compassionate communication guide.
                  Together, we'll learn to express ourselves authentically and
                  truly listen to others. Ready to begin?
                </p>
              </SpeechBubble>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="mx-auto object-contain h-80 w-auto scale-x-[-1] drop-shadow-xl animate-float-soft"
              />
            </div>

            {/* Right side - Content */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-brown-800 mb-6 text-balance tracking-tight">
                Learn to Communicate{' '}
                <span className="text-giraffe-700">with Compassion</span>
              </h1>

              <p className="text-xl text-brown-700 mb-8 leading-relaxed max-w-prose mx-auto md:mx-0">
                Master Non-Violent Communication (NVC) through interactive
                lessons and conversations. Learn to express yourself
                authentically while truly understanding others.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                <Link to="/learn">
                  <Button size="lg" variant="primary" className="px-8">
                    Start Learning
                  </Button>
                </Link>
                <Link to="/practice">
                  <Button size="lg" variant="secondary" className="px-8">
                    Start Practicing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-3xl mx-auto">
          <DailyChallengeCard />
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-4">
              <BenefitCard
                title="4 Core Skills"
                description="Learn observation, feeling, need, and request—the foundation of compassionate communication."
              />
              <BenefitCard
                title="Practice in Real Scenarios"
                description="Have meaningful conversations with characters and get instant feedback on your communication."
              />
              <BenefitCard
                title="See Your Progress"
                description="Track your growth as you develop your ability to communicate with empathy and clarity."
              />
            </div>

            {/* Right side - Giraffe with Speech Bubble */}
            <div className="flex flex-col items-center">
              <SpeechBubble className="mb-8 max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium text-pretty">
                  Here's what you'll master on your journey with me! Each skill
                  builds on the others to help you communicate with true
                  compassion.
                </p>
              </SpeechBubble>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="mx-auto object-contain h-72 w-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is NVC Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-6 text-center text-balance tracking-tight">
            What is Non-Violent Communication?
          </h2>

          <p className="text-lg text-brown-700 mb-12 leading-relaxed text-center max-w-prose mx-auto text-pretty">
            Non-Violent Communication (NVC) is a communication framework created
            by Marshall Rosenberg. It's based on the idea that all humans share
            the same universal needs—like understanding, respect, and
            connection. When we communicate with this in mind, we can resolve
            conflicts peacefully and build deeper relationships.
          </p>

          {/* The 4 Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <NVCComponent
              number="1"
              title="Observation"
              description="Describe what you see or hear without judgment. Focus on facts, not interpretations."
              example="'You didn't text me back' (not 'You always ignore me')"
            />
            <NVCComponent
              number="2"
              title="Feeling"
              description="Express your actual emotions, not thoughts disguised as feelings."
              example="'I felt worried' (not 'I felt like you don't care')"
            />
            <NVCComponent
              number="3"
              title="Need"
              description="Connect your feelings to universal human needs that matter to you."
              example="'because connection is important to me'"
            />
            <NVCComponent
              number="4"
              title="Request"
              description="Ask for a concrete action, not a demand. Leave room for 'no'."
              example="'Would you be willing to text me if you're running late?'"
            />
          </div>

          <GuideNote heading="Why it works">
            When we communicate our observations, feelings, and needs clearly, we
            help others understand us. When we listen for others' feelings and
            needs, we build empathy. This creates conversations where everyone
            feels heard.
          </GuideNote>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-12 text-center text-balance tracking-tight">
            How the App Works
          </h2>

          <ol className="space-y-8">
            <StepCard
              step="1"
              title="Learn the Foundations"
              description="Start with bite-sized lessons about each NVC component. Understand the concepts and see real-world examples."
            />
            <StepCard
              step="2"
              title="Practice with Scenarios"
              description="Engage in realistic conversations. Each scenario presents a different communication challenge."
            />
            <StepCard
              step="3"
              title="Get Thoughtful Feedback"
              description="After each message, see instant feedback on your use of NVC—what you're doing well, and what to explore next."
            />
            <StepCard
              step="4"
              title="Build Your Skill"
              description="Complete daily challenges, track your progress, and watch your communication skills grow over time."
            />
          </ol>
        </div>
      </section>

      {/* Giraffe vs Jackal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-12 text-center text-balance tracking-tight">
            Giraffe Language vs Jackal Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Giraffe Language Card */}
            <div className="bg-white rounded-lg overflow-hidden border-2 border-giraffe-300 shadow-sm">
              <div className="bg-giraffe-100 p-6 flex items-center justify-center h-48">
                <img
                  src="/giraff.png"
                  alt="The giraffe, a symbol of compassionate communication"
                  className="h-40 w-auto object-contain drop-shadow-md"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-brown-900 mb-2">
                  Giraffe Language
                </h3>
                <p className="text-brown-700 mb-6 font-medium">
                  Compassionate, empathetic communication
                </p>
                <ul className="space-y-3 text-brown-700">
                  <TraitItem positive>Focuses on facts without judgment</TraitItem>
                  <TraitItem positive>
                    Expresses feelings and needs openly
                  </TraitItem>
                  <TraitItem positive>Makes requests, not demands</TraitItem>
                  <TraitItem positive>
                    Creates understanding and connection
                  </TraitItem>
                </ul>
              </div>
            </div>

            {/* Jackal Language Card */}
            <div className="bg-white rounded-lg overflow-hidden border-2 border-empathy-low/50 shadow-sm">
              <div className="bg-empathy-low/15 p-6 flex items-center justify-center h-48">
                <img
                  src="/jakyll.png"
                  alt="The jackal, a symbol of reactive communication"
                  className="h-40 w-auto object-contain drop-shadow-md"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-brown-900 mb-2">
                  Jackal Language
                </h3>
                <p className="text-brown-700 mb-6 font-medium">
                  Judgmental, reactive communication
                </p>
                <ul className="space-y-3 text-brown-700">
                  <TraitItem>Uses judgment and blame</TraitItem>
                  <TraitItem>Makes demands and ultimatums</TraitItem>
                  <TraitItem>Criticizes or diagnoses</TraitItem>
                  <TraitItem>Creates defensiveness and distance</TraitItem>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <GuideNote heading="Our goal">
              Help you become more fluent in giraffe language. We're not here to
              judge; we're here to celebrate your growth and help you communicate
              more authentically.
            </GuideNote>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brown-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
            {/* Giraffe guide, encouraging the final step */}
            <img
              src="/giraff.png"
              alt="Your compassionate communication guide"
              className="h-56 w-auto object-contain mx-auto drop-shadow-2xl"
            />

            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-cream mb-4 text-balance tracking-tight">
                Ready to Transform Your Communication?
              </h2>
              <p className="text-xl text-giraffe-100 mb-8 max-w-prose mx-auto md:mx-0 text-pretty">
                Start your journey toward more compassionate, authentic
                conversations today. Let your giraffe guide you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link to="/learn">
                  <Button size="lg" variant="primary" className="px-8">
                    Begin Your Learning Journey
                  </Button>
                </Link>
                <Link to="/practice">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 border-cream text-cream hover:bg-brown-700"
                  >
                    Practice with Real Scenarios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

interface BenefitCardProps {
  title: string
  description: string
}

function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <Card hoverable>
      <CardBody className="py-6">
        <h3 className="text-xl font-bold text-brown-800 mb-2">{title}</h3>
        <p className="text-brown-700">{description}</p>
      </CardBody>
    </Card>
  )
}

interface NVCComponentProps {
  number: string
  title: string
  description: string
  example: string
}

function NVCComponent({
  number,
  title,
  description,
  example,
}: NVCComponentProps) {
  return (
    <Card hoverable>
      <CardBody>
        <div className="flex items-start gap-4">
          <span className="flex-shrink-0 grid place-items-center w-11 h-11 rounded-full bg-giraffe-400 text-brown-800 font-bold text-lg">
            {number}
          </span>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-brown-800 mb-2">{title}</h3>
            <p className="text-brown-700 mb-3">{description}</p>
            <p className="text-sm text-brown-600 italic">{example}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

interface StepCardProps {
  step: string
  title: string
  description: string
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <li className="flex gap-6 items-start">
      <span className="bg-giraffe-400 text-brown-800 rounded-full w-14 h-14 grid place-items-center flex-shrink-0 font-bold text-xl">
        {step}
      </span>
      <div className="flex-grow pt-1">
        <h3 className="text-2xl font-bold text-brown-800 mb-2">{title}</h3>
        <p className="text-brown-700 text-lg">{description}</p>
      </div>
    </li>
  )
}

interface GuideNoteProps {
  heading: string
  children: React.ReactNode
}

/**
 * A warm aside in the guide's voice. Replaces the old side-stripe callouts with
 * a full-bordered tinted panel led by the giraffe avatar—the Patient Mentor
 * speaking directly to the learner.
 */
function GuideNote({ heading, children }: GuideNoteProps) {
  return (
    <div className="flex items-start gap-4 bg-giraffe-50 border border-giraffe-200 rounded-2xl p-6">
      <img
        src="/giraff.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block flex-shrink-0 w-14 h-14 rounded-full object-cover object-top bg-giraffe-100 ring-2 ring-giraffe-200"
      />
      <div>
        <h3 className="font-bold text-brown-800 mb-1">{heading}</h3>
        <p className="text-brown-700 text-pretty">{children}</p>
      </div>
    </div>
  )
}

interface TraitItemProps {
  positive?: boolean
  children: React.ReactNode
}

function TraitItem({ positive = false, children }: TraitItemProps) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`mt-0.5 flex-shrink-0 grid place-items-center w-5 h-5 rounded-full text-xs font-bold ${
          positive
            ? 'bg-giraffe-100 text-giraffe-700'
            : 'bg-empathy-low/15 text-empathy-low'
        }`}
      >
        {positive ? '✓' : '✕'}
      </span>
      <span>{children}</span>
    </li>
  )
}
