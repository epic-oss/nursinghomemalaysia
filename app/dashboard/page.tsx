export const dynamic = 'force-dynamic'

import { getUserProfile } from '@/lib/auth-helpers'
import { MyListings } from '@/components/MyListings'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getUserListings(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

async function getPendingClaims(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('claim_requests')
    .select('*, companies(name, slug)')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return data || []
}

export default async function DashboardPage() {
  const user = await getUserProfile()

  if (!user) {
    return null
  }

  const { data: listings } = await getUserListings(user.id)
  const pendingClaims = await getPendingClaims(user.id)
  const hasPremium = listings?.some(l => l.is_premium) || false

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome back, {user.fullName || user.email}
          </p>
        </div>

        {/* Pending Claims Banner */}
        {pendingClaims.length > 0 && (
          <div className="mb-6 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-6 dark:bg-yellow-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-50">
                  {pendingClaims.length} Pending Claim Request{pendingClaims.length > 1 ? 's' : ''}
                </h3>
                <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                  Your claim request{pendingClaims.length > 1 ? 's are' : ' is'} being reviewed. You'll be notified within 1-2 business days.
                </p>
                <ul className="mt-3 space-y-2">
                  {pendingClaims.map((claim: any) => (
                    <li key={claim.id} className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{claim.companies?.name || 'Unknown Company'}</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        (Submitted {new Date(claim.created_at).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Premium Status Banner */}
        <div className="mb-8">
          {hasPremium ? (
            <div className="rounded-lg border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 dark:from-yellow-950/20 dark:to-yellow-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-50">
                      Current Plan: Premium
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Your listing is featured and getting maximum visibility
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/upgrade"
                  className="rounded-md border-2 border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-900 transition-colors hover:bg-yellow-600 hover:text-white dark:text-yellow-50"
                >
                  Manage Plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Current Plan: Free
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Upgrade to Premium to get featured placement and 5x more visibility
                  </p>
                </div>
                <Link
                  href="/dashboard/upgrade"
                  className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* My Listings Section */}
        <div className="mb-8">
          <MyListings listings={listings || []} />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Listings
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {listings?.length || 0}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Featured Listings
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {listings?.filter((l) => l.is_featured).length || 0}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Active Listings
            </h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {listings?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
