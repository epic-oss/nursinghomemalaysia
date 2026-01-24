export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface VendorSubmission {
  id: string
  company_name: string
  registration_number: string | null
  email: string
  phone: string
  website: string | null
  address: string
  state: string
  city: string
  company_type: string
  description: string
  activities_offered: string[]
  referral_source: string | null
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
  reviewed_at: string | null
}

async function getSubmission(id: string): Promise<VendorSubmission | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('vendor_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as VendorSubmission
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getLogoUrl(website: string | null): string | null {
  if (!website) return null
  try {
    const url = new URL(website)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
  } catch {
    return null
  }
}

async function approveSubmission(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const supabase = createAdminClient()

  // Get the submission
  const { data: submission, error: fetchError } = await supabase
    .from('vendor_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !submission) {
    throw new Error('Submission not found')
  }

  // Create the nursing home listing
  const slug = generateSlug(submission.company_name)
  const logoUrl = getLogoUrl(submission.website)

  const { error: insertError } = await supabase.from('nursing_homes').insert({
    name: submission.company_name,
    slug: slug,
    description: submission.description,
    contact_email: submission.email,
    contact_phone: submission.phone,
    website: submission.website,
    logo_url: logoUrl,
    location: `${submission.city}, ${submission.state}`,
    state: submission.state,
    services: submission.activities_offered,
    category: submission.company_type,
    featured: false,
  })

  if (insertError) {
    console.error('Error creating listing:', insertError)
    throw new Error('Failed to create listing')
  }

  // Update submission status
  const { error: updateError } = await supabase
    .from('vendor_submissions')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    console.error('Error updating submission:', updateError)
    throw new Error('Failed to update submission status')
  }

  revalidatePath('/admin/applications')
  redirect('/admin/applications?status=approved')
}

async function rejectSubmission(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const adminNotes = formData.get('adminNotes') as string
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('vendor_submissions')
    .update({
      status: 'rejected',
      admin_notes: adminNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error rejecting submission:', error)
    throw new Error('Failed to reject submission')
  }

  revalidatePath('/admin/applications')
  redirect('/admin/applications?status=rejected')
}

async function deleteSubmission(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('vendor_submissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting submission:', error)
    throw new Error('Failed to delete submission')
  }

  revalidatePath('/admin/applications')
  redirect('/admin/applications')
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const submission = await getSubmission(id)

  if (!submission) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            Pending Review
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/applications"
            className="mb-2 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            ← Back to Applications
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {submission.company_name}
          </h1>
        </div>
        {getStatusBadge(submission.status)}
      </div>

      {/* Submission Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Information */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Company Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Company Name</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{submission.company_name}</dd>
            </div>
            {submission.registration_number && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">Registration Number</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{submission.registration_number}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-zinc-500">Company Type</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{submission.company_type}</dd>
            </div>
            {submission.website && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">Website</dt>
                <dd>
                  <a
                    href={submission.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {submission.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Contact Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Email</dt>
              <dd>
                <a
                  href={`mailto:${submission.email}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {submission.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Phone</dt>
              <dd>
                <a
                  href={`tel:${submission.phone}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {submission.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Address</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{submission.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Location</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">
                {submission.city}, {submission.state}
              </dd>
            </div>
          </dl>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            {submission.description}
          </p>
        </div>

        {/* Services/Activities */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Services Offered
          </h2>
          <div className="flex flex-wrap gap-2">
            {submission.activities_offered.map((activity) => (
              <span
                key={activity}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Submission Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Submitted</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">
                {new Date(submission.created_at).toLocaleString()}
              </dd>
            </div>
            {submission.referral_source && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">Referral Source</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{submission.referral_source}</dd>
              </div>
            )}
            {submission.reviewed_at && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">Reviewed</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {new Date(submission.reviewed_at).toLocaleString()}
                </dd>
              </div>
            )}
            {submission.admin_notes && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">Admin Notes</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{submission.admin_notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Action Buttons */}
      {submission.status === 'pending' && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Review Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            {/* Approve Form */}
            <form action={approveSubmission}>
              <input type="hidden" name="id" value={submission.id} />
              <button
                type="submit"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
              >
                Approve & Create Listing
              </button>
            </form>

            {/* Reject Form */}
            <form action={rejectSubmission} className="flex items-center gap-2">
              <input type="hidden" name="id" value={submission.id} />
              <input
                type="text"
                name="adminNotes"
                placeholder="Rejection reason (optional)"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                Reject
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Button (always visible) */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
          Danger Zone
        </h2>
        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          Permanently delete this application. This action cannot be undone.
        </p>
        <form action={deleteSubmission}>
          <input type="hidden" name="id" value={submission.id} />
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
            onClick={(e) => {
              if (!confirm('Are you sure you want to delete this application?')) {
                e.preventDefault()
              }
            }}
          >
            Delete Application
          </button>
        </form>
      </div>
    </div>
  )
}
