import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { SearchFilter } from '@/components/SearchFilter'
import { NursingHome } from '@/lib/types'
import { getUser } from '@/lib/auth-helpers'

export const metadata: Metadata = {
  title: 'Nursing Home Malaysia | Elderly Care Directory',
  description: 'Compare nursing homes and elderly care facilities in Malaysia. Browse services, read reviews, and get free quotes for quality senior care.',
}

interface SearchParams {
  search?: string
  state?: string
  category?: string
  service?: string
}

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const user = await getUser()
  const search = searchParams.search || ''
  const state = searchParams.state || ''
  const category = searchParams.category || ''
  const service = searchParams.service || ''

  // Fetch all nursing homes to extract unique services
  const { data: allNursingHomes } = await supabase.from('nursing_homes').select('services')

  // Extract unique services from comma-separated strings or arrays
  const uniqueServices = new Set<string>()
  allNursingHomes?.forEach(nursing_home => {
    if (nursing_home.services) {
      const services = Array.isArray(nursing_home.services)
        ? nursing_home.services
        : typeof nursing_home.services === 'string'
          ? nursing_home.services.split(',').map((a: string) => a.trim())
          : []
      services.forEach((a: string) => {
        if (a) uniqueServices.add(a)
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
    query = query.ilike('services', `%${service}%`)
  }

  const { data: nursing_homes } = await query
    .order('is_premium', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
              Nursing Home Malaysia | Elderly Care Directory
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Discover the best nursing homes and elderly care facilities across Malaysia.
              Quality care and compassionate services for your loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SearchFilter
          showCategoryFilter={true}
          showStateFilter={true}
          showActivityFilter={true}
          showHrdfFilter={false}
          services={servicesList}
        />
      </section>

      {/* Results Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
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
      </section>
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      }
    >
      <HomeContent searchParams={params} />
    </Suspense>
  )
}
