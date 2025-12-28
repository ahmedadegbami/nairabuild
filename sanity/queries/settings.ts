import { groq } from "next-sanity";

export const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  siteName,
  footerText
}`;
