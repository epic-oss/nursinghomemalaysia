'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reset Password</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to receive a password reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                <p className="font-medium">Check your email</p>
                <p className="mt-1">We've sent a password reset link to <strong>{email}</strong></p>
              </div>
              <Link
                href="/login"
                className="block w-full rounded-md bg-zinc-900 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-teal-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
