export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Terms of Service
        </h1>

        <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Team Building MY, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              2. Use of Service
            </h2>
            <p>
              Team Building MY provides a directory service connecting users with team building
              companies, venues, and activities in Malaysia. We do not directly provide team building
              services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              3. Listing Information
            </h2>
            <p>
              While we strive to maintain accurate and up-to-date information, we do not guarantee
              the accuracy, completeness, or reliability of any listing information. Users should
              verify details directly with service providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              4. User Responsibilities
            </h2>
            <p>Users agree to:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Provide accurate information when submitting inquiries</li>
              <li>Not misuse or abuse the platform</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              5. Limitation of Liability
            </h2>
            <p>
              Team Building MY is not responsible for any disputes, damages, or issues arising from
              transactions or interactions between users and listed service providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service
              constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              7. Contact
            </h2>
            <p>
              For questions about these terms, please contact us at{' '}
              <a href="mailto:hello@teambuildingmy.com" className="underline">
                hello@teambuildingmy.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
