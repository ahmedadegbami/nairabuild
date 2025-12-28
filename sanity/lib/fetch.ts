import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_SETTINGS_QUERY } from "@/sanity/queries/blog-settings";

export type BlogSettings = {
  underConstruction?: boolean | null;
  message?: string | null;
};

export const fetchSanityBlogSettings = async (): Promise<BlogSettings | null> => {
  const { data } = await sanityFetch({
    query: BLOG_SETTINGS_QUERY,
  });

  return data ?? null;
};
