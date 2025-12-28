import { groq } from "next-sanity";

export const HOME_SETTINGS_QUERY = groq`*[_type == "homeSettings"][0]{
  homeIntroEyebrow,
  homeIntroTitle,
  homeIntroSubtitle,
  homeIntroPrimaryCtaLabel,
  homeIntroPrimaryCtaUrl,
  homeIntroSecondaryCtaLabel,
  homeIntroSecondaryCtaUrl,
  homeFeaturedLabel,
  homeFeaturedPosts[]->{
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
  },
  categoriesTitle,
  allCategoriesLabel,
  postsTitle,
  emptyPostsText
}`;
