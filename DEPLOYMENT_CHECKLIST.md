# 🚀 Deployment Checklist

## ✅ Code Pushed to GitHub Successfully!

Your code has been committed and pushed to GitHub:
```
Commit: 4c70a4e - Add authentication, claim listing, and premium subscription features
Repository: https://github.com/epic-oss/nursinghome.git
Branch: main
```

## 📋 Pre-Deployment Checklist

### 1. Environment Variables (CRITICAL)

When deploying to Vercel/production, you MUST add these environment variables:

#### Supabase Variables (Already have these):
```env
NEXT_PUBLIC_SUPABASE_URL=https://bgrtsijikctafnlqikzl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Stripe Variables (Choose Test or Live):

**For Testing (Recommended First):**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_YOUR_TEST_LINK
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

**For Production (When Ready):**
```env
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/YOUR_PAYMENT_LINK
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
```

### 2. Before You Can Deploy

You need to complete these steps first:

- [ ] **Create Stripe Payment Link**
  - Go to Stripe Dashboard → Payment Links
  - Create link for RM99/month recurring
  - Copy the link URL
  - Add to environment variables

- [ ] **Set Up Stripe Webhook**
  - After deploying, get your production URL
  - Go to Stripe Dashboard → Webhooks
  - Add endpoint: `https://yoursite.com/api/webhooks/stripe`
  - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy webhook signing secret
  - Add to environment variables

## 🔧 Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `epic-oss/nursinghome`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `directory`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add ALL variables listed in section 1 above
   - Make sure to use the correct values (test or live)
   - Click "Deploy"

5. **Wait for Deployment**
   - First build takes 2-3 minutes
   - Watch build logs for any errors

6. **Get Your Production URL**
   - Vercel will give you a URL like: `https://nursinghome-xxx.vercel.app`
   - You can also add a custom domain later

### Option 2: Deploy to Other Platforms

If using another platform (Netlify, Railway, etc.), you'll need to:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set root directory: `directory`
4. Add all environment variables
5. Deploy

## 📡 Post-Deployment Steps

### 1. Set Up Webhook (CRITICAL)

After deployment completes:

1. Copy your production URL from Vercel
2. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
3. Click "Add endpoint"
4. Enter: `https://your-production-url.com/api/webhooks/stripe`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Save and copy the **Signing Secret**
7. Go back to Vercel → Settings → Environment Variables
8. Update `STRIPE_WEBHOOK_SECRET` with the new secret
9. Redeploy (Vercel will auto-redeploy when env vars change)

### 2. Test the Deployment

1. **Visit your site**
   - Go to your production URL
   - Browse the directory

2. **Test Registration**
   - Register a new account
   - Verify email confirmation works

3. **Test Claim Listing**
   - Claim an existing listing
   - Check it appears in dashboard

4. **Test Premium Upgrade**
   - Go to `/dashboard/upgrade`
   - Click "Get Premium Now"
   - Use test card if in test mode
   - Verify upgrade works

### 3. Verify Everything Works

- [ ] Homepage loads correctly
- [ ] Search and filtering work
- [ ] Registration/login work
- [ ] Dashboard shows user listings
- [ ] Claim listing works
- [ ] Premium upgrade page loads
- [ ] Payment processing works
- [ ] Webhook receives events
- [ ] Premium badge shows on listings
- [ ] Premium listings appear first

## 🔍 Monitoring & Debugging

### Check Vercel Logs
- Go to Vercel Dashboard → Your Project → Logs
- Check for runtime errors
- Monitor webhook requests

### Check Stripe Webhook Logs
- Stripe Dashboard → Webhooks → [Your Endpoint] → Events
- Look for successful deliveries (200 status)
- Check for errors (400, 500 status)

### Common Issues

**Build Fails:**
- Check environment variables are set correctly
- Check build logs for specific errors
- Verify all dependencies are installed

**Webhook Not Working:**
- Verify webhook URL is correct
- Check webhook secret matches
- Look at Stripe webhook event logs
- Check Vercel function logs

**Premium Not Upgrading:**
- Check webhook is receiving events
- Verify database connection
- Check Supabase service role key is set

## 🎉 When Everything Works

Once deployed and tested:

1. **Announce to Users**
   - Premium subscriptions are live!
   - RM99/month for featured placement

2. **Monitor First Subscriptions**
   - Watch for first customers
   - Check webhook is processing correctly
   - Verify premium features work

3. **Collect Feedback**
   - Monitor user feedback
   - Check for any issues
   - Make improvements

## 🔄 Future Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically redeploy when you push to main branch.

## 📞 Support

If you encounter issues:
- Check Vercel logs
- Check Stripe webhook logs
- Review documentation files
- Check database for data

---

**Your app is ready to deploy!** 🚀

Start with Vercel deployment and test mode, then switch to live mode when ready.
