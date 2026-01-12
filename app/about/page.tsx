import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Nursing Home Malaysia',
  description: 'Learn about Nursing Home Malaysia - helping families find quality elderly care facilities across Malaysia since 2024.',
  openGraph: {
    title: 'About Us | Nursing Home Malaysia',
    description: 'Learn about Nursing Home Malaysia - helping families find quality elderly care facilities across Malaysia.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            About Nursing Home Malaysia
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Helping Malaysian families find quality elderly care
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-12 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Our Mission
          </h2>
          <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
            Finding the right nursing home for a loved one is one of the most important
            decisions a family can make. We believe every Malaysian family deserves
            access to clear, honest information about elderly care options.
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Our mission is to make this process easier by providing a comprehensive
            directory of nursing homes across Malaysia, complete with transparent
            pricing, verified information, and helpful resources to guide families
            through this important decision.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            What We Do
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Comprehensive Directory
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We maintain a detailed database of nursing homes across all Malaysian
                states, from budget-friendly options to premium care facilities.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Verified Information
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Each listing is verified for accuracy, including JKM registration status,
                services offered, and pricing information.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Educational Resources
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Our guides cover everything from choosing the right facility to
                understanding costs and navigating the admission process.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Cost Calculator
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Our free calculator helps families estimate nursing home costs based on
                location, care level, and specific needs.
              </p>
            </div>
          </div>
        </div>

        {/* Why We Started Section */}
        <div className="mb-12 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Why We Started
          </h2>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Malaysia&apos;s elderly population is growing rapidly. By 2030, over 15% of
            Malaysians will be aged 60 and above. Yet finding quality elderly care
            remains challenging for many families.
          </p>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Information is scattered across multiple sources. Pricing is often unclear.
            Families don&apos;t know what questions to ask or what standards to expect.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            We built Nursing Home Malaysia to solve these problems - to be the trusted
            resource families turn to when making this important decision.
          </p>
        </div>

        {/* Our Values Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Our Values
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white dark:bg-teal-500">
                1
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Transparency</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We believe families deserve honest, accurate information about costs,
                  services, and facility quality.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white dark:bg-teal-500">
                2
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Compassion</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We understand this is an emotional journey. Every interaction is
                  handled with care and empathy.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white dark:bg-teal-500">
                3
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Accessibility</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Quality elderly care information should be available to everyone,
                  regardless of budget or background.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-12 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Get in Touch
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Have questions or suggestions? We&apos;d love to hear from you. Whether you&apos;re
            a family looking for guidance or a nursing home wanting to be listed,
            we&apos;re here to help.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/submit"
              className="rounded-md bg-teal-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              List Your Facility
            </Link>
            <Link
              href="/listings"
              className="rounded-md border border-zinc-300 px-6 py-3 text-center font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Browse Nursing Homes
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">100+</div>
            <div className="text-zinc-600 dark:text-zinc-400">Nursing Homes Listed</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">14</div>
            <div className="text-zinc-600 dark:text-zinc-400">States Covered</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Free</div>
            <div className="text-zinc-600 dark:text-zinc-400">For Families</div>
          </div>
        </div>
      </div>
    </div>
  )
}
