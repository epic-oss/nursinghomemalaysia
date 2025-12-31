import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-helpers'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Delete the listing
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('id', listingId)

    if (deleteError) {
      console.error('Error deleting listing:', deleteError)
      return NextResponse.json(
        { error: `Failed to delete listing: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
