import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/components/portable-text";
import { getInitials } from "@/lib/initials";
import CommentThread from "@/components/comments/thread";
import {
  fetchBlogSettings,
  fetchCommentSettings,
  fetchCommentsByPostId,
  fetchPostBySlug,
  fetchPostsExcept,
  fetchRelatedPosts,
  fetchSiteSettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;

type CommentNode = {
  _id: string;
  name: string;
  email?: string;
  body: string;
  createdAt?: string;
  isStaff?: boolean;
  userId?: string | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  staffAuthor?: {
    _id?: string;
    name?: string;
    slug?: { current: string };
  };
  replies: CommentNode[];
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildCommentTree = (comments: any[]): CommentNode[] => {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    map.set(comment._id, {
      _id: comment._id,
      name: comment.name,
      email: comment.email,
      body: comment.body,
      createdAt: comment.createdAt,
      isStaff: comment.isStaff,
      userId: comment.userId,
      editedAt: comment.editedAt,
      deletedAt: comment.deletedAt,
      staffAuthor: comment.staffAuthor,
      replies: [],
    });
  });

  comments.forEach((comment) => {
    const node = map.get(comment._id);
    const parentId = comment.parentId;

    if (node && parentId && map.has(parentId)) {
      map.get(parentId)?.replies.push(node);
      return;
    }

    if (node) {
      roots.push(node);
    }
  });

  return roots;
};

