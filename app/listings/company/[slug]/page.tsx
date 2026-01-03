import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NursingHomeDetailContent } from '@/components/CompanyDetailContent'
import { NursingHome } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getNursingHomeBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data: data as NursingHome | null, error }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: nursing_home } = await getNursingHomeBySlug(slug)

  if (!nursing_home) {
    return {
      title: 'Nursing Home Not Found',
    }
  }

  // Base URL for canonical and OG tags
  const baseUrl = 'https://www.nursinghomemalaysia.com'
  const pageUrl = `${baseUrl}/listings/nursing_home/${nursing_home.slug}`

  // Use nursing home's logo or first image for OG
  const ogImage = getHighResLogoUrl(nursing_home.logo_url) || nursing_home.images?.[0] || `${baseUrl}/og-placeholder.jpg`

  // Create meta description
  let description: string
  if (nursing_home.description && nursing_home.description.trim().length > 0) {
    // Use first 160 characters of nursing home description
    description = nursing_home.description.length > 160
      ? `${nursing_home.description.substring(0, 157)}...`
      : nursing_home.description
  } else {
    // Generate fallback description
    description = `${nursing_home.name} offers professional elderly care services in ${nursing_home.state}. View care packages and amenities.`
  }

  return {
    title: `${nursing_home.name} - Nursing Home Malaysia | Elderly Care`,
    description: description,
    keywords: [
      nursing_home.name,
      'nursing home Malaysia',
      nursing_home.state,
      'elderly care',
      'senior care',
    ].filter(Boolean),

    // Canonical URL
    alternates: {
      canonical: pageUrl,
    },

    // Open Graph tags
    openGraph: {
      title: `${nursing_home.name} - Nursing Home Malaysia`,
      description: description,
      url: pageUrl,
      siteName: 'Nursing Home Malaysia',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${nursing_home.name} - Elderly Care Provider`,
        },
      ],
      locale: 'en_MY',
      type: 'website',
    },

    // Twitter Card tags
    twitter: {
      card: 'summary_large_image',
      title: `${nursing_home.name} - Nursing Home Malaysia`,
      description: description,
      images: [ogImage],
    },

    // Additional metadata
    other: {
      'og:phone_number': nursing_home.contact_phone || '',
      'og:email': nursing_home.contact_email || '',
      'og:locality': nursing_home.state,
      'og:country-name': 'Malaysia',
    },
  }
}

export default async function NursingHomeDetailPage({ params }: PageProps) {
  const { slug } = await params

  const { data: nursing_home, error } = await getNursingHomeBySlug(slug)

  if (error || !nursing_home) {
    notFound()
  }

  return <NursingHomeDetailContent company={nursing_home} />
}
