import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/components/portable-text";
import CommentThread from "@/components/comments/thread";
import {
  fetchBlogSettings,
  fetchCommentSettings,
  fetchCommentsByPostId,
  fetchPostBySlug,
  fetchPostsExcept,
  fetchRelatedPosts,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type CommentNode = {
  _id: string;
  name: string;
  body: string;
  createdAt?: string;
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
      body: comment.body,
      createdAt: comment.createdAt,
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
    post.categories?.map((category) => category.slug?.current).filter(Boolean) ??
    [];
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
          {post.categories?.map((category) => (
            <span key={category._id}>{category.title}</span>
          ))}
          {post.publishedAt ? (
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          ) : null}
          {post.author?.name ? (
            <Link
              href={`/author/${post.author.slug?.current}`}
              className="text-foreground underline decoration-emerald-400/80 underline-offset-4"
            >
              {post.author.name}
            </Link>
          ) : null}
        </div>
        {post.mainImage ? (
          <div className="mx-auto w-fit max-w-full overflow-hidden rounded-3xl border border-border/60 bg-muted">
            <Image
              src={urlFor(post.mainImage).width(1600).url()}
              alt={post.title}
              width={
                post.mainImage?.asset?.metadata?.dimensions?.width || 1200
              }
              height={
                post.mainImage?.asset?.metadata?.dimensions?.height || 800
              }
              className="mx-auto h-auto max-h-[520px] w-auto max-w-full object-contain"
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
        ) : null}
        <PortableTextRenderer value={post.body} />
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
      <section className="mx-auto w-full max-w-3xl">
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
            successMessage: commentSettings?.commentSuccessMessage,
            errorMessage: commentSettings?.commentErrorMessage,
          }}
          emptyText={commentSettings?.commentsEmptyText}
        />
      </section>
    </div>
  );
}
