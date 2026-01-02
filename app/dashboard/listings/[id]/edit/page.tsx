export const dynamic = 'force-dynamic'

import { getUserProfile } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { EditListingForm } from '@/components/EditListingForm'
import { redirect } from 'next/navigation'

async function getListing(listingId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nursing_homes')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', userId) // Verify ownership
    .single()

  return { data, error }
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUserProfile()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const { data: listing, error } = await getListing(id, user.id)

  if (error || !listing) {
    redirect('/dashboard') // Listing not found or user doesn't own it
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Edit Listing
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Update your business information
          </p>
        </div>

        {/* Edit Form */}
        <EditListingForm listing={listing} />
      </div>
    </div>
  )
}
