export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

type SubmissionStatus = 'pending' | 'approved' | 'rejected'

interface VendorSubmission {
  id: string
  company_name: string
  email: string
  phone: string
  state: string
  city: string
  company_type: string
  status: SubmissionStatus
  created_at: string
  referral_source: string | null
}

async function getSubmissions(statusFilter?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('vendor_submissions')
    .select('id, company_name, email, phone, state, city, company_type, status, created_at, referral_source')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching submissions:', error)
    return []
  }

  return data as VendorSubmission[]
}

async function getSubmissionCounts() {
  const supabase = createAdminClient()

  const { count: pendingCount } = await supabase
    .from('vendor_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: approvedCount } = await supabase
    .from('vendor_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('vendor_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')

  return {
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
    total: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0),
  }
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status || 'all'
  const submissions = await getSubmissions(statusFilter)
  const counts = await getSubmissionCounts()

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            Pending
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Vendor Applications ({counts.total})
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Link
          href="/admin/applications?status=all"
          className={`rounded-lg border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
            statusFilter === 'all'
              ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">All</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{counts.total}</p>
        </Link>

        <Link
          href="/admin/applications?status=pending"
          className={`rounded-lg border p-4 transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/10 ${
            statusFilter === 'pending'
              ? 'border-yellow-500 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700 dark:text-yellow-300">{counts.pending}</p>
        </Link>

        <Link
          href="/admin/applications?status=approved"
          className={`rounded-lg border p-4 transition-colors hover:bg-green-50 dark:hover:bg-green-900/10 ${
            statusFilter === 'approved'
              ? 'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{counts.approved}</p>
        </Link>

        <Link
          href="/admin/applications?status=rejected"
          className={`rounded-lg border p-4 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 ${
            statusFilter === 'rejected'
              ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">{counts.rejected}</p>
        </Link>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Company
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Submitted
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  No applications found
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {submission.company_name}
                    </div>
                    {submission.referral_source && (
                      <div className="text-xs text-zinc-500">
                        Via: {submission.referral_source}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-zinc-900 dark:text-zinc-50">{submission.email}</div>
                    <div className="text-xs text-zinc-500">{submission.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {submission.city}, {submission.state}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {submission.company_type}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(submission.status)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-zinc-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/applications/${submission.id}`}
                      className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
