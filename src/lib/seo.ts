export const SITE_NAME = 'Practice NVC'

/**
 * Meta tags for one page.
 *
 * Every route shared a single title before this, so browser history, bookmarks
 * and any shared link were indistinguishable from each other. Routes pass a
 * distinctive page name and their own description; the root route supplies the
 * defaults that apply when a route says nothing.
 *
 * Note: og:image is deliberately absent until there is an image worth sharing.
 */
export function pageMeta({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const fullTitle = `${title} | ${SITE_NAME}`

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]
}
