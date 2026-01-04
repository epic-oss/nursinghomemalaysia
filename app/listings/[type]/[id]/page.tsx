import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/ContactForm'
import { NursingHome, Facility, Service, ListingType } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'

interface PageProps {
  params: Promise<{
    type: string
    id: string
  }>
}

async function getListingData(type: string, id: string) {
  const supabase = await createClient()

  if (type === 'nursing_home') {
    const { data, error } = await supabase
      .from('nursing_homes')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as NursingHome | null, error }
  } else if (type === 'facility') {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as Facility | null, error }
  } else if (type === 'service') {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as Service | null, error }
  }

  return { data: null, error: { message: 'Invalid type' } }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { type, id } = await params

  if (!['nursing_home', 'facility', 'service'].includes(type)) {
    notFound()
  }

  const { data: listing, error } = await getListingData(type, id)

  if (error || !listing) {
    notFound()
  }

  // Handle images as either string or array
  const normalizeImages = (imgs: any): string[] => {
    if (Array.isArray(imgs)) return imgs
    if (imgs && typeof imgs === 'string' && imgs.length > 0) return [imgs]
    return []
  }
  const images = normalizeImages(listing.images)
  const mainImage = images[0] || '/placeholder.svg'
  const isNursingHome = type === 'nursing_home'
  const nursing_home = isNursingHome ? (listing as NursingHome) : null
  let ratingDisplay: string | null = null
  if (
    nursing_home &&
    typeof nursing_home.average_rating === 'number' &&
    typeof nursing_home.review_count === 'number'
  ) {
    ratingDisplay = `${nursing_home.average_rating.toFixed(1)} ⭐ (${nursing_home.review_count} ${
      nursing_home.review_count === 1 ? 'review' : 'reviews'
    })`
  }
  const logoInitials = listing.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

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
          <Link href={`/listings?type=${type}`} className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-50">{listing.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{listing.name}</h1>
              {ratingDisplay && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{ratingDisplay}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {listing.featured && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Main Image */}
            <div
              className={`relative mb-6 h-96 w-full overflow-hidden rounded-lg ${
                isNursingHome ? 'bg-zinc-50 dark:bg-zinc-900/80' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {isNursingHome ? (
                getHighResLogoUrl(nursing_home?.logo_url || null) ? (
                  <Image
                    src={getHighResLogoUrl(nursing_home?.logo_url || null)!}
                    alt={`${listing.name} logo`}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-8 text-4xl font-semibold text-zinc-600 dark:text-zinc-200">
                    {logoInitials || listing.name.charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                <Image
                  src={mainImage}
                  alt={listing.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Image Gallery */}
            {images.length > 1 && (
              <div className="mb-6 grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                  >
                    <Image src={image} alt={`${listing.name} ${index + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Description
              </h2>
              <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                {listing.description}
              </p>
            </div>

            {/* Type-specific Details */}
            {type === 'nursing_home' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Care Services Offered
                </h2>
                {(listing as NursingHome).services && (listing as NursingHome).services!.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
                    {(() => {
                      const services = (listing as NursingHome).services
                      const serviceArray = Array.isArray(services)
                        ? services
                        : typeof services === 'string'
                          ? services.split(',').map((s: string) => s.trim())
                          : []
                      return serviceArray.map((service: string, index: number) => (
                        <li key={index}>{service}</li>
                      ))
                    })()}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
              </div>
            )}

            {type === 'facility' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Amenities
                </h2>
                {(listing as Facility).amenities && (listing as Facility).amenities!.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                    {(listing as Facility).amenities!.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
              </div>
            )}

            {type === 'service' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Service Details
                </h2>
                {(listing as Service).objectives && (listing as Service).objectives!.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                    {(listing as Service).objectives!.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
                {(listing as Service).requirements && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                      Requirements
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {(listing as Service).requirements}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Details Card */}
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Details
                </h2>
                <dl className="space-y-3 text-sm">
                  {type === 'nursing_home' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Location</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as NursingHome).location}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">State</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as NursingHome).state}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as NursingHome).price_range || 'Contact for pricing'}
                        </dd>
                      </div>
                    </>
                  )}

                  {type === 'facility' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Location</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Facility).location}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">City</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Facility).city}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">State</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Facility).state}</dd>
                      </div>
                      {(listing as Facility).capacity && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Capacity</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">
                            {(listing as Facility).capacity} residents
                          </dd>
                        </div>
                      )}
                      {(listing as Facility).venue_type && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Type</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Facility).venue_type}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as Facility).price_range || 'Contact for pricing'}
                        </dd>
                      </div>
                    </>
                  )}

                  {type === 'service' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Category</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Service).category}</dd>
                      </div>
                      {(listing as Service).duration && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Duration</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Service).duration}</dd>
                        </div>
                      )}
                      {(listing as Service).group_size && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Group Size</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Service).group_size}</dd>
                        </div>
                      )}
                      {(listing as Service).difficulty_level && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Care Level</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">
                            {(listing as Service).difficulty_level}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as Service).price_range || 'Contact for pricing'}
                        </dd>
                      </div>
                    </>
                  )}

                  {'contact_email' in listing && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Email</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">
                        <a href={`mailto:${listing.contact_email}`} className="hover:underline">
                          {listing.contact_email}
                        </a>
                      </dd>
                    </div>
                  )}

                  {'contact_phone' in listing && listing.contact_phone && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Phone</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">
                        <a href={`tel:${listing.contact_phone}`} className="hover:underline">
                          {listing.contact_phone}
                        </a>
                      </dd>
                    </div>
                  )}

                  {'website' in listing && listing.website && (
                    <div>
                      <dt className="font-medium text-zinc-900 dark:text-zinc-50">Website</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400">
                        <a
                          href={listing.website}
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
                listingId={listing.id}
                listingName={listing.name}
                listingType={type as ListingType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
