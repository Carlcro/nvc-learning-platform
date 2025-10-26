import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          {/* Giraffe Emoji / Symbol */}
          <div className="text-7xl mb-8 animate-bounce">🦒</div>

          <h1 className="text-5xl sm:text-6xl font-bold text-brown-800 dark:text-white mb-6">
            Learn to Communicate
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              with Compassion
            </span>
          </h1>

          <p className="text-xl text-brown-700 dark:text-brown-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Master Non-Violent Communication (NVC) through interactive lessons
            and real conversations with AI. Learn to express yourself
            authentically while truly understanding others.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <BenefitCard
              emoji="💭"
              title="4 Core Skills"
              description="Learn observation, feeling, need, and request—the foundation of compassionate communication."
            />
            <BenefitCard
              emoji="🎯"
              title="Practice in Real Scenarios"
              description="Have meaningful conversations with AI characters and get instant feedback on your communication."
            />
            <BenefitCard
              emoji="📈"
              title="See Your Progress"
              description="Track your growth as you develop your ability to communicate with empathy and clarity."
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/learn">
              <Button size="lg" variant="primary" className="px-8">
                Start Learning
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* What is NVC Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brown-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 dark:text-white mb-12 text-center">
            What is Non-Violent Communication?
          </h2>

          <p className="text-lg text-brown-700 dark:text-brown-400 mb-12 leading-relaxed">
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

          <div className="bg-giraffe-50 dark:bg-giraffe-900 border-l-4 border-giraffe-500 p-6 rounded">
            <p className="text-brown-700 dark:text-brown-300">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-giraffe-50 dark:bg-brown-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 dark:text-white mb-12 text-center">
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
              description="Engage in realistic conversations with AI characters. Each scenario presents a different communication challenge."
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brown-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-brown-800 dark:text-white mb-12 text-center">
            Giraffe Language vs Jackal Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-giraffe-50 dark:bg-brown-900 rounded-lg p-8 border-2 border-giraffe-200 dark:border-giraffe-700">
              <h3 className="text-2xl font-bold text-brown-900 dark:text-giraffe-200 mb-4">
                🦒 Giraffe Language
              </h3>
              <p className="text-brown-700 dark:text-brown-400 mb-4">
                Compassionate, empathetic communication
              </p>
              <ul className="space-y-3 text-brown-700 dark:text-brown-400">
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✓</span>
                  <span>Focuses on facts without judgment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✓</span>
                  <span>Expresses feelings and needs openly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✓</span>
                  <span>Makes requests, not demands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✓</span>
                  <span>Creates understanding and connection</span>
                </li>
              </ul>
            </div>

            <div className="bg-empathy-low dark:bg-empathy-low rounded-lg p-8 border-2 border-empathy-low dark:border-empathy-low">
              <h3 className="text-2xl font-bold text-empathy-low dark:text-empathy-low mb-4">
                🐺 Jackal Language
              </h3>
              <p className="text-brown-700 dark:text-brown-400 mb-4">
                Judgmental, reactive communication
              </p>
              <ul className="space-y-3 text-brown-700 dark:text-brown-400">
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✗</span>
                  <span>Uses judgment and blame</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✗</span>
                  <span>Makes demands and ultimatums</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✗</span>
                  <span>Criticizes or diagnoses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl mt-1">✗</span>
                  <span>Creates defensiveness and distance</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-giraffe-50 dark:bg-giraffe-900 border-l-4 border-giraffe-500 p-6 rounded">
            <p className="text-brown-700 dark:text-brown-300">
              <strong>Our goal:</strong> Help you become more fluent in giraffe
              language. We're not here to judge; we're here to celebrate your
              growth and help you communicate more authentically.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-700 dark:to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl text-giraffe-50 mb-10">
            Start your journey toward more compassionate, authentic
            conversations today.
          </p>
          <Link to="/learn">
            <Button
              size="lg"
              variant="primary"
              className="bg-white text-giraffe-600 hover:bg-giraffe-100 px-8"
            >
              Begin Your Learning Journey
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

interface BenefitCardProps {
  emoji: string
  title: string
  description: string
}

function BenefitCard({ emoji, title, description }: BenefitCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody className="text-center py-8">
        <div className="text-5xl mb-4">{emoji}</div>
        <h3 className="text-xl font-bold text-brown-800 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-brown-600 dark:text-brown-400">{description}</p>
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
          <div className="text-3xl font-bold text-giraffe-600 dark:text-giraffe-400 flex-shrink-0">
            {number}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-brown-800 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-brown-600 dark:text-brown-400 mb-3">
              {description}
            </p>
            <p className="text-sm text-brown-700 dark:text-giraffe-300 italic">
              {example}
            </p>
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
      <div className="bg-giraffe-600 dark:bg-giraffe-500 text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-bold text-xl">
        {step}
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-brown-800 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-brown-600 dark:text-brown-400 text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
