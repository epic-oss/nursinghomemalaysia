'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NursingHome } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ClaimModalProps {
  company: NursingHome
  onClose: () => void
}

export function ClaimModal({ company, onClose }: ClaimModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    role: '',
    businessEmail: '',
    phone: '',
    verificationNotes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/listings/nursing_home/${company.slug}`)
        return
      }

      // Validation
      if (!formData.role || !formData.businessEmail || !formData.phone) {
        setError('Please fill in all required fields.')
        setLoading(false)
        return
      }

      // Check if company is already claimed
      if (company.user_id) {
        setError('This listing has already been claimed by another user.')
        setLoading(false)
        return
      }

      // Check if user already has a pending or approved claim for this company
      const { data: existingClaim } = await supabase
        .from('claim_requests')
        .select('status')
        .eq('user_id', user.id)
        .eq('nursing_home_id', company.id)
        .single()

      if (existingClaim) {
        if (existingClaim.status === 'pending') {
          setError('You already have a pending claim request for this listing.')
        } else if (existingClaim.status === 'approved') {
          setError('You already own this listing.')
        } else if (existingClaim.status === 'rejected') {
          setError('Your previous claim request was rejected. Please contact support.')
        }
        setLoading(false)
        return
      }

      // Check user's total approved claims (limit to 5)
      const { data: userClaims, error: claimsError } = await supabase
        .from('claim_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')

      if (claimsError) {
        console.error('Error checking user claims:', claimsError)
      }

      if (userClaims && userClaims.length >= 5) {
        setError('You have reached the maximum limit of 5 claimed listings. Please contact support if you need to claim more.')
        setLoading(false)
        return
      }

      // Create a claim REQUEST (pending approval)
      const { error: insertError } = await supabase
        .from('claim_requests')
        .insert({
          user_id: user.id,
          nursing_home_id: company.id,
          role_at_company: formData.role,
          verification_phone: formData.phone,
          proof_notes: `Business Email: ${formData.businessEmail}\n\nVerification Notes: ${formData.verificationNotes}`,
          status: 'pending',
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        setError(`Failed to submit claim request: ${insertError.message}`)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 3000)

    } catch (err) {
      console.error('Claim error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {success ? (
          <>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Claim Request Submitted!
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your request will be reviewed within 1-2 business days. You'll be notified via email once approved.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Request to Claim {company.name}
            </h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="mb-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Verification Required:</strong> All claim requests are manually reviewed to prevent fraud. Please provide accurate business contact details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Role at Company *
                </label>
                <select
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="">Select your role</option>
                  <option value="Owner">Owner</option>
                  <option value="Director">Director</option>
                  <option value="Manager">Manager</option>
                  <option value="Authorized Representative">Authorized Representative</option>
                </select>
              </div>

              <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Business Email *
                </label>
                <input
                  id="businessEmail"
                  type="email"
                  required
                  placeholder="yourname@company.com"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <p className="mt-1 text-xs text-zinc-500">Must match your company domain</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Business Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+60 12-345 6789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>

              <div>
                <label htmlFor="verificationNotes" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Additional Verification Info (Optional)
                </label>
                <textarea
                  id="verificationNotes"
                  rows={3}
                  placeholder="E.g., 'I'm listed on the company website as Director' or 'Can provide business registration documents'"
                  value={formData.verificationNotes}
                  onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-md border border-zinc-300 px-4 py-2 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
