import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BreadcrumbSchema, ArticleSchema, FAQSchema } from '@/components/JsonLd'
import type { Company } from '@/lib/types'

export const revalidate = 3600 // Revalidate every hour

async function getHRDFProviders(): Promise<Company[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('hrdf_claimable', true)
    .order('average_rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(10)

  return (data as Company[]) || []
}

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/guides/team-building-training-provider-malaysia`

  return {
    title: `Best 10 Team Building Training Provider Malaysia: HRDF-Registered Companies & What to Look For (${currentYear})`,
    description:
      "Find HRDF-registered team building training providers in Malaysia. Learn what distinguishes training providers from regular vendors, and how to maximise your HRDF claims.",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Best 10 Team Building Training Provider Malaysia: HRDF-Registered Companies & What to Look For (${currentYear})`,
      description:
        "Find HRDF-registered team building training providers in Malaysia. Compare top providers, understand claim requirements.",
      type: 'article',
      url: pageUrl,
      siteName: 'Team Building MY',
    },
  }
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-zinc-400 text-sm">No ratings yet</span>

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

const faqData = [
  {
    question: "How do I verify if a provider is HRDF registered?",
    answer: "To verify HRDF registration: 1) Ask the provider for their HRD Corp registration number. 2) Visit the official HRD Corp website (hrdcorp.gov.my) and use their training provider search function. 3) Enter the registration number or company name to confirm their status. 4) Also verify that the specific programme you're booking is approved, as not all programmes from registered providers automatically qualify for claims."
  },
  {
    question: "What's the difference between HRDF claimable and HRDF registered?",
    answer: "HRDF registered means the company is approved by HRD Corp as a training provider. HRDF claimable refers to specific programmes that qualify for levy claims. A registered provider may offer both claimable and non-claimable programmes. For a programme to be claimable, it must have structured learning outcomes, qualified trainers, assessment components, and proper documentation. Always confirm that your specific programme is claimable, not just that the provider is registered."
  },
  {
    question: "How much can I claim from HRDF for team building?",
    answer: "HRDF claim rates vary based on your company size and the HRD Corp scheme you're under. Generally: SMEs can claim up to 80% of eligible training costs, while larger companies typically claim 50-70%. Team building programmes categorised as 'soft skills training' or 'leadership development' usually qualify. The exact claimable amount depends on your levy balance, programme type, and current HRD Corp policies. Contact HRD Corp or check their website for current rates specific to your company category."
  },
  {
    question: "What documents do I need for HRDF claims?",
    answer: "Required documents for HRDF claims typically include: 1) Training completion report from the provider. 2) Attendance records with participant signatures. 3) Programme outline showing learning objectives. 4) Assessment or evaluation results. 5) Trainer credentials and certifications. 6) Invoice and payment proof. 7) Completion certificates for participants. 8) Photos of training (some schemes require this). Your training provider should supply most of these documents. Submit claims within the timeframe specified by HRD Corp (usually within 6 months of training completion)."
  }
]

