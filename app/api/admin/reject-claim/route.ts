import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-helpers'

export async function POST(request: NextRequest) {
  try {
    const { claimRequestId, reason } = await request.json()

    if (!claimRequestId) {
      return NextResponse.json(
        { error: 'Missing claim request ID' },
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

    // Check if user is admin
    const adminStatus = await isAdmin()
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient()

    // Get the claim request
    const { data: claimRequest, error: fetchError } = await supabaseAdmin
      .from('claim_requests')
      .select('*')
      .eq('id', claimRequestId)
      .single()

    if (fetchError || !claimRequest) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (claimRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Claim request already ${claimRequest.status}` },
        { status: 400 }
      )
    }

    // Update claim request status to rejected
    const { error: updateError } = await supabaseAdmin
      .from('claim_requests')
      .update({
        status: 'rejected',
        admin_notes: reason || 'No reason provided',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', claimRequestId)

    if (updateError) {
      console.error('Error updating claim request:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject claim request' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to user explaining rejection
    // You can use Supabase Edge Functions or a third-party email service

    return NextResponse.json({
      success: true,
      message: 'Claim rejected successfully',
    })

  } catch (error) {
    console.error('Error rejecting claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
