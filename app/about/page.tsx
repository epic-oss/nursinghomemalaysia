export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          About Nursing Home Malaysia
        </h1>

        <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400">
          <p>
            Welcome to Nursing Home Malaysia, Malaysia's premier directory for nursing home facilities and elderly care services.
          </p>

          <p>
            We connect families with the best elderly care service providers across Malaysia,
            making it easy to find and book quality care facilities that provide compassionate support for your loved ones.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Our Mission
          </h2>
          <p>
            To help Malaysian families find quality elderly care by providing access to
            the best nursing homes and care facilities the country has to offer.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            What We Offer
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Comprehensive directory of verified nursing homes</li>
            <li>Detailed facility listings across all Malaysian states</li>
            <li>Wide range of care services for different needs</li>
            <li>Quality care providers</li>
            <li>Direct contact with care facilities</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
