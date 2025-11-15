import { Link, createFileRoute } from '@tanstack/react-router'
import { Unauthenticated } from 'convex/react'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'

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
              {/* Speech Bubble */}
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-giraffe-200 relative max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium">
                  Hi there! I'm your compassionate communication guide.
                  Together, we'll learn to express ourselves authentically and
                  truly listen to others. Ready to begin?
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt="Giraffe - Your NVC Guide"
                className="mx-auto object-contain h-80 w-auto scale-x-[-1]"
              />
            </div>

            {/* Right side - Content */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-brown-800 mb-6">
                Learn to Communicate
                <br />
                <span className="bg-linear-to-r from-giraffe-600 to-giraffe-500 bg-clip-text text-transparent">
                  with Compassion
                </span>
              </h1>

              <p className="text-xl text-brown-700 mb-8 leading-relaxed">
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

      {/* Key Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="order-1 md:order-1">
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
            </div>

            {/* Right side - Giraffe with Speech Bubble */}
            <div className="flex flex-col items-center order-2 md:order-2">
              {/* Speech Bubble */}
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-giraffe-200 relative max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium">
                  Here's what you'll master on your journey with me! Each skill
                  builds on the others to help you communicate with true
                  compassion.
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>

              {/* Giraffe Image */}
              <img
                src="/giraff.png"
                alt="Giraffe - Your NVC Guide"
                className="mx-auto object-contain h-72 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is NVC Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-12 text-center">
            What is Non-Violent Communication?
          </h2>

          <p className="text-lg text-brown-700 mb-12 leading-relaxed">
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

          <div className="bg-giraffe-50 border-l-4 border-giraffe-500 p-6 rounded">
            <p className="text-brown-700">
              <strong>Why it works:</strong> When we communicate our
              observations, feelings, and needs clearly, we help others
              understand us. When we listen for others' feelings and needs, we
              build empathy. This creates conversations where everyone feels
              heard.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-12 text-center">
            How the App Works
          </h2>

          <div className="space-y-8">
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
              title="Get Smart Feedback"
              description="After each message, get instant feedback on your use of NVC. See what you're doing well and what to improve."
            />
            <StepCard
              step="4"
              title="Build Your Skill"
              description="Complete daily challenges, track your progress, and watch your communication skills grow over time."
            />
          </div>
        </div>
      </section>

      {/* Giraffe vs Jackal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 mb-12 text-center">
            Giraffe Language vs Jackal Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Giraffe Language Card */}
            <div className="bg-white rounded-lg overflow-hidden border-2 border-giraffe-300 shadow-lg">
              {/* Image Container */}
              <div className="bg-giraffe-100 p-6 flex items-center justify-center h-48">
                <img
                  src="/giraff.png"
                  alt="Giraffe - Compassionate Communication"
                  className="h-40 w-auto object-contain"
                />
              </div>

              {/* Content Container */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-brown-900 mb-2">
                  Giraffe Language
                </h3>
                <p className="text-brown-700 mb-6 font-medium">
                  Compassionate, empathetic communication
                </p>
                <ul className="space-y-3 text-brown-700">
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-giraffe-600">✓</span>
                    <span>Focuses on facts without judgment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-giraffe-600">✓</span>
                    <span>Expresses feelings and needs openly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-giraffe-600">✓</span>
                    <span>Makes requests, not demands</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-giraffe-600">✓</span>
                    <span>Creates understanding and connection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Jackal Language Card */}
            <div className="bg-white rounded-lg overflow-hidden border-2 border-empathy-low shadow-lg">
              {/* Image Container */}
              <div className="bg-empathy-low p-6 flex items-center justify-center h-48">
                <img
                  src="/jakyll.png"
                  alt="Jackal - Reactive Communication"
                  className="h-40 w-auto object-contain"
                />
              </div>

              {/* Content Container */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-2">
                  Jackal Language
                </h3>
                <p className="text-brown-700 mb-6 font-medium">
                  Judgmental, reactive communication
                </p>
                <ul className="space-y-3 text-brown-700">
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-empathy-low">✗</span>
                    <span>Uses judgment and blame</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-empathy-low">✗</span>
                    <span>Makes demands and ultimatums</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-empathy-low">✗</span>
                    <span>Criticizes or diagnoses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl mt-1 text-empathy-low">✗</span>
                    <span>Creates defensiveness and distance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-giraffe-50 border-l-4 border-giraffe-500 p-6 rounded">
            <p className="text-brown-700">
              <strong>Our goal:</strong> Help you become more fluent in giraffe
              language. We're not here to judge; we're here to celebrate your
              growth and help you communicate more authentically.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-giraffe-600 to-giraffe-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl text-giraffe-50 mb-10">
            Start your journey toward more compassionate, authentic
            conversations today. Let your giraffe guide you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/learn">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-giraffe-600 hover:bg-giraffe-100 px-8"
              >
                Begin Your Learning Journey
              </Button>
            </Link>
            <Link to="/practice">
              <Button
                size="lg"
                variant="primary"
                className="bg-giraffe-700 text-white hover:bg-giraffe-800 px-8"
              >
                Practice with Real Scenarios
              </Button>
            </Link>
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody className="text-center py-8">
        <h3 className="text-xl font-bold text-brown-800 mb-3">{title}</h3>
        <p className="text-brown-600">{description}</p>
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
    <Card className="border-l-4 border-l-blue-500">
      <CardBody>
        <div className="flex items-start gap-4">
          <div className="text-3xl font-bold text-giraffe-600 flex-shrink-0">
            {number}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-brown-800 mb-2">{title}</h3>
            <p className="text-brown-600 mb-3">{description}</p>
            <p className="text-sm text-brown-700 italic">{example}</p>
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
    <div className="flex gap-6 items-start">
      <div className="bg-giraffe-600 text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-bold text-xl">
        {step}
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-brown-800 mb-2">{title}</h3>
        <p className="text-brown-600 text-lg">{description}</p>
      </div>
    </div>
  )
}
