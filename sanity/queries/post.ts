import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  author->{
    name,
    image
  }
}`;

export const POSTS_PAGED_QUERY = groq`*[
  _type == "post" &&
  defined(slug.current) &&
  (!defined($categorySlug) || $categorySlug == "" || $categorySlug in categories[]->slug.current) &&
  (!defined($search) || $search == "" || title match $search || excerpt match $search)
] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  author->{
    name,
    image
  }
}`;

export const POSTS_COUNT_QUERY = groq`count(*[
  _type == "post" &&
  defined(slug.current) &&
  (!defined($categorySlug) || $categorySlug == "" || $categorySlug in categories[]->slug.current) &&
  (!defined($search) || $search == "" || title match $search || excerpt match $search)
])`;

export const POSTS_BY_CATEGORY_QUERY = groq`*[_type == "post" && defined(slug.current) && $categorySlug in categories[]->slug.current] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  author->{
    name,
    image
  }
}`;

export const POSTS_BY_AUTHOR_QUERY = groq`*[_type == "post" && defined(slug.current) && author->slug.current == $authorSlug] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  author->{
    name,
    slug,
    image
  }
}`;

export const POST_BY_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  imageCredit,
  imageCreditUrl,
  mainImage{
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
  },
  body,
  categories[]->{
    _id,
    title,
    slug
  },
  author->{
    name,
    slug,
    image,
    bio
  }
}`;

export const RELATED_POSTS_QUERY = groq`*[_type == "post" && _id != $postId && defined(slug.current) && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  }
}`;

export const POSTS_EXCEPT_QUERY = groq`*[_type == "post" && _id != $postId && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  }
}`;

export const POST_SLUGS_QUERY = groq`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`;
