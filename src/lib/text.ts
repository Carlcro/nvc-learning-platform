/**
 * Capitalize only the first letter: "plein de gratitude" becomes
 * "Plein de gratitude". The CSS `capitalize` style capitalizes every word,
 * which is wrong for multi-word feelings in French, Spanish and Swedish.
 */
export function upperFirst(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1)
}
