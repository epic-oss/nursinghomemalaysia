import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-helpers'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const listingId = formData.get('listingId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${listingId}-${Date.now()}.${ext}`
    const filePath = `logos/${filename}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient
      .storage
      .from('company-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = adminClient
      .storage
      .from('company-assets')
      .getPublicUrl(filePath)

    const logoUrl = urlData.publicUrl

    // Update the company record with the new logo URL
    const { error: updateError } = await adminClient
      .from('nursing_homes')
      .update({
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', listingId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update listing with logo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      logo_url: logoUrl,
    })

  } catch (error) {
    console.error('Error uploading logo:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
