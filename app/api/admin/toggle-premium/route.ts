import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-helpers'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const { listingId, isPremium } = await request.json()

    if (!listingId || typeof isPremium !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update premium status
    const { error: updateError } = await supabase
      .from('nursing_homes')
      .update({
        is_premium: isPremium,
        is_featured: isPremium, // Also update featured status
      })
      .eq('id', listingId)

    if (updateError) {
      console.error('Error updating premium status:', updateError)
      return NextResponse.json(
        { error: `Failed to update premium status: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Premium status ${isPremium ? 'enabled' : 'disabled'} successfully`,
    })

  } catch (error) {
    console.error('Error toggling premium:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
