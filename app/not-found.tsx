import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-md text-center text-zinc-600 dark:text-zinc-400">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Go Home
        </Link>
        <Link
          href="/listings"
          className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Browse Listings
        </Link>
      </div>
    </div>
  )
}
