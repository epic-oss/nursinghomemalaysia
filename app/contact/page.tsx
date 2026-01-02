export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">Contact Us</h1>

        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            Have questions or need assistance? We'd love to hear from you.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Email</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                <a
                  href="mailto:hello@nursinghomemalaysia.com"
                  className="text-zinc-900 underline dark:text-zinc-50"
                >
                  hello@nursinghomemalaysia.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                For Business Inquiries
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                If you're a nursing home operator interested in listing your facility, please visit
                our{' '}
                <a href="/submit" className="text-zinc-900 underline dark:text-zinc-50">
                  Submit Your Facility
                </a>{' '}
                page.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Response Time
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
