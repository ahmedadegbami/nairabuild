import { sanityFetch } from "@/sanity/lib/live";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import { HOME_SETTINGS_QUERY } from "@/sanity/queries/home-settings";
import { BLOG_SETTINGS_QUERY } from "@/sanity/queries/blog-settings";
import { COMMENT_SETTINGS_QUERY } from "@/sanity/queries/comment-settings";
import { AUTHOR_GUIDE_QUERY } from "@/sanity/queries/author-guide";
import { PRIVACY_POLICY_QUERY } from "@/sanity/queries/privacy-policy";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import {
  POST_BY_SLUG_QUERY,
  POSTS_BY_AUTHOR_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  POSTS_COUNT_QUERY,
  POSTS_PAGED_QUERY,
  POSTS_QUERY,
  POSTS_EXCEPT_QUERY,
  RELATED_POSTS_QUERY,
} from "@/sanity/queries/post";
import { COMMENTS_BY_POST_QUERY } from "@/sanity/queries/comment";
import { AUTHOR_BY_SLUG_QUERY } from "@/sanity/queries/author";

export type Category = {
  _id: string;
  title: string;
  slug?: { current: string };
};

export type Post = {
  _id: string;
  title: string;
  slug?: { current: string };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: any;
  categories?: Category[];
  author?: {
    name?: string;
    slug?: { current: string };
    image?: any;
    bio?: string;
  };
  body?: any;
};

export type SiteSettings = {
  siteName?: string;
  footerText?: string;
};

export type HomeSettings = {
  homeIntroEyebrow?: string;
  homeIntroTitle?: string;
  homeIntroSubtitle?: string;
  homeIntroPrimaryCtaLabel?: string;
  homeIntroPrimaryCtaUrl?: string;
  homeIntroSecondaryCtaLabel?: string;
  homeIntroSecondaryCtaUrl?: string;
  homeFeaturedLabel?: string;
  homeFeaturedPosts?: Post[];
  categoriesTitle?: string;
  allCategoriesLabel?: string;
  postsTitle?: string;
  emptyPostsText?: string;
};

export type BlogSettings = {
  backToPostsLabel?: string;
  relatedPostsTitle?: string;
};

export type CommentSettings = {
  commentsTitle?: string;
  commentFormTitle?: string;
  commentsEmptyText?: string;
  commentNameLabel?: string;
  commentNamePlaceholder?: string;
  commentEmailLabel?: string;
  commentEmailPlaceholder?: string;
  commentBodyLabel?: string;
  commentBodyPlaceholder?: string;
  commentSubmitLabel?: string;
  commentSignInTitle?: string;
  commentSignInHelper?: string;
  commentSignInButtonLabel?: string;
  commentSignInSentMessage?: string;
  commentSignInErrorMessage?: string;
  commentSignOutLabel?: string;
  commentLeaveLabel?: string;
  commentReplyLabel?: string;
  commentEditLabel?: string;
  commentDeleteLabel?: string;
  commentEditedLabel?: string;
  commentDeletedLabel?: string;
  commentShowRepliesLabel?: string;
  commentHideRepliesLabel?: string;
  commentAuthorBadgeLabel?: string;
  commentSuccessMessage?: string;
  commentErrorMessage?: string;
  commentRateLimitMessage?: string;
};

export type AuthorGuide = {
  title?: string;
  subtitle?: string;
  body?: any;
  emailLabel?: string;
  email?: string;
};

export type PrivacyPolicy = {
  title?: string;
  lastUpdated?: string;
  body?: any;
};

export type Author = {
  _id: string;
  name?: string;
  slug?: { current: string };
  bio?: string;
  image?: any;
};

export type Comment = {
  _id: string;
  name: string;
  email?: string;
  body: string;
  createdAt?: string;
  parentId?: string | null;
  isStaff?: boolean;
  userId?: string;
  editedAt?: string;
  deletedAt?: string;
  staffAuthor?: {
    _id?: string;
    name?: string;
    slug?: { current: string };
  };
};

export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
  });

  return data ?? null;
};

export const fetchHomeSettings = async (): Promise<HomeSettings | null> => {
  const { data } = await sanityFetch({
    query: HOME_SETTINGS_QUERY,
  });

  return data ?? null;
};

export const fetchBlogSettings = async (): Promise<BlogSettings | null> => {
  const { data } = await sanityFetch({
    query: BLOG_SETTINGS_QUERY,
  });

  return data ?? null;
};

export const fetchCommentSettings = async (): Promise<CommentSettings | null> => {
  const { data } = await sanityFetch({
    query: COMMENT_SETTINGS_QUERY,
  });

  return data ?? null;
};

export const fetchAuthorGuide = async (): Promise<AuthorGuide | null> => {
  const { data } = await sanityFetch({
    query: AUTHOR_GUIDE_QUERY,
  });

  return data ?? null;
};

export const fetchPrivacyPolicy = async (): Promise<PrivacyPolicy | null> => {
  const { data } = await sanityFetch({
    query: PRIVACY_POLICY_QUERY,
  });

  return data ?? null;
};

export const fetchAuthorBySlug = async (
  slug: string
): Promise<Author | null> => {
  const { data } = await sanityFetch({
    query: AUTHOR_BY_SLUG_QUERY,
    params: { slug },
  });

  return data ?? null;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await sanityFetch({
    query: CATEGORIES_QUERY,
  });

  return data ?? [];
};

export const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });

  return data ?? [];
};

export const fetchPostsPaged = async ({
  categorySlug,
  search,
  page,
  perPage,
}: {
  categorySlug?: string;
  search?: string;
  page: number;
  perPage: number;
}): Promise<{ posts: Post[]; total: number }> => {
  const searchTerm = search?.trim();
  const searchParam = searchTerm ? `*${searchTerm}*` : "";
  const start = Math.max(0, (page - 1) * perPage);
  const end = start + perPage;

  const [{ data: posts }, { data: total }] = await Promise.all([
    sanityFetch({
      query: POSTS_PAGED_QUERY,
      params: { categorySlug: categorySlug || "", search: searchParam, start, end },
    }),
    sanityFetch({
      query: POSTS_COUNT_QUERY,
      params: { categorySlug: categorySlug || "", search: searchParam },
    }),
  ]);

  return { posts: posts ?? [], total: total ?? 0 };
};

export const fetchPostsByCategory = async (
  categorySlug: string
): Promise<Post[]> => {
  const { data } = await sanityFetch({
    query: POSTS_BY_CATEGORY_QUERY,
    params: { categorySlug },
  });

  return data ?? [];
};

export const fetchPostsByAuthor = async (
  authorSlug: string
): Promise<Post[]> => {
  const { data } = await sanityFetch({
    query: POSTS_BY_AUTHOR_QUERY,
    params: { authorSlug },
  });

  return data ?? [];
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data } = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  });

  return data ?? null;
};

export const fetchRelatedPosts = async (
  postId: string,
  categorySlugs: string[]
): Promise<Post[]> => {
  const { data } = await sanityFetch({
    query: RELATED_POSTS_QUERY,
    params: { postId, categorySlugs },
  });

  return data ?? [];
};

export const fetchPostsExcept = async (postId: string): Promise<Post[]> => {
  const { data } = await sanityFetch({
    query: POSTS_EXCEPT_QUERY,
    params: { postId },
  });

  return data ?? [];
};

export const fetchCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  const { data } = await sanityFetch({
    query: COMMENTS_BY_POST_QUERY,
    params: { postId },
  });

  return data ?? [];
};
