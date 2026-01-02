/**
 * Generates a URL-safe slug from a company name
 *
 * Rules:
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters and punctuation
 * - Removes common suffixes like SDN BHD, PLT, etc.
 * - Ensures URL-safe output
 *
 * @param name - The company name to slugify
 * @returns A URL-safe slug
 *
 * @example
 * generateSlug('MD Events Asia SDN BHD') // Returns: 'md-events-asia'
 * generateSlug('Nursing Home Co.') // Returns: 'nursing-home-co'
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    // Remove common Malaysian company suffixes
    .replace(/\s*(sdn\.?\s*bhd\.?|bhd\.?|sdn\.?|plt\.?|llp\.?|inc\.?|ltd\.?|limited|corporation|corp\.?)\s*$/gi, '')
    // Replace special characters and punctuation with spaces
    .replace(/[^a-z0-9\s-]/g, ' ')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Ensure it's not empty
    || 'nursing_home'
}

/**
 * Checks if a slug already exists in the database
 *
 * @param supabase - Supabase client instance
 * @param slug - The slug to check
 * @param excludeId - Optional ID to exclude from the check (for updates)
 * @returns True if the slug exists, false otherwise
 */
export async function slugExists(
  supabase: any,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from('nursing_homes')
    .select('id')
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query.single()

  if (error) {
    // If error is "PGRST116" it means no rows found, which means slug doesn't exist
    return error.code !== 'PGRST116'
  }

  return !!data
}

/**
 * Generates a unique slug by appending a number if the base slug already exists
 *
 * @param supabase - Supabase client instance
 * @param baseName - The company name to generate a slug from
 * @param excludeId - Optional ID to exclude from uniqueness check
 * @returns A unique slug
 *
 * @example
 * generateUniqueSlug(supabase, 'MD Events Asia') // Returns: 'md-events-asia' or 'md-events-asia-2' if exists
 */
export async function generateUniqueSlug(
  supabase: any,
  baseName: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseName)
  let slug = baseSlug
  let counter = 2

  // Check if slug exists and increment counter until we find a unique one
  while (await slugExists(supabase, slug, excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Validates if a string is a valid slug format
 *
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  // Must be lowercase, contain only letters, numbers, and hyphens
  // Cannot start or end with a hyphen
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}
