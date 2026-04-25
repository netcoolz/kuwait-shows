import { MetadataRoute } from 'next'

export const dynamic = 'force-static' // هذا هو السطر الذي يحل المشكلة

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.kuwaitshows.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}