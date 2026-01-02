import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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

    // Get the listing and verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('nursing_homes')
      .select('*')
      .eq('id', listingId)
      .single()

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: `Listing not found: ${fetchError.message}` },
        { status: 404 }
      )
    }

    if (!listing) {
      console.error('No listing data returned')
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Verify user owns this listing
    if (listing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this listing' },
        { status: 403 }
      )
    }

    // Use admin client to bypass RLS for the update
    const supabaseAdmin = createAdminClient()

    // Unclaim the listing
    const { error: updateError } = await supabaseAdmin
      .from('nursing_homes')
      .update({
        user_id: null,
        is_premium: false,
        is_featured: false,
      })
      .eq('id', listingId)

    if (updateError) {
      console.error('Error unclaiming listing:', updateError)
      return NextResponse.json(
        { error: `Failed to unclaim listing: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('Successfully unclaimed listing:', listingId)

    return NextResponse.json({
      success: true,
      message: 'Listing unclaimed successfully',
    })

  } catch (error) {
    console.error('Error unclaiming listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
