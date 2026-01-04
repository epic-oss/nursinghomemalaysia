export interface NursingHome {
  id: string
  slug: string
  name: string
  description: string
  contact_email: string
  contact_phone: string | null
  website: string | null
  logo_url: string | null
  images: string[] | null
  average_rating: number | null
  review_count: number | null
  location: string
  state: string
  price_range: string | null
  category: string | null
  services: string | null
  featured: boolean
  user_id: string | null
  is_featured: boolean
  is_premium: boolean
  premium_since: string | null
  featured_until: string | null
  featured_images: string[] | null
  created_at: string
  updated_at: string
  // Enriched fields
  care_levels: string[] | null
  amenities: string[] | null
  languages: string[] | null
  price_min: number | null
  price_max: number | null
  room_types: string | null
}

export interface Facility {
  id: string
  name: string
  description: string
  contact_email: string
  contact_phone: string | null
  website: string | null
  images: string[] | null
  location: string
  state: string
  city: string
  capacity: number | null
  price_range: string | null
  amenities: string[] | null
  venue_type: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  duration: string | null
  group_size: string | null
  price_range: string | null
  difficulty_level: string | null
  images: string[] | null
  objectives: string[] | null
  requirements: string | null
  suitable_for: string[] | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Inquiry {
  listing_type: 'nursing_home' | 'facility' | 'service'
  listing_id: string
  listing_name: string
  name: string
  email: string
  phone?: string
  company_name?: string
  message: string
  preferred_date?: string
  group_size?: string
}

export type Listing = NursingHome | Facility | Service
export type ListingType = 'nursing_home' | 'facility' | 'service'

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
] as const

export const CATEGORIES = [
  'Residential Care',
  'Day Care Services',
  'Rehabilitation',
  'Medical Care',
  'Respite Care',
  'Memory Care',
  'Palliative Care',
  'Home Care',
] as const

export const VENUE_TYPES = [
  'Residential Care Facility',
  'Day Care Center',
  'Nursing Home',
  'Assisted Living',
  'Rehabilitation Center',
  'Memory Care Unit',
  'Hospice',
  'Home Care Services',
] as const

export interface ClaimRequest {
  id: string
  user_id: string
  nursing_home_id: string
  role_at_facility: string
  verification_phone: string
  proof_notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
  updated_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export interface UserProfile {
  id: string
  email: string | undefined
  fullName: string
  companyName: string
  createdAt: string
}
