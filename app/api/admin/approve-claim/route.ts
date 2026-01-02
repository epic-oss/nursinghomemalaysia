import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-helpers'

export async function POST(request: NextRequest) {
  try {
    const { claimRequestId } = await request.json()

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
      .select('*, companies(*)')
      .eq('id', claimRequestId)
      .single()

    if (fetchError || !claimRequest) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    // Check if already approved
    if (claimRequest.status === 'approved') {
      return NextResponse.json(
        { error: 'Claim request already approved' },
        { status: 400 }
      )
    }

    // Check if company is already claimed
    if (claimRequest.companies.user_id) {
      return NextResponse.json(
        { error: 'Company already claimed by another user' },
        { status: 400 }
      )
    }

    // Update the company's user_id
    const { error: updateError } = await supabaseAdmin
      .from('nursing_homes')
      .update({ user_id: claimRequest.user_id })
      .eq('id', claimRequest.nursing_home_id)

    if (updateError) {
      console.error('Error updating company:', updateError)
      return NextResponse.json(
        { error: 'Failed to update company ownership' },
        { status: 500 }
      )
    }

    // Update claim request status
    const { error: statusError } = await supabaseAdmin
      .from('claim_requests')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', claimRequestId)

    if (statusError) {
      console.error('Error updating claim request:', statusError)
      return NextResponse.json(
        { error: 'Failed to update claim request status' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to user
    // You can use Supabase Edge Functions or a third-party email service

    return NextResponse.json({
      success: true,
      message: 'Claim approved successfully',
    })

  } catch (error) {
    console.error('Error approving claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
