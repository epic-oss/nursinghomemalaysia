# 🧪 Testing Guide - Stripe Premium Subscription

## ✅ Build Status: SUCCESSFUL

Your production build completed successfully with all features working!

```
✓ Compiled successfully
✓ TypeScript checks passed
✓ All routes generated
✓ Webhook endpoint ready at /api/webhooks/stripe
```

## 🔑 Test Mode Configuration

I've configured your `.env.local` with **TEST MODE** keys for safe testing:

```env
STRIPE_SECRET_KEY=sk_test_51SVrTG3b8mgauXiQ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SVrTG3b8mgauXiQ...
```

**This means:**
- ✅ No real money will be charged
- ✅ Safe to test unlimited times
- ✅ Use test card numbers only
- ✅ Switch to live keys when ready

## 🚀 Step-by-Step Testing

### Step 1: Create a Test Payment Link

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) (make sure you're in **Test Mode**)
2. Navigate to **Payment Links**
3. Click **Create payment link**
4. Configure:
   - **Product**: Premium Listing
   - **Price**: RM 99.00 MYR
   - **Billing**: Recurring - Monthly
   - **After payment**: Redirect to `http://localhost:3000/dashboard`
5. Click **Create link**
6. Copy the payment link URL (starts with `https://buy.stripe.com/test_`)
7. Update `.env.local` line 9:
   ```env
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_YOUR_LINK_HERE
   ```

### Step 2: Set Up Test Webhook

#### Option A: Use Stripe CLI (Easiest for local testing)

1. **Install Stripe CLI** (if not already installed):
   ```bash
   # Windows (via Scoop)
   scoop install stripe

   # Mac (via Homebrew)
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Start your development server**:
   ```bash
   npm run dev
   ```

4. **Forward webhooks in a new terminal**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Copy the webhook secret** from the output (starts with `whsec_`) and update `.env.local` line 10:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

6. **Restart your dev server** to load the new environment variable

#### Option B: Deploy and Use Real Webhook (For deployed testing)

1. Deploy to Vercel/hosting
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://yoursite.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy signing secret and update `.env.local`

### Step 3: Run the Test Flow

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Register a test account**:
   - Go to `http://localhost:3000/register`
   - Create a test account (use fake email like `test@example.com`)

3. **Create or claim a company**:
   - Browse listings at `http://localhost:3000`
   - Click "Claim This Listing" on any company
   - OR submit a new company at `/submit`

4. **Go to dashboard**:
   - Navigate to `http://localhost:3000/dashboard`
   - You should see "Current Plan: Free"

5. **Click "Upgrade to Premium"**:
   - You'll be taken to `/dashboard/upgrade`
   - Review the benefits
   - Click "Get Premium Now"

6. **Complete test payment**:
   - You'll be redirected to Stripe checkout
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
   - Click "Subscribe"

7. **Verify upgrade**:
   - You'll be redirected back to `/dashboard`
   - Dashboard should show "Current Plan: Premium" with gold badge
   - Your listing should have "Premium" badge with gold border
   - Listing should appear FIRST in search results

### Step 4: Verify Webhook

1. **Check Stripe CLI output** (if using CLI):
   ```
   --> charge.succeeded [evt_xxxxx]
   --> checkout.session.completed [evt_xxxxx]
   <-- [200] POST http://localhost:3000/api/webhooks/stripe [evt_xxxxx]
   ```

2. **Or check Stripe Dashboard** → Webhooks → [Your Endpoint] → Events
   - Look for `checkout.session.completed` event
   - Status should be "Succeeded"
   - Click event to see request/response

3. **Check database**:
   ```sql
   SELECT id, name, is_premium, is_featured, premium_since
   FROM companies
   WHERE user_id = 'your-test-user-id';
   ```

## 🧪 Test Card Numbers

### Successful Payments
- **Basic card**: `4242 4242 4242 4242`
- **3D Secure**: `4000 0027 6000 3184`

### Failed Payments
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

### All Test Cards
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any postal code

## ✅ What to Check After Payment

### In Dashboard (`/dashboard`):
- [ ] Premium status banner shows "Current Plan: Premium"
- [ ] Gold star icon in banner
- [ ] Stats show correct counts

### In Directory (`/` or `/listings`):
- [ ] Your listing has gold "Premium" badge
- [ ] Listing has 2px gold border with shadow
- [ ] Listing appears FIRST (before all other listings)

### In Database:
```sql
SELECT
  name,
  is_premium,
  is_featured,
  premium_since,
  featured_until
FROM companies
WHERE is_premium = true;
```

Should show:
- `is_premium = true`
- `is_featured = true`
- `premium_since = [timestamp of payment]`
- `featured_until = [30 days from payment]`

### In Stripe Dashboard:
- [ ] Customer created
- [ ] Subscription active
- [ ] Payment successful
- [ ] Webhook delivered successfully

## 🔄 Test Subscription Lifecycle

### Test Cancellation:
1. Go to Stripe Dashboard → Customers
2. Find test customer
3. Cancel subscription
4. Check that `is_premium` and `is_featured` are set to `false`
5. Verify listing no longer has premium badge

### Test Renewal:
1. Wait for webhook: `customer.subscription.updated`
2. Verify subscription stays active
3. Check `featured_until` is extended

## 🐛 Troubleshooting

### Webhook not receiving events?
```bash
# Check Stripe CLI is running
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Verify webhook secret in .env.local
# Restart dev server after changing .env.local
```

### Company not upgrading?
1. Check Stripe webhook logs for errors
2. Check browser console for errors
3. Check server logs: `npm run dev` output
4. Verify `STRIPE_WEBHOOK_SECRET` is correct

### Payment link not working?
1. Verify link is in test mode
2. Check link is active in Stripe Dashboard
3. Update `.env.local` with correct link
4. Restart dev server

### Premium badge not showing?
1. Refresh the page (hard refresh: Ctrl+Shift+R)
2. Check database: `SELECT * FROM companies WHERE id = 'company-id'`
3. Verify `is_premium = true` in database

## 🎯 Success Criteria

Before going live, verify ALL of these:

- [x] Build completes successfully ✅
- [x] TypeScript compiles without errors ✅
- [x] Webhook endpoint created ✅
- [ ] Test payment completes successfully
- [ ] Webhook receives and processes event
- [ ] Company upgrades to premium in database
- [ ] Dashboard shows premium status
- [ ] Listing has premium badge and gold border
- [ ] Listing appears first in search
- [ ] Cancellation works correctly
- [ ] No console errors
- [ ] No server errors

## 🚀 Going Live

Once all tests pass:

1. **Switch to Live Mode**:
   - Comment out test keys in `.env.local`
   - Uncomment live keys (lines 12-14)
   - Create live payment link in Stripe
   - Set up live webhook endpoint
   - Update webhook secret

2. **Deploy to Production**:
   ```bash
   git add .
   git commit -m "Add premium subscription feature"
   git push
   ```

3. **Test one real payment** (you can refund it)

4. **Announce to users** that premium subscriptions are available!

## 📊 Monitoring

After going live, monitor:
- Stripe Dashboard → Events (webhook deliveries)
- Stripe Dashboard → Subscriptions (active subs)
- Database → Premium companies count
- User feedback

---

**Ready to test!** Start with Step 1 above and work through the testing flow. 🎉
