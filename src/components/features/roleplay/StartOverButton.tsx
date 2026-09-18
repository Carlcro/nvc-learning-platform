/**
 * StartOverButton Component
 *
 * Leaves the current conversation behind and begins the scenario again.
 * Unlike a rewind this cannot be undone and skips the results screen, so it
 * always asks first, and the gentle choice (staying) is the easy one.
 */

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface StartOverButtonProps {
  onStartOver: () => Promise<void>
  /** Whether wrapping up is available, so the dialog can point to it. */
  canWrapUp: boolean
  disabled?: boolean
}

export function StartOverButton({
  onStartOver,
  canWrapUp,
  disabled = false,
}: StartOverButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const handleStartOver = async () => {
    setIsStarting(true)
    try {
      await onStartOver()
      setIsOpen(false)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="px-3 py-2 text-sm rounded-lg text-brown-600 hover:text-brown-900 hover:bg-giraffe-100 transition-colors cursor-pointer disabled:text-brown-400 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
        >
          Start over
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-giraffe-400 text-brown-800 px-6 py-4">
              <Dialog.Title className="text-lg font-bold">
                Start this conversation over?
              </Dialog.Title>
            </div>

            <div className="p-6 space-y-3">
              <Dialog.Description className="text-brown-800 text-sm leading-relaxed text-pretty">
                Everything said so far will be set aside and the scenario
                begins again from the first line. This cannot be undone.
              </Dialog.Description>
              <p className="text-xs text-brown-600 text-pretty">
                {canWrapUp
                  ? 'If you would rather keep what you have practiced, you can wrap up instead and see how it went.'
                  : 'If only your last message felt off, a rewind takes back just that one.'}
              </p>
            </div>

            <div className="border-t border-giraffe-100 px-6 py-4 flex gap-3 justify-end bg-giraffe-50">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isStarting}
                  className="px-4 py-2 text-sm font-semibold text-brown-700 hover:bg-giraffe-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Keep going
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleStartOver}
                disabled={isStarting}
                className="px-4 py-2 text-sm font-semibold text-cream bg-brown-600 hover:bg-brown-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isStarting ? 'Starting over…' : 'Start over'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
