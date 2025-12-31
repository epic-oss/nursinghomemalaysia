import { uniqueSlugify } from './slugify'

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Extract H2 and H3 headings from markdown content
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const existingSlugs = new Set<string>()

  // Match ## (h2) and ### (h3) headings
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const hashes = match[1]
    const text = match[2].trim()
    const level = hashes.length as 2 | 3

    // Only include h2 and h3
    if (level === 2 || level === 3) {
      // Clean the text (remove markdown formatting like bold, italic, links)
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/`(.*?)`/g, '$1')       // Remove code backticks
        .trim()

      const id = uniqueSlugify(cleanText, existingSlugs)

      headings.push({
        id,
        text: cleanText,
        level,
      })
    }
  }

  return headings
}
