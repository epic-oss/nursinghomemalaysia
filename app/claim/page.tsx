import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ClaimButton } from './ClaimButton'

export const metadata: Metadata = {
  title: 'Claim Your Listing | Nursing Home MY',
  description: 'Claim your business listing on Nursing Home MY to receive leads and manage your profile.',
}

interface ClaimPageProps {
  searchParams: Promise<{ vendor?: string }>
}

interface FacilityData {
  id: string
  name: string
  state: string | null
  services: string | null
  contact_email: string | null
  user_id: string | null
}

async function getVendor(facilityId: string): Promise<FacilityData | null> {
  const supabase = createAdminClient()

  console.log('[getVendor] Looking up vendor:', facilityId)

  const { data, error } = await supabase
    .from('nursing_homes')
    .select('id, name, state, services, contact_email, user_id')
    .eq('id', facilityId)
    .single()

  if (error) {
    console.error('[getVendor] Error:', error.message, error.code, error.details)
    return null
  }

  if (!data) {
    console.log('[getVendor] No data returned')
    return null
  }

  console.log('[getVendor] Found vendor:', data.name)
  return data
}

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function ClaimPage({ searchParams }: ClaimPageProps) {
  const { vendor: facilityId } = await searchParams

  // No vendor ID provided
  if (!facilityId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No Listing Specified</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Please use a valid claim link to claim your listing.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch vendor data
  const vendor = await getVendor(facilityId)

  // Vendor not found
  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Listing Not Found</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              The listing you&apos;re trying to claim doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get current user
  const user = await getCurrentUser()

  // Already claimed by someone
  if (vendor.user_id) {
    const isOwnListing = user && vendor.user_id === user.id

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {isOwnListing ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">This Is Your Listing</h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  You&apos;ve already claimed <strong>{vendor.name}</strong>. Manage your listing from your dashboard.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                  <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Already Claimed</h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>{vendor.name}</strong> has already been claimed by another user.
                </p>
                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                  If you believe this is an error, please contact us at{' '}
                  <a href="mailto:support@nursinghomemy.com" className="text-blue-600 hover:underline dark:text-blue-400">
                    support@nursinghomemy.com
                  </a>
                </p>
                <Link
                  href="/listings"
                  className="mt-6 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Browse All Listings
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Not logged in - show landing page
  if (!user) {
    const redirectUrl = `/claim?vendor=${facilityId}`
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`
    const registerUrl = `/register?redirect=${encodeURIComponent(redirectUrl)}`

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
        <div className="w-full max-w-lg">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Claim {vendor.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Verify you own this business to receive leads
              </p>
            </div>

            {/* Vendor Info */}
            <div className="mb-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Listing Details</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Company</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{vendor.name}</dd>
                </div>
                {vendor.state && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Location</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-50">{vendor.state}</dd>
                  </div>
                )}
                {vendor.services && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">Services</dt>
                    <dd className="max-w-[200px] truncate font-medium text-zinc-900 dark:text-zinc-50">{vendor.services}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Why claim your listing?</h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Receive leads with full contact details</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update your company profile and photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority placement in search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% free — no hidden fees</span>
                </li>
              </ul>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3">
              <Link
                href={registerUrl}
                className="block w-full rounded-md bg-zinc-900 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign Up to Claim
              </Link>
              <Link
                href={loginUrl}
                className="block w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-center font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
              >
                Log In to Claim
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Logged in - show claim confirmation
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Claim {vendor.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              You&apos;re logged in as <strong>{user.email}</strong>
            </p>
          </div>

          {/* Vendor Info */}
          <div className="mb-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">You&apos;re claiming</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Company</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{vendor.name}</dd>
              </div>
              {vendor.state && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Location</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{vendor.state}</dd>
                </div>
              )}
              {vendor.contact_email && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">Listed Email</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{vendor.contact_email}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Disclaimer */}
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              By clicking &quot;Confirm Claim&quot;, you confirm that you are authorized to represent this business.
              False claims may result in account suspension.
            </p>
          </div>

          {/* Claim Button */}
          <ClaimButton facilityId={vendor.id} vendorName={vendor.name} />
        </div>
      </div>
    </div>
  )
}
