'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { QuoteForm } from './QuoteForm'

interface QuoteFormModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string
}

export function QuoteFormModal({ isOpen, onClose, source = 'floating_button' }: QuoteFormModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'

      // Track modal open event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_form_opened', {
          source: source,
        })
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, source])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900 sm:p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            id="quote-modal-title"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl"
          >
            Get Free Quotes
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Tell us about your nursing home needs and we'll connect you with up to 5 suitable
            facilities at no cost.
          </p>
        </div>

        {/* Form */}
        <QuoteForm onSuccess={onClose} source={source} />
      </div>
    </div>
  )
}
