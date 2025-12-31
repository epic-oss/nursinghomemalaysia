'use client'

import { useState } from 'react'
import { ListingCard } from '@/components/ListingCard'
import type { Company } from '@/lib/types'

interface CompanyListProps {
  initialCompanies: Company[]
  totalCount: number
  state: string
  location: string
}

export function CompanyList({ initialCompanies, totalCount, state, location }: CompanyListProps) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const COMPANIES_PER_PAGE = 12

  const hasMore = companies.length < totalCount

  const loadMore = async () => {
    setIsLoading(true)

    try {
      const nextPage = currentPage + 1
      const offset = currentPage * COMPANIES_PER_PAGE

      const response = await fetch(
        `/api/companies?state=${encodeURIComponent(state)}&offset=${offset}&limit=${COMPANIES_PER_PAGE}`
      )

      if (response.ok) {
        const newCompanies = await response.json()
        setCompanies([...companies, ...newCompanies])
        setCurrentPage(nextPage)
      }
    } catch (error) {
      console.error('Failed to load more companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
          No companies listed yet in {location}.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Be the first to submit your company!
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {totalCount > 0 && `${totalCount} `}
          {totalCount === 1 ? 'Company' : 'Companies'} in {location}
        </h2>
        <a
          href={`/listings?state=${encodeURIComponent(state)}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View in Listings →
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <ListingCard
            key={company.id}
            listing={company}
            type="company"
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                Load More Companies
                <span className="text-sm opacity-75">
                  ({companies.length} of {totalCount})
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && totalCount > COMPANIES_PER_PAGE && (
        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Showing all {totalCount} companies
        </div>
      )}
    </div>
  )
}
