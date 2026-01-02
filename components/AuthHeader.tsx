'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function AuthHeader() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo/Brand */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Nursing Home MY
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700 dark:text-zinc-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/listings"
            className="text-sm font-semibold leading-6 text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Browse Companies
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

        {/* CTA/Auth Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                <span>{user.user_metadata?.full_name || user.email}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Log in
              </Link>
              <Link
                href="/submit"
                className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Submit Your Company
              </Link>
            </>
          )}
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
              Browse Companies
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

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/submit"
                  className="mt-3 block rounded-md bg-zinc-900 px-4 py-2.5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submit Your Company
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
