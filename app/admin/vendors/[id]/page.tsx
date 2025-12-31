export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getVendorDetails(userId: string) {
  const supabase = await createClient()

  const { data: listings, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !listings || listings.length === 0) {
    return null
  }

  return {
    email: listings[0].contact_email || '',
    phone: listings[0].contact_phone || '',
    listings,
  }
}

export default async function AdminVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vendor = await getVendorDetails(id)

  if (!vendor) {
    notFound()
  }

  const isPremium = vendor.listings.some((l) => l.is_premium)
  const totalListings = vendor.listings.length

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/vendors"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to Vendors
      </Link>

      {/* Vendor Info */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Vendor Details
        </h1>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{vendor.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Phone</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
              {vendor.phone || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Plan</dt>
            <dd className="mt-1">
              {isPremium ? (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                  Premium
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                  Free
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Listings
            </dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{totalListings}</dd>
          </div>
        </dl>
      </div>

      {/* Vendor's Listings */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Listings ({totalListings})
        </h2>

        <div className="space-y-3">
          {vendor.listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {listing.name}
                  </h3>
                  {listing.is_premium && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                      Premium
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {listing.location}, {listing.state}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/listings/company/${listing.slug}`}
                  target="_blank"
                  className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  View
                </Link>
                <Link
                  href={`/admin/listings/${listing.id}`}
                  className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
