/**
 * Converts a name or string to a URL-friendly slug
 * @param name - The name or string to convert to a slug
 * @returns A URL-friendly slug string
 *
 * @example
 * slugify("Hello World!") // returns "hello-world"
 * slugify("User's Name & Co.") // returns "users-name-and-co"
 * slugify("Café & Résumé") // returns "cafe-and-resume"
 */
export function slugify(name: string): string {
  if (!name) return '';

  return (
    name
      .toLowerCase()
      // Replace & with "and"
      .replace(/&/g, 'and')
      // Replace spaces, underscores, and other separators with hyphens
      .replace(/[\s_]+/g, '-')
      // Replace special characters and punctuation with hyphens
      .replace(/[^\w\-]+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Replace multiple consecutive hyphens with a single hyphen
      .replace(/-+/g, '-')
  );
}
