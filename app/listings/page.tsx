import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { SearchFilter } from '@/components/SearchFilter'
import { Company } from '@/lib/types'
import { getUser } from '@/lib/auth-helpers'

interface SearchParams {
  search?: string
  state?: string
  category?: string
  activity?: string
  hrdf?: string
}

async function ListingsContent({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const user = await getUser()
  const search = searchParams.search || ''
  const state = searchParams.state || ''
  const category = searchParams.category || ''
  const activity = searchParams.activity || ''
  const hrdf = searchParams.hrdf || 'all'

  // Fetch all companies to extract unique activities
  const { data: allCompanies } = await supabase.from('companies').select('activities')

  // Extract unique activities from comma-separated strings
  const uniqueActivities = new Set<string>()
  allCompanies?.forEach(company => {
    if (company.activities) {
      const activities = company.activities.split(',').map((a: string) => a.trim())
      activities.forEach((a: string) => {
        if (a) uniqueActivities.add(a)
      })
    }
  })
  const activitiesList = Array.from(uniqueActivities).sort()

  // Fetch companies with filters
  let query = supabase.from('companies').select('*')

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (state) {
    query = query.eq('state', state)
  }
  if (category) {
    query = query.ilike('category', `%${category}%`)
  }
  if (activity) {
    query = query.ilike('activities', `%${activity}%`)
  }
  if (hrdf === 'claimable') {
    query = query.eq('hrdf_claimable', true)
  } else if (hrdf === 'non') {
    query = query.eq('hrdf_claimable', false)
  }

  const { data: companies } = await query
    .order('is_premium', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Team Building Companies
      </h1>

      <div className="mb-8">
        <SearchFilter
          showCategoryFilter={true}
          showStateFilter={true}
          showActivityFilter={true}
          showHrdfFilter={true}
          activities={activitiesList}
        />
      </div>

      {!companies || companies.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            No companies found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Showing {companies.length} {companies.length === 1 ? 'result' : 'results'}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <ListingCard
                key={company.id}
                listing={company as Company}
                type="company"
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
