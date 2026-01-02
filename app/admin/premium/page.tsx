export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getPremiumListings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('is_premium', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching premium listings:', error)
    return []
  }

  return data || []
}

export default async function AdminPremiumPage() {
  const premiumListings = await getPremiumListings()

  // Calculate revenue (RM99 per premium listing per month)
  const monthlyRevenue = premiumListings.length * 99

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Premium Subscriptions ({premiumListings.length})
        </h1>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Monthly Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                RM {monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Active Subscriptions
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {premiumListings.length}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Avg per Subscription
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                RM 99
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Listings Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Company
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {premiumListings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-500">
                  No premium subscriptions yet
                </td>
              </tr>
            ) : (
              premiumListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {listing.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      {listing.location}, {listing.state}
                    </div>
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
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                      RM99/month
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <span>✓</span> Active
                    </span>
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
                        className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        Manage
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
