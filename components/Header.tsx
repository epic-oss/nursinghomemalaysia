'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        {/* Logo/Brand */}
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="Nursing Home Malaysia"
              width={280}
              height={70}
              className="h-[50px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 dark:text-zinc-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          <Link
            href="/listings"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Browse Facilities
          </Link>
          <Link
            href="/locations"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Locations
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Calculator
          </Link>
          <Link
            href="/guides"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Guides
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            About
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            List Your Facility
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-zinc-200 px-4 pb-3 pt-2 dark:border-zinc-800">
            <Link
              href="/listings"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Facilities
            </Link>
            <Link
              href="/locations"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Locations
            </Link>
            <Link
              href="/calculator"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link
              href="/guides"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/submit"
              className="mt-4 block rounded-md bg-zinc-900 px-3 py-2 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              List Your Facility
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
