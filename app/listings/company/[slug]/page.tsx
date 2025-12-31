import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CompanyDetailContent } from '@/components/CompanyDetailContent'
import { Company } from '@/lib/types'
import { getHighResLogoUrl } from '@/lib/image-utils'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCompanyBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data: data as Company | null, error }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: company } = await getCompanyBySlug(slug)

  if (!company) {
    return {
      title: 'Company Not Found',
    }
  }

  // Base URL for canonical and OG tags
  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/listings/company/${company.slug}`

  // Use company's logo or first image for OG
  const ogImage = getHighResLogoUrl(company.logo_url) || company.images?.[0] || `${baseUrl}/og-placeholder.jpg`

  // Create meta description
  let description: string
  if (company.description && company.description.trim().length > 0) {
    // Use first 160 characters of company description
    description = company.description.length > 160
      ? `${company.description.substring(0, 157)}...`
      : company.description
  } else {
    // Generate fallback description
    description = `${company.name} offers professional team building services in ${company.state}. View packages, activities${company.hrdf_claimable ? ', and HRDF certification status' : ''}.`
  }

  return {
    title: `${company.name} - Team Building Malaysia | Team Building MY`,
    description: description,
    keywords: [
      company.name,
      'team building Malaysia',
      company.state,
      'team building activities',
      'corporate events',
      company.hrdf_claimable ? 'HRDF claimable' : '',
    ].filter(Boolean),

    // Canonical URL
    alternates: {
      canonical: pageUrl,
    },

    // Open Graph tags
    openGraph: {
      title: `${company.name} - Team Building Malaysia`,
      description: description,
      url: pageUrl,
      siteName: 'Team Building MY',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${company.name} - Team Building Provider`,
        },
      ],
      locale: 'en_MY',
      type: 'website',
    },

    // Twitter Card tags
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} - Team Building Malaysia`,
      description: description,
      images: [ogImage],
    },

    // Additional metadata
    other: {
      'og:phone_number': company.contact_phone || '',
      'og:email': company.contact_email || '',
      'og:locality': company.state,
      'og:country-name': 'Malaysia',
    },
  }
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params

  const { data: company, error } = await getCompanyBySlug(slug)

  if (error || !company) {
    notFound()
  }

  return <CompanyDetailContent company={company} />
}
