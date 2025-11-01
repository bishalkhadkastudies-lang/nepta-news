/**
 * Generates a URL-friendly slug from a title
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Creates a unique slug by appending date if needed
 * Format: slug-YYYYMMDD or slug-YYYYMMDD-HHmmss for same-day duplicates
 */
export function createUniqueSlug(
  title: string,
  existingSlugs: string[] = [],
  timestamp?: Date
): string {
  const baseSlug = generateSlug(title)
  const date = timestamp || new Date()
  
  // Format: YYYYMMDD
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  
  // First try: slug-YYYYMMDD
  const slugWithDate = `${baseSlug}-${dateStr}`
  if (!existingSlugs.includes(slugWithDate)) {
    return slugWithDate
  }
  
  // Second try: slug-YYYYMMDD-HHmmss for same-day duplicates
  const timeStr = date.toISOString().slice(11, 19).replace(/:/g, '')
  return `${baseSlug}-${dateStr}-${timeStr}`
}

/**
 * Normalizes category name for URL
 * Converts to lowercase, replaces spaces with hyphens
 */
export function normalizeCategory(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

/**
 * Extracts category and slug from URL path
 * Expected format: /category/slug
 */
export function parseArticleUrl(path: string): { category: string; slug: string } | null {
  const match = path.match(/^\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  
  return {
    category: match[1],
    slug: match[2]
  }
}

/**
 * Builds article URL from category and slug
 */
export function buildArticleUrl(category: string, slug: string): string {
  const normalizedCategory = normalizeCategory(category)
  return `/${normalizedCategory}/${slug}`
}
