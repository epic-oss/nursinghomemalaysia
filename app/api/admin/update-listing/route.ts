import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-helpers'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const body = await request.json()
    const {
      listingId,
      name,
      description,
      contact_phone,
      contact_email,
      website,
      location,
      state,
      average_rating,
      review_count,
      ,
      is_premium,
      is_featured,
    } = body

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: 'Company name must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!description || description.length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      )
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be less than 500 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contact_email || !emailRegex.test(contact_email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for admin operations
    const adminClient = createAdminClient()

    // Parse rating and review count (convert empty strings to null)
    const parsedRating = average_rating !== '' && average_rating !== null
      ? parseFloat(average_rating)
      : null
    const parsedReviewCount = review_count !== '' && review_count !== null
      ? parseInt(review_count, 10)
      : null

    // Validate rating if provided
    if (parsedRating !== null && (parsedRating < 1 || parsedRating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate review count if provided
    if (parsedReviewCount !== null && parsedReviewCount < 0) {
      return NextResponse.json(
        { error: 'Review count cannot be negative' },
        { status: 400 }
      )
    }

    // Update the listing (admin can update all fields)
    const { error: updateError } = await adminClient
      .from('nursing_homes')
      .update({
        name,
        description,
        contact_phone,
        contact_email,
        website: website || null,
        location,
        state,
        average_rating: parsedRating,
        review_count: parsedReviewCount,
        ,
        is_premium,
        is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)

    if (updateError) {
      console.error('Error updating listing:', updateError)
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
    })

  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
