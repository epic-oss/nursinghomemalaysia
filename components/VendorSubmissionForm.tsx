'use client'

import { useState } from 'react'
import { submitVendorApplication } from '@/lib/actions'

const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
]

const COMPANY_TYPES = [
  'Event Management Company',
  'Nursing Home Provider',
  'Training Provider',
  'Adventure Activity Provider',
  'Venue Operator',
  'Corporate Retreat Organizer',
  'Other',
]

const ACTIVITY_TYPES = [
  'Indoor Activities',
  'Outdoor Activities',
  'Adventure Activities',
  'Creative Workshops',
  'Problem Solving',
  'Communication Activities',
  'Leadership Training',
  'Virtual Nursing Home',
  'Sports Activities',
]

const REFERRAL_SOURCES = [
  'Google Search',
  'Social Media',
  'Referral from Friend/Colleague',
  'Industry Event',
  'Other',
]

export function VendorSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [error, setError] = useState('')
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Add selected activities to form data
    formData.delete('services') // Remove any existing
    selectedActivities.forEach(activity => {
      formData.append('services', activity)
    })

    try {
      const result = await submitVendorApplication(formData)

      if (result.success) {
        setIsSuccess(true)
        setSubmittedEmail(formData.get('email') as string)
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
          Submission Received!
        </h3>
        <p className="text-green-800 dark:text-green-200">
          Thank you! We'll review your submission within 2-3 business days and contact you at{' '}
          <strong>{submittedEmail}</strong>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Company Information */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Company Information
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Registration Number (Optional)
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              placeholder="e.g., 1234567-A"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="+60 12-345 6789"
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Website URL (Optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="https://www.example.com"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Location</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              placeholder="Street address"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">Select state</option>
                {MALAYSIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Services</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="companyType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Company Type <span className="text-red-500">*</span>
            </label>
            <select
              id="companyType"
              name="companyType"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select type</option>
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Brief Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              maxLength={1000}
              placeholder="Describe your company and services (max 200 words)"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <p className="mt-1 text-xs text-zinc-500">Maximum 1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Activities Offered <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {ACTIVITY_TYPES.map((activity) => (
                <label
                  key={activity}
                  className="flex items-center space-x-2 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity)}
                    onChange={() => handleActivityToggle(activity)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <span>{activity}</span>
                </label>
              ))}
            </div>
            {selectedActivities.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please select at least one activity type</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              HRDF Claimable? <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 space-x-6">
              <label className="inline-flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  name="hrdfClaimable"
                  value="yes"
                  required
                  className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  name="hrdfClaimable"
                  value="no"
                  required
                  className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="referralSource" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              How did you hear about us? (Optional)
            </label>
            <select
              id="referralSource"
              name="referralSource"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select an option</option>
              {REFERRAL_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-700">
        <button
          type="submit"
          disabled={isSubmitting || selectedActivities.length === 0}
          className="w-full rounded-md bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
        <p className="mt-2 text-xs text-zinc-500">
          By submitting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  )
}
