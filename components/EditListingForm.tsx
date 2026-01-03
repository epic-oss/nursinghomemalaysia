'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { NursingHome } from '@/lib/types'

interface EditListingFormProps {
  listing: NursingHome
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: listing.name || '',
    description: listing.description || '',
    contact_phone: listing.contact_phone || '',
    contact_email: listing.contact_email || '',
    website: listing.website || '',
    location: listing.location || '',
    state: listing.state || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Company name must be at least 3 characters'
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!formData.contact_phone) {
      newErrors.contact_phone = 'Phone number is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.contact_email || !emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = 'Valid email address is required'
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://'
    }

    if (!formData.location) {
      newErrors.location = 'Location is required'
    }

    if (!formData.state) {
      newErrors.state = 'State is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/update-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update listing')
      }

      alert('Listing updated successfully!')
      router.push('/dashboard')
      router.refresh()

    } catch (error) {
      console.error('Error updating listing:', error)
      alert(error instanceof Error ? error.message : 'Failed to update listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch('/api/delete-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId: listing.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete listing')
      }

      alert('Listing deleted successfully')
      router.push('/dashboard')
      router.refresh()

    } catch (error) {
      console.error('Error deleting listing:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete listing. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const malaysianStates = [
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

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Company Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full rounded-lg border px-4 py-3 transition-colors ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            placeholder="Your company name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Description * ({formData.description.length}/500)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            maxLength={500}
            className={`w-full rounded-lg border px-4 py-3 transition-colors ${
              errors.description
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            placeholder="Describe your nursing home services..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
        </div>

        {/* Phone & Email */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="contact_phone" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Phone Number *
            </label>
            <input
              type="tel"
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.contact_phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
              placeholder="+60123456789"
            />
            {errors.contact_phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contact_phone}</p>}
          </div>

          <div>
            <label htmlFor="contact_email" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Email Address *
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.contact_email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
              placeholder="contact@company.com"
            />
            {errors.contact_email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contact_email}</p>}
          </div>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Website (Optional)
          </label>
          <input
            type="url"
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className={`w-full rounded-lg border px-4 py-3 transition-colors ${
              errors.website
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            placeholder="https://www.company.com"
          />
          {errors.website && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>}
        </div>

        {/* Location & State */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              City/Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.location
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
              placeholder="Petaling Jaya"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              State *
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.state
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select state</option>
              {malaysianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="w-full rounded-lg border border-red-300 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            Delete Listing
          </button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Delete This Listing?
            </h3>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to permanently delete this listing? This action cannot be undone. All data associated with this listing will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
