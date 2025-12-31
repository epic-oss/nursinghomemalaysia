export interface Company {
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
  services: string[] | null
  category: string | null
  activities: string | null
  featured: boolean
  hrdf_claimable: boolean | null
  user_id: string | null
  is_featured: boolean
  is_premium: boolean
  premium_since: string | null
  featured_until: string | null
  featured_images: string[] | null
  created_at: string
  updated_at: string
}

export interface Venue {
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

export interface Activity {
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
  listing_type: 'company' | 'venue' | 'activity'
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

export type Listing = Company | Venue | Activity
export type ListingType = 'company' | 'venue' | 'activity'

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
  'Outdoor',
  'Indoor',
  'Virtual',
  'Sports',
  'Adventure',
  'Creative',
  'Problem Solving',
  'Communication',
] as const

export const VENUE_TYPES = [
  'Indoor',
  'Outdoor',
  'Resort',
  'Hotel',
  'Conference Center',
  'Adventure Park',
  'Beach',
  'Farm',
] as const

export interface ClaimRequest {
  id: string
  user_id: string
  company_id: string
  role_at_company: string
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
