# 🔍 SEO Foundations - Implementation Plan

## 1. Sitemap Generation (`app/sitemap.ts`)

```typescript
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.teambuildingmy.com'
  const supabase = await createClient()

  // Get all companies
  const { data: companies } = await supabase
    .from('companies')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  const companyUrls = (companies || []).map((company) => ({
    url: `${baseUrl}/listings/company/${company.slug}`,
    lastModified: company.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  return [...staticPages, ...companyUrls]
}
```

## 2. Robots.txt (`app/robots.ts`)

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/dashboard/*',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://www.teambuildingmy.com/sitemap.xml',
  }
}
```

## 3. Enhanced Vendor Listing SEO (`app/listings/company/[slug]/page.tsx`)

**Current structure - we'll enhance the metadata generation:**

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = await getCompanyBySlug(params.slug)

  if (!company) {
    return {
      title: 'Company Not Found',
    }
  }

  // Base URL for canonical and OG tags
  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/listings/company/${company.slug}`

  // Use company's first image or a default
  const ogImage = company.images?.[0] || `${baseUrl}/og-default.jpg`

  // Create rich description from company data
  const description = company.description.length > 160
    ? `${company.description.substring(0, 157)}...`
    : company.description

  return {
    title: `${company.name} - Team Building Malaysia | Team Building MY`,
    description: description,
    keywords: [
      company.name,
      'team building Malaysia',
      company.state,
      company.category || 'corporate events',
      'team building activities',
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
      'og:phone_number': company.phone || '',
      'og:email': company.email || '',
      'og:locality': company.state,
      'og:country-name': 'Malaysia',
    },
  }
}
```

## 4. Enhanced Navigation & Footer

### A. Update AuthHeader.tsx Navigation

```typescript
{/* Desktop navigation */}
<div className="hidden lg:flex lg:gap-x-8">
  <Link
    href="/listings"
    className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
  >
    Browse Companies
  </Link>
  <Link
    href="/blog"
    className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
  >
    Blog
  </Link>
  <Link
    href="/locations"
    className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
  >
    Locations
  </Link>
  <Link
    href="/about"
    className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
  >
    About
  </Link>
  {user && (
    <Link
      href="/dashboard"
      className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
    >
      Dashboard
    </Link>
  )}
</div>
```

### B. Create Footer Component (`components/Footer.tsx`)

```typescript
import Link from 'next/link'

const MALAYSIAN_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan',
  'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak',
  'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
]

const ACTIVITY_CATEGORIES = [
  'Outdoor Activities',
  'Indoor Workshops',
  'Virtual Team Building',
  'Adventure Activities',
  'Creative Workshops',
  'Sports & Games',
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/listings"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Popular Locations
            </h3>
            <ul className="space-y-3">
              {['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Melaka'].map((state) => (
                <li key={state}>
                  <Link
                    href={`/listings?state=${encodeURIComponent(state)}`}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {state}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View All States →
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Activity Types
            </h3>
            <ul className="space-y-3">
              {ACTIVITY_CATEGORIES.slice(0, 5).map((category) => (
                <li key={category}>
                  <Link
                    href={`/listings?category=${encodeURIComponent(category)}`}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  List Your Company
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © {currentYear} Team Building MY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### C. Add Footer to Root Layout (`app/layout.tsx`)

```typescript
import { Footer } from '@/components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthHeader />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### D. Update Mobile Menu in AuthHeader

```typescript
{/* Mobile menu */}
{mobileMenuOpen && (
  <div className="lg:hidden">
    <div className="space-y-1 border-t border-zinc-200 px-4 pb-3 pt-2 dark:border-zinc-800">
      <Link
        href="/listings"
        className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
        onClick={() => setMobileMenuOpen(false)}
      >
        Browse Companies
      </Link>
      <Link
        href="/blog"
        className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
        onClick={() => setMobileMenuOpen(false)}
      >
        Blog
      </Link>
      <Link
        href="/locations"
        className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
        onClick={() => setMobileMenuOpen(false)}
      >
        Locations
      </Link>
      <Link
        href="/about"
        className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </Link>

      {/* Auth section remains the same */}
    </div>
  </div>
)}
```

## 5. Root Layout Meta Tags (`app/layout.tsx`)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.teambuildingmy.com'),
  title: {
    default: 'Team Building MY - Find the Best Team Building Companies in Malaysia',
    template: '%s | Team Building MY',
  },
  description: 'Discover top-rated team building companies and activities across Malaysia. Browse by location, read reviews, and book your next corporate event.',
  keywords: [
    'team building Malaysia',
    'corporate events Malaysia',
    'team building activities',
    'company retreats',
    'HRDF claimable',
  ],
  authors: [{ name: 'Team Building MY' }],
  creator: 'Team Building MY',
  publisher: 'Team Building MY',

  // Viewport and language
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',

  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://www.teambuildingmy.com',
    siteName: 'Team Building MY',
    title: 'Team Building MY - Find the Best Team Building Companies in Malaysia',
    description: 'Discover top-rated team building companies and activities across Malaysia.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Team Building MY',
    description: 'Find the best team building companies in Malaysia',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Rest of layout */}
    </html>
  )
}
```

## 📋 Summary of Changes

### New Files:
1. `app/sitemap.ts` - Dynamic sitemap with all vendors
2. `app/robots.ts` - Robots.txt configuration
3. `components/Footer.tsx` - SEO-friendly footer with internal links

### Modified Files:
1. `app/layout.tsx` - Enhanced metadata, viewport, language
2. `app/listings/company/[slug]/page.tsx` - Rich OG tags, Twitter cards, canonical URLs
3. `components/AuthHeader.tsx` - Added Blog & Locations nav links

### SEO Features Added:
- ✅ Dynamic sitemap with all vendors
- ✅ Proper robots.txt
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured navigation
- ✅ Footer with internal linking
- ✅ Meta viewport
- ✅ Language tags
- ✅ Priority/frequency settings

### Benefits:
1. **Better indexing** - Google can discover all pages
2. **Social sharing** - Rich previews on Facebook/Twitter
3. **User navigation** - Easy access to all sections
4. **Link equity** - Internal linking structure
5. **Mobile SEO** - Proper viewport settings

## ❓ Questions for Review:

1. **Contact page** - Do you have `/contact` route? If not, should I create one?
2. **Locations index** - Should `/locations` show a list of all states before content system?
3. **Default OG image** - Need to create `/public/og-default.jpg` placeholder?
4. **Activity categories** - Are the 6 categories I listed correct? Need changes?
5. **Footer social links** - Want to add Facebook, Instagram, LinkedIn?

Ready to implement? Let me know any changes!
