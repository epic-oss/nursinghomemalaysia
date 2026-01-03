import { getLocationPage, getLocationPages } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { BreadcrumbSchema } from '@/components/JsonLd'
import { NursingHomeList } from '@/components/CompanyList'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { NursingHome } from '@/lib/types'

interface LocationPageProps {
  params: Promise<{ slug: string }>
}

// Only allow slugs that exist in content/locations - return 404 for all others
export const dynamicParams = false

export async function generateStaticParams() {
  const locations = getLocationPages()
  return locations.map((location) => ({
    slug: location.slug,
  }))
}

async function getCompanyCount(state: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('nursing_homes')
    .select('*', { count: 'exact', head: true })
    .eq('state', state)
  return count || 0
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params
  const location = getLocationPage(slug)

  if (!location) {
    return {
      title: 'Location Not Found',
    }
  }

  const count = await getCompanyCount(location.state)
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/locations/${location.slug}`

  const dynamicTitle = `Best Nursing Home Company in ${location.location} - ${count} Providers (${currentYear})`

  return {
    title: dynamicTitle,
    description: location.description,
    keywords: location.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: dynamicTitle,
      description: location.description,
      url: pageUrl,
      siteName: 'Nursing Home MY',
      images: location.image ? [location.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: dynamicTitle,
      description: location.description,
      images: location.image ? [location.image] : [],
    },
  }
}

async function getCompaniesInState(state: string, limit: number = 12) {
  const supabase = await createClient()

  // Get total count
  const { count } = await supabase
    .from('nursing_homes')
    .select('*', { count: 'exact', head: true })
    .eq('state', state)

  // Get first page of companies
  const { data } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('state', state)
    .order('is_premium', { ascending: false })
    .order('is_featured', { ascending: false })
    .limit(limit)

  return {
    companies: data || [],
    totalCount: count || 0
  }
}

async function getTopRatedCompanies(state: string, limit: number = 5): Promise<NursingHome[]> {
  const supabase = await createClient()

  // Get top 5 companies by rating (include those with 0 or null ratings)
  const { data: ratedCompanies } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('state', state)
    .order('average_rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(limit)

  return (ratedCompanies as NursingHome[]) || []
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-zinc-400">No ratings yet</span>

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? 'text-yellow-400'
              : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-zinc-300 dark:text-zinc-600'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params
  const location = getLocationPage(slug)

  if (!location) {
    notFound()
  }

  const [{ companies, totalCount }, topRatedCompanies] = await Promise.all([
    getCompaniesInState(location.state),
    getTopRatedCompanies(location.state, 5)
  ])

  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/locations/${location.slug}`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Locations', url: `${baseUrl}/locations` },
          { name: location.location, url: pageUrl },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          {' > '}
          <Link href="/locations" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Locations
          </Link>
          {' > '}
          <span className="text-zinc-900 dark:text-zinc-50">{location.location}</span>
        </nav>

        {/* H1 Title */}
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
          Best Nursing Home Companies in {location.location}
        </h1>

        {/* Best X Companies Section - immediately after H1 */}
        {topRatedCompanies.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Best {topRatedCompanies.length} Nursing Home Organizers & Providers in {location.location}
            </h2>
            <div className="space-y-6">
              {topRatedCompanies.map((company, index) => (
                <article
                  key={company.id}
                  className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Company Name & Rating */}
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                          <Link
                            href={`/listings/nursing_home/${company.slug}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {company.name}
                          </Link>
                        </h3>
                        <StarRating rating={company.average_rating} />
                        {company.review_count && company.review_count > 0 && (
                          <span className="text-sm text-zinc-500">
                            ({company.review_count} reviews)
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="inline-flex items-center">
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {company.location}, {company.state}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mb-4 line-clamp-2 text-zinc-600 dark:text-zinc-400">
                        {company.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {company.is_premium && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Premium Provider
                          </span>
                        )}
                        {company.price_range && (
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                            {company.price_range}
                          </span>
                        )}
                        {company.category && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {company.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <div className="hidden flex-shrink-0 sm:block">
                      <Link
                        href={`/listings/nursing_home/${company.slug}`}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        View Profile
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile View Button */}
                  <div className="mt-4 sm:hidden">
                    <Link
                      href={`/listings/nursing_home/${company.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      View Profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Companies Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            All {totalCount} Nursing Home Companies in {location.location}
          </h2>
          <CompanyList
            initialCompanies={companies}
            totalCount={totalCount}
            state={location.state}
            location={location.location}
          />
        </div>

        {/* Supporting Content Section - moved to bottom */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <MDXContent source={location.content} />
        </div>
      </div>
    </div>
  )
}
