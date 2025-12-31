# Stripe Premium Subscription Setup Guide

## Overview
This guide will help you set up Stripe to handle premium subscriptions for your directory. Users can upgrade to Premium for RM99/month to get featured placement.

## What's Been Built

### 1. **Database Changes**
- Added `is_premium` and `premium_since` columns to companies table
- Premium companies are automatically featured
- Database trigger syncs premium status to featured status

### 2. **Premium Features**
- **Featured Placement**: Premium listings appear first in search results
- **Premium Badge**: Gold "Premium" badge with gradient background
- **Gold Border**: Visual distinction with yellow border and shadow
- **Priority in Search**: Listings sorted by: is_premium → is_featured → featured → created_at

### 3. **User-Facing Pages**
- `/dashboard/upgrade` - Premium sales page with benefits and pricing
- Dashboard shows current plan status (Free/Premium)
- "Upgrade to Premium" CTA button for free users

### 4. **Webhook Integration**
- Stripe webhook endpoint at `/api/webhooks/stripe`
- Handles checkout completion, subscription updates, and cancellations
- Automatically updates company premium status

## Stripe Setup Steps

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (required for live payments)
3. For testing, you can use Test Mode

### Step 2: Get Your API Keys

#### For Testing (Test Mode):
1. In Stripe Dashboard, toggle to "Test mode" (top right)
2. Go to **Developers → API keys**
3. Copy these keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

#### For Production (Live Mode):
1. Toggle to "Live mode"
2. Go to **Developers → API keys**
3. Copy these keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Step 3: Add Keys to Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys (Test Mode - for development)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_xxxxx

# Stripe Webhook Secret (get this in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 4: Create a Payment Link

We're using **Option A: External Stripe Payment Link** for simplicity.

1. In Stripe Dashboard, go to **Payment Links**
2. Click **Create payment link**
3. Configure the payment link:
   - **Product name**: "Premium Listing - Monthly"
   - **Price**: RM 99.00
   - **Billing**: Recurring (monthly)
   - **After payment**: Redirect to `https://yourdomain.com/dashboard`

4. In **Advanced settings**:
   - Enable "Collect customer email"
   - Enable "Allow promotion codes" (optional)

5. Click **Create link**
6. Copy the payment link URL
7. Add it to `.env.local` as `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`

### Step 5: Set Up Webhook

#### Testing Locally with Stripe CLI:

1. Install Stripe CLI:
   ```bash
   # Windows (via Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Mac (via Homebrew)
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`

#### Production Webhook Setup:

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add to your production environment variables

### Step 6: Pass Metadata in Payment Link

IMPORTANT: The webhook needs `user_id` and `company_id` to work correctly.

**Method 1: Dynamic Payment Links (Recommended)**

Create a server action to generate custom Stripe Checkout sessions:

```typescript
// app/actions/create-checkout.ts
'use server'

import { requireAuth } from '@/lib/auth-helpers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function createCheckoutSession(companyId: string) {
  const user = await requireAuth()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      company_id: companyId,
    },
    line_items: [
      {
        price: 'price_xxxxx', // Your Stripe Price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade`,
  })

  return session.url
}
```

Then update the upgrade page button to call this action.

**Method 2: Pre-fill Payment Links**

When creating the payment link, use URL parameters:
```
https://buy.stripe.com/test_xxxxx?client_reference_id={USER_ID}_{COMPANY_ID}
```

Then in the webhook, parse the `client_reference_id`.

### Step 7: Test the Integration

#### Test Cards (Test Mode Only):

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC

#### Testing Flow:

1. Register a test user account
2. Claim or create a test company listing
3. Go to `/dashboard/upgrade`
4. Click "Get Premium Now"
5. Complete test payment with card 4242...
6. Webhook should fire and update company to premium
7. Check dashboard - should show "Current Plan: Premium"
8. Listing should appear first in search with Premium badge

### Step 8: Go Live

When ready for production:

1. Complete Stripe account verification
2. Switch to Live mode in Stripe Dashboard
3. Get live API keys
4. Create live payment link
5. Set up production webhook endpoint
6. Update environment variables with live keys
7. Test with real payment (you can refund it)

## Webhook Endpoint Details

The webhook at `/api/webhooks/stripe/route.ts` handles:

### Events:
1. **checkout.session.completed**: When payment succeeds
   - Sets `is_premium = true`
   - Sets `is_featured = true`
   - Sets `premium_since` timestamp
   - Sets `featured_until` to 30 days from now

2. **customer.subscription.updated**: When subscription changes
   - Updates premium/featured status based on subscription status

3. **customer.subscription.deleted**: When subscription is cancelled
   - Sets `is_premium = false`
   - Sets `is_featured = false`

## Environment Variables Summary

```env
# Required for Premium Features
STRIPE_SECRET_KEY=sk_test_or_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxxx

# Already existing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Troubleshooting

### Webhook not firing:
- Check Stripe Dashboard → Developers → Webhooks → Events log
- Verify webhook URL is correct
- Ensure STRIPE_WEBHOOK_SECRET is set correctly

### Company not upgrading after payment:
- Check webhook logs in Stripe Dashboard
- Verify metadata (user_id, company_id) is passed correctly
- Check server logs for errors

### Premium badge not showing:
- Refresh the page
- Check database - is `is_premium = true`?
- Verify ListingCard component receives updated data

## Support

For Stripe integration issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For code issues, check the webhook logs and database state.
