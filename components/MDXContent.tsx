import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { slugify } from '@/lib/slugify'
import { processTemplateVariables } from '@/lib/date-utils'
import { GuideCTA, QuoteCTA, CalculatorCTA } from '@/components/blog/GuideCTA'

interface MDXContentProps {
  source: string
}

// Helper to generate ID from heading content
function getHeadingId(children: any): string {
  const text = typeof children === 'string'
    ? children
    : Array.isArray(children)
    ? children.join('')
    : ''
  return slugify(text)
}

// Helper to extract text content from React children
function extractTextContent(children: any): string {
  if (typeof children === 'string') {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }
  if (children?.props?.children) {
    return extractTextContent(children.props.children)
  }
  return ''
}

const components = {
  h1: (props: any) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  h2: (props: any) => {
    const id = getHeadingId(props.children)
    return (
      <h2 id={id} className="mb-4 mt-8 scroll-mt-20 text-3xl font-bold text-zinc-900 dark:text-zinc-50" {...props} />
    )
  },
  h3: (props: any) => {
    const id = getHeadingId(props.children)
    return (
      <h3 id={id} className="mb-3 mt-6 scroll-mt-20 text-2xl font-semibold text-zinc-900 dark:text-zinc-50" {...props} />
    )
  },
  h4: (props: any) => (
    <h4 className="mb-2 mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50" {...props} />
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
  blockquote: (props: any) => {
    // Check if this is a CTA blockquote (contains emoji + bold headline pattern)
    const content = props.children
    const textContent = extractTextContent(content)

    // Detect CTA patterns: starts with emoji like 📋 or 💰
    const isCTA = /^[\u{1F4CB}\u{1F4B0}\u{1F4DD}\u{2705}]/u.test(textContent.trim())

    if (isCTA) {
      // Determine variant based on emoji
      const isCalculator = /[\u{1F4B0}]/u.test(textContent)
      const bgClass = isCalculator
        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
        : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'

      return (
        <div className={`my-8 rounded-xl border-2 p-6 not-prose ${bgClass}`}>
          <div className="[&>p]:mb-2 [&>p]:text-zinc-700 [&>p]:dark:text-zinc-300 [&>p:first-child]:mb-3 [&>p:first-child]:text-lg [&>p:first-child]:font-bold [&>p:first-child]:text-zinc-900 [&>p:first-child]:dark:text-zinc-50 [&>p:last-child]:mb-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-lg [&_a]:bg-blue-600 [&_a]:px-5 [&_a]:py-2.5 [&_a]:font-semibold [&_a]:text-white [&_a]:no-underline [&_a]:transition-colors [&_a]:hover:bg-blue-700 [&_a]:hover:text-white">
            {props.children}
          </div>
        </div>
      )
    }

    // Standard blockquote styling
    return (
      <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" {...props} />
    )
  },
  code: (props: any) => (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" {...props} />
  ),
  pre: (props: any) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-50 dark:bg-zinc-950" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  em: (props: any) => (
    <em className="italic" {...props} />
  ),
  table: (props: any) => (
    <div className="mb-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-200 border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-zinc-50 dark:bg-zinc-900" {...props} />
  ),
  tbody: (props: any) => (
    <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950" {...props} />
  ),
  tr: (props: any) => (
    <tr {...props} />
  ),
  th: (props: any) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50" {...props} />
  ),
  td: (props: any) => (
    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  // Custom components available in MDX
  GuideCTA,
  QuoteCTA,
  CalculatorCTA,
}

export function MDXContent({ source }: MDXContentProps) {
  // Process template variables like {{currentYear}}
  const processedSource = processTemplateVariables(source)

  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <MDXRemote
        source={processedSource}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  )
}
