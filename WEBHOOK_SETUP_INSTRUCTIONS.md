# Stripe Webhook Setup Instructions

## ✅ What's Already Done

Your Stripe keys have been added to `.env.local`:
- ✅ `STRIPE_SECRET_KEY` - Live mode secret key
- ✅ `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` - Payment link for RM99/month
- ⏳ `STRIPE_WEBHOOK_SECRET` - **You need to add this next**

The webhook endpoint is already built at: `/api/webhooks/stripe`

## 🔧 How to Get Your Webhook Secret

### Step 1: Deploy Your App (or Test Locally)

#### Option A: Deploy to Production (Recommended)
1. Deploy your app to Vercel/your hosting
2. Get your production URL (e.g., `https://yoursite.com`)

#### Option B: Test Locally with Stripe CLI
```bash
# Install Stripe CLI (if not already installed)
# Windows
scoop install stripe

# Mac
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Step 2: Create Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Live Mode** (toggle in top right)
3. Navigate to: **Developers → Webhooks**
4. Click **Add endpoint**

### Step 3: Configure the Webhook

**Endpoint URL:**
- Production: `https://yoursite.com/api/webhooks/stripe`
- Local testing: Stripe CLI will give you the URL

**Events to listen to** (select these 3):
```
✓ checkout.session.completed
✓ customer.subscription.updated
✓ customer.subscription.deleted
```

**Description** (optional):
```
Premium subscription webhook for Team Building MY directory
```

### Step 4: Get the Signing Secret

1. After creating the webhook, you'll see the webhook details page
2. Under **Signing secret**, click **Reveal**
3. Copy the secret (starts with `whsec_`)
4. Update your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

### Step 5: Update Payment Link Metadata (Important!)

Your payment link needs to pass `user_id` and `company_id` to the webhook. Here's how:

#### Option A: Use Client Reference ID (Simpler)

When a user clicks "Get Premium Now", we need to know which company to upgrade.

**Quick Fix:** Update the upgrade page to pass company ID:

In `app/dashboard/upgrade/page.tsx`, change the payment link to include metadata:

```typescript
// Instead of direct link, create a form that submits to Stripe
<form action={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} method="GET">
  <input type="hidden" name="client_reference_id" value={`${user.id}_${companies[0]?.id}`} />
  <button type="submit">Get Premium Now</button>
</form>
```

Then update the webhook to parse this ID.

#### Option B: Use Stripe Checkout API (Better, requires code change)

Create a server action that generates a custom checkout session with metadata. See `STRIPE_SETUP_GUIDE.md` for full details.

### Step 6: Test the Webhook

1. Make sure your app is running
2. Go to `/dashboard/upgrade`
3. Click "Get Premium Now"
4. Complete test payment with card: `4242 4242 4242 4242`
5. Check Stripe Dashboard → Webhooks → Events
6. You should see `checkout.session.completed` event
7. Check your database - company should have `is_premium = true`

### Step 7: Verify It's Working

After payment:
- [ ] Dashboard shows "Current Plan: Premium"
- [ ] Listing has gold "Premium" badge
- [ ] Listing appears FIRST in search results
- [ ] Listing has gold border
- [ ] Database shows `is_premium = true` and `is_featured = true`

## 🚨 Important Notes

### Security
- Never commit `.env.local` to git
- Keep your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` secret
- Only share these keys through secure channels

### Testing vs Live Mode
- You're using **Live Mode** keys
- Real payments will be charged
- Test thoroughly before announcing to users

### Webhook Verification
The webhook endpoint automatically verifies requests using the webhook secret. This prevents unauthorized requests from updating your database.

## 🐛 Troubleshooting

### Webhook not receiving events?
1. Check Stripe Dashboard → Webhooks → [Your Webhook] → Events
2. Look for failed deliveries
3. Click on event to see response details

### Company not upgrading?
1. Check webhook event log in Stripe
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check server logs for errors
4. Verify metadata is being passed correctly

### Payment succeeded but webhook didn't fire?
1. Make sure webhook is in **Live Mode** (not test mode)
2. Verify webhook URL is correct
3. Check that you selected the right events

## 📞 Need Help?

- Stripe Documentation: https://stripe.com/docs/webhooks
- Webhook Testing Guide: https://stripe.com/docs/webhooks/test
- Stripe Support: https://support.stripe.com

---

## Quick Checklist

- [x] Stripe keys added to `.env.local`
- [ ] Deploy app to production (or run locally with Stripe CLI)
- [ ] Create webhook in Stripe Dashboard
- [ ] Add webhook secret to `.env.local`
- [ ] Update payment link to pass metadata
- [ ] Test payment flow
- [ ] Verify premium upgrade works

Once you get the webhook secret, just update line 9 in `.env.local` and you're done!
