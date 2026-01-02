import type { Metadata } from 'next'
import { CostCalculator } from '@/components/CostCalculator'

export const metadata: Metadata = {
  title: 'Nursing Home Cost Calculator Malaysia | Get Instant Estimates',
  description: 'Calculate your nursing home budget instantly. Get estimated costs for 10-300 participants across Malaysia. Free quotes from verified providers.',
  keywords: [
    'nursing home cost calculator',
    'nursing home budget Malaysia',
    'nursing home price estimate',
    'corporate event cost calculator',
    'nursing home cost per person',
  ],
  openGraph: {
    title: 'Nursing Home Cost Calculator Malaysia',
    description: 'Calculate your nursing home budget instantly. Get estimated costs for 10-300 participants across Malaysia.',
    type: 'website',
  },
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Nursing Home Cost Calculator Malaysia
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Get instant budget estimates for your nursing home event in Malaysia
          </p>
        </div>

        {/* Calculator Component */}
        <CostCalculator />

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                How much does nursing home cost in Malaysia?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Team building costs in Malaysia typically range from RM80-150 per person for half-day indoor activities,
                up to RM700-1,000 per person for 3-day resort retreats. Factors include duration, activity type,
                location, and group size. Larger groups often get better per-person rates.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                What factors affect nursing home prices?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Key factors include: (1) Number of participants - larger groups get bulk discounts,
                (2) Duration - overnight stays cost more than day trips, (3) Activity type - adventure activities
                and resort venues are pricier than indoor workshops, (4) Location - Kuala Lumpur and Selangor
                tend to be more expensive than other states, and (5) Season - peak periods may have higher rates.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Is this calculator accurate?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Our calculator provides estimated ranges based on industry averages and data from verified
                providers across Malaysia. Final prices may vary based on specific requirements, customization,
                season, and vendor. Use this as a budgeting guide, then request exact quotes from providers
                for your specific needs.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Can I get HRDF claim for nursing home?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Yes! Many nursing home programs are if they meet training criteria.
                HRDF covers 50-80% of approved training costs. The provider must be HRDF registered,
                and the program should focus on skills development (leadership, communication, problem-solving).
                Check our{' '}
                <a href="/listings?hrdf=yes" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
                  HRDF-claimable providers
                </a>
                {' '}for eligible programs.
              </p>
            </details>
          </div>
        </div>

        {/* Why These Prices Section */}
        <div className="mt-12 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Why These Prices?
          </h2>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              Our estimates are based on real market data from over 100+ verified nursing home
              providers across Malaysia. The ranges account for:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Venue rental and facility costs</li>
              <li>Professional facilitators and trainers</li>
              <li>Activity equipment and materials</li>
              <li>Meals and refreshments (F&B)</li>
              <li>Transportation (if included)</li>
              <li>Accommodation (for overnight programs)</li>
              <li>Insurance and safety equipment</li>
              <li>Administration and logistics support</li>
            </ul>
            <p className="mt-4">
              Premium providers with specialized equipment, experienced trainers, and exclusive venues
              typically charge at the higher end. Budget-friendly options focus on essential activities
              with basic facilities.
            </p>
          </div>
        </div>

        {/* Nursing Home Costs by Activity Type */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Nursing Home Costs by Activity Type
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Understanding what drives pricing helps you budget more accurately. Here&apos;s what to expect across different activity categories in Malaysia.
          </p>

          <div className="space-y-6">
            {/* Indoor Activities */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Indoor Activities (RM80 - RM180 per person)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Indoor nursing home works best for air-conditioned comfort and weather-proof planning. Typical programs include escape room challenges, cooking competitions, drumming workshops, and problem-solving games. Prices include facilitator fees, equipment, and basic refreshments. Hotel meeting rooms or training centers add RM500-2,000 to your total for venue rental.
              </p>
            </div>

            {/* Outdoor Adventures */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Outdoor Adventures (RM150 - RM350 per person)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Outdoor programs deliver higher energy and memorable experiences. Popular choices include obstacle courses, jungle trekking, beach Olympics, and Amazing Race-style challenges. Pricing covers safety equipment, trained guides, permits, and often includes lunch. Transport to venues like Janda Baik, Port Dickson, or Cameron Highlands is usually extra unless bundled.
              </p>
            </div>

            {/* Resort & Retreat Packages */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Resort & Retreat Packages (RM400 - RM800 per person)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Overnight retreats combine nursing home with accommodation for deeper bonding. Two-day-one-night packages at resorts in Pahang, Negeri Sembilan, or Melaka include multiple activity sessions, all meals, accommodation, and evening programs. These work well for annual team retreats or department offsites where extended time together matters.
              </p>
            </div>

            {/* Premium & Specialized Programs */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Premium & Specialized Programs (RM500 - RM1,200 per person)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                High-end experiences include yacht nursing home, helicopter challenges, professional racing experiences, or programs with celebrity facilitators. Corporate leadership retreats with executive coaches also fall into this category. These deliver unique bragging rights and work well for C-suite retreats or reward programs.
              </p>
            </div>
          </div>
        </div>

        {/* HRDF Claimable Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            HRDF Claimable: Reduce Your Cost by 50-80%
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            If your company contributes to HRDF (Human Resources Development Fund), you can claim back a significant portion of your nursing home costs - but only if the program qualifies.
          </p>

          {/* What's Claimable Under HRDF */}
          <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What&apos;s Claimable Under HRDF?
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">Cost Item</th>
                    <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">Claimable?</th>
                    <th className="py-3 font-semibold text-zinc-900 dark:text-zinc-50">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Training/Program Fees</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">✅ 100%</td>
                    <td className="py-3">Must be from HRDF-registered provider</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Venue & Hotel</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">✅ Yes</td>
                    <td className="py-3">When booked through training package</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Meals</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">✅ Capped</td>
                    <td className="py-3">Daily limit set by HRD Corp</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Transportation</td>
                    <td className="py-3 pr-4 text-green-600 dark:text-green-400">✅ Yes</td>
                    <td className="py-3">Bus charter, flight tickets</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 pr-4">Activities & Games</td>
                    <td className="py-3 pr-4 text-yellow-600 dark:text-yellow-400">⚠️ Partial</td>
                    <td className="py-3">Must have learning objectives</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Entertainment</td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400">❌ No</td>
                    <td className="py-3">Purely recreational not covered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How Much Can You Save */}
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How Much Can You Save?
            </h3>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              For a 50-person full-day outdoor program at RM250/person:
            </p>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li><strong>Total cost:</strong> RM12,500</li>
              <li><strong> (est. 60%):</strong> RM7,500</li>
              <li className="text-lg font-semibold text-green-600 dark:text-green-400"><strong>Your actual cost:</strong> RM5,000</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              This calculator shows gross estimates. For HRDF-specific quotes,{' '}
              <a href="/listings?hrdf=yes" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
                browse our HRDF-registered providers
              </a>{' '}
              who can prepare compliant proposals.
            </p>
          </div>

          {/* HRDF Claim Requirements */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              HRDF Claim Requirements
            </h3>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Your program must meet these criteria:
            </p>
            <ol className="ml-6 list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong>Registered provider</strong> - Trainer must have valid HRDF registration</li>
              <li><strong>Learning outcomes</strong> - Program must develop skills (leadership, communication, problem-solving)</li>
              <li><strong>Documentation</strong> - Attendance sheets, training materials, assessment forms required</li>
              <li><strong>Advance approval</strong> - Submit grant application before the program date</li>
            </ol>
          </div>
        </div>

        {/* Budgeting Tips for HR Managers */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Budgeting Tips for HR Managers
          </h2>

          {/* Right-Size Your Budget */}
          <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Right-Size Your Budget to Your Goals
            </h3>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">Team bonding on a budget (RM80-150/pax):</strong>{' '}
                Half-day indoor activities work well for quarterly bonding. Focus on fun over learning outcomes.
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">Skills development (RM200-350/pax):</strong>{' '}
                Full-day programs with trained facilitators. Good for communication, leadership, or department-specific challenges. Usually.
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">Annual retreat (RM500-800/pax):</strong>{' '}
                Overnight programs for deeper impact. Combine strategic sessions with team activities. Best ROI for yearly investment.
              </p>
            </div>
          </div>

          {/* Hidden Costs to Watch */}
          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Hidden Costs to Watch
            </h3>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong>Transport:</strong> Budget RM15-30/person for bus charter to outdoor venues</li>
              <li><strong>T-shirts/merchandise:</strong> RM25-50/person if you want custom team shirts</li>
              <li><strong>Photography/videography:</strong> RM1,500-3,000 for professional coverage</li>
              <li><strong>Prizes & gifts:</strong> RM500-2,000 depending on activities</li>
            </ul>
          </div>

          {/* Best Time to Book */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Best Time to Book
            </h3>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong>Peak season (Oct-Dec):</strong> Book 6-8 weeks ahead, prices 10-20% higher</li>
              <li><strong>Off-peak (Jan-Mar):</strong> Better availability, some facilities offer discounts</li>
              <li><strong>Ramadan period:</strong> Limited outdoor options, indoor programs available</li>
            </ul>
          </div>
        </div>

        {/* Ready to Get Exact Quotes CTA */}
        <div className="mt-12 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to Get Exact Quotes?
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            This calculator gives you budget estimates based on market averages. For precise pricing tailored to your requirements, submit your details above and receive quotes from 3-5 verified providers within 24 hours.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            All providers in our network are vetted for quality, and many offer HRDF-claimable programs with full documentation support.
          </p>
        </div>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Nursing Home Cost Calculator',
            applicationCategory: 'BusinessApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'MYR',
            },
            description: 'Calculate nursing home costs for events in Malaysia. Get instant budget estimates for 10-300 participants.',
          }),
        }}
      />
    </div>
  )
}
