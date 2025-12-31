# Quick Setup Guide: SEO-Friendly Company URLs

Follow these steps to enable slug-based URLs for your companies.

## Step 1: Run Database Migration

In your Supabase SQL Editor, run:

```sql
-- Add slug column to companies table
ALTER TABLE companies ADD COLUMN slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_companies_slug ON companies(slug);
```

## Step 2: Populate Slugs for Existing Companies

Run the population script:

```bash
node scripts/run-slug-migration.js
```

Expected output:
```
🚀 Starting slug population for companies...

📊 Found 81 companies

✅ Generated slug for "MD Events Asia SDN BHD": md-events-asia
✅ Generated slug for "Team Building Pro": team-building-pro
...

==================================================
📈 Summary:
   ✅ Updated: 81
   ⏭️  Skipped: 0
   ❌ Errors: 0
==================================================

🎉 Slug population completed successfully!
```

## Step 3: Test the URLs

Visit a company page using the new slug format:
- Old: `http://localhost:3000/listings/company/{uuid}`
- New: `http://localhost:3000/listings/company/md-events-asia`

## Step 4: Verify Everything Works

1. Check the company listing cards link to slug URLs
2. Test the breadcrumb navigation
3. Verify company detail pages load correctly
4. Check that the contact form still works

## Troubleshooting

### Script fails with "Missing Supabase credentials"

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Slug generation creates duplicates

The system automatically handles duplicates by appending numbers:
- `company-name`
- `company-name-2`
- `company-name-3`

### Need to regenerate a slug

Delete the existing slug in the database and run the script again:
```sql
UPDATE companies SET slug = NULL WHERE id = 'your-company-id';
```

Then run: `node scripts/run-slug-migration.js`

## What Changed?

### Files Created:
- `lib/slug-utils.ts` - Slug generation utilities
- `lib/image-utils.ts` - Image URL transformation
- `scripts/run-slug-migration.js` - Bulk slug population script
- `app/listings/company/[slug]/page.tsx` - New slug-based company detail page
- `supabase/migrations/add_slug_to_companies.sql` - Database migration

### Files Modified:
- `lib/types.ts` - Added `slug: string` to Company interface
- `components/ListingCard.tsx` - Updated to use slug URLs for companies
- `DATABASE_SCHEMA.md` - Updated schema documentation

### URLs:
- Companies now use: `/listings/company/{slug}`
- Venues still use: `/listings/venue/{id}`
- Activities still use: `/listings/activity/{id}`

## Benefits

✅ **SEO-friendly URLs** - Better search engine rankings
✅ **Readable URLs** - Users can understand what the page is about
✅ **Better sharing** - Clean URLs on social media
✅ **Professional** - Modern URL structure

## Next Steps

After setup is complete:
1. Update any hardcoded links to use slug format
2. Consider implementing 301 redirects from old URLs
3. Submit new URLs to search engines
4. Update sitemap with new slug-based URLs
