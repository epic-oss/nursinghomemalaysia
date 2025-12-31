export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { AdminListingsTable } from '@/components/admin/AdminListingsTable'
import { AdminListingsHeader } from '@/components/admin/AdminListingsHeader'

interface SearchParams {
  status?: string
  premium?: string
  state?: string
  search?: string
}

async function getListings(params: SearchParams) {
  const supabase = await createClient()

  let query = supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter by status (claimed/unclaimed)
  if (params.status === 'claimed') {
    query = query.not('user_id', 'is', null)
  } else if (params.status === 'unclaimed') {
    query = query.is('user_id', null)
  }

  // Filter by premium
  if (params.premium === 'premium') {
    query = query.eq('is_premium', true)
  } else if (params.premium === 'free') {
    query = query.eq('is_premium', false)
  }

  // Filter by state
  if (params.state && params.state !== 'all') {
    query = query.eq('state', params.state)
  }

  // Search by name
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return data || []
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const listings = await getListings(params)

  const malaysianStates = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Kuala Lumpur',
    'Labuan',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Putrajaya',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
  ]

  return (
    <div className="space-y-6">
      <AdminListingsHeader count={listings.length} />

      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <form method="get" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Status
              </label>
              <select
                name="status"
                defaultValue={params.status || 'all'}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="all">All</option>
                <option value="claimed">Claimed</option>
                <option value="unclaimed">Unclaimed</option>
              </select>
            </div>

            {/* Premium Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Premium
              </label>
              <select
                name="premium"
                defaultValue={params.premium || 'all'}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="all">All</option>
                <option value="premium">Premium</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                State
              </label>
              <select
                name="state"
                defaultValue={params.state || 'all'}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="all">All States</option>
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Search
              </label>
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Company name..."
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Apply Filters
            </button>
            <a
              href="/admin/listings"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Clear
            </a>
          </div>
        </form>
      </div>

      {/* Listings Table */}
      <AdminListingsTable listings={listings} />
    </div>
  )
}
