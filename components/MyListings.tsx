'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { NursingHome } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'
import { useRouter } from 'next/navigation'

interface MyListingsProps {
  listings: NursingHome[]
}

export function MyListings({ listings }: MyListingsProps) {
  const router = useRouter()
  const [unclaimingId, setUnclaimingId] = useState<string | null>(null)
  const [showUnclaimDialog, setShowUnclaimDialog] = useState<string | null>(null)
  const [cancelingPremiumId, setCancelingPremiumId] = useState<string | null>(null)
  const [showCancelPremiumDialog, setShowCancelPremiumDialog] = useState<string | null>(null)

  const handleUnclaim = async (listingId: string) => {
    setUnclaimingId(listingId)

    try {
      const response = await fetch('/api/unclaim-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unclaim listing')
      }

      // Show success message
      alert('Listing unclaimed successfully! It can now be claimed by other facilities.')

      // Refresh the page to show updated listings
      router.refresh()
      setShowUnclaimDialog(null)

    } catch (error) {
      console.error('Error unclaiming listing:', error)
      alert(error instanceof Error ? error.message : 'Failed to unclaim listing. Please try again.')
    } finally {
      setUnclaimingId(null)
    }
  }

  const handleCancelPremium = async (listingId: string) => {
    setCancelingPremiumId(listingId)

    try {
      const response = await fetch('/api/cancel-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel premium')
      }

      // Show success message
      alert('Premium subscription canceled successfully. Your listing will remain active on the free tier.')

      // Refresh the page to show updated listings
      router.refresh()
      setShowCancelPremiumDialog(null)

    } catch (error) {
      console.error('Error canceling premium:', error)
      alert(error instanceof Error ? error.message : 'Failed to cancel premium. Please try again.')
    } finally {
      setCancelingPremiumId(null)
    }
  }
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Listings
        </h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          You don't own any listings yet.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/submit"
            className="rounded-md bg-zinc-900 px-6 py-2 font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Submit New Business
          </Link>
          <span className="text-zinc-500 dark:text-zinc-500">or</span>
          <button className="rounded-md border border-zinc-300 px-6 py-2 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800">
            Claim Existing Listing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Listings
        </h2>
        <Link
          href="/submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Add New Listing
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Logo/Image */}
            <div className="relative h-48 w-full bg-zinc-50 dark:bg-zinc-900/80">
              {getHighResLogoUrl(listing.logo_url) ? (
                <Image
                  src={getHighResLogoUrl(listing.logo_url)!}
                  alt={`${listing.name} logo`}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-zinc-600 dark:text-zinc-200">
                  {listing.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute right-2 top-2 flex flex-col gap-2">
                {listing.is_featured && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
                    Featured
                  </span>
                )}
                {listing.featured && (
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {listing.name}
              </h3>
              <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                {listing.location}, {listing.state}
              </p>

              {/* Featured Until */}
              {listing.is_featured && listing.featured_until && (
                <div className="mb-3 text-xs text-zinc-500 dark:text-zinc-500">
                  Featured until: {new Date(listing.featured_until).toLocaleDateString()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link
                    href={`/listings/nursing_home/${listing.slug}`}
                    className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/listings/${listing.id}/edit`}
                    className="flex-1 rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Edit
                  </Link>
                </div>

                {/* Cancel Premium Button (only for premium listings) */}
                {listing.is_premium && (
                  <button
                    onClick={() => setShowCancelPremiumDialog(listing.id)}
                    className="w-full rounded-md border border-yellow-300 px-3 py-2 text-center text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-950/20"
                  >
                    Cancel Premium
                  </button>
                )}

                {/* Unclaim Button */}
                <button
                  onClick={() => setShowUnclaimDialog(listing.id)}
                  className="w-full rounded-md border border-red-300 px-3 py-2 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  Unclaim This Listing
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unclaim Confirmation Dialog */}
      {showUnclaimDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Unclaim This Listing?
            </h3>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to unclaim this listing? This will:
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Return the listing to unclaimed status</li>
              <li>Remove any premium features</li>
              <li>Allow other facilities to claim it</li>
            </ul>
            <p className="mb-6 text-sm font-medium text-red-600 dark:text-red-400">
              This action cannot be undone. You'll need to submit a new claim request to reclaim this listing.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnclaimDialog(null)}
                disabled={unclaimingId === showUnclaimDialog}
                className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnclaim(showUnclaimDialog)}
                disabled={unclaimingId === showUnclaimDialog}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {unclaimingId === showUnclaimDialog ? 'Unclaiming...' : 'Yes, Unclaim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Premium Confirmation Dialog */}
      {showCancelPremiumDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Cancel Premium Subscription?
            </h3>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to cancel your premium subscription? You'll lose:
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Featured placement at the top of listings</li>
              <li>Premium badge on your listing</li>
              <li>Priority customer support</li>
              <li>Enhanced visibility and exposure</li>
            </ul>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Your listing will remain active and claimed, but will return to the free tier.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelPremiumDialog(null)}
                disabled={cancelingPremiumId === showCancelPremiumDialog}
                className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Keep Premium
              </button>
              <button
                onClick={() => handleCancelPremium(showCancelPremiumDialog)}
                disabled={cancelingPremiumId === showCancelPremiumDialog}
                className="flex-1 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelingPremiumId === showCancelPremiumDialog ? 'Canceling...' : 'Cancel Premium'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
