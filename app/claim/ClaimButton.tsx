'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimVendor } from './actions'

interface ClaimButtonProps {
  facilityId: string
  vendorName: string
}

export function ClaimButton({ facilityId, vendorName }: ClaimButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleClaim = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await claimVendor(facilityId)

      if (!result.success) {
        setError(result.error || 'Failed to claim listing')
        setLoading(false)
        return
      }

      setSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
          Congratulations!
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You&apos;ve successfully claimed <strong>{vendorName}</strong>!
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Redirecting to your dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={loading}
        className="w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Claiming...
          </span>
        ) : (
          'Confirm Claim'
        )}
      </button>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        Not the right listing?{' '}
        <a href="/listings" className="text-blue-600 hover:underline dark:text-blue-400">
          Browse all listings
        </a>
      </p>
    </div>
  )
}
