'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { MALAYSIAN_STATES, CATEGORIES } from '@/lib/types'

interface SearchFilterProps {
  showCategoryFilter?: boolean
  showStateFilter?: boolean
  showActivityFilter?: boolean
  showHrdfFilter?: boolean
  activities?: string[]
  services?: string[]
}

export function SearchFilter({
  showCategoryFilter = false,
  showStateFilter = true,
  showActivityFilter = false,
  showHrdfFilter = true,
  activities = [],
  services = [],
}: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [state, setState] = useState(searchParams.get('state') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [activity, setActivity] = useState(searchParams.get('service') || searchParams.get('activity') || '')
  const [hrdf, setHrdf] = useState(searchParams.get('hrdf') || 'all')

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state) params.set('state', state)
    if (category) params.set('category', category)
    if (activity) params.set('service', activity)
    if (hrdf && hrdf !== 'all') params.set('hrdf', hrdf)

    startTransition(() => {
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleClear = () => {
    setSearch('')
    setState('')
    setCategory('')
    setActivity('')
    setHrdf('all')
    startTransition(() => {
      router.push(pathname)
    })
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {showCategoryFilter && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {showStateFilter && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">All States</option>
              {MALAYSIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {showActivityFilter && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Care Services
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">All Services</option>
              {(services.length > 0 ? services : activities).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleFilter}
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          {isPending ? 'Filtering...' : 'Apply Filters'}
        </button>
        <button
          onClick={handleClear}
          disabled={isPending}
          className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