export default async function TrainingProviderGuidePage() {
  const hrdfProviders = await getHRDFProviders()
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/guides/team-building-training-provider-malaysia`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ArticleSchema
        title={`Best 10 Team Building Training Provider Malaysia: HRDF-Registered Companies & What to Look For (${currentYear})`}
        description="Find HRDF-registered team building training providers in Malaysia."
        publishedDate="2025-09-24"
        author="Team Building MY"
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Guides', url: `${baseUrl}/guides` },
          { name: 'Team Building Training Provider Malaysia', url: pageUrl },
        ]}
      />
      <FAQSchema questions={faqData} />

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
          <span className="text-zinc-900 dark:text-zinc-50">Training Provider Guide</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Team Building Training Provider Malaysia: HRDF-Registered Companies & What to Look For
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Searching for a team building training provider in Malaysia usually means one thing — you want programmes that qualify for HRDF claims. The right provider can help your company recover 50-80% of team building costs while delivering genuine skill development.
          </p>
        </header>

        {/* Top 10 HRDF Providers Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Top 10 HRDF-Registered Team Building Providers
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            These providers are verified HRDF-claimable and ranked by client ratings. All offer structured programmes with proper documentation for claims.
          </p>

          <div className="space-y-4">
            {hrdfProviders.map((provider, index) => (
              <div
                key={provider.id}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/listings/company/${provider.slug}`}
                      className="font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                    >
                      {provider.name}
                    </Link>
                    <StarRating rating={provider.average_rating} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                    <span>{provider.location}, {provider.state}</span>
                    {provider.review_count && provider.review_count > 0 && (
                      <span>• {provider.review_count} reviews</span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/listings/company/${provider.slug}`}
                  className="hidden flex-shrink-0 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:block"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/listings?hrdf=yes"
              className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400"
            >
              View all HRDF-claimable providers →
            </Link>
          </div>
        </section>

        {/* Training Provider vs Regular Company */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Training Provider vs Regular Team Building Company
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">
                Regular Team Building Company
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-zinc-400">•</span>
                  Activities-focused
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-zinc-400">•</span>
                  Entertainment value prioritised
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-zinc-400">•</span>
                  May or may not have qualified trainers
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-red-500">✕</span>
                  Typically not HRDF claimable
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
              <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">
                Team Building Training Provider
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✓</span>
                  Learning outcomes defined
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✓</span>
                  Qualified, certified trainers
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✓</span>
                  Assessment and evaluation components
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✓</span>
                  HRDF claimable (if registered)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Provider Type Comparison Table */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Provider Types Comparison
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Understanding the different types of team building providers helps you choose the right match for your objectives.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800">
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                    Aspect
                  </th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                    Corporate Trainers
                  </th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                    Adventure Providers
                  </th>
                  <th className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                    Hybrid Providers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">Focus</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Skills development, workshops</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Outdoor activities, challenges</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Balance of both approaches</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">Best For</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Leadership, communication training</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Team bonding, morale boosting</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Comprehensive development</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">HRDF Claimable</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Usually Yes
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Sometimes
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Often Yes
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">Price Range</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">RM150-400/pax</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">RM100-300/pax</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">RM200-500/pax</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">Documentation</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Comprehensive reports</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Basic attendance</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Full training documentation</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">Venue</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Hotels, meeting rooms</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Outdoor, resorts</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Flexible options</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> For HRDF claims, hybrid providers often offer the best value — combining engaging activities with proper training structure and documentation.{' '}
              <Link href="/calculator" className="underline hover:no-underline">
                Use our calculator
              </Link>{' '}
              to estimate costs.
            </p>
          </div>
        </section>

        {/* What Makes Programme Claimable */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            What Makes a Programme HRDF Claimable
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Provider Requirements</h3>
              <p className="mb-3 text-zinc-600 dark:text-zinc-400">
                The company must be registered with HRD Corp (formerly HRDF) as an approved training provider:
              </p>
              <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• Business registration in Malaysia</li>
                <li>• Qualified trainers on staff</li>
                <li>• Approved training programmes</li>
                <li>• Compliance with HRD Corp standards</li>
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Programme Requirements</h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><strong>Clear learning objectives:</strong> Documented outcomes like &quot;improve communication skills&quot;</li>
                <li><strong>Include assessment:</strong> Evaluation showing participants achieved learning objectives</li>
                <li><strong>Meet minimum duration:</strong> Typically at least 7 hours for full-day claims</li>
                <li><strong>Provide documentation:</strong> Attendance records, assessment results, certificates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Programme Types */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Popular Training Programme Types
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Leadership Development</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Developing leadership competencies through experiential challenges. Learning outcomes include leadership styles, delegation, and team motivation.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Communication Skills</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Improving interpersonal and team communication. Learning outcomes include active listening, feedback delivery, and conflict resolution.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Problem-Solving & Innovation</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Challenging teams to solve complex problems collaboratively. Learning outcomes include creative thinking and systematic problem-solving.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Team Effectiveness</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Addressing team dynamics and collaboration. Learning outcomes include trust building, role clarity, and collective accountability.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
            <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Ready to Find Your Training Provider?
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              Browse HRDF-registered providers or use our calculator to estimate costs and get personalized quotes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/listings?hrdf=yes"
                className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
              >
                Browse HRDF Providers
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Cost Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* Red Flags Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Red Flags to Avoid
          </h2>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                Cannot provide HRD Corp registration numbers
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                Vague about learning outcomes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                No assessment components in the programme
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                Trainers without proper certification
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                Reluctance to provide documentation samples
              </li>
            </ul>
          </div>
        </section>

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
