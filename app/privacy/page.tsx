export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              1. Information We Collect
            </h2>
            <p>We collect information you provide when you:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Submit inquiry forms to contact service providers</li>
              <li>Submit your company for listing</li>
              <li>Contact us via email</li>
            </ul>
            <p className="mt-3">
              This may include your name, email address, phone number, company name, and message
              content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              2. How We Use Your Information
            </h2>
            <p>We use the collected information to:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Forward your inquiries to the relevant service providers</li>
              <li>Process company listing submissions</li>
              <li>Respond to your questions and support requests</li>
              <li>Improve our directory service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              3. Information Sharing
            </h2>
            <p>
              We share your contact information with nursing home service providers when you submit
              an inquiry through our platform. We do not sell your personal information to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              5. Cookies and Analytics
            </h2>
            <p>
              We may use cookies and similar technologies to improve user experience and analyze site
              traffic. You can control cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              7. Children's Privacy
            </h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              8. Changes to Privacy Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of any
              material changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              9. Contact Us
            </h2>
            <p>
              For privacy-related questions or requests, please contact us at{' '}
              <a href="mailto:hello@nursinghomemy.com" className="underline">
                hello@nursinghomemy.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
