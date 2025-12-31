# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Team Building Directory for Malaysia - A comprehensive directory application for discovering team building companies, venues, and activities across Malaysia. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router
- **React**: 19.2.0
- **TypeScript**: v5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Geist Sans and Geist Mono (loaded via next/font/google)

## Project Structure

- `app/` - Next.js App Router pages
  - `page.tsx` - Home page with hero, categories, and featured listings
  - `layout.tsx` - Root layout with font configuration
  - `listings/` - Listings pages
    - `page.tsx` - Main listings page with search and filtering
    - `[type]/[id]/page.tsx` - Dynamic detail pages for companies, venues, activities
- `components/` - Reusable React components
  - `ListingCard.tsx` - Card component for displaying listings
  - `SearchFilter.tsx` - Client component for search and filtering
  - `ContactForm.tsx` - Inquiry form component with Server Actions
- `lib/` - Utility functions and configurations
  - `supabase/` - Supabase client setup
    - `client.ts` - Browser client
    - `server.ts` - Server client for Server Components
  - `types.ts` - TypeScript type definitions
  - `actions.ts` - Server Actions for form submissions
- `DATABASE_SCHEMA.md` - Complete database schema documentation
- `.env.example` - Environment variables template

## TypeScript Configuration

- Uses path alias `@/*` pointing to root directory
- Target: ES2017 with ESNext modules
- Strict mode enabled
- JSX set to `react-jsx` (React 19 automatic JSX transform)

## Styling Architecture

Tailwind CSS v4 with custom CSS variables defined in `globals.css`:
- `--background` and `--foreground` for theme colors
- Automatic dark mode support via `prefers-color-scheme`
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## ESLint Configuration

Uses Next.js recommended ESLint configs:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Global ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Supabase Setup

Before running the app, configure Supabase:

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local` and add your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
3. Create database tables using SQL from `DATABASE_SCHEMA.md` in Supabase Studio
4. Add sample data through Supabase Studio dashboard

## Database Architecture

Three main entities managed via Supabase Studio:

- **Companies**: Team building service providers with services, location, pricing
- **Venues**: Locations for events with capacity, amenities, venue type
- **Activities**: Specific team building activities with categories, difficulty, objectives
- **Inquiries**: Contact form submissions from users

All tables include `featured` flag for homepage display and are indexed for search performance.

## Key Features

- **Search & Filter**: Text search with filters by state, category, venue type
- **Detail Pages**: Dynamic routes for companies, venues, and activities
- **Contact Forms**: Server Actions submit inquiries to Supabase
- **Featured Listings**: Homepage displays featured items from each category
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Mode**: Automatic theme switching via CSS variables

## Development Notes

- Server Components are used for data fetching (no client-side API calls)
- Client Components marked with `'use client'` directive (SearchFilter, ContactForm)
- Path alias `@/*` points to root directory
- Images should be placed in `/public` or use external URLs in database
