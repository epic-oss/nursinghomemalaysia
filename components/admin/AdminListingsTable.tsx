'use client'

import Link from 'next/link'
import { NursingHome } from '@/lib/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminListingsTableProps {
  listings: NursingHome[]
}

export function AdminListingsTable({ listings }: AdminListingsTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (listingId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(listingId)

    try {
      const response = await fetch('/api/admin/delete-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete listing')
      }

      alert('Listing deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete listing')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePremium = async (listingId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/toggle-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, isPremium: !currentStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle premium')
      }

      alert(`Premium status ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
      router.refresh()
    } catch (error) {
      console.error('Error toggling premium:', error)
      alert(error instanceof Error ? error.message : 'Failed to toggle premium')
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">No listings found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Company
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Premium
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Owner
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              State
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3">
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {listing.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  {listing.location}
                </div>
              </td>
              <td className="px-4 py-3">
                {listing.user_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <span>✓</span> Claimed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                    Unclaimed
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {listing.is_premium ? (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Premium
                  </span>
                ) : (
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">Free</span>
                )}
              </td>
              <td className="px-4 py-3">
                {listing.user_id ? (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {listing.contact_email}
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 dark:text-zinc-600">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                {listing.state}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/listings/nursing_home/${listing.slug}`}
                    target="_blank"
                    className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/listings/${listing.id}`}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleTogglePremium(listing.id, listing.is_premium)}
                    className="rounded-md border border-yellow-300 px-3 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-950/20"
                  >
                    {listing.is_premium ? 'Remove Premium' : 'Make Premium'}
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id, listing.name)}
                    disabled={deletingId === listing.id}
                    className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
