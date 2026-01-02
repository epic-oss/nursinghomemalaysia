'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trackQuoteSubmission } from '@/lib/analytics'

export function CostCalculator() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1 - Calculator inputs
  const [participants, setParticipants] = useState(50)
  const [duration, setDuration] = useState<'half-day' | 'full-day' | '2d1n' | '3d2n'>('full-day')
  const [activityType, setActivityType] = useState('outdoor')
  const [location, setLocation] = useState('Selangor')

  // Step 2 - Lead capture
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferred_date: '',
    requirements: '',
  })

  // Budget calculation
  const [budget, setBudget] = useState({ min: 0, max: 0 })

  // Calculate budget whenever inputs change
  useEffect(() => {
    calculateBudget()
  }, [participants, duration, activityType, location])

  const calculateBudget = () => {
    // Base rates per person
    const baseRates: Record<string, { min: number; max: number }> = {
      'half-day': { min: 80, max: 150 },
      'full-day': { min: 150, max: 280 },
      '2d1n': { min: 350, max: 550 },
      '3d2n': { min: 700, max: 1000 },
    }

    // Activity type multipliers
    const activityMultipliers: Record<string, number> = {
      indoor: 0.8,
      outdoor: 1.0,
      adventure: 1.2,
      resort: 1.3,
      custom: 1.0,
    }

    // Location multipliers
    const locationMultipliers: Record<string, number> = {
      'Kuala Lumpur': 1.0,
      Selangor: 1.0,
      Penang: 0.9,
      'Johor Bahru': 0.9,
      Perak: 0.85,
      'Port Dickson': 0.85,
      Other: 0.9,
    }

    const base = baseRates[duration]
    const activityMult = activityMultipliers[activityType] || 1.0
    const locationMult = locationMultipliers[location] || 0.9

    const perPersonMin = Math.round(base.min * activityMult * locationMult)
    const perPersonMax = Math.round(base.max * activityMult * locationMult)

    const totalMin = perPersonMin * participants
    const totalMax = perPersonMax * participants

    setBudget({
      min: totalMin,
      max: totalMax,
    })
  }

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submitData = {
      ...formData,
      participants,
      duration,
      activity_type: activityType,
      location,
      estimated_budget_min: budget.min,
      estimated_budget_max: budget.max,
      source: 'calculator',
    }

    console.log('📤 Calculator form submitting data:', submitData)

    try {
      const response = await fetch('/api/calculator-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      console.log('📥 API response status:', response.status)

      const data = await response.json()
      console.log('📥 API response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      // Track successful submission with GA4
      trackQuoteSubmission({
        source: 'calculator',
        participants,
        location,
        duration,
        estimatedBudget: `RM ${budget.min} - RM ${budget.max}`,
      })

      // Redirect to thank you state
      setStep(3)
    } catch (error) {
      console.error('Error submitting lead:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const malaysianStates = [
    'Kuala Lumpur',
    'Selangor',
    'Penang',
    'Johor Bahru',
    'Perak',
    'Port Dickson',
    'Other',
  ]

  // Track calculator usage
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_page_view')
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (step === 3) {
    // Thank you page
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Thank You!
        </h2>
        <p className="mb-4 text-lg text-zinc-700 dark:text-zinc-300">
          We're connecting you with 3-5 verified providers
        </p>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          You'll receive personalized quotes within 24 hours via email and WhatsApp.
        </p>

        <div className="mb-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">What happens next?</h3>
          <ol className="space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
            <li>1. We review your requirements</li>
            <li>2. We match you with suitable providers</li>
            <li>3. Providers send you customized quotes</li>
            <li>4. You compare and choose the best option</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/listings"
            className="rounded-md border border-zinc-300 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Browse Providers
          </a>
          <a
            href="/"
            className="rounded-md bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 1
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'bg-green-600 text-white'
            }`}
          >
            {step > 1 ? '✓' : '1'}
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Calculate Budget
          </span>
        </div>
        <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700" />
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 2
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'border-2 border-zinc-300 text-zinc-400 dark:border-zinc-700'
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Get Quotes
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Step 1: Event Details
          </h2>

          <div className="space-y-6">
            {/* Number of Participants */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Number of Participants
                </label>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {participants} people
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700"
                style={{
                  background: `linear-gradient(to right, #18181b 0%, #18181b ${((participants - 10) / 290) * 100}%, #e4e4e7 ${((participants - 10) / 290) * 100}%, #e4e4e7 100%)`,
                }}
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-500">
                <span>10</span>
                <span>300</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: 'half-day', label: 'Half Day', desc: '4-5 hours', icon: '🕐' },
                  { value: 'full-day', label: 'Full Day', desc: '8 hours', icon: '☀️' },
                  { value: '2d1n', label: '2D1N', desc: 'Overnight', icon: '🌙' },
                  { value: '3d2n', label: '3D2N', desc: 'Weekend', icon: '🏖️' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDuration(option.value as any)}
                    className={`rounded-lg border-2 p-3 text-left transition-colors ${
                      duration === option.value
                        ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
                        : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="mb-1 text-2xl">{option.icon}</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {option.label}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Activity Type
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="indoor">Indoor Activities (workshops, training)</option>
                <option value="outdoor">Outdoor Activities (sports, nature)</option>
                <option value="adventure">Adventure Activities (rafting, climbing)</option>
                <option value="resort">Resort/Retreat (beach, hill resort)</option>
                <option value="custom">Custom/Mixed</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Location Preference
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Estimate */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-6 dark:from-blue-950/20 dark:to-blue-900/20">
              <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Estimated Budget
              </div>
              <div className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(budget.min)} - {formatCurrency(budget.max)}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                ({formatCurrency(Math.round(budget.min / participants))} -{' '}
                {formatCurrency(Math.round(budget.max / participants))} per person)
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                setStep(2)
                // Track analytics
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'calculator_completed', {
                    participants,
                    duration,
                    estimated_budget: `${budget.min}-${budget.max}`,
                  })
                }
              }}
              className="w-full rounded-md bg-zinc-900 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Free Quotes →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Get Exact Quotes from Verified Providers
          </h2>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Fill in your details to receive personalized quotes from 3-5 nursing home companies
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+60"
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Additional Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Any specific needs or preferences..."
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-zinc-300 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-zinc-900 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isSubmitting ? 'Submitting...' : 'Get Free Quotes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
