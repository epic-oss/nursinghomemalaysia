# 📝 Markdown Content System - Implementation Plan

## 📦 Packages to Install

```bash
npm install next-mdx-remote gray-matter reading-time
npm install -D @types/mdx
```

## 📁 Folder Structure

```
/content
  /blog
    - team-building-benefits.md
    - virtual-team-building-guide.md
    - outdoor-activities-malaysia.md
  /locations
    - kuala-lumpur.md
    - penang.md
    - johor-bahru.md
```

## 📄 Sample Markdown Files

### Blog Post Example (`content/blog/team-building-benefits.md`)

```markdown
---
title: "10 Proven Benefits of Team Building Activities in Malaysia"
description: "Discover how team building activities can transform your workplace culture, boost productivity, and improve employee engagement in Malaysian companies."
date: "2024-01-15"
keywords: ["team building", "employee engagement", "workplace culture", "Malaysia"]
image: "/blog/team-building-benefits.jpg"
author: "Team Building MY"
readingTime: "5 min read"
---

# 10 Proven Benefits of Team Building Activities in Malaysia

Team building is more than just a fun day out of the office. Here's why Malaysian companies are investing in team building activities...

## 1. Improved Communication

Effective communication is the backbone of any successful team...

## 2. Increased Productivity

Studies show that engaged employees are up to 17% more productive...
```

### Location Page Example (`content/locations/kuala-lumpur.md`)

```markdown
---
title: "Team Building Activities in Kuala Lumpur"
description: "Explore the best team building venues and activities in Kuala Lumpur. From indoor workshops to outdoor adventures, find the perfect activity for your team."
date: "2024-01-10"
keywords: ["Kuala Lumpur team building", "KL corporate events", "team activities KL"]
image: "/locations/kuala-lumpur.jpg"
location: "Kuala Lumpur"
state: "Kuala Lumpur"
---

# Team Building Activities in Kuala Lumpur

Kuala Lumpur, Malaysia's bustling capital, offers a diverse range of team building activities for companies of all sizes...

## Why Choose Kuala Lumpur for Team Building?

- **Central location** - Easily accessible from anywhere in Malaysia
- **Diverse venues** - From high-rise hotels to outdoor parks
- **Professional providers** - Experienced team building companies
```

## 🎨 Component Structure

### 1. Utility Functions (`lib/mdx.ts`)

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  image?: string
  author?: string
  content: string
  readingTime: string
}

export interface LocationPage {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  image?: string
  location: string
  state: string
  content: string
}

export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  const fileNames = fs.readdirSync(postsDirectory)

  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        keywords: data.keywords || [],
        image: data.image,
        author: data.author,
        content,
        readingTime: readingTime(content).text,
      }
    })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/blog', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      keywords: data.keywords || [],
      image: data.image,
      author: data.author,
      content,
      readingTime: readingTime(content).text,
    }
  } catch {
    return null
  }
}

export function getLocationPages(): LocationPage[] {
  const locationsDirectory = path.join(process.cwd(), 'content/locations')
  const fileNames = fs.readdirSync(locationsDirectory)

  const locations = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(locationsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        keywords: data.keywords || [],
        image: data.image,
        location: data.location,
        state: data.state,
        content,
      }
    })

  return locations
}

export function getLocationPage(slug: string): LocationPage | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/locations', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      keywords: data.keywords || [],
      image: data.image,
      location: data.location,
      state: data.state,
      content,
    }
  } catch {
    return null
  }
}
```

### 2. MDX Renderer Component (`components/MDXContent.tsx`)

```typescript
'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

const components = {
  h1: (props: any) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 mt-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-7 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  li: (props: any) => (
    <li className="leading-7" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" {...props} />
  ),
  code: (props: any) => (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" {...props} />
  ),
  pre: (props: any) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-50 dark:bg-zinc-950" {...props} />
  ),
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
```

### 3. Blog Index Page (`app/blog/page.tsx`)

```typescript
import { getBlogPosts } from '@/lib/mdx'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team Building Blog | Insights & Tips | Team Building MY',
  description: 'Expert insights, tips, and guides for planning successful team building activities in Malaysia.',
  keywords: ['team building blog', 'corporate events', 'team activities Malaysia'],
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Team Building Blog
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Expert insights, tips, and guides for successful team building
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {post.image && (
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
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

                <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {post.title}
                </h2>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>

                <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-12 text-center text-zinc-600 dark:text-zinc-400">
            No blog posts found. Check back soon!
          </div>
        )}
      </div>
    </div>
  )
}
```

### 4. Blog Post Page (`app/blog/[slug]/page.tsx`)

```typescript
import { getBlogPost, getBlogPosts } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { serialize } from 'next-mdx-remote/serialize'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Team Building MY`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const mdxSource = await serialize(post.content)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          {' > '}
          <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Blog
          </Link>
          {' > '}
          <span className="text-zinc-900 dark:text-zinc-50">{post.title}</span>
        </nav>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
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

        {/* Content */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <MDXContent source={mdxSource} />
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
```

### 5. Location Page (`app/locations/[slug]/page.tsx`)

```typescript
import { getLocationPage, getLocationPages } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { serialize } from 'next-mdx-remote/serialize'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import type { Metadata } from 'next'

interface LocationPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const locations = getLocationPages()
  return locations.map((location) => ({
    slug: location.slug,
  }))
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = getLocationPage(params.slug)

  if (!location) {
    return {
      title: 'Location Not Found',
    }
  }

  return {
    title: `${location.title} | Team Building MY`,
    description: location.description,
    keywords: location.keywords,
    openGraph: {
      title: location.title,
      description: location.description,
      images: location.image ? [location.image] : [],
    },
  }
}

async function getCompaniesInState(state: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('state', state)
    .order('is_premium', { ascending: false })
    .limit(6)

  return data || []
}

export default async function LocationPage({ params }: LocationPageProps) {
  const location = getLocationPage(params.slug)

  if (!location) {
    notFound()
  }

  const mdxSource = await serialize(location.content)
  const companies = await getCompaniesInState(location.state)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          {' > '}
          <Link href="/listings" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Listings
          </Link>
          {' > '}
          <span className="text-zinc-900 dark:text-zinc-50">{location.location}</span>
        </nav>

        {/* Content Section */}
        <div className="mb-16 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <MDXContent source={mdxSource} />
        </div>

        {/* Companies Section */}
        {companies.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Featured Companies in {location.location}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <ListingCard
                  key={company.id}
                  listing={company}
                  type="company"
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={`/listings?state=${encodeURIComponent(location.state)}`}
                className="inline-block rounded-md bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View All Companies in {location.location}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## 🎯 Key Features

1. **SEO Optimized**
   - Dynamic meta tags using Next.js Metadata API
   - OpenGraph tags for social sharing
   - Keyword support
   - Proper heading structure

2. **Performance**
   - Static generation with `generateStaticParams`
   - Optimized images with Next.js Image
   - Fast MDX rendering

3. **Developer Experience**
   - Simple markdown files
   - Frontmatter for metadata
   - Type-safe with TypeScript
   - Reusable components

4. **User Experience**
   - Beautiful typography
   - Responsive design
   - Dark mode support
   - Reading time estimates
   - Breadcrumb navigation

## 📋 Review Checklist

- [ ] Does the folder structure make sense?
- [ ] Are the frontmatter fields appropriate?
- [ ] Is the styling consistent with your existing theme?
- [ ] Do you want any additional features (tags, categories, search)?
- [ ] Should we add a related posts section?
- [ ] Do you want author profiles?

Please review and let me know if you'd like any changes before I implement!
