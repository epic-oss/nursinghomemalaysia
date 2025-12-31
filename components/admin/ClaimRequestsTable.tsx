'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ClaimRequest {
  id: string
  user_id: string
  company_id: string
  role_at_company: string
  verification_phone: string
  proof_notes: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  userEmail: string
  companies: {
    id: string
    name: string
    slug: string
    state: string
    website: string | null
    phone: string | null
  }
}

interface ClaimRequestsTableProps {
  requests: ClaimRequest[]
}

export function ClaimRequestsTable({ requests }: ClaimRequestsTableProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ClaimRequest | null>(null)

  const filteredRequests = requests.filter(r =>
    filter === 'all' ? true : r.status === filter
  )

  const handleApprove = async (request: ClaimRequest) => {
    if (!confirm(`Approve claim for ${request.companies.name}?\n\nThis will:\n- Grant ${request.userEmail} ownership of the listing\n- Allow them to manage and upgrade it`)) {
      return
    }

    setProcessing(request.id)

    try {
      const response = await fetch('/api/admin/approve-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimRequestId: request.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve claim')
      }

      alert('Claim approved successfully!')
      router.refresh()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (request: ClaimRequest) => {
    const reason = prompt(`Reject claim for ${request.companies.name}?\n\nPlease provide a reason (optional):`)

    if (reason === null) return // User clicked cancel

    setProcessing(request.id)

    try {
      const response = await fetch('/api/admin/reject-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimRequestId: request.id,
          reason: reason || 'No reason provided'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject claim')
      }

      alert('Claim rejected successfully!')
      router.refresh()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Filter Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-4 px-6 py-3">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
              }`}
            >
              {status} ({requests.filter(r => status === 'all' ? true : r.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Claimant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-zinc-500">
                  No {filter !== 'all' && filter} claim requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        href={`/listings/company/${request.companies.slug}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                        target="_blank"
                      >
                        {request.companies.name}
                      </Link>
                      <div className="text-xs text-zinc-500">{request.companies.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-900 dark:text-zinc-50">
                      {request.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {request.role_at_company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-zinc-900 dark:text-zinc-50">{request.verification_phone}</div>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View details
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request)}
                          disabled={processing === request.id}
                          className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processing === request.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          disabled={processing === request.id}
                          className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRequest(null)}>
          <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Claim Request Details
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company</div>
                <div className="text-zinc-900 dark:text-zinc-50">{selectedRequest.companies.name}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company Website</div>
                <div className="text-zinc-900 dark:text-zinc-50">
                  {selectedRequest.companies.website ? (
                    <a href={selectedRequest.companies.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      {selectedRequest.companies.website}
                    </a>
                  ) : (
                    <span className="text-zinc-500">Not provided</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company Phone</div>
                <div className="text-zinc-900 dark:text-zinc-50">
                  {selectedRequest.companies.phone || 'Not provided'}
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Claimant Email</div>
                <div className="text-zinc-900 dark:text-zinc-50">{selectedRequest.userEmail}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Verification Info</div>
                <div className="mt-1 whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                  {selectedRequest.proof_notes || 'No additional information provided'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-md bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
