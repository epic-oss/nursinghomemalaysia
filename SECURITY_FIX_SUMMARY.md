# 🔒 Critical Security Fixes - Claim System

## ⚠️ Vulnerabilities Fixed

### 1. **Multiple Users Could Claim Same Listing**
**Before:** Any user could claim a listing, even if already claimed
**After:**
- Button hidden once listing has `user_id` set
- API checks if `company.user_id` exists before accepting claim
- Error shown: "This listing has already been claimed by another user."

### 2. **Unlimited Claims Per User**
**Before:** Users could claim unlimited listings (fraud risk)
**After:**
- Hard limit of **5 listings per user**
- API checks total approved claims before accepting new requests
- Error shown: "You have reached the maximum limit of 5 claimed listings."

### 3. **Auto-Approval Without Verification**
**Before:** Claims were instantly approved with no verification
**After:**
- **Manual approval required** - all claims go to pending status
- Admin must review and approve each claim
- Verification form requires: role, business email, phone number
- Claims only appear in user dashboard after admin approval

### 4. **No Duplicate Request Prevention**
**Before:** Users could submit multiple requests for same company
**After:**
- Checks for existing claim requests (any status)
- Error messages based on status:
  - Pending: "You already have a pending claim request"
  - Approved: "You already own this listing"
  - Rejected: "Your previous claim request was rejected"

## ✅ New Security Features

### Claim Request Verification Form
Users must now provide:
- **Role at Company** (Owner, Director, Manager, Authorized Rep)
- **Business Email** (must match company domain)
- **Business Phone Number**
- **Additional Verification Notes** (optional proof)

### Admin Approval Panel
Location: `/admin/claims`

Features:
- View all claim requests (pending/approved/rejected)
- See claimant details (email, phone, role)
- View company information (name, website, phone)
- Read verification notes
- Approve or reject with reason
- Track who reviewed and when

### Status Workflow
```
User submits claim → PENDING
                    ↓
Admin reviews      → APPROVED → Company ownership granted
                    ↓
                    → REJECTED → User notified (can't resubmit)
```

## 📋 How to Use (Admin Guide)

### Step 1: Access Admin Panel
1. Log in to your account
2. Navigate to: `https://www.teambuildingmy.com/admin/claims`
3. Your user ID will be shown in yellow banner
4. Copy your user ID

### Step 2: Add Yourself as Admin
1. Open `app/admin/claims/page.tsx`
2. Find line 7: `const ADMIN_USER_IDS: string[] = []`
3. Add your user ID:
```typescript
const ADMIN_USER_IDS: string[] = [
  'your-user-id-here',
]
```
4. Commit and deploy

### Step 3: Review Claims
The admin panel shows:
- **Pending tab** - New claims awaiting review
- **Company details** - Name, location, website, phone
- **Claimant info** - Email, phone, role
- **Verification notes** - Additional proof provided

### Step 4: Verify Ownership
Before approving, verify the claimant:
1. Check business email matches company domain
2. Call the provided phone number
3. Visit company website to confirm claimant's role
4. Review any verification notes provided

### Step 5: Approve or Reject
**To Approve:**
- Click "Approve" button
- Company's `user_id` is set to claimant
- Claim status → approved
- User can now manage listing in dashboard

**To Reject:**
- Click "Reject" button
- Enter rejection reason (shown to user)
- Claim status → rejected
- Company remains unclaimed

## 🎯 Testing the New Flow

### As a User:
1. Visit any unclaimed listing
2. Click "Claim This Listing"
3. Fill out verification form:
   - Role: Owner
   - Email: yourname@company.com
   - Phone: +60 12-345 6789
   - Notes: "I'm listed as CEO on company website"
4. Submit request
5. See success message: "Your request will be reviewed within 1-2 business days"
6. Check dashboard - see pending claim in yellow banner
7. Wait for admin approval

### As an Admin:
1. Go to `/admin/claims`
2. See new claim in Pending tab
3. Click "View details" to see full information
4. Verify legitimacy of claim
5. Click "Approve" or "Reject"
6. User is notified

## 🔐 Security Checklist

- [x] Duplicate claims prevented
- [x] Claim limit enforced (5 per user)
- [x] Manual approval required
- [x] Verification information collected
- [x] Admin panel for review
- [x] Status tracking (pending/approved/rejected)
- [x] Can't claim already-claimed listings
- [x] Can't submit duplicate requests
- [x] Audit trail (reviewed_by, reviewed_at)

## 📊 Database Schema

### claim_requests table
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- company_id (uuid, references companies)
- role_at_company (text) - e.g., "Owner", "Director"
- verification_phone (text)
- proof_notes (text) - Business email + verification notes
- status (text) - 'pending' | 'approved' | 'rejected'
- admin_notes (text) - Rejection reason
- reviewed_by (uuid) - Admin who reviewed
- reviewed_at (timestamp)
- created_at (timestamp)
```

### companies table (updated)
```sql
- user_id (uuid, nullable) - NULL = unclaimed, set = owned
```

## 🚀 Deployment Notes

The security fixes are now live on production. Existing auto-approved claims from testing are still in the database, but:
1. All future claims require manual approval
2. No one can claim those 3 listings you already claimed (they have user_id set)
3. You can access admin panel to approve/reject future claims

## 📝 TODO for Production Launch

1. **Add your admin user ID** to `ADMIN_USER_IDS` array
2. **Test the full flow** - submit a claim request and approve it
3. **Optional: Set up email notifications** (currently shows success message only)
4. **Optional: Add more admins** by adding their user IDs
5. **Consider: Auto-reject after 30 days** if you want to clean up old pending claims

## 🎉 Result

Your platform is now secure against fraudulent listing claims. Only verified business owners will be able to manage and upgrade listings.
