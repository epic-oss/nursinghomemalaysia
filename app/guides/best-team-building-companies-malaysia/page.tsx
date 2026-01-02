import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BreadcrumbSchema, ArticleSchema } from '@/components/JsonLd'
import type { NursingHome } from '@/lib/types'

export const revalidate = 3600 // Revalidate every hour

async function getTopCompanies(): Promise<{ companies: NursingHome[]; totalCount: number }> {
  const supabase = await createClient()

  // Get total count of all companies
  const { count: totalCount } = await supabase
    .from('nursing_homes')
    .select('*', { count: 'exact', head: true })

  // Get top 15 companies sorted by rating
  const { data } = await supabase
    .from('nursing_homes')
    .select('*')
    .order('average_rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .order('is_premium', { ascending: false })
    .limit(15)

  return {
    companies: (data as NursingHome[]) || [],
    totalCount: totalCount || 0,
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/guides/best-nursing-home-companies-malaysia`

  return {
    title: `15 Best Nursing Home Companies in Malaysia (${currentYear}) - Reviewed & Rated`,
    description:
      "Compare Malaysia's top-rated nursing home companies. We reviewed 80+ providers across KL, Selangor, Penang & JB. Find HRDF-claimable options, pricing & real client reviews.",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `15 Best Nursing Home Companies in Malaysia (${currentYear}) - Reviewed & Rated`,
      description:
        "Compare Malaysia's top-rated nursing home companies. We reviewed 80+ providers across KL, Selangor, Penang & JB.",
      type: 'article',
      url: pageUrl,
      siteName: 'Nursing Home MY',
    },
    twitter: {
      card: 'summary_large_image',
      title: `15 Best Nursing Home Companies in Malaysia (${currentYear})`,
      description:
        "Compare Malaysia's top-rated nursing home companies. Find HRDF-claimable options, pricing & real client reviews.",
    },
  }
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

export default async function BestNursingHomeCompaniesPage() {
  const { companies, totalCount } = await getTopCompanies()
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/guides/best-nursing-home-companies-malaysia`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ArticleSchema
        title={`15 Best Nursing Home Companies in Malaysia (${currentYear})`}
        description="Compare Malaysia's top-rated nursing home companies. We reviewed 80+ providers across KL, Selangor, Penang & JB."
        publishedDate={`${currentYear}-01-01`}
        author="Nursing Home MY"
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Guides', url: `${baseUrl}/guides` },
          { name: `Best Nursing Home Companies Malaysia ${currentYear}`, url: pageUrl },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          {' > '}
          <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Guides
          </Link>
          {' > '}
          <span className="text-zinc-900 dark:text-zinc-50">Best Nursing Home Companies</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
            15 Best Nursing Home Companies in Malaysia ({currentYear})
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            We reviewed {totalCount}+ nursing home providers across Malaysia. Here are the
            top-rated companies based on client reviews, program variety, and HRDF compliance.
          </p>
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-MY', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Company List */}
        <div className="space-y-6">
          {companies.map((company, index) => (
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
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      <Link
                        href={`/listings/nursing_home/${company.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {company.name}
                      </Link>
                    </h2>
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
                    {company.
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                        HRDF Claimable
                      </span>
                    )}
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

        {/* How We Ranked Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How We Ranked These Companies
          </h2>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Our rankings are based on real data, not paid placements. Here&apos;s our methodology:
            </p>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start">
                <span className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  1
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">Client Reviews:</strong> Average
                  rating from verified clients weighted by review volume
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  2
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">Program Variety:</strong>{' '}
                  Companies offering diverse activities and customization options score higher
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">HRDF Compliance:</strong> Providers
                  with proper HRD Corp registration and documentation support
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  4
                </span>
                <span>
                  <strong className="text-zinc-900 dark:text-zinc-50">Response Quality:</strong> How
                  quickly and professionally they respond to inquiries
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              Rankings update automatically as new reviews come in. Premium listings receive
              visibility benefits but don&apos;t affect the ranking algorithm.
            </p>
          </div>
        </section>

        {/* What to Look For Section */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            What to Look for in a Nursing Home Provider
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Experience & Track Record
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Look for companies with at least 3-5 years in the industry and a portfolio of
                corporate clients. Ask for references from similar-sized companies.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Customization Capability
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Avoid one-size-fits-all programs. The best providers tailor activities to your team
                size, objectives, and company culture.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                HRDF Registration
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If budget recovery matters, verify they&apos;re HRD Corp registered. Ask for their
                registration number and sample claim documentation.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Safety & Insurance
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                For adventure activities, confirm they have proper safety certifications, trained
                staff, and adequate insurance coverage.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
            <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Can&apos;t Decide? Get Quotes from Multiple Providers
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              Use our calculator to estimate costs and receive personalized quotes from 3-5 verified
              providers within 24 hours.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              Try the Cost Calculator
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
        </section>

        {/* Browse All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/listings"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Browse All {totalCount}+ Nursing Home Companies
          </Link>
        </div>

        {/* Back to Guides */}
        <div className="mt-8 text-center">
          <Link
            href="/guides"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Guides
          </Link>
        </div>
      </div>
    </div>
  )
}
