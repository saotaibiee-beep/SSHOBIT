import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sshobit.vercel.app';
  const paths = [
    '', '/problems', '/diagnosis', '/directory', '/knowledge',
    '/services', '/faq', '/about', '/contact', '/privacy', '/terms',
  ];

  const supabase = await createClient();
  const [{ data: articles }, { data: problems }] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published'),
    supabase
      .from('problems')
      .select('slug, updated_at, review_date')
      .eq('status', 'published'),
  ]);

  const staticPages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((item) => ({
    url: `${base}/knowledge/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : item.published_at ? new Date(item.published_at) : new Date(),
  }));

  const problemPages: MetadataRoute.Sitemap = (problems || []).map((item) => ({
    url: `${base}/problems/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : item.review_date ? new Date(item.review_date) : new Date(),
  }));

  return [...staticPages, ...articlePages, ...problemPages];
}
