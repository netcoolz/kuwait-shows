import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.kuwaitshows.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // يمكنك نسخ البلوك السابق وإضافة روابط صفحاتك الأخرى هنا
    // مثل: https://www.kuwaitshows.com/events
  ]
}