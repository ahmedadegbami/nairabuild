import { groq } from "next-sanity";

export const AUTHOR_BY_SLUG_QUERY = groq`*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  bio,
  image{
    ...,
    asset->{
      _id,
      metadata {
        dimensions {
          width,
          height
        }
      }
    }
  }
}`;
