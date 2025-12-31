/**
 * Transforms Google logo URLs to use higher resolution versions
 * Replaces 's44' (44x44px) with 's200' (200x200px) in Googleusercontent URLs
 *
 * @param url - The original logo URL (can be null)
 * @returns The transformed URL with higher resolution, or null if input is null
 *
 * @example
 * getHighResLogoUrl('https://lh5.googleusercontent.com/.../s44-p-k-no-ns-nd/photo.jpg')
 * // Returns: 'https://lh5.googleusercontent.com/.../s200-p-k-no-ns-nd/photo.jpg'
 */
export function getHighResLogoUrl(url: string | null): string | null {
  if (!url) return null

  // Replace s44 with s200 to get higher resolution images from Google
  return url.replace(/\/s44(-|$)/, '/s200$1')
}
