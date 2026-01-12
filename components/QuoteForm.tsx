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
  patientAge: number
  relationship: string
  careLevel: string
  stayType: string
  mobilityLevel: string
  specialRequirements: string[]
  budget: string
  timeline: string
  location: string
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
    patientAge: 75,
    relationship: '',
    careLevel: '',
    stayType: '',
    mobilityLevel: '',
    specialRequirements: [],
    budget: '',
    timeline: '',
    location: '',
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Malaysian phone number'
    }

    if (!formData.patientAge || formData.patientAge < 1 || formData.patientAge > 120) {
      newErrors.patientAge = 'Please enter a valid age'
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Please select your relationship'
    }

    if (!formData.careLevel) {
      newErrors.careLevel = 'Please select care level needed'
    }

    if (!formData.stayType) {
      newErrors.stayType = 'Please select type of stay'
    }

    if (!formData.mobilityLevel) {
      newErrors.mobilityLevel = 'Please select mobility level'
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location'
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Please select a timeline'
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
        participants: formData.patientAge,
        location: formData.location,
        duration: formData.stayType,
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

  const toggleSpecialRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }))
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
            <li>We'll match you with 3-5 suitable nursing homes (within 24 hours)</li>
            <li>Facilities will contact you directly with customized quotes</li>
            <li>Compare quotes and choose the best fit for your loved one</li>
          </ol>

          <h4 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
            Your Request Summary:
          </h4>
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <li>• Patient Age: {formData.patientAge} years</li>
            <li>• Care Level: {formData.careLevel}</li>
            <li>• Type of Stay: {formData.stayType}</li>
            <li>• Mobility: {formData.mobilityLevel}</li>
            <li>• Location: {formData.location}</li>
            {formData.budget && <li>• Monthly Budget: {formData.budget}</li>}
            <li>• Timeline: {formData.timeline}</li>
          </ul>
        </div>

        <div className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="mb-2 font-semibold">Questions in the meantime?</p>
          <p>📧 hello@nursinghomemy.com</p>
          <p>💬 WhatsApp: +6012-298 8091</p>
        </div>

        <button
          onClick={onSuccess}
          className="w-full rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700"
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
              Your Name *
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
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
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
              placeholder="your.email@example.com"
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
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
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
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

      {/* CARE REQUIREMENTS SECTION */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Care Requirements
        </h3>

        <div className="space-y-4">
          {/* Patient Age */}
          <div>
            <label htmlFor="patientAge" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Patient's Age * ({formData.patientAge} years)
            </label>
            <input
              type="range"
              id="patientAge"
              min="1"
              max="120"
              value={formData.patientAge}
              onChange={(e) => setFormData({ ...formData, patientAge: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Different facilities specialize in different age groups
            </p>
            {errors.patientAge && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.patientAge}</p>}
          </div>

          {/* Relationship to Patient */}
          <div>
            <label htmlFor="relationship" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Your Relationship to Patient *
            </label>
            <select
              id="relationship"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.relationship
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select relationship</option>
              <option value="Son/Daughter">Son/Daughter</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Self">Self</option>
              <option value="Professional Caregiver">Professional Caregiver</option>
              <option value="Other">Other</option>
            </select>
            {errors.relationship && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.relationship}</p>}
          </div>

          {/* Care Level Needed */}
          <div>
            <label htmlFor="careLevel" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Care Level Needed *
            </label>
            <select
              id="careLevel"
              value={formData.careLevel}
              onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.careLevel
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select care level</option>
              <option value="Basic Assistance">Basic Assistance</option>
              <option value="Nursing Care">Nursing Care</option>
              <option value="Memory/Dementia Care">Memory/Dementia Care</option>
              <option value="Palliative Care">Palliative Care</option>
              <option value="Not Sure">Not Sure</option>
            </select>
            {errors.careLevel && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.careLevel}</p>}
          </div>

          {/* Type of Stay */}
          <div>
            <label htmlFor="stayType" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Type of Stay *
            </label>
            <select
              id="stayType"
              value={formData.stayType}
              onChange={(e) => setFormData({ ...formData, stayType: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.stayType
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select stay type</option>
              <option value="Permanent Residence">Permanent Residence</option>
              <option value="Respite/Short-term">Respite/Short-term</option>
              <option value="Day Care Only">Day Care Only</option>
            </select>
            {errors.stayType && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.stayType}</p>}
          </div>

          {/* Mobility Level */}
          <div>
            <label htmlFor="mobilityLevel" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Mobility Level *
            </label>
            <select
              id="mobilityLevel"
              value={formData.mobilityLevel}
              onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.mobilityLevel
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select mobility level</option>
              <option value="Fully Independent">Fully Independent</option>
              <option value="Needs Some Assistance">Needs Some Assistance</option>
              <option value="Wheelchair User">Wheelchair User</option>
              <option value="Bedridden">Bedridden</option>
            </select>
            {errors.mobilityLevel && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.mobilityLevel}</p>}
          </div>

          {/* Special Requirements */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Special Requirements (Optional)
            </label>
            <div className="space-y-2">
              {[
                'Dementia Care',
                'Dialysis Support',
                'Physiotherapy',
                'Halal Meals',
                'Vegetarian Meals',
                'Chinese-speaking Staff',
                '24-hour Nursing',
              ].map((requirement) => (
                <label key={requirement} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.specialRequirements.includes(requirement)}
                    onChange={() => toggleSpecialRequirement(requirement)}
                    className="mr-2"
                  />
                  {requirement}
                </label>
              ))}
            </div>
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
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select a location</option>
              <option value="Selangor">Selangor</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Penang">Penang</option>
              <option value="Johor">Johor</option>
              <option value="Perak">Perak</option>
              <option value="Negeri Sembilan">Negeri Sembilan</option>
              <option value="Melaka">Melaka</option>
              <option value="Pahang">Pahang</option>
              <option value="Kedah">Kedah</option>
              <option value="Kelantan">Kelantan</option>
              <option value="Terengganu">Terengganu</option>
              <option value="Sabah">Sabah</option>
              <option value="Sarawak">Sarawak</option>
              <option value="Other">Other</option>
            </select>
            {errors.location && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.location}</p>}
          </div>

          {/* Monthly Budget */}
          <div>
            <label htmlFor="budget" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Monthly Budget (Optional)
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 transition-colors focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">Select budget range</option>
              <option value="Below RM2,000">Below RM2,000</option>
              <option value="RM2,000-4,000">RM2,000-4,000</option>
              <option value="RM4,000-6,000">RM4,000-6,000</option>
              <option value="RM6,000-10,000">RM6,000-10,000</option>
              <option value="Above RM10,000">Above RM10,000</option>
            </select>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              This helps us match you with suitable facilities
            </p>
          </div>

          {/* Move-in Timeline */}
          <div>
            <label htmlFor="timeline" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Move-in Timeline *
            </label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 transition-colors ${
                errors.timeline
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 dark:text-zinc-50`}
            >
              <option value="">Select timeline</option>
              <option value="Immediately">Immediately</option>
              <option value="Within 1 Month">Within 1 Month</option>
              <option value="1-3 Months">1-3 Months</option>
              <option value="Just Researching">Just Researching</option>
            </select>
            {errors.timeline && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.timeline}</p>}
          </div>

          {/* Additional Requirements */}
          <div>
            <label htmlFor="additionalRequirements" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Additional Information (Optional)
            </label>
            <textarea
              id="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              placeholder="Any other information we should know? Medical conditions, dietary restrictions, preferred languages, specific facility preferences, etc."
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 transition-colors focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
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
            I agree to receive quotes from verified nursing homes and accept the{' '}
            <a href="/terms" target="_blank" className="text-teal-600 underline hover:text-teal-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-teal-600 underline hover:text-teal-700">
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
        className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-base font-bold text-white transition-all hover:from-teal-700 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
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
