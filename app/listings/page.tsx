import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { SearchFilter } from '@/components/SearchFilter'
import { NursingHome } from '@/lib/types'
import { getUser } from '@/lib/auth-helpers'

interface SearchParams {
  search?: string
  state?: string
  category?: string
  service?: string
  activity?: string
  hrdf?: string
}

async function ListingsContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const user = await getUser()
  const search = searchParams.search || ''
  const state = searchParams.state || ''
  const category = searchParams.category || ''
  const service = searchParams.service || searchParams.activity || ''
  const hrdf = searchParams.hrdf || 'all'

  // Fetch all nursing homes to extract unique services
  const { data: allNursingHomes } = await supabase.from('nursing_homes').select('services')

  // Extract unique services from comma-separated strings or arrays
  const uniqueServices = new Set<string>()
  allNursingHomes?.forEach(nursing_home => {
    if (nursing_home.services) {
      const services = Array.isArray(nursing_home.services)
        ? nursing_home.services
        : typeof nursing_home.services === 'string'
          ? nursing_home.services.split(',').map((s: string) => s.trim())
          : []
      services.forEach((s: string) => {
        if (s) uniqueServices.add(s)
      })
    }
  })
  const servicesList = Array.from(uniqueServices).sort()

  // Fetch nursing homes with filters
  let query = supabase.from('nursing_homes').select('*')

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (state) {
    query = query.eq('state', state)
  }
  if (category) {
    query = query.ilike('category', `%${category}%`)
  }
  if (service) {
    // Match service in JSON array format - escape special characters
    // Check if services column contains the service (works for both JSONB arrays and comma-separated strings)
    query = query.filter('services', 'ilike', `%${service}%`)
  }

  const { data: nursing_homes } = await query
    .order('is_premium', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Nursing Homes
      </h1>

      <div className="mb-8">
        <SearchFilter
          showCategoryFilter={true}
          showStateFilter={true}
          showActivityFilter={true}
          showHrdfFilter={false}
          services={servicesList}
        />
      </div>

      {!nursing_homes || nursing_homes.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            No nursing homes found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Showing {nursing_homes.length} {nursing_homes.length === 1 ? 'result' : 'results'}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nursing_homes.map((nursing_home) => (
              <ListingCard
                key={nursing_home.id}
                listing={nursing_home as NursingHome}
                type="nursing_home"
                currentUserId={user?.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
          </div>
        }
      >
        <ListingsContent searchParams={params} />
      </Suspense>
    </div>
  )
}
