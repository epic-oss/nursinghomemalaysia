import { getBlogPosts } from '@/lib/mdx'
import { processTemplateVariables } from '@/lib/date-utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team Building Guides | Insights & Tips | Team Building MY',
  description: 'Expert insights, tips, and guides for planning successful team building activities in Malaysia. Learn best practices and discover new ideas.',
  keywords: ['team building guides', 'corporate events Malaysia', 'team activities tips', 'employee engagement'],
}

export default function GuidesPage() {
  const posts = getBlogPosts()
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Team Building Guides
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Expert insights, tips, and guides for successful team building
          </p>
        </div>

        {/* Featured Guide */}
        <div className="mb-12">
          <Link
            href="/guides/best-team-building-companies-malaysia"
            className="group block overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all hover:border-blue-400 hover:shadow-xl dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950 dark:hover:border-blue-600"
          >
            <div className="p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Featured Guide
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Updated {new Date().toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 sm:text-3xl">
                15 Best Team Building Companies in Malaysia ({currentYear})
              </h2>

              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                Compare Malaysia&apos;s top-rated team building companies. We reviewed 80+ providers across KL, Selangor, Penang & JB. Find HRDF-claimable options, pricing & real client reviews.
              </p>

              <div className="flex items-center gap-4 text-sm">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Live Rankings
                </span>
                <span className="inline-flex items-center text-zinc-600 dark:text-zinc-400">
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  8 min read
                </span>
              </div>

              <div className="mt-6 inline-flex items-center font-semibold text-blue-600 dark:text-blue-400">
                View the rankings
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          All Guides
        </h2>

        {/* Standalone Guides + Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Team Building Exercises Guide */}
          <Link
            href="/guides/team-building-exercises-malaysia"
            className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime="2025-10-01">
                  {new Date('2025-10-01').toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>•</span>
                <span>10 min read</span>
              </div>

              <h2 className="mb-3 text-xl font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                30 Best Team Building Exercises Malaysia
              </h2>

              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Best team building exercises in Malaysia. Indoor games, outdoor challenges, trust activities & problem-solving tasks. Free ideas + professional providers.
              </p>

              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                By Team Building MY
              </div>

              <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read more →
              </div>
            </div>
          </Link>

          {/* HRDF Training Provider Guide */}
          <Link
            href="/guides/team-building-training-provider-malaysia"
            className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime="2025-09-24">
                  {new Date('2025-09-24').toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>•</span>
                <span>8 min read</span>
              </div>

              <h2 className="mb-3 text-xl font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                Team Building Training Provider Malaysia
              </h2>

              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Find HRDF-registered team building training providers in Malaysia. Learn what distinguishes training providers from regular vendors.
              </p>

              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                By Team Building MY
              </div>

              <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read more →
              </div>
            </div>
          </Link>

          {/* MDX Blog Posts */}
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/guides/${post.slug}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-MY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>

                <h2 className="mb-3 text-xl font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {processTemplateVariables(post.title)}
                </h2>

                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {processTemplateVariables(post.description)}
                </p>

                {post.author && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    By {post.author}
                  </div>
                )}

                <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
