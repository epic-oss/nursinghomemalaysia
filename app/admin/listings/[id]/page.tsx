export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AdminListingForm } from '@/components/admin/AdminListingForm'

async function getListing(listingId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('id', listingId)
    .single()

  return { data, error }
}

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: listing, error } = await getListing(id)

  if (error || !listing) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/listings"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to Listings
      </Link>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {listing.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Admin Edit - Full Access
          </p>
        </div>
        <div className="flex items-center gap-2">
          {listing.is_premium && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              Premium
            </span>
          )}
          {listing.user_id ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Claimed
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
              Unclaimed
            </span>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Owner</p>
          <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
            {listing.user_id ? listing.contact_email : 'None'}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Location</p>
          <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
            {listing.location}, {listing.state}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Created</p>
          <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/listings/nursing_home/${listing.slug}`}
          target="_blank"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          View on Site →
        </Link>
      </div>

      {/* Edit Form */}
      <AdminListingForm listing={listing} />
    </div>
  )
}
