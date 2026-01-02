'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UpgradeButtonProps {
  nursingHomeId: string
}

export function UpgradeButton({ nursingHomeId }: UpgradeButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nursingHomeId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: any) {
      console.error('Upgrade error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="block w-full rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Creating checkout session...' : 'Get Premium Now'}
      </button>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        Secure payment via Stripe • Cancel anytime
      </p>
    </div>
  )
}