const toPlainText = (value: any) => {
  if (!Array.isArray(value)) return "";
  return value
    .filter((block) => block?._type === "block")
    .map((block) =>
      (block?.children || [])
        .map((child: { text?: string }) => child.text || "")
        .join("")
    )
    .join(" ");
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const [post, siteSettings] = await Promise.all([
    fetchPostBySlug(slug),
    fetchSiteSettings(),
  ]);

  if (!post) {
    return {};
  }

  const title = post.title || siteSettings?.siteName || "Post";
  const description = post.excerpt || toPlainText(post.body);
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    openGraph: imageUrl
      ? {
          title,
          description,
          type: "article",
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
            },
          ],
        }
      : undefined,
    twitter: imageUrl
      ? {
          card: "summary_large_image",
          title,
          description,
          images: [imageUrl],
        }
      : undefined,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const [blogSettings, commentSettings] = await Promise.all([
    fetchBlogSettings(),
    fetchCommentSettings(),
  ]);
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categorySlugs =
    post.categories
      ?.map((category) => category.slug?.current)
      .filter(Boolean) ?? [];
  const [relatedPosts, fallbackPosts, comments] = await Promise.all([
    categorySlugs.length
      ? fetchRelatedPosts(post._id, categorySlugs as string[])
      : Promise.resolve([]),
    fetchPostsExcept(post._id),
    fetchCommentsByPostId(post._id),
  ]);

  const relatedIds = new Set(relatedPosts.map((item) => item._id));
  const otherCategoryPosts = categorySlugs.length
    ? fallbackPosts.filter(
        (item) =>
          !item.categories?.some((category) =>
            categorySlugs.includes(category.slug?.current || "")
          )
      )
    : fallbackPosts;
  const filledRelated = [
    ...relatedPosts,
    ...shuffle(otherCategoryPosts).filter((item) => !relatedIds.has(item._id)),
  ].slice(0, 2);

  const commentTree = buildCommentTree(comments);
  const authorInitials = getInitials(post.author?.name, "A");
  const categoryHref = (slug?: string) => {
    const query = new URLSearchParams();
    if (slug) query.set("category", slug);
    const queryString = query.toString();
    return `/${queryString ? `?${queryString}` : ""}#latest-posts`;
  };

  return (
    <div className="container flex flex-col gap-16 py-12">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {blogSettings?.backToPostsLabel}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {post.categories?.map((category) =>
            category.slug?.current ? (
              <Link
                key={category._id}
                href={categoryHref(category.slug.current)}
                className="transition hover:text-foreground"
              >
                {category.title}
              </Link>
            ) : (
              <span key={category._id}>{category.title}</span>
            )
          )}
          {post.publishedAt ? (
            <span>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(post.publishedAt))}
            </span>
          ) : null}
        </div>
        {post.author?.name ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.author.image ? (
              <div className="relative h-7 w-7 overflow-hidden rounded-full border border-border/60 bg-muted">
                <Image
                  src={urlFor(post.author.image).width(56).height(56).url()}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-muted text-[10px] font-semibold uppercase text-foreground">
                {authorInitials}
              </div>
            )}
            <Link
              href={`/author/${post.author.slug?.current}`}
              className="font-semibold text-foreground underline decoration-emerald-400/80 underline-offset-4"
            >
              {post.author.name}
            </Link>
          </div>
        ) : null}
        {post.mainImage ? (
          <figure className="mx-auto w-fit max-w-full">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
              <Image
                src={urlFor(post.mainImage).width(1600).url()}
                alt={post.title}
                width={post.mainImage?.asset?.metadata?.dimensions?.width || 1200}
                height={
                  post.mainImage?.asset?.metadata?.dimensions?.height || 800
                }
                className="mx-auto h-auto max-h-[520px] w-auto max-w-full object-contain"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
            {post.imageCredit ? (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {blogSettings?.imageCreditLabel
                  ? `${blogSettings.imageCreditLabel}: `
                  : ""}
                {post.imageCreditUrl ? (
                  <a
                    href={post.imageCreditUrl}
                    className="underline decoration-emerald-400/80 underline-offset-4"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {post.imageCredit}
                  </a>
                ) : (
                  <span>{post.imageCredit}</span>
                )}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <PortableTextRenderer
          value={post.body}
          creditLabel={blogSettings?.mediaCreditLabel}
        />
      </article>

      {filledRelated.length ? (
        <section className="mx-auto w-full max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">
            {blogSettings?.relatedPostsTitle}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {filledRelated.map((related) => (
              <Link
                key={related._id}
                href={`/blog/${related.slug?.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  {related.mainImage ? (
                    <Image
                      src={urlFor(related.mainImage)
                        .width(800)
                        .height(500)
                        .url()}
                      alt={related.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(120deg,_rgba(15,23,42,0.04),_rgba(15,23,42,0.12))]" />
                  )}
                </div>
                <div className="flex flex-col gap-3 px-5 py-5">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {related.categories?.map((category) => (
                      <span key={category._id}>{category.title}</span>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {related.title}
                  </h3>
                  {related.excerpt ? (
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {related.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section id="comments" className="mx-auto w-full max-w-3xl">
        <CommentThread
          postId={post._id}
          comments={commentTree}
          labels={{
            title: commentSettings?.commentsTitle,
            nameLabel: commentSettings?.commentNameLabel,
            namePlaceholder: commentSettings?.commentNamePlaceholder,
            emailLabel: commentSettings?.commentEmailLabel,
            emailPlaceholder: commentSettings?.commentEmailPlaceholder,
            bodyLabel: commentSettings?.commentBodyLabel,
            bodyPlaceholder: commentSettings?.commentBodyPlaceholder,
            submitLabel: commentSettings?.commentSubmitLabel,
            signInTitle: commentSettings?.commentSignInTitle,
            signInHelper: commentSettings?.commentSignInHelper,
            signInButtonLabel: commentSettings?.commentSignInButtonLabel,
            signInSentMessage: commentSettings?.commentSignInSentMessage,
            signInErrorMessage: commentSettings?.commentSignInErrorMessage,
            signOutLabel: commentSettings?.commentSignOutLabel,
            leaveLabel: commentSettings?.commentLeaveLabel,
            replyLabel: commentSettings?.commentReplyLabel,
            editLabel: commentSettings?.commentEditLabel,
            deleteLabel: commentSettings?.commentDeleteLabel,
            editedLabel: commentSettings?.commentEditedLabel,
            deletedLabel: commentSettings?.commentDeletedLabel,
            showRepliesLabel: commentSettings?.commentShowRepliesLabel,
            hideRepliesLabel: commentSettings?.commentHideRepliesLabel,
            authorBadgeLabel: commentSettings?.commentAuthorBadgeLabel,
            successMessage: commentSettings?.commentSuccessMessage,
            errorMessage: commentSettings?.commentErrorMessage,
            rateLimitMessage: commentSettings?.commentRateLimitMessage,
          }}
          emptyText={commentSettings?.commentsEmptyText}
        />
      </section>
    </div>
  );
}
