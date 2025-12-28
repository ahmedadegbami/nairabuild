import { groq } from "next-sanity";

export const BLOG_SETTINGS_QUERY = groq`*[_type == "blogSettings"][0]{
  backToPostsLabel,
  relatedPostsTitle
}`;
