/**
 * RewindButton Component
 *
 * Allows users to undo their last message and try a different approach
 * Limited to 2 rewinds per conversation to encourage thoughtful responses
 */

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface RewindButtonProps {
  rewindsRemaining: number
  onRewind: () => Promise<void>
  disabled?: boolean
}

function RewindIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
      />
    </svg>
  )
}

export function RewindButton({
  rewindsRemaining,
  onRewind,
  disabled = false,
}: RewindButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRewinding, setIsRewinding] = useState(false)

  const handleRewind = async () => {
    setIsRewinding(true)
    try {
      await onRewind()
      setIsOpen(false)
    } finally {
      setIsRewinding(false)
    }
  }

  const canRewind = rewindsRemaining > 0 && !disabled

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          disabled={!canRewind}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
            canRewind
              ? 'border-giraffe-300 text-giraffe-700 hover:bg-giraffe-100 hover:border-giraffe-400 hover:text-giraffe-800 cursor-pointer'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RewindIcon />
          <span>Rewind</span>
          <span className="text-xs bg-giraffe-100 text-giraffe-700 px-1.5 py-0.5 rounded-full">
            {rewindsRemaining}
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-giraffe-500 to-giraffe-400 text-white px-6 py-4">
              <Dialog.Title className="text-lg font-bold">
                Rewind Last Message?
              </Dialog.Title>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-200">
                <p className="text-brown-800 text-sm leading-relaxed">
                  Feeling stuck? This will remove your last message and the
                  character's response, giving you a chance to try a different
                  approach.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-giraffe-700">
                <span className="font-semibold">Rewinds remaining:</span>
                <span className="bg-giraffe-100 px-2 py-0.5 rounded-full">
                  {rewindsRemaining}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Using a rewind won't affect your final score - it's here to help
                you learn!
              </p>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end bg-gray-50">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleRewind}
                disabled={isRewinding}
                className="px-4 py-2 text-sm font-medium text-white bg-giraffe-600 hover:bg-giraffe-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRewinding ? 'Rewinding...' : 'Rewind'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
