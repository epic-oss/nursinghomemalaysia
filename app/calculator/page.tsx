import type { Metadata } from 'next'
import { NursingHomeCostCalculator } from '@/components/NursingHomeCostCalculator'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nursing Home Cost Calculator Malaysia | Estimate Monthly Fees',
  description: 'Calculate nursing home costs in Malaysia. Get instant monthly fee estimates based on location, care level, room type, and special needs.',
  keywords: [
    'nursing home cost calculator malaysia',
    'nursing home fees malaysia',
    'elderly care cost malaysia',
    'nursing home price estimate',
    'pusat jagaan warga emas cost',
  ],
  openGraph: {
    title: 'Nursing Home Cost Calculator Malaysia',
    description: 'Calculate nursing home costs in Malaysia. Get instant monthly fee estimates based on your specific needs.',
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
            Nursing Home Cost Calculator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Estimate monthly nursing home costs in Malaysia based on your needs
          </p>
        </div>

        {/* Calculator Component */}
        <NursingHomeCostCalculator />

        {/* Cost Factors Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            What Affects Nursing Home Costs?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Location
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Kuala Lumpur and Selangor have the highest costs due to higher operating expenses.
                States like Perak and Johor offer more affordable options with comparable care quality.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Level of Care
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Basic care covers supervision and daily needs. Skilled nursing and memory care
                require specialized staff and equipment, significantly increasing costs.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Room Type
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Shared rooms (4-6 beds) are most affordable. Semi-private rooms offer
                a balance, while private rooms provide maximum comfort at premium rates.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Special Needs
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Additional services like dialysis support, physiotherapy, or special diets
                add to monthly costs but ensure comprehensive care for your loved one.
              </p>
            </div>
          </div>
        </div>

        {/* Average Costs by State */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Average Nursing Home Costs by State
          </h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">State</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Basic Care</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Assisted Living</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Skilled Nursing</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">Kuala Lumpur</td>
                  <td className="px-6 py-4">RM3,500 - RM5,000</td>
                  <td className="px-6 py-4">RM4,500 - RM6,500</td>
                  <td className="px-6 py-4">RM5,500 - RM8,000</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">Selangor</td>
                  <td className="px-6 py-4">RM3,000 - RM4,500</td>
                  <td className="px-6 py-4">RM4,000 - RM5,500</td>
                  <td className="px-6 py-4">RM5,000 - RM7,000</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">Penang</td>
                  <td className="px-6 py-4">RM2,500 - RM4,000</td>
                  <td className="px-6 py-4">RM3,500 - RM5,000</td>
                  <td className="px-6 py-4">RM4,500 - RM6,500</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">Johor</td>
                  <td className="px-6 py-4">RM2,000 - RM3,500</td>
                  <td className="px-6 py-4">RM3,000 - RM4,500</td>
                  <td className="px-6 py-4">RM4,000 - RM5,500</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">Perak</td>
                  <td className="px-6 py-4">RM1,800 - RM3,000</td>
                  <td className="px-6 py-4">RM2,500 - RM4,000</td>
                  <td className="px-6 py-4">RM3,500 - RM5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
            * Costs are estimates and vary by facility. Contact nursing homes directly for exact pricing.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                How accurate is this calculator?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                This calculator provides estimated ranges based on average market rates across Malaysia.
                Actual costs may vary by 20-30% depending on the specific facility, amenities,
                and current availability. Always contact nursing homes directly for exact pricing.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                What&apos;s typically included in nursing home fees?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Most nursing home fees include accommodation, three meals plus snacks daily,
                24-hour supervision, basic personal care assistance, housekeeping, and laundry.
                Medical consultations, medications, specialized therapies, and certain supplies
                are usually charged separately.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Are there government subsidies available?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                JKM (Jabatan Kebajikan Masyarakat) provides subsidized care for eligible low-income
                families. Zakat funds may also be available for Muslim families. Contact your local
                JKM office or hospital social worker for assistance with applications.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                What should I look for when choosing a nursing home?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Key factors include JKM registration, staff-to-resident ratio, cleanliness,
                proximity to hospitals, visiting hours, and the languages spoken by staff.
                Visit multiple facilities, talk to current residents&apos; families, and check
                for any safety or hygiene issues.
              </p>
            </details>

            <details className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                How do I know if my loved one needs skilled nursing or memory care?
              </summary>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Skilled nursing is needed for those requiring regular medical attention,
                wound care, IV medications, or rehabilitation after surgery/stroke. Memory care
                is designed for those with dementia or Alzheimer&apos;s who need secured environments
                and specialized cognitive programs. Consult with your doctor for recommendations.
              </p>
            </details>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Tips to Reduce Nursing Home Costs
          </h2>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">1.</span>
              <span><strong>Consider locations outside KL</strong> - States like Perak, Johor, and other areas offer quality care at 30-40% lower costs.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">2.</span>
              <span><strong>Choose shared rooms</strong> - Shared rooms can save RM500-1,500/month while still providing good care.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">3.</span>
              <span><strong>Check for government subsidies</strong> - JKM assistance and zakat funds can significantly reduce costs for eligible families.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">4.</span>
              <span><strong>Ask about long-term discounts</strong> - Some facilities offer discounts for annual payments or long-term commitments.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">5.</span>
              <span><strong>Compare multiple facilities</strong> - Prices vary significantly even within the same area. Get quotes from at least 3-5 nursing homes.</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ready to Find the Right Nursing Home?
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Browse our directory of verified nursing homes across Malaysia and request quotes from multiple facilities.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/listings"
              className="rounded-md bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse Nursing Homes
            </Link>
            <Link
              href="/guides"
              className="rounded-md border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Read Our Guides
            </Link>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Nursing Home Cost Calculator Malaysia',
            applicationCategory: 'HealthApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'MYR',
            },
            description: 'Calculate nursing home costs in Malaysia. Get instant monthly fee estimates based on location, care level, room type, and special needs.',
          }),
        }}
      />
    </div>
  )
}
