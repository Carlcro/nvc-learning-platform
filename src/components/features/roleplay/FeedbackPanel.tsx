/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, empathy meter, and coaching tips
 * Provides real-time feedback during conversation with Giraffe mascot coaching
 */

import { EmpathyMeter } from './EmpathyMeter'
import { GiraffeCoach } from './GiraffeCoach'
import type { FeedbackData, NVCScore } from './types'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  isLoading?: boolean
  messageCount?: number
}

export function FeedbackPanel({
  feedback,
  isLoading = false,
  messageCount = 0,
}: FeedbackPanelProps) {
  return (
    <div className="bg-gradient-to-b from-giraffe-50 to-cream border-l border-giraffe-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-giraffe-200 bg-gradient-to-r from-giraffe-500 to-giraffe-400 text-white sticky top-0">
        <h2 className="font-bold text-lg">Live Feedback</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="animate-spin">
              <svg
                className="w-8 h-8 text-giraffe-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-brown-600">Analyzing your message...</p>
          </div>
        ) : feedback ? (
          <>
            {/* Empathy Meter */}
            <EmpathyMeter score={feedback.score.total} size="lg" />

            {/* Giraffe Coach with Progressive Feedback */}
            <GiraffeCoach feedback={feedback} messageCount={messageCount} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
              className="mx-auto object-contain h-80 w-auto"
            />{' '}
            <p className="text-center text-brown-600 text-sm">
              Send a message and I will give you feedback on your NVC
              communication!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
