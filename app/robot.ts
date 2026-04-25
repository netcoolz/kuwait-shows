import { MetadataRoute } from 'next'

export const dynamic = 'force-static' // أضفناه هنا أيضاً

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.kuwaitshows.com/sitemap.xml',
  }
}