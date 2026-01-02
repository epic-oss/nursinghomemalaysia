# Nursing Home Directory - Setup Guide

## Quick Start

### 1. Install Dependencies

Already installed, but if needed:

```bash
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

3. **Configure Environment Variables**

   Create a `.env.local` file in the root directory:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Create Database Tables

1. Open Supabase Studio (your project dashboard)
2. Go to SQL Editor
3. Copy and paste the SQL from `DATABASE_SCHEMA.md`
4. Run each `create table` statement
5. Run the index creation statements
6. Run the RLS (Row Level Security) statements

### 4. Add Sample Data

In Supabase Studio:

1. Go to Table Editor
2. Select a table (nursing_homes, facilities, or services)
3. Click "Insert row" to add sample data

**Example Nursing Home:**
```
name: "Golden Years Care Centre"
description: "Leading elderly care facility specializing in residential care and rehabilitation programs."
contact_email: "info@goldenyears.my"
contact_phone: "+60 12-345 6789"
location: "Kuala Lumpur"
state: "Kuala Lumpur"
price_range: "RM 500 - RM 2000 per month"
services: ["Residential Care", "Medical Care", "Rehabilitation Services"]
featured: true
```

**Example Facility:**
```
name: "Sunshine Elderly Care Center"
description: "Modern care facility with professional staff and comprehensive elderly care services."
contact_email: "care@sunshinecare.my"
location: "Jalan Utama, Petaling Jaya"
city: "Petaling Jaya"
state: "Selangor"
capacity: 50
price_range: "RM 3000 - RM 8000 per month"
amenities: ["Medical Care", "Physiotherapy", "Recreational Activities", "24/7 Nursing"]
venue_type: "Residential Care Facility"
featured: true
```

**Example Service:**
```
name: "Day Care Program"
description: "Comprehensive day care services for seniors with medical supervision and activities."
category: "Day Care Services"
duration: "8 hours daily"
group_size: "10-30 people"
price_range: "RM 150 per day"
difficulty_level: "Easy"
objectives: ["Health Monitoring", "Social Interaction", "Physical Activities", "Mental Stimulation"]
suitable_for: ["Seniors", "Elderly with Mobility", "Active Seniors"]
featured: true
```

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

- **Home Page** (`/`) - Hero section with featured listings
- **Listings Page** (`/listings`) - Browse all listings with search and filters
- **Detail Pages** (`/listings/[type]/[id]`) - Individual listing details with contact form

## Managing Content

All content is managed through Supabase Studio:

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the table you want to edit (nursing_homes, facilities, services)
4. Add, edit, or delete rows as needed
5. Changes appear immediately on the website

## Features

✅ Search and filter by name, location, category
✅ Featured listings on homepage
✅ Detailed listing pages with images and information
✅ Contact/inquiry forms for each listing
✅ Fully responsive design
✅ Dark mode support

## Next Steps

1. Add more sample data to populate the directory
2. Upload actual images (use Supabase Storage or external URLs)
3. Customize styling and branding
4. Add more features as needed

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- See `CLAUDE.md` for technical details
