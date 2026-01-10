import { createClient } from '@/lib/supabase/server'
import { LocationsGrid, LocationsGridSkeleton } from '@/components/LocationsGrid'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nursing Home by Location - All Malaysian States | Nursing Home MY',
  description: 'Find nursing home facilities across all Malaysian states. Browse by location to discover the best elderly care providers in your area.',
  keywords: ['nursing home Malaysia', 'elderly care by location', 'nursing facilities by state'],
}

const MALAYSIAN_STATES = [
  { name: 'Johor', slug: 'johor' },
  { name: 'Kedah', slug: 'kedah' },
  { name: 'Kelantan', slug: 'kelantan' },
  { name: 'Kuala Lumpur', slug: 'kuala-lumpur' },
  { name: 'Labuan', slug: 'labuan' },
  { name: 'Melaka', slug: 'melaka' },
  { name: 'Negeri Sembilan', slug: 'negeri-sembilan' },
  { name: 'Pahang', slug: 'pahang' },
  { name: 'Penang', slug: 'penang' },
  { name: 'Perak', slug: 'perak' },
  { name: 'Perlis', slug: 'perlis' },
  { name: 'Putrajaya', slug: 'putrajaya' },
  { name: 'Sabah', slug: 'sabah' },
  { name: 'Sarawak', slug: 'sarawak' },
  { name: 'Selangor', slug: 'selangor' },
  { name: 'Terengganu', slug: 'terengganu' },
]

async function getStateCompanyCounts() {
  const supabase = await createClient()

  // Get count of companies per state
  const counts: Record<string, number> = {}

  for (const state of MALAYSIAN_STATES) {
    const { count } = await supabase
      .from('nursing_homes')
      .select('*', { count: 'exact', head: true })
      .eq('state', state.name)

    counts[state.name] = count || 0
  }

  return counts
}

async function LocationsContent() {
  const stateCounts = await getStateCompanyCounts()

  // Sort states by company count (descending)
  const sortedStates = [...MALAYSIAN_STATES].sort((a, b) => {
    return (stateCounts[b.name] || 0) - (stateCounts[a.name] || 0)
  })

  return <LocationsGrid states={sortedStates} stateCounts={stateCounts} />
}

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Nursing Home by Location
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Find the best nursing home facilities across Malaysia
          </p>
        </div>

        {/* States Grid with Suspense */}
        <Suspense fallback={<LocationsGridSkeleton />}>
          <LocationsContent />
        </Suspense>

        {/* Info Section */}
        <div className="mt-16 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Why Choose Nursing Home MY?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Comprehensive Coverage
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                We feature nursing home providers across all 16 Malaysian states and federal territories, making it easy to find services in your area.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Verified Providers
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                All listed facilities are verified providers offering professional elderly care services, from basic assistance to skilled nursing.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Family Support Services
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Many facilities offer family counseling, regular updates, and flexible visiting hours to keep families connected with their loved ones.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Easy Comparison
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Browse by location to compare facilities, read reviews, view services, and contact providers directly for inquiries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
