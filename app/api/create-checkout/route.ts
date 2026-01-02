import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { nursingHomeId } = await request.json()

    if (!nursingHomeId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Get the authenticated user
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the user owns this company
    const { data: company, error: companyError } = await supabase
      .from('nursing_homes')
      .select('id, name, user_id')
      .eq('id', nursingHomeId)
      .eq('user_id', user.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found or not owned by user' },
        { status: 404 }
      )
    }

    // Create Stripe checkout session with metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: `${user.id}_${nursingHomeId}`,
      metadata: {
        user_id: user.id,
        nursing_home_id: nursingHomeId,
        company_name: company.name,
      },
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: 'Premium Listing - Monthly',
              description: `Featured placement for ${company.name}`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 9900, // RM99.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/dashboard/upgrade?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
