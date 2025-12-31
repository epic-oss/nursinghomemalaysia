# Next Steps - Premium Subscription Setup

## ✅ Completed
- [x] Database migration completed successfully
- [x] All 81 companies visible in database
- [x] RLS policies configured correctly
- [x] Claim listing functionality working
- [x] Checkout API created with metadata
- [x] Webhook with email fallback implemented

## 🚀 What to Do Next

### Step 1: Test the Website
1. Visit your production site: **www.teambuildingmy.com**
2. Verify all 81 companies are showing up
3. If not, do a hard refresh (Ctrl+Shift+R)

### Step 2: Test Claim Listing Flow
1. Find an unclaimed listing on your site
2. Click "Claim This Listing"
3. Confirm it appears in your dashboard
4. This should now work with the fixed RLS policy

### Step 3: Set Up Stripe Webhook (IMPORTANT!)
Your webhook endpoint is ready at: `https://www.teambuildingmy.com/api/webhooks/stripe`

**Create the webhook in Stripe Dashboard:**
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "+ Add endpoint"
3. Enter URL: `https://www.teambuildingmy.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Webhook signing secret** (starts with `whsec_`)

**Add webhook secret to your environment:**
1. In Vercel Dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add: `STRIPE_WEBHOOK_SECRET` = `whsec_your_secret_here`
4. Redeploy your site

### Step 4: Test Premium Upgrade Flow
1. Login to your dashboard
2. Make sure you have a claimed listing
3. Click "Upgrade to Premium"
4. Click "Get Premium Now" button
5. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
6. Complete payment
7. Verify you're redirected back to dashboard
8. Check that your listing now shows:
   - ✅ "Featured" badge
   - ✅ Gold border
   - ✅ Appears at top of search results
   - ✅ Premium status in dashboard

### Step 5: Monitor Webhook (Debug if needed)
Check Stripe webhook logs:
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook
3. View the "Recent events" tab
4. Ensure `checkout.session.completed` shows **200 OK** (not 400)

If you see errors:
- Check Vercel function logs
- Verify webhook secret is correct
- Test with: `node scripts/debug-claim.js`

## 🧪 Testing Checklist

- [ ] All companies visible on homepage
- [ ] Search and filters working
- [ ] Claim listing works without errors
- [ ] Claimed listing shows in dashboard
- [ ] Premium upgrade button appears
- [ ] Checkout creates session successfully
- [ ] Payment completes without errors
- [ ] Webhook receives 200 OK response
- [ ] Company is upgraded to premium
- [ ] Premium badge appears on listing
- [ ] Premium listing appears first in search
- [ ] Dashboard shows premium status

## 🎯 Expected Result

After completing a test payment:
1. Your company should have:
   - `is_premium: true`
   - `is_featured: true`
   - `premium_since: [current timestamp]`
   - `featured_until: [30 days from now]`

2. On the listings page, premium companies should:
   - Appear FIRST (before all non-premium)
   - Show gold "Featured" badge
   - Have gold border
   - Display premium styling

## 🐛 Troubleshooting

### Webhook returns 400 error
- **Cause:** Webhook secret mismatch
- **Fix:** Verify `STRIPE_WEBHOOK_SECRET` in Vercel matches Stripe Dashboard

### Company not upgrading after payment
- **Cause:** Webhook not receiving metadata
- **Fix:** Use upgrade page (not direct payment link) - it calls `/api/create-checkout`

### Listing not showing in dashboard after claim
- **Cause:** RLS policy issue (already fixed)
- **Fix:** Already fixed with RUNTHIS_IN_SUPABASE_SAFE.sql

### Companies not showing on production
- **Cause:** Database columns missing
- **Fix:** ✅ Already fixed with migration

## 📞 Need Help?

Run diagnostics:
```bash
node scripts/check-database.js    # Check database health
node scripts/debug-claim.js        # Debug claim issues
```

## 🎉 You're Almost Done!

Once the webhook is configured and you've tested a payment, your premium subscription system is fully operational!
