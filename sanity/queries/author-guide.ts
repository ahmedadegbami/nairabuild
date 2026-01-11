import { groq } from "next-sanity";

export const AUTHOR_GUIDE_QUERY = groq`*[_type == "authorGuide"][0]{
  title,
  subtitle,
  body,
  emailLabel,
  email
}`;
