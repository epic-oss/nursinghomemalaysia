export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/server'
import { ClaimRequestsTable } from '@/components/admin/ClaimRequestsTable'

async function getClaimRequests() {
  // Use admin client to bypass RLS and fetch all claim requests
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('claim_requests')
    .select(`
      *,
      companies (
        id,
        name,
        slug,
        state,
        website,
        phone
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching claim requests:', error)
    return []
  }

  return data || []
}

async function getUserEmail(userId: string) {
  // Use admin client to get user info
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.admin.getUserById(userId)
  return user?.email || 'Unknown'
}

export default async function AdminClaimsPage() {
  // Admin check is handled by the layout via requireAdmin()
  const claimRequests = await getClaimRequests()

  // Enrich with user emails
  const enrichedRequests = await Promise.all(
    claimRequests.map(async (request) => ({
      ...request,
      userEmail: await getUserEmail(request.user_id),
    }))
  )

  const pendingCount = enrichedRequests.filter(r => r.status === 'pending').length
  const approvedCount = enrichedRequests.filter(r => r.status === 'approved').length
  const rejectedCount = enrichedRequests.filter(r => r.status === 'rejected').length

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Claim Requests Management
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Review and approve listing ownership claims
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
              {pendingCount}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Pending Review</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {approvedCount}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Approved</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {rejectedCount}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Rejected</div>
          </div>
        </div>

        {/* Claim Requests Table */}
        <ClaimRequestsTable requests={enrichedRequests} />
      </div>
    </div>
  )
}
