'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ContactForm } from '@/components/ContactForm'
import { NursingHome } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'

interface NursingHomeDetailContentProps {
  company: NursingHome
}

export function NursingHomeDetailContent({ company }: NursingHomeDetailContentProps) {
  const [logoError, setLogoError] = useState(false)

  let ratingDisplay: string | null = null
  if (
    typeof company.average_rating === 'number' &&
    typeof company.review_count === 'number'
  ) {
    ratingDisplay = `${company.average_rating.toFixed(1)} ⭐ (${company.review_count} ${
      company.review_count === 1 ? 'review' : 'reviews'
    })`
  }

  const logoInitials = company.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

  const logoUrl = getHighResLogoUrl(company.logo_url)

  // Handle images as either string or array
  const normalizeImages = (imgs: any): string[] => {
    if (Array.isArray(imgs)) return imgs
    if (imgs && typeof imgs === 'string' && imgs.length > 0) return [imgs]
    return []
  }
  const images = normalizeImages(company.images)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/listings" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Listings
          </Link>
          <span className="mx-2">/</span>
          <Link href="/listings?type=nursing_home" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Facilities
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-50">{company.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{company.name}</h1>
              {ratingDisplay && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{ratingDisplay}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {company.featured && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Main Logo */}
            <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900/80">
              {logoUrl && !logoError ? (
                <Image
                  src={logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-4xl font-semibold text-zinc-600 dark:text-zinc-200">
                  {logoInitials || company.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mb-6 grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                  >
                    <Image src={image} alt={`${company.name} ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* About This Facility */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                About This Facility
              </h2>
              <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                {company.description}
              </p>
            </div>

            {/* Care Services */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Care Services
              </h2>
              {company.services && company.services.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
                  {(Array.isArray(company.services)
                    ? company.services
                    : typeof company.services === 'string'
                      ? company.services.split(',').map((s: string) => s.trim())
                      : []
                  ).map((service: string, index: number) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
              )}
            </div>

            {/* Care Levels */}
            {company.care_levels && company.care_levels.length > 0 && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Care Levels
                </h2>
                <div className="flex flex-wrap gap-2">
                  {company.care_levels.map((level: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {company.amenities && company.amenities.length > 0 && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Amenities
                </h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {company.amenities.map((amenity: string, index: number) => (
                    <li key={index} className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <svg className="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Room Types */}
            {company.room_types && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Room Types
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">{company.room_types}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Facility Details Card */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Facility Details
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-zinc-900 dark:text-zinc-50">Location</dt>
                    <dd className="text-zinc-600 dark:text-zinc-400">{company.location}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-900 dark:text-zinc-50">State</dt>
                    <dd className="text-zinc-600 dark:text-zinc-400">{company.state}</dd>
                  </div>
                  {company.price_min && company.price_max ? (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Estimated Monthly Cost</dt>
                      <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        RM {company.price_min.toLocaleString()} - RM {company.price_max.toLocaleString()}
                      </dd>
                    </div>
                  ) : company.price_range ? (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">{company.price_range}</dd>
                    </div>
                  ) : (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">Contact for pricing</dd>
                    </div>
                  )}
                  {company.languages && company.languages.length > 0 && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Languages Spoken</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {company.languages.map((language: string, index: number) => (
                          <span
                            key={index}
                            className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {language}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium text-zinc-900 dark:text-zinc-50">Email</dt>
                    <dd className="text-zinc-600 dark:text-zinc-400">
                      <a href={`mailto:${company.contact_email}`} className="hover:underline">
                        {company.contact_email}
                      </a>
                    </dd>
                  </div>
                  {company.contact_phone && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Phone</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">
                        <a href={`tel:${company.contact_phone}`} className="hover:underline">
                          {company.contact_phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {company.website && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Website</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Visit Website →
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Contact Form */}
              <ContactForm
                listingId={company.id}
                listingName={company.name}
                listingType="nursing_home"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
