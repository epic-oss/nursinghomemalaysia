export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema for root layout
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Team Building MY',
    description: 'Malaysia\'s leading directory for team building companies, venues, and activities.',
    url: 'https://www.teambuildingmy.com',
    logo: 'https://www.teambuildingmy.com/logo.png',
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Malay'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
  }

  return <JsonLd data={schema} />
}

// Article Schema for blog posts
export function ArticleSchema({
  title,
  description,
  publishedDate,
  modifiedDate,
  author,
  url,
  image,
}: {
  title: string
  description: string
  publishedDate: string
  modifiedDate?: string
  author?: string
  url: string
  image?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: author || 'Team Building MY',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Team Building MY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.teambuildingmy.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
  }

  return <JsonLd data={schema} />
}

// BreadcrumbList Schema
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={schema} />
}

// FAQ Schema for FAQ sections
export function FAQSchema({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return <JsonLd data={schema} />
}

// LocalBusiness Schema for company pages
export function LocalBusinessSchema({
  name,
  description,
  address,
  phone,
  email,
  website,
  image,
  priceRange,
}: {
  name: string
  description: string
  address?: string
  phone?: string
  email?: string
  website?: string
  image?: string
  priceRange?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    description: description,
    ...(address && { address: address }),
    ...(phone && { telephone: phone }),
    ...(email && { email: email }),
    ...(website && { url: website }),
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
    ...(priceRange && { priceRange: priceRange }),
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
  }

  return <JsonLd data={schema} />
}
