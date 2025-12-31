import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get the customer email and metadata
        const customerEmail = session.customer_email
        let userId = session.metadata?.user_id
        let companyId = session.metadata?.company_id

        // Fallback: If no metadata, try to find user by email and their company
        if (!userId || !companyId) {
          console.log('No metadata found, trying email fallback...')

          if (!customerEmail) {
            console.error('No metadata and no customer email')
            return NextResponse.json(
              { error: 'Missing required metadata and customer email' },
              { status: 400 }
            )
          }

          // Find user by email
          const { data: authData } = await supabase.auth.admin.listUsers()
          const user = authData.users.find(u => u.email === customerEmail)

          if (!user) {
            console.error(`No user found with email: ${customerEmail}`)
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            )
          }

          userId = user.id

          // Find the user's claimed company
          const { data: companies } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', userId)
            .limit(1)

          if (!companies || companies.length === 0) {
            console.error(`No company found for user: ${userId}`)
            return NextResponse.json(
              { error: 'No company found for this user' },
              { status: 404 }
            )
          }

          companyId = companies[0].id
          console.log(`✓ Found user ${userId} and company ${companyId} via email`)
        }

        // Update the company to be premium and featured
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            is_premium: true,
            is_featured: true,
            premium_since: new Date().toISOString(),
            featured_until: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days from now
          })
          .eq('id', companyId)
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating company:', updateError)
          return NextResponse.json(
            { error: 'Failed to update company' },
            { status: 500 }
          )
        }

        console.log(`✓ Company ${companyId} upgraded to premium`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id
        const companyId = subscription.metadata?.company_id

        if (!userId || !companyId) {
          console.error('Missing user_id or company_id in subscription metadata')
          break
        }

        // Check if subscription is active
        const isActive = subscription.status === 'active'

        await supabase
          .from('companies')
          .update({
            is_premium: isActive,
            is_featured: isActive,
          })
          .eq('id', companyId)
          .eq('user_id', userId)

        console.log(`✓ Company ${companyId} subscription updated: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id
        const companyId = subscription.metadata?.company_id

        if (!userId || !companyId) {
          console.error('Missing user_id or company_id in subscription metadata')
          break
        }

        // Deactivate premium and featured status
        await supabase
          .from('companies')
          .update({
            is_premium: false,
            is_featured: false,
          })
          .eq('id', companyId)
          .eq('user_id', userId)

        console.log(`✓ Company ${companyId} premium cancelled`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
