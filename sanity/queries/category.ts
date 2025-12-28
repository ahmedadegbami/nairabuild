import { groq } from "next-sanity";

export const CATEGORIES_QUERY = groq`*[_type == "category"] | order(title asc){
  _id,
  title,
  slug
}`;
