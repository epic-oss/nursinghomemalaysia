# Team Building Directory - Setup Guide

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
2. Select a table (companies, venues, or activities)
3. Click "Insert row" to add sample data

**Example Company:**
```
name: "Adventure Team Malaysia"
description: "Leading team building company specializing in outdoor adventures and corporate training programs."
contact_email: "info@adventureteam.my"
contact_phone: "+60 12-345 6789"
location: "Kuala Lumpur"
state: "Kuala Lumpur"
price_range: "RM 500 - RM 2000 per person"
services: ["Outdoor Adventures", "Corporate Training", "Leadership Development"]
featured: true
```

**Example Venue:**
```
name: "Port Dickson Beach Resort"
description: "Beautiful beachfront resort perfect for team building activities with modern facilities."
contact_email: "events@pdresort.my"
location: "Jalan Pantai, Port Dickson"
city: "Port Dickson"
state: "Negeri Sembilan"
capacity: 200
price_range: "RM 3000 - RM 8000 per day"
amenities: ["Beach Access", "Meeting Rooms", "Outdoor Spaces", "Accommodation"]
venue_type: "Resort"
featured: true
```

**Example Activity:**
```
name: "Amazing Race Challenge"
description: "Fast-paced team competition combining physical and mental challenges across the city."
category: "Outdoor"
duration: "4-6 hours"
group_size: "20-100 people"
price_range: "RM 150 per person"
difficulty_level: "Moderate"
objectives: ["Team Bonding", "Communication", "Problem Solving", "Fun & Engagement"]
suitable_for: ["Corporate Teams", "Schools", "Organizations"]
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
3. Select the table you want to edit (companies, venues, activities)
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
