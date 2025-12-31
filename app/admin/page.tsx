export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'

async function getAdminStats() {
  const supabase = await createClient()

  // Get total vendors count
  const { count: totalVendors } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  // Get premium vendors count
  const { count: premiumVendors } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true)

  // Get unclaimed listings count
  const { count: unclaimedListings } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .is('user_id', null)

  // Get claimed listings count
  const { count: claimedListings } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .not('user_id', 'is', null)

  return {
    totalVendors: totalVendors || 0,
    premiumVendors: premiumVendors || 0,
    unclaimedListings: unclaimedListings || 0,
    claimedListings: claimedListings || 0,
  }
}

async function getRecentActivity() {
  const supabase = await createClient()

  // Get recently claimed listings
  const { data: recentClaims } = await supabase
    .from('companies')
    .select('name, user_id, updated_at')
    .not('user_id', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(5)

  // Get recently created premium listings
  const { data: recentPremium } = await supabase
    .from('companies')
    .select('name, is_premium, updated_at')
    .eq('is_premium', true)
    .order('updated_at', { ascending: false })
    .limit(5)

  const activities = []

  if (recentClaims) {
    activities.push(
      ...recentClaims.map((claim) => ({
        type: 'claim',
        message: `Listing claimed: ${claim.name}`,
        timestamp: claim.updated_at,
      }))
    )
  }

  if (recentPremium) {
    activities.push(
      ...recentPremium.map((premium) => ({
        type: 'premium',
        message: `Premium activated: ${premium.name}`,
        timestamp: premium.updated_at,
      }))
    )
  }

  // Sort by timestamp and take top 10
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
}

async function getPendingClaims() {
  // Use admin client to bypass RLS
  const supabase = createAdminClient()

  const { data, error, count } = await supabase
    .from('claim_requests')
    .select(`
      id,
      user_id,
      role_at_company,
      created_at,
      companies (
        id,
        name,
        slug,
        state
      )
    `, { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching pending claims:', error)
    return { claims: [], count: 0 }
  }

  // Get user emails for each claim
  const claimsWithEmails = await Promise.all(
    (data || []).map(async (claim) => {
      const { data: { user } } = await supabase.auth.admin.getUserById(claim.user_id)
      return {
        ...claim,
        userEmail: user?.email || 'Unknown',
      }
    })
  )

  return { claims: claimsWithEmails, count: count || 0 }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()
  const recentActivity = await getRecentActivity()
  const { claims: pendingClaims, count: pendingClaimsCount } = await getPendingClaims()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Vendors
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {stats.totalVendors}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Premium Vendors
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {stats.premiumVendors}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Unclaimed Listings
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {stats.unclaimedListings}
              </p>
            </div>
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-900/20">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Claimed Listings
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {stats.claimedListings}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-200 p-6 text-center transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-50 dark:hover:bg-zinc-800"
          >
            <span className="mb-2 text-3xl">📝</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              View All Vendors
            </span>
          </Link>

          <Link
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-200 p-6 text-center transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-50 dark:hover:bg-zinc-800"
          >
            <span className="mb-2 text-3xl">⚙️</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              Manage Listings
            </span>
          </Link>

          <Link
            href="/admin/vendors"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-200 p-6 text-center transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-50 dark:hover:bg-zinc-800"
          >
            <span className="mb-2 text-3xl">👥</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              View Vendors
            </span>
          </Link>

          <Link
            href="/admin/premium"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-200 p-6 text-center transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-50 dark:hover:bg-zinc-800"
          >
            <span className="mb-2 text-3xl">💰</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              Premium Status
            </span>
          </Link>
        </div>
      </div>

      {/* Pending Claims */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Pending Claims
            {pendingClaimsCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                {pendingClaimsCount}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/claims"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Manage Claims
            </Link>
            <Link
              href="/admin/claims"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View all →
            </Link>
          </div>
        </div>
        {pendingClaims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Company
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Claimant
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Role
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Submitted
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {pendingClaims.map((claim: any) => (
                  <tr key={claim.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3">
                      <Link
                        href={`/listings/company/${claim.companies?.slug}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                        target="_blank"
                      >
                        {claim.companies?.name}
                      </Link>
                      <div className="text-xs text-zinc-500">{claim.companies?.state}</div>
                    </td>
                    <td className="py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {claim.userEmail}
                    </td>
                    <td className="py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {claim.role_at_company}
                    </td>
                    <td className="py-3 text-sm text-zinc-500">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/claims"
                        className="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 transition-colors hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/50"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            No pending claim requests
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {activity.type === 'claim' ? '📋' : '💰'}
                  </span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {activity.message}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
