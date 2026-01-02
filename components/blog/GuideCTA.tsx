'use client'

import Link from 'next/link'
import { Calculator, FileText } from 'lucide-react'

type CTAVariant = 'quote' | 'calculator'

interface GuideCTAProps {
  /** Headline text - defaults based on variant */
  headline?: string
  /** Description text */
  description?: string
  /** Button text - defaults based on variant */
  buttonText?: string
  /** Link destination - defaults to /calculator */
  href?: string
  /** Visual variant: 'quote' (blue) or 'calculator' (green) */
  variant?: CTAVariant
  /** Optional context (e.g., location name) to customize messaging */
  context?: string
}

const variantConfig = {
  quote: {
    icon: FileText,
    defaultHeadline: 'Get Your Custom Quote',
    defaultDescription: 'Get personalized quotes from verified providers.',
    defaultButtonText: 'Get Free Quotes →',
    bgClass: 'bg-blue-50 dark:bg-blue-950/50',
    borderClass: 'border-blue-200 dark:border-blue-800',
    iconClass: 'text-blue-600 dark:text-blue-400',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  calculator: {
    icon: Calculator,
    defaultHeadline: 'Calculate Your Budget',
    defaultDescription: 'Use our free calculator to estimate costs for your team size and preferences.',
    defaultButtonText: 'Try the Calculator →',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
}

/**
 * GuideCTA - A styled call-to-action component for guide articles
 *
 * Usage in MDX files:
 * ```mdx
 * import { GuideCTA } from '@/components/blog/GuideCTA'
 *
 * <GuideCTA variant="quote" context="Penang" />
 *
 * <GuideCTA
 *   variant="calculator"
 *   headline="Plan Your Budget"
 *   description="Custom description here"
 * />
 * ```
 *
 * Or use the simple markdown blockquote format (auto-styled):
 * ```markdown
 * > **📋 Get Your Custom Quote**
 * >
 * > Planning nursing home? Get personalized quotes from verified providers.
 * >
 * > **[Get Free Quotes →](/calculator)**
 * ```
 */
export function GuideCTA({
  headline,
  description,
  buttonText,
  href = '/calculator',
  variant = 'quote',
  context,
}: GuideCTAProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  // Build contextual defaults
  const displayHeadline = headline || (context
    ? `Planning ${context} Nursing Home?`
    : config.defaultHeadline)

  const displayDescription = description || (context
    ? `Get personalized quotes from verified ${context} providers.`
    : config.defaultDescription)

  const displayButtonText = buttonText || config.defaultButtonText

  return (
    <div className={`my-8 rounded-xl border-2 ${config.borderClass} ${config.bgClass} p-6 not-prose`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 rounded-lg bg-white p-2 shadow-sm dark:bg-zinc-900 ${config.iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h4 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {displayHeadline}
          </h4>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            {displayDescription}
          </p>

          <Link
            href={href}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-colors ${config.buttonClass}`}
          >
            {displayButtonText}
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Pre-configured CTA variants for common use cases
 */
export function QuoteCTA({ context, ...props }: Omit<GuideCTAProps, 'variant'>) {
  return <GuideCTA variant="quote" context={context} {...props} />
}

export function CalculatorCTA({ context, ...props }: Omit<GuideCTAProps, 'variant'>) {
  return <GuideCTA variant="calculator" context={context} {...props} />
}
