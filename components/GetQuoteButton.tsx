'use client'

import { useState, useEffect } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import { QuoteFormModal } from './QuoteFormModal'

export function GetQuoteButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-36 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:h-14 sm:w-40 lg:bottom-8 lg:right-8"
        style={{
          boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
          animation: 'pulse-subtle 3s ease-in-out infinite',
        }}
        aria-label="Get free quotes"
      >
        <MessageSquareQuote className="h-5 w-5" />
        <span className="text-sm font-bold sm:text-base">Get Free Quotes</span>
      </button>

      <QuoteFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  )
}
