import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_SLUGS_QUERY } from "@/sanity/queries/post";
import { AUTHOR_SLUGS_QUERY } from "@/sanity/queries/author";

type SlugResult = {
  slug?: string;
  publishedAt?: string;
  _updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [postsResult, authorsResult] = await Promise.all([
    sanityFetch({ query: POST_SLUGS_QUERY }),
    sanityFetch({ query: AUTHOR_SLUGS_QUERY }),
  ]);
  const posts = (postsResult.data as SlugResult[] | null) ?? [];
  const authors = (authorsResult.data as SlugResult[] | null) ?? [];
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/share-topic`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || post._updatedAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const authorRoutes: MetadataRoute.Sitemap = authors
    .filter((author) => author.slug)
    .map((author) => ({
      url: `${baseUrl}/author/${author.slug}`,
      lastModified: new Date(author._updatedAt || now),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...postRoutes, ...authorRoutes];
}
