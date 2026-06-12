/**
 * MessageInput Component
 *
 * Input field for user's response to the AI character
 * Handles validation, character limit, and submission
 */

import { useState } from 'react'
import { Button } from '~/components/ui/Button'

interface MessageInputProps {
  onSubmit: (message: string) => Promise<void> | void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  onStartOver?: () => void
}

const MAX_MESSAGE_LENGTH = 1000

export function MessageInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Type your response here... Express your observations, feelings, needs, and requests.',
  onStartOver,
}: MessageInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const characterCount = value.length
  const charactersRemaining = MAX_MESSAGE_LENGTH - characterCount
  const isNearLimit = charactersRemaining < 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!value.trim()) {
      setError('Please enter a message')
      return
    }

    if (value.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`)
      return
    }

    setError(null)
    setIsSubmitting(true)

    // Clear textbox immediately
    const messageToSend = value
    setValue('')

    try {
      await onSubmit(messageToSend)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error submitting message:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Only submit if there's content and not already submitting
      if (value.trim() && !isSubmitting && !disabled && !isLoading) {
        handleSubmit(e as any)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Error Message */}
      {error && (
        <div className="bg-empathy-low/15 border border-empathy-low/40 text-brown-800 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading || isSubmitting}
          maxLength={MAX_MESSAGE_LENGTH}
          className={`
            w-full px-4 py-3 rounded-lg border-2
            bg-white text-brown-800 placeholder-brown-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-giraffe-400 focus:ring-offset-2
            disabled:bg-brown-100 disabled:text-brown-400 disabled:cursor-not-allowed
            resize-none
            border-giraffe-200 focus:border-giraffe-400
            ${value.length > 0 ? 'border-giraffe-300' : 'border-giraffe-200'}
            ${error ? 'border-empathy-low/50' : ''}
            min-h-24
          `}
        />

        {/* Character Count */}
        <div
          className={`absolute bottom-3 right-3 text-xs font-semibold ${
            isNearLimit ? 'text-empathy-low' : 'text-brown-500'
          }`}
        >
          {characterCount}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex gap-3 flex-1">
          <Button
            type="submit"
            variant="primary"
            disabled={disabled || isLoading || isSubmitting || !value.trim()}
            isLoading={isSubmitting}
            className="text-nowrap"
          >
            {'Send Response'}
          </Button>

          {onStartOver && (
            <Button
              type="button"
              variant="secondary"
              disabled={disabled || isLoading || isSubmitting}
              onClick={onStartOver}
              className="text-nowrap"
            >
              Start Over
            </Button>
          )}
        </div>

        {/* Info Text */}
        {characterCount > 0 && (
          <div className="text-xs text-brown-600 w-full">
            Remember: Express your observation, feeling, need, and request
          </div>
        )}
      </div>
    </form>
  )
}
