'use client'

import { useState } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import { QuoteFormModal } from './QuoteFormModal'

interface InArticleCTAProps {
  title?: string
  description?: string
  location?: string
}

export function InArticleCTA({
  title = 'Ready to Book Your Nursing Home?',
  description = 'Get free quotes from up to 5 verified facilities',
  location,
}: InArticleCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayTitle = location ? `Ready to Book Your ${location} Nursing Home?` : title

  return (
    <>
      <div className="my-8 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 text-center shadow-sm dark:border-blue-900 dark:from-blue-950 dark:to-cyan-950">
        <div className="mb-4 flex justify-center">
          <MessageSquareQuote className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{displayTitle}</h3>
        <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">{description}</p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <MessageSquareQuote className="h-5 w-5" />
          Get Free Quotes
        </button>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No obligation • Response within 24 hours
        </p>
      </div>

      <QuoteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={location ? `blog_cta_${location.toLowerCase().replace(/\s+/g, '_')}` : 'blog_cta'}
      />
    </>
  )
}
