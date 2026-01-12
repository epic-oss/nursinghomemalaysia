'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Pricing configuration
const BASE_COST_BY_STATE: Record<string, number> = {
  'Kuala Lumpur': 4000,
  'Selangor': 3500,
  'Penang': 3000,
  'Johor': 2500,
  'Perak': 2200,
  'Other': 2000,
}

const CARE_LEVEL_MULTIPLIERS: Record<string, { multiplier: number; label: string; description: string }> = {
  'basic': { multiplier: 1.0, label: 'Basic Care', description: 'Daily supervision, meals, housekeeping' },
  'assisted': { multiplier: 1.3, label: 'Assisted Living', description: 'Help with daily activities (bathing, dressing)' },
  'skilled': { multiplier: 1.6, label: 'Skilled Nursing', description: '24-hour nursing care, medical monitoring' },
  'memory': { multiplier: 2.0, label: 'Memory/Dementia Care', description: 'Specialized dementia and Alzheimer\'s care' },
}

const ROOM_TYPE_ADJUSTMENTS: Record<string, { adjustment: number; label: string; description: string }> = {
  'shared': { adjustment: -500, label: 'Shared Room (4-6 beds)', description: 'Most affordable option' },
  'semi-private': { adjustment: 0, label: 'Semi-Private (2 beds)', description: 'Balance of privacy and cost' },
  'private': { adjustment: 1000, label: 'Private Room', description: 'Maximum privacy and comfort' },
}

const SPECIAL_NEEDS_OPTIONS: Record<string, { cost: number; label: string }> = {
  'dialysis': { cost: 800, label: 'Dialysis Support' },
  'physiotherapy': { cost: 400, label: 'Physiotherapy Sessions' },
  'nursing24hr': { cost: 500, label: '24-Hour Dedicated Nursing' },
  'specialDiet': { cost: 200, label: 'Special Diet Requirements' },
}

export function NursingHomeCostCalculator() {
  const [state, setState] = useState('Selangor')
  const [careLevel, setCareLevel] = useState('basic')
  const [roomType, setRoomType] = useState('semi-private')
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([])
  const [estimate, setEstimate] = useState({ min: 0, max: 0, base: 0 })

  // Calculate estimate whenever inputs change
  useEffect(() => {
    calculateEstimate()
  }, [state, careLevel, roomType, specialNeeds])

  const calculateEstimate = () => {
    // Base cost by state
    const baseCost = BASE_COST_BY_STATE[state] || BASE_COST_BY_STATE['Other']

    // Apply care level multiplier
    const careLevelData = CARE_LEVEL_MULTIPLIERS[careLevel]
    const afterCareLevel = baseCost * careLevelData.multiplier

    // Apply room type adjustment
    const roomData = ROOM_TYPE_ADJUSTMENTS[roomType]
    const afterRoom = afterCareLevel + roomData.adjustment

    // Add special needs costs
    const specialNeedsCost = specialNeeds.reduce((total, need) => {
      return total + (SPECIAL_NEEDS_OPTIONS[need]?.cost || 0)
    }, 0)

    const finalCost = afterRoom + specialNeedsCost

    // Calculate range (±20%)
    const min = Math.round(finalCost * 0.8)
    const max = Math.round(finalCost * 1.2)

    setEstimate({ min, max, base: Math.round(finalCost) })
  }

  const handleSpecialNeedToggle = (need: string) => {
    setSpecialNeeds(prev =>
      prev.includes(need)
        ? prev.filter(n => n !== need)
        : [...prev, need]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Calculate Your Monthly Cost
        </h2>

        <div className="space-y-6">
          {/* State Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              State / Location
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              {Object.keys(BASE_COST_BY_STATE).map((stateOption) => (
                <option key={stateOption} value={stateOption}>
                  {stateOption} - Base: {formatCurrency(BASE_COST_BY_STATE[stateOption])}/month
                </option>
              ))}
            </select>
          </div>

          {/* Care Level Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Level of Care Required
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(CARE_LEVEL_MULTIPLIERS).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCareLevel(key)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    careLevel === key
                      ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {data.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {data.multiplier}x
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {data.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Room Type Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Room Type
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(ROOM_TYPE_ADJUSTMENTS).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRoomType(key)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    roomType === key
                      ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {data.label}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {data.adjustment > 0 ? `+${formatCurrency(data.adjustment)}` : data.adjustment < 0 ? formatCurrency(data.adjustment) : 'Base price'}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    {data.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Special Needs Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Special Care Needs (Optional)
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(SPECIAL_NEEDS_OPTIONS).map(([key, data]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                    specialNeeds.includes(key)
                      ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={specialNeeds.includes(key)}
                    onChange={() => handleSpecialNeedToggle(key)}
                    className="h-5 w-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {data.label}
                    </span>
                    <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                      +{formatCurrency(data.cost)}/month
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cost Estimate Display */}
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-6 dark:from-blue-950/30 dark:to-blue-900/30">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Estimated Monthly Cost
            </div>
            <div className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Based on {state} rates with {CARE_LEVEL_MULTIPLIERS[careLevel].label.toLowerCase()}
            </div>
            {specialNeeds.length > 0 && (
              <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                Includes: {specialNeeds.map(n => SPECIAL_NEEDS_OPTIONS[n].label).join(', ')}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/submit"
            className="block w-full rounded-md bg-zinc-900 px-6 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Personalized Quotes
          </Link>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
            Compare quotes from verified nursing homes in {state}
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Your Cost Breakdown
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Base cost ({state})</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {formatCurrency(BASE_COST_BY_STATE[state] || BASE_COST_BY_STATE['Other'])}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">
              Care level ({CARE_LEVEL_MULTIPLIERS[careLevel].label})
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              x{CARE_LEVEL_MULTIPLIERS[careLevel].multiplier}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">
              Room type ({ROOM_TYPE_ADJUSTMENTS[roomType].label.split(' ')[0]})
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {ROOM_TYPE_ADJUSTMENTS[roomType].adjustment >= 0 ? '+' : ''}{formatCurrency(ROOM_TYPE_ADJUSTMENTS[roomType].adjustment)}
            </span>
          </div>
          {specialNeeds.length > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Special needs</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                +{formatCurrency(specialNeeds.reduce((sum, n) => sum + SPECIAL_NEEDS_OPTIONS[n].cost, 0))}
              </span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <div className="flex justify-between">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">Estimated range</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
