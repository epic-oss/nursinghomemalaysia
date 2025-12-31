export const dynamic = 'force-dynamic'

import { requireAuth, getUserProfile } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { UpgradeButton } from '@/components/UpgradeButton'

async function getUserCompanies(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function UpgradePage() {
  const user = await requireAuth()
  const profile = await getUserProfile()
  const companies = await getUserCompanies(user.id)

  // Check if user already has a premium listing
  const hasPremium = companies.some(c => c.is_premium)

  // Get the first company to upgrade (or first company if none is premium)
  const companyToUpgrade = companies.find(c => !c.is_premium) || companies[0]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Upgrade to Premium
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Stand out from the competition and get more visibility for your business
          </p>
        </div>

        {hasPremium && (
          <div className="mb-8 rounded-lg border-2 border-green-500 bg-green-50 p-6 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-50">
                  You're already Premium!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your listing is featured and getting maximum visibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Card */}
        <div className="mb-8 overflow-hidden rounded-2xl border-2 border-yellow-500 bg-white shadow-xl dark:bg-zinc-900">
          {/* Premium Badge */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 text-center">
            <h2 className="text-2xl font-bold text-white">Premium Plan</h2>
            <p className="mt-1 text-yellow-100">Get featured and grow your business</p>
          </div>

          <div className="p-8">
            {/* Price */}
            <div className="mb-8 text-center">
              <div className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                RM99
                <span className="text-2xl font-normal text-zinc-600 dark:text-zinc-400">/month</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                What's included:
              </h3>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Featured Placement</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Appear at the top of search results, above all non-premium listings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Premium Badge</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Stand out with a distinctive "Featured" badge on your listing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Enhanced Visibility</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Get up to 5x more views compared to regular listings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Priority Support</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Get faster responses and dedicated support from our team
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Extended Gallery</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Upload up to 8 featured images to showcase your services
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {!hasPremium && companyToUpgrade ? (
              <UpgradeButton companyId={companyToUpgrade.id} />
            ) : hasPremium ? (
              <Link
                href="/dashboard"
                className="block w-full rounded-lg border-2 border-zinc-900 bg-white px-6 py-4 text-center text-lg font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Back to Dashboard
              </Link>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 text-center dark:bg-yellow-950/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You need to claim a listing before upgrading to Premium.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-2 inline-block text-sm font-medium text-yellow-900 underline hover:text-yellow-700 dark:text-yellow-50 dark:hover:text-yellow-300"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                Can I cancel anytime?
              </h4>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Yes! You can cancel your Premium subscription at any time. Your listing will remain featured until the end of your billing period.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                How quickly will I see results?
              </h4>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Your listing will be featured immediately after payment is confirmed, typically within minutes.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                What payment methods do you accept?
              </h4>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                We accept all major credit cards, debit cards, and online banking through our secure Stripe payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
