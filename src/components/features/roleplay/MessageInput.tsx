/**
 * MessageInput Component
 *
 * Input field for the user's response to the character
 * Handles validation, character limit, and submission
 */

import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/Button'

interface MessageInputProps {
  /** Returns whether the message was sent; the input only clears on success. */
  onSubmit: (message: string) => Promise<boolean>
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  /**
   * Words handed back to the composer after a rewind, so a message can be
   * adjusted rather than retyped. A new `id` means a new hand-back, even when
   * the text repeats.
   */
  restoredDraft?: { id: number; text: string } | null
}

const MAX_MESSAGE_LENGTH = 1000

export function MessageInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'What is the next true thing you want to say?',
  restoredDraft = null,
}: MessageInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // After a rewind the taken-back words return here, ready to be reshaped.
  useEffect(() => {
    if (!restoredDraft) return
    setValue(restoredDraft.text)
    setError(null)
    textareaRef.current?.focus()
  }, [restoredDraft])

  const characterCount = value.length
  const charactersRemaining = MAX_MESSAGE_LENGTH - characterCount
  const isNearLimit = charactersRemaining < 100

  const submitMessage = async () => {
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

    try {
      const sent = await onSubmit(value)
      // Only clear once the message is safely sent; on failure the user's
      // words stay in the box so nothing is lost.
      if (sent) {
        setValue('')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error submitting message:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void submitMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Only submit if there's content and not already submitting
      if (value.trim() && !isSubmitting && !disabled && !isLoading) {
        void submitMessage()
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
          ref={textareaRef}
          aria-label="Your message"
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
        <Button
          type="submit"
          variant="primary"
          disabled={disabled || isLoading || isSubmitting || !value.trim()}
          isLoading={isSubmitting}
          className="text-nowrap"
        >
          Send Response
        </Button>

        {/* Info Text */}
        {characterCount > 0 && (
          <div className="text-xs text-brown-600 w-full">
            One piece at a time is plenty. Say the next true thing.
          </div>
        )}
      </div>
    </form>
  )
}
