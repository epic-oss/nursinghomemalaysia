'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ClaimResult {
  success: boolean
  error?: string
}

export async function claimVendor(vendorId: string): Promise<ClaimResult> {
  // Validate input
  if (!vendorId || typeof vendorId !== 'string') {
    return { success: false, error: 'Invalid vendor ID' }
  }

  // Get current user
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be logged in to claim a listing' }
  }

  // Use admin client to bypass RLS for the claim operation
  const adminClient = createAdminClient()

  // Check if vendor exists and is not already claimed
  const { data: vendor, error: vendorError } = await adminClient
    .from('companies')
    .select('id, name, user_id')
    .eq('id', vendorId)
    .single()

  if (vendorError || !vendor) {
    return { success: false, error: 'Listing not found' }
  }

  if (vendor.user_id) {
    if (vendor.user_id === user.id) {
      return { success: false, error: 'You have already claimed this listing' }
    }
    return { success: false, error: 'This listing has already been claimed by another user' }
  }

  // Check if user already has a claimed listing (optional: allow multiple claims)
  // Uncomment if you want to limit users to one listing
  // const { data: existingClaim } = await adminClient
  //   .from('companies')
  //   .select('id, name')
  //   .eq('user_id', user.id)
  //   .single()
  //
  // if (existingClaim) {
  //   return { success: false, error: `You have already claimed ${existingClaim.name}. Contact support to claim additional listings.` }
  // }

  // Claim the vendor
  const { error: updateError } = await adminClient
    .from('companies')
    .update({
      user_id: user.id,
    })
    .eq('id', vendorId)
    .is('user_id', null) // Extra safety: only update if still unclaimed

  if (updateError) {
    console.error('Error claiming vendor:', updateError)
    return { success: false, error: 'Failed to claim listing. Please try again.' }
  }

  // Revalidate relevant pages
  revalidatePath('/dashboard')
  revalidatePath('/listings')
  revalidatePath(`/claim`)

  return { success: true }
}
