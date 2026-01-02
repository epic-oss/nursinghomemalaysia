'use client'

import Link from 'next/link'
import { useState } from 'react'

interface State {
  name: string
  slug: string
}

interface LocationsGridProps {
  states: State[]
  stateCounts: Record<string, number>
}

function LocationCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="mt-2 h-4 w-24 rounded bg-zinc-100 dark:bg-zinc-900"></div>
        </div>
        <div className="h-5 w-5 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
      <div className="mt-4 h-4 w-28 rounded bg-zinc-100 dark:bg-zinc-900"></div>
    </div>
  )
}

export function LocationsGrid({ states, stateCounts }: LocationsGridProps) {
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Separate states with and without companies
  const statesWithCompanies = states.filter((state) => (stateCounts[state.name] || 0) > 0)
  const statesWithoutCompanies = states.filter((state) => (stateCounts[state.name] || 0) === 0)

  const displayedStates = showAll ? states : statesWithCompanies

  const handleToggle = () => {
    if (!showAll) {
      setIsLoading(true)
      // Simulate a brief loading state for UX
      setTimeout(() => {
        setShowAll(true)
        setIsLoading(false)
      }, 200)
    } else {
      setShowAll(false)
    }
  }

  return (
    <>
      {/* States Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedStates.map((state) => {
          const count = stateCounts[state.name] || 0

          return (
            <Link
              key={state.slug}
              href={`/locations/${state.slug}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-900 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {state.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {count > 0 ? (
                      <>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {count}
                        </span>{' '}
                        {count === 1 ? 'nursing_home' : 'companies'}
                      </>
                    ) : (
                      'No companies yet'
                    )}
                  </p>
                </div>

                <svg
                  className="h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Explore location →
              </div>
            </Link>
          )
        })}

        {/* Skeleton loading for newly revealed states */}
        {isLoading &&
          statesWithoutCompanies.map((state) => (
            <LocationCardSkeleton key={`skeleton-${state.slug}`} />
          ))}
      </div>

      {/* Show All Toggle Button */}
      {statesWithoutCompanies.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleToggle}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {showAll ? (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Show fewer states
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show all {states.length} states ({statesWithoutCompanies.length} without companies)
              </>
            )}
          </button>
        </div>
      )}
    </>
  )
}

export function LocationsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <LocationCardSkeleton key={i} />
      ))}
    </div>
  )
}
