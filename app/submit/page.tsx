import { VendorSubmissionForm } from '@/components/VendorSubmissionForm'

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Submit Your Facility
          </h1>
          <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
            Join Malaysia's leading nursing home directory and reach thousands of families seeking quality care.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Why List Your Facility?
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                ✓ Increased Visibility
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get discovered by families looking for quality elderly care services across Malaysia
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                ✓ Direct Inquiries
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Receive inquiries directly from interested families through our platform
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                ✓ SEO-Friendly URLs
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Benefit from clean, search-engine optimized URLs for better rankings
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                ✓ Quality Badge
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Showcase your quality care status to attract families
              </p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Application Form
          </h2>
          <VendorSubmissionForm />
        </div>
      </div>
    </div>
  )
}
