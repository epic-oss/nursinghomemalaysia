'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Company, Venue, Activity, ListingType } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'
import { useState } from 'react'
import { ClaimModal } from './ClaimModal'

interface ListingCardProps {
  listing: Company | Venue | Activity
  type: ListingType
  currentUserId?: string | null
}

export function ListingCard({ listing, type, currentUserId }: ListingCardProps) {
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const imageUrl = listing.images?.[0] || '/placeholder.svg'
  const title = listing.name
  const description =
    listing.description.length > 150
      ? `${listing.description.slice(0, 150)}...`
      : listing.description
  const isCompany = type === 'company'
  const company = isCompany ? (listing as Company) : null
  const logoUrl = getHighResLogoUrl(company?.logo_url || null)
  const hrdfClaimable = !!company?.hrdf_claimable
  const isUnclaimed = isCompany && !company?.user_id
  const isOwnedByCurrentUser = isCompany && company?.user_id === currentUserId
  let ratingDisplay: string | null = null
  if (
    company &&
    typeof company.average_rating === 'number' &&
    typeof company.review_count === 'number'
  ) {
    ratingDisplay = `${company.average_rating.toFixed(1)} ⭐ (${company.review_count} ${
      company.review_count === 1 ? 'review' : 'reviews'
    })`
  }

  const initials = title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  // Type-specific details
  let details: string[] = []
  if (type === 'company') {
    const company = listing as Company
    details = [
      company.state,
      company.price_range || 'Contact for pricing',
    ]
  } else if (type === 'venue') {
    const venue = listing as Venue
    details = [
      `${venue.city}, ${venue.state}`,
      venue.capacity ? `Capacity: ${venue.capacity}` : '',
      venue.price_range || 'Contact for pricing',
    ].filter(Boolean)
  } else if (type === 'activity') {
    const activity = listing as Activity
    details = [
      activity.category,
      activity.duration || '',
      activity.price_range || 'Contact for pricing',
    ].filter(Boolean)
  }

  // Generate the appropriate URL based on listing type
  const listingUrl = isCompany && company?.slug
    ? `/listings/company/${company.slug}`
    : `/listings/${type}/${listing.id}`

  const handleClaimClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowClaimModal(true)
  }

  return (
    <>
      <Link href={listingUrl} className="block">
        <div className={`group relative overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg dark:bg-zinc-900 ${
          company?.is_premium
            ? 'border-2 border-yellow-500 shadow-lg shadow-yellow-500/20 dark:border-yellow-400'
            : 'border border-zinc-200 dark:border-zinc-800'
        }`}>
          <div
            className={`relative h-48 w-full overflow-hidden ${
              isCompany ? 'bg-zinc-50 dark:bg-zinc-900/80' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
          {isCompany ? (
            logoUrl && !logoError ? (
              <Image
                src={logoUrl}
                alt={`${title} logo`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-6 text-3xl font-semibold text-zinc-600 dark:text-zinc-200">
                {initials || title.charAt(0).toUpperCase()}
              </div>
            )
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {/* Premium/Featured Badges */}
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            {company?.is_premium && (
              <span className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                Premium
              </span>
            )}
            {listing.featured && !company?.is_premium && (
              <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
              {ratingDisplay && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
                    {ratingDisplay}
                  </span>
                </div>
              )}
            </div>
            {hrdfClaimable && (
              <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-100">
                HRDF Claimable
              </span>
            )}
          </div>
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
          <div className="flex flex-wrap gap-2">
            {details.map((detail, index) => (
              <span
                key={index}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {detail}
              </span>
            ))}
          </div>

          {/* Claim Button - Only show for unclaimed companies */}
          {isUnclaimed && !isOwnedByCurrentUser && (
            <button
              onClick={handleClaimClick}
              className="mt-3 w-full rounded-md border-2 border-zinc-900 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
            >
              Claim This Listing
            </button>
          )}
        </div>
      </div>
    </Link>

    {/* Claim Modal */}
    {showClaimModal && company && (
      <ClaimModal
        company={company}
        onClose={() => setShowClaimModal(false)}
      />
    )}
    </>
  )
}
