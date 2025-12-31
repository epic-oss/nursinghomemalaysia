export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          About Team Building MY
        </h1>

        <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400">
          <p>
            Welcome to Team Building MY, Malaysia's premier directory for team building companies,
            venues, and activities.
          </p>

          <p>
            We connect organizations with the best team building service providers across Malaysia,
            making it easy to find and book engaging experiences that strengthen teams and boost
            workplace morale.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Our Mission
          </h2>
          <p>
            To help Malaysian businesses build stronger, more cohesive teams by providing access to
            the best team building experiences the country has to offer.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            What We Offer
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Comprehensive directory of verified team building companies</li>
            <li>Detailed venue listings across all Malaysian states</li>
            <li>Wide range of activities for teams of all sizes</li>
            <li>HRDF claimable providers</li>
            <li>Direct contact with service providers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
