import { groq } from "next-sanity";

export const PRIVACY_POLICY_QUERY = groq`*[_type == "privacyPolicy"][0]{
  title,
  lastUpdated,
  body
}`;
