# Database Schema for Supabase

This document describes the tables to create in Supabase Studio.

## Tables

### 1. nursing_homes

Elderly care facilities and nursing home providers.

```sql
create table nursing_homes (
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
  services text,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 2. facilities

Elderly care facilities and service locations.

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

### 3. services

Specific elderly care services and packages.

```sql
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null, -- e.g., "Residential Care", "Day Care", "Rehabilitation", "Medical"
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
  listing_type text not null, -- 'nursing_home', 'facility', or 'service'
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
-- Nursing Homes
create index idx_nursing_homes_slug on nursing_homes(slug);
create index idx_nursing_homes_state on nursing_homes(state);
create index idx_nursing_homes_featured on nursing_homes(featured);

-- Facilities
create index idx_facilities_state on facilities(state);
create index idx_facilities_venue_type on facilities(venue_type);
create index idx_facilities_featured on facilities(featured);

-- Services
create index idx_services_category on services(category);
create index idx_services_featured on services(featured);

-- Inquiries
create index idx_inquiries_created_at on inquiries(created_at desc);
create index idx_inquiries_listing on inquiries(listing_type, listing_id);
```

## Row Level Security (RLS)

Enable RLS and create policies for public read access:

```sql
-- Enable RLS
alter table nursing_homes enable row level security;
alter table facilities enable row level security;
alter table services enable row level security;
alter table inquiries enable row level security;

-- Public read access for listings
create policy "Public read access" on nursing_homes for select using (true);
create policy "Public read access" on facilities for select using (true);
create policy "Public read access" on services for select using (true);

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
