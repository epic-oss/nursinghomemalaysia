/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
}

/**
 * Generate unique slug by appending number if duplicate exists
 */
export function uniqueSlugify(text: string, existingSlugs: Set<string>): string {
  let slug = slugify(text)
  let counter = 2

  while (existingSlugs.has(slug)) {
    slug = `${slugify(text)}-${counter}`
    counter++
  }

  existingSlugs.add(slug)
  return slug
}
