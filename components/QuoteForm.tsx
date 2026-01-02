'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { trackQuoteSubmission } from '@/lib/analytics'

interface QuoteFormProps {
  onSuccess: () => void
  source: string
}

interface FormData {
  name: string
  company: string
  email: string
  phone: string
  participants: number
  date: string
  flexibleDates: boolean
  location: string
  duration: string
  budget: string
  hrdf: string
  additionalRequirements: string
  agreeToTerms: boolean
  honeypot: string
}

export function QuoteForm({ onSuccess, source }: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    participants: 50,
    date: '',
    flexibleDates: false,
    location: '',
    duration: '',
    budget: '',
    hrdf: '',
    additionalRequirements: '',
    agreeToTerms: false,
    honeypot: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitTime] = useState(Date.now())

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Please enter your name'
    }

    if (!formData.company || formData.company.length < 2) {
      newErrors.company = 'Please enter your company name'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Malaysian phone number'
    }

    if (!formData.participants || formData.participants < 10 || formData.participants > 500) {
      newErrors.participants = 'Participants must be between 10 and 500'
    }

    // Date is only required if not flexible
    if (!formData.flexibleDates && !formData.date) {
      newErrors.date = 'Please select a date or check flexible dates'
    } else if (formData.date && !formData.flexibleDates) {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date'
      }
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location'
    }

    if (!formData.duration) {
      newErrors.duration = 'Please select a duration'
    }

    if (!formData.hrdf) {
      newErrors.hrdf = 'Please select an option'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to continue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Anti-spam: Check if form was filled too quickly (less than 3 seconds)
    const timeElapsed = Date.now() - submitTime
    if (timeElapsed < 3000) {
      setErrors({ name: 'Please take your time filling out the form' })
      return
    }

    // Anti-spam: Check honeypot field
    if (formData.honeypot) {
      // Bot detected, silently reject
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      // Track successful submission with GA4
      trackQuoteSubmission({
        source: 'quote_form',
        participants: formData.participants,
        location: formData.location,
        duration: formData.duration,
        estimatedBudget: formData.budget,
      })

      setShowSuccess(true)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({
        name: error instanceof Error ? error.message : 'Something went wrong. Please try again or email us at hello@nursinghomemy.com',
      })

      // Track error
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_form_error', {
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 animate-bounce" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          ✓ Request Received!
        </h3>
        <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">
          Thank you, {formData.name}! We've received your nursing home quote request.
        </p>

        <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-left dark:border-zinc-800 dark:bg-zinc-800">
          <h4 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
            What Happens Next:
          </h4>
          <ol className="mb-4 ml-5 list-decimal space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>We'll match you with 3-5 suitable facilities (within 24 hours)</li>
            <li>Facilities will contact you directly with customized quotes</li>
            <li>Compare quotes and choose the best fit for your team</li>
          </ol>

          <h4 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
            Your Request Summary:
          </h4>
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <li>• {formData.participants} participants</li>
            <li>• {formData.duration} program in {formData.location}</li>
            <li>• Date: {formData.flexibleDates ? 'Flexible' : new Date(formData.date).toLocaleDateString()}</li>
            {formData.budget && <li>• Budget: {formData.budget}/person</li>}
            <li>•: {formData.hrdf === 'yes' ? 'Yes' : formData.hrdf === 'no' ? 'No' : 'Not sure'}</li>
          </ul>
        </div>

        <div className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="mb-2 font-semibold">Questions in the meantime?</p>
          <p>📧 hello@nursinghomemy.com</p>
          <p>💬 WhatsApp: +6012-298 8091</p>
        </div>

        <button
          onClick={onSuccess}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors.name && typeof errors.name === 'string' && !formData.name && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {errors.name}
        </div>
      )}

      {/* YOUR DETAILS SECTION */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Your Details
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="nursing_home" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Company Name *
            </label>
            <input
              type="text"
              id="nursing_home"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company name"
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.company
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.company && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.company}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@company.com"
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+60123456789"
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>}
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">We'll use WhatsApp if available</p>
          </div>

          {/* Honeypot field (hidden) */}
          <input
            type="text"
            name="website"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      {/* TEAM BUILDING REQUIREMENTS SECTION */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Nursing Home Requirements
        </h3>

        <div className="space-y-4">
          {/* Number of Participants */}
          <div>
            <label htmlFor="participants" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Number of Participants * ({formData.participants})
            </label>
            <input
              type="range"
              id="participants"
              min="10"
              max="500"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Most facilities require minimum 20 participants
            </p>
          </div>

          {/* Preferred Date */}
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preferred Date *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.date
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date}</p>}

            <label className="mt-2 flex items-center text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formData.flexibleDates}
                onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
                className="mr-2"
              />
              Flexible dates
            </label>
          </div>

          {/* Location Preference */}
          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Location Preference *
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.location
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select a location</option>
              <option value="Selangor">Selangor</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Penang">Penang</option>
              <option value="Negeri Sembilan">Negeri Sembilan</option>
              <option value="Pahang">Pahang</option>
              <option value="Melaka">Melaka</option>
              <option value="Johor">Johor</option>
              <option value="Perak">Perak</option>
              <option value="Kedah">Kedah</option>
              <option value="Terengganu">Terengganu</option>
              <option value="Kelantan">Kelantan</option>
              <option value="Sabah">Sabah</option>
              <option value="Sarawak">Sarawak</option>
              <option value="Other">Other</option>
            </select>
            {errors.location && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.location}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Duration *
            </label>
            <div className="space-y-2">
              {[
                { value: 'half-day', label: 'Half Day (4-5 hours)' },
                { value: 'full-day', label: 'Full Day (8 hours)' },
                { value: '2d1n', label: '2D1N (Overnight)' },
                { value: '3d2n', label: '3D2N (2 nights)' },
                { value: 'not-sure', label: 'Not Sure' },
              ].map((option) => (
                <label key={option.value} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={formData.duration === option.value}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.duration && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.duration}</p>}
          </div>

          {/* Budget Range */}
          <div>
            <label htmlFor="budget" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Budget per Person (Optional)
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">Select budget range</option>
              <option value="Below RM100">Below RM100</option>
              <option value="RM100-200">RM100-200</option>
              <option value="RM200-300">RM200-300</option>
              <option value="RM300-500">RM300-500</option>
              <option value="Above RM500">Above RM500</option>
              <option value="Not Sure / Need Guidance">Not Sure / Need Guidance</option>
            </select>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              This helps us match you with suitable facilities
            </p>
          </div>

          {/* HRDF Claim Required */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              HRDF Claim Required? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'yes', label: 'Yes, need HRDF-claimable program' },
                { value: 'no', label: 'No HRDF needed' },
                { value: 'not-sure', label: 'Not sure / Need advice' },
              ].map((option) => (
                <label key={option.value} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="hrdf"
                    value={option.value}
                    checked={formData.hrdf === option.value}
                    onChange={(e) => setFormData({ ...formData, hrdf: e.target.value })}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.hrdf && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.hrdf}</p>}
          </div>

          {/* Additional Requirements */}
          <div>
            <label htmlFor="additionalRequirements" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Additional Requirements (Optional)
            </label>
            <textarea
              id="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              placeholder="Tell us more about your nursing home goals, activity preferences, or special requests...&#10;Example: Looking for beach activities, need halal catering, team of 50 sales staff, focus on communication skills, etc."
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {formData.additionalRequirements.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* CONSENT SECTION */}
      <div>
        <label className="flex items-start text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="mr-2 mt-1"
          />
          <span>
            I agree to receive quotes from verified facilities and accept the{' '}
            <a href="/terms" target="_blank" className="text-blue-600 underline hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-blue-600 underline hover:text-blue-700">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-base font-bold text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Get My Free Quotes'
        )}
      </button>
    </form>
  )
}
