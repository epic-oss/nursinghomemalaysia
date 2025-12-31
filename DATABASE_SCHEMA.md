# Database Schema for Supabase

This document describes the tables to create in Supabase Studio.

## Tables

### 1. companies

Team building service providers and organizers.

```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique, -- URL-safe slug for SEO-friendly URLs
  name text not null,
  description text not null,
  contact_email text not null,
  contact_phone text,
  website text,
  logo_url text,
  images text[], -- Array of image URLs
  average_rating numeric(3,2), -- Average rating (0.00 to 5.00)
  review_count integer, -- Number of reviews
  location text not null, -- City or state in Malaysia
  state text not null, -- Malaysian state
  price_range text, -- e.g., "RM 500 - RM 2000"
  services text[], -- Array of services offered
  category text,
  activities text,
  featured boolean default false,
  hrdf_claimable boolean,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 2. venues

Locations where team building activities can be held.

```sql
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  contact_email text not null,
  contact_phone text,
  website text,
  images text[], -- Array of image URLs
  location text not null, -- Full address
  state text not null, -- Malaysian state
  city text not null,
  capacity integer, -- Maximum number of people
  price_range text, -- e.g., "RM 1000 - RM 5000 per day"
  amenities text[], -- Array of amenities
  venue_type text, -- e.g., "Indoor", "Outdoor", "Resort", "Hotel"
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 3. activities

Specific team building activities and packages.

```sql
create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null, -- e.g., "Outdoor", "Indoor", "Virtual", "Sports"
  duration text, -- e.g., "2 hours", "Full day"
  group_size text, -- e.g., "10-50 people"
  price_range text, -- e.g., "RM 50 per person"
  difficulty_level text, -- e.g., "Easy", "Moderate", "Challenging"
  images text[], -- Array of image URLs
  objectives text[], -- Array of objectives/learning outcomes
  requirements text, -- Special requirements or equipment
  suitable_for text[], -- Array of suitable groups
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 4. inquiries

Contact form submissions from users.

```sql
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null, -- 'company', 'venue', or 'activity'
  listing_id uuid not null,
  listing_name text not null, -- Denormalized for easy reference
  name text not null,
  email text not null,
  phone text,
  company_name text,
  message text not null,
  preferred_date text,
  group_size text,
  created_at timestamp with time zone default now()
);
```

## Indexes

Create indexes for better query performance:

```sql
-- Companies
create index idx_companies_slug on companies(slug);
create index idx_companies_state on companies(state);
create index idx_companies_featured on companies(featured);

-- Venues
create index idx_venues_state on venues(state);
create index idx_venues_venue_type on venues(venue_type);
create index idx_venues_featured on venues(featured);

-- Activities
create index idx_activities_category on activities(category);
create index idx_activities_featured on activities(featured);

-- Inquiries
create index idx_inquiries_created_at on inquiries(created_at desc);
create index idx_inquiries_listing on inquiries(listing_type, listing_id);
```

## Row Level Security (RLS)

Enable RLS and create policies for public read access:

```sql
-- Enable RLS
alter table companies enable row level security;
alter table venues enable row level security;
alter table activities enable row level security;
alter table inquiries enable row level security;

-- Public read access for listings
create policy "Public read access" on companies for select using (true);
create policy "Public read access" on venues for select using (true);
create policy "Public read access" on activities for select using (true);

-- Only authenticated users can insert inquiries
create policy "Anyone can submit inquiries" on inquiries for insert with check (true);
```

## Sample Data

### Malaysian States
- Johor
- Kedah
- Kelantan
- Kuala Lumpur
- Labuan
- Melaka
- Negeri Sembilan
- Pahang
- Penang
- Perak
- Perlis
- Putrajaya
- Sabah
- Sarawak
- Selangor
- Terengganu
