import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('nursing_homes')
      .select('user_id, is_premium')
      .eq('id', listingId)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this listing' },
        { status: 403 }
      )
    }

    if (!listing.is_premium) {
      return NextResponse.json(
        { error: 'This listing is not premium' },
        { status: 400 }
      )
    }

    // Cancel premium (keep listing claimed, just remove premium features)
    const { error: updateError } = await supabase
      .from('nursing_homes')
      .update({
        is_premium: false,
        is_featured: false,
      })
      .eq('id', listingId)
      .eq('user_id', user.id) // Additional security check

    if (updateError) {
      console.error('Error canceling premium:', updateError)
      return NextResponse.json(
        { error: `Failed to cancel premium: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Premium subscription canceled successfully',
    })

  } catch (error) {
    console.error('Error canceling premium:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
