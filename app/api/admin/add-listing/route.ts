import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      location,
      state,
      contact_phone,
      contact_email,
      website,
      description
    } = body

    // Validate required fields
    if (!name || !location || !state || !contact_email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Generate a unique slug
    let slug = generateSlug(name)

    // Check if slug exists and make it unique if needed
    const { data: existingSlug } = await adminClient
      .from('nursing_homes')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existingSlug) {
      // Add timestamp to make unique
      slug = `${slug}-${Date.now()}`
    }

    // Insert new company
    const { data, error } = await adminClient
      .from('nursing_homes')
      .insert({
        name,
        slug,
        location,
        state,
        contact_phone: contact_phone || null,
        contact_email,
        website: website || null,
        description,
        featured: false,
        is_featured: false,
        is_premium: false,
        average_rating: null,
        review_count: 0,
        user_id: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding listing:', error)
      return NextResponse.json(
        { error: 'Failed to add listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in add-listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
