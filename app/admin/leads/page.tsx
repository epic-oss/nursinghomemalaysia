'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

type LeadStatus = 'new' | 'contacted' | 'resolved'

interface Inquiry {
  id: string
  listing_type: string
  listing_id: string
  listing_name: string
  name: string
  email: string
  phone: string | null
  company_name: string | null
  message: string
  preferred_date: string | null
  group_size: string | null
  status: LeadStatus
  created_at: string
}

export default function AdminLeadsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [counts, setCounts] = useState({ new: 0, contacted: 0, resolved: 0, total: 0 })
  const [isPending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchInquiries()
    fetchCounts()
  }, [statusFilter])

  async function fetchInquiries() {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching inquiries:', error)
    } else {
      setInquiries(data as Inquiry[])
    }
    setLoading(false)
  }

  async function fetchCounts() {
    const supabase = createClient()

    const { count: newCount } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    const { count: contactedCount } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'contacted')

    const { count: resolvedCount } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved')

    setCounts({
      new: newCount || 0,
      contacted: contactedCount || 0,
      resolved: resolvedCount || 0,
      total: (newCount || 0) + (contactedCount || 0) + (resolvedCount || 0),
    })
  }

  async function updateStatus(id: string, newStatus: LeadStatus) {
    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Error updating status:', error)
        alert('Failed to update status')
      } else {
        fetchInquiries()
        fetchCounts()
      }
    })
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting inquiry:', error)
        alert('Failed to delete inquiry')
      } else {
        fetchInquiries()
        fetchCounts()
      }
    })
  }

  async function bulkDeleteResolved() {
    if (!confirm('Are you sure you want to delete ALL resolved inquiries?')) return

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('status', 'resolved')

      if (error) {
        console.error('Error bulk deleting:', error)
        alert('Failed to delete resolved inquiries')
      } else {
        fetchInquiries()
        fetchCounts()
      }
    })
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            New
          </span>
        )
      case 'contacted':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            Contacted
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Resolved
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
          Leads / Inquiries ({counts.total})
        </h1>
        {counts.resolved > 0 && (
          <button
            onClick={bulkDeleteResolved}
            disabled={isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Delete All Resolved ({counts.resolved})
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
            statusFilter === 'all'
              ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">All</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{counts.total}</p>
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10 ${
            statusFilter === 'new'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">New</p>
          <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{counts.new}</p>
        </button>

        <button
          onClick={() => setStatusFilter('contacted')}
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/10 ${
            statusFilter === 'contacted'
              ? 'border-yellow-500 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Contacted</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700 dark:text-yellow-300">{counts.contacted}</p>
        </button>

        <button
          onClick={() => setStatusFilter('resolved')}
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-green-50 dark:hover:bg-green-900/10 ${
            statusFilter === 'resolved'
              ? 'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-900/20'
              : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
          }`}
        >
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{counts.resolved}</p>
        </button>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Facility
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">{inquiry.name}</div>
                      <div className="text-xs text-zinc-500">
                        <a href={`mailto:${inquiry.email}`} className="hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="text-xs text-zinc-500">
                          <a href={`tel:${inquiry.phone}`} className="hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-900 dark:text-zinc-50">{inquiry.listing_name}</div>
                      <div className="text-xs text-zinc-500">{inquiry.listing_type}</div>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <div className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {inquiry.message}
                      </div>
                      {(inquiry.preferred_date || inquiry.group_size) && (
                        <div className="mt-1 text-xs text-zinc-500">
                          {inquiry.preferred_date && <span>Date: {inquiry.preferred_date}</span>}
                          {inquiry.preferred_date && inquiry.group_size && <span> · </span>}
                          {inquiry.group_size && <span>Size: {inquiry.group_size}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(inquiry.status)}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-500">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {inquiry.status === 'new' && (
                          <button
                            onClick={() => updateStatus(inquiry.id, 'contacted')}
                            disabled={isPending}
                            className="rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900/30 dark:text-yellow-300"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {inquiry.status === 'contacted' && (
                          <button
                            onClick={() => updateStatus(inquiry.id, 'resolved')}
                            disabled={isPending}
                            className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-300"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          disabled={isPending}
                          className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
