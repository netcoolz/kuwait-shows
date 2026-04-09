import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // يمكنك إضافة مسارات تمنع جوجل من أرشفتها باستخدام: disallow: '/private-page/'
    },
    sitemap: 'https://www.kuwaitshows.com/sitemap.xml',
  }
}