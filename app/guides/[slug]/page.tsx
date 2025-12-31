import { getBlogPost, getBlogPosts } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { ArticleSchema, BreadcrumbSchema } from '@/components/JsonLd'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { BackToTop } from '@/components/blog/BackToTop'
import { processTemplateVariables } from '@/lib/date-utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

// Only allow slugs that exist in content/blog - return 404 for all others
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: 'Guide Not Found',
    }
  }

  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/guides/${post.slug}`

  const processedTitle = processTemplateVariables(post.title)
  const processedDescription = processTemplateVariables(post.description)

  return {
    title: `${processedTitle} | Team Building MY`,
    description: processedDescription,
    keywords: post.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: processedTitle,
      description: processedDescription,
      type: 'article',
      publishedTime: post.date,
      url: pageUrl,
      siteName: 'Team Building MY',
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: processedTitle,
      description: processedDescription,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = 'https://www.teambuildingmy.com'
  const pageUrl = `${baseUrl}/guides/${post.slug}`
  const processedTitle = processTemplateVariables(post.title)
  const processedDescription = processTemplateVariables(post.description)

  const showTOC = post.headings.length >= 5

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ArticleSchema
        title={processedTitle}
        description={processedDescription}
        publishedDate={post.date}
        author={post.author}
        url={pageUrl}
        image={post.image}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Guides', url: `${baseUrl}/guides` },
          { name: processedTitle, url: pageUrl },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className={showTOC ? 'lg:flex lg:gap-8' : ''}>
          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                Home
              </Link>
              {' > '}
              <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                Guides
              </Link>
              {' > '}
              <span className="text-zinc-900 dark:text-zinc-50">{processedTitle}</span>
            </nav>

            {/* Header */}
            <header className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
              <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {processedTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>•</span>
                <span>{post.readingTime}</span>
                {post.author && (
                  <>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>
            </header>

            {/* Mobile TOC */}
            {showTOC && (
              <div className="lg:hidden">
                <TableOfContents headings={post.headings} />
              </div>
            )}

            {/* Content */}
            <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <MDXContent source={post.content} />
            </div>

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link
                href="/guides"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Guides
              </Link>
            </div>
          </article>

          {/* Desktop TOC Sidebar */}
          {showTOC && (
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={post.headings} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
