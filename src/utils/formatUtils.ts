/**
 * Get initials from a name
 * @param name Full name
 * @returns Uppercase initials
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Format authors array or string for display
 * @param authors Authors as array or string
 * @returns Formatted author string
 */
export function formatAuthors(authors: string[] | string | undefined): string {
  if (!authors) return "Unknown Authors";

  if (Array.isArray(authors)) {
    return authors.join(", ");
  }

  return authors;
}

/**
 * Format publication source (journal or publisher)
 * @param journal Journal name
 * @param publisher Publisher name
 * @returns Formatted source string
 */
export function formatPublicationSource(
  journal?: string,
  publisher?: string,
): string {
  return journal || publisher || "Unknown Publisher";
}
