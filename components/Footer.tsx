import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link
            href="/about"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Contact
          </Link>
          <Link
            href="/terms"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Privacy
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>&copy; {currentYear} Nursing Home MY. All rights reserved.</p>
        </div>

        {/* Optional: Additional info */}
        <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
          <p>Your trusted directory for nursing home companies in Malaysia</p>
        </div>
      </div>
    </footer>
  )
}
