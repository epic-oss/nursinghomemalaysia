/**
 * Get the current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Process content by replacing template variables like {{currentYear}} and {year}
 */
export function processTemplateVariables(content: string): string {
  const year = getCurrentYear()

  return content
    .replace(/\{\{currentYear\}\}/g, String(year))
    .replace(/\{\{nextYear\}\}/g, String(year + 1))
    // Support {year} format used in MDX frontmatter and content
    .replace(/\{year\}/g, String(year))
}
