import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/ContactForm'
import { Company, Venue, Activity, ListingType } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'

interface PageProps {
  params: Promise<{
    type: string
    id: string
  }>
}

async function getListingData(type: string, id: string) {
  const supabase = await createClient()

  if (type === 'company') {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as Company | null, error }
  } else if (type === 'venue') {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as Venue | null, error }
  } else if (type === 'activity') {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()
    return { data: data as Activity | null, error }
  }

  return { data: null, error: { message: 'Invalid type' } }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { type, id } = await params

  if (!['company', 'venue', 'activity'].includes(type)) {
    notFound()
  }

  const { data: listing, error } = await getListingData(type, id)

  if (error || !listing) {
    notFound()
  }

  const images = listing.images || []
  const mainImage = images[0] || '/placeholder.svg'
  const isCompany = type === 'company'
  const company = isCompany ? (listing as Company) : null
  const hrdfClaimable = !!company?.hrdf_claimable
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
                {hrdfClaimable && (
                  <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-500/20 dark:text-green-100">
                    HRDF Claimable
                  </span>
                )}
              </div>
            </div>

            {/* Main Image */}
            <div
              className={`relative mb-6 h-96 w-full overflow-hidden rounded-lg ${
                isCompany ? 'bg-zinc-50 dark:bg-zinc-900/80' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              {isCompany ? (
                getHighResLogoUrl(company?.logo_url || null) ? (
                  <Image
                    src={getHighResLogoUrl(company?.logo_url || null)!}
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
            {type === 'company' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Services Offered
                </h2>
                {(listing as Company).services && (listing as Company).services!.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                    {(listing as Company).services!.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
              </div>
            )}

            {type === 'venue' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Amenities
                </h2>
                {(listing as Venue).amenities && (listing as Venue).amenities!.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                    {(listing as Venue).amenities!.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
              </div>
            )}

            {type === 'activity' && (
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Objectives
                </h2>
                {(listing as Activity).objectives && (listing as Activity).objectives!.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                    {(listing as Activity).objectives!.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">Contact for details</p>
                )}
                {(listing as Activity).requirements && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                      Requirements
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {(listing as Activity).requirements}
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
                  {type === 'company' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Location</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Company).location}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">State</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Company).state}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as Company).price_range || 'Contact for pricing'}
                        </dd>
                      </div>
                    </>
                  )}

                  {type === 'venue' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Location</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Venue).location}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">City</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Venue).city}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">State</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Venue).state}</dd>
                      </div>
                      {(listing as Venue).capacity && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Capacity</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">
                            {(listing as Venue).capacity} people
                          </dd>
                        </div>
                      )}
                      {(listing as Venue).venue_type && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Type</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Venue).venue_type}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as Venue).price_range || 'Contact for pricing'}
                        </dd>
                      </div>
                    </>
                  )}

                  {type === 'activity' && (
                    <>
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Category</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Activity).category}</dd>
                      </div>
                      {(listing as Activity).duration && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Duration</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Activity).duration}</dd>
                        </div>
                      )}
                      {(listing as Activity).group_size && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Group Size</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">{(listing as Activity).group_size}</dd>
                        </div>
                      )}
                      {(listing as Activity).difficulty_level && (
                        <div>
                          <dt className="font-medium text-zinc-900 dark:text-zinc-50">Difficulty</dt>
                          <dd className="text-zinc-600 dark:text-zinc-400">
                            {(listing as Activity).difficulty_level}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-medium text-zinc-900 dark:text-zinc-50">Price Range</dt>
                        <dd className="text-zinc-600 dark:text-zinc-400">
                          {(listing as Activity).price_range || 'Contact for pricing'}
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
