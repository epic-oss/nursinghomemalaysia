export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface FacilityData {
  user_id: string
  email: string
  is_premium: boolean
  listing_count: number
  nursing_home_names: string[]
}

async function getFacilities() {
  const supabase = await createClient()

  // Get all claimed listings
  const { data: claimedListings, error } = await supabase
    .from('nursing_homes')
    .select('user_id, name, contact_email, is_premium, created_at')
    .not('user_id', 'is', null)

  if (error || !claimedListings) {
    return []
  }

  // Group by user_id
  const facilitiesMap = new Map<string, FacilityData>()

  claimedListings.forEach((listing) => {
    if (!listing.user_id) return

    if (!facilitiesMap.has(listing.user_id)) {
      facilitiesMap.set(listing.user_id, {
        user_id: listing.user_id,
        email: listing.contact_email || '',
        is_premium: listing.is_premium,
        listing_count: 0,
        nursing_home_names: [],
      })
    }

    const vendor = facilitiesMap.get(listing.user_id)!
    vendor.listing_count++
    vendor.nursing_home_names.push(listing.name)
    if (listing.is_premium) {
      vendor.is_premium = true
    }
  })

  return Array.from(facilitiesMap.values())
}

export default async function AdminFacilitiesPage() {
  const facilities = await getFacilities()

  const premiumFacilities = facilities.filter((v) => v.is_premium)
  const freeFacilities = facilities.filter((v) => !v.is_premium)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Facilities ({facilities.length})
        </h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Premium Facilities
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {premiumFacilities.length}
              </p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Free Plan Facilities
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {freeFacilities.length}
              </p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Vendor Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Listings
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Companies
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {facilities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-500">
                  No facilities found
                </td>
              </tr>
            ) : (
              facilities.map((vendor) => (
                <tr key={vendor.user_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {vendor.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {vendor.is_premium ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {vendor.listing_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {vendor.nursing_home_names.join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/facilities/${vendor.user_id}`}
                      className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      View Details
                    </Link>
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
