import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Admin and dashboard pages
          '/admin/*',
          '/dashboard/*',
          '/api/*',
          // Auth pages
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/auth/*',
          // Non-existent routes (block crawlers from indexing fake URLs)
          '/category/*',
          '/categories/*',
          '/location/*',
          '/features/*',
          '/feature/*',
          '/tag/*',
          '/tags/*',
        ],
      },
    ],
    sitemap: 'https://www.teambuildingmy.com/sitemap.xml',
  }
}
