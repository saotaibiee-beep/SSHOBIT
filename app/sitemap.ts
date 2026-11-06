import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sshobit.vercel.app';
  const paths = [
    '', '/problems', '/diagnosis', '/directory', '/knowledge',
    '/services', '/faq', '/about', '/contact', '/privacy', '/terms',
  ];
  return paths.map(path => ({
    url: base + path,
    lastModified: new Date(),
  }));
}
