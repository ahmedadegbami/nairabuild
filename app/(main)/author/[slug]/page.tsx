import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchAuthorBySlug,
  fetchPostsByAuthor,
  fetchSiteSettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import PortableTextRenderer from "@/components/portable-text";
import { getInitials } from "@/lib/initials";

type PageProps = {
  params: Promise<{ slug: string }>;
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
  const [author, siteSettings] = await Promise.all([
    fetchAuthorBySlug(slug),
    fetchSiteSettings(),
  ]);

  if (!author) {
    return {};
  }

  const title = `${author.name || "Author"} | ${siteSettings?.siteName || "Blog"}`;
  const description = toPlainText(author.bio);

  return {
    title,
    description,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await fetchAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await fetchPostsByAuthor(slug);
  const authorInitials = getInitials(author.name, "A");

  return (
    <main className="container py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
          {author.image ? (
            <div className="mx-auto overflow-hidden rounded-3xl border border-border/60 bg-muted">
              <Image
                src={urlFor(author.image).width(360).url()}
                alt={author.name || "Author"}
                width={author.image?.asset?.metadata?.dimensions?.width || 320}
                height={author.image?.asset?.metadata?.dimensions?.height || 320}
                className="h-auto max-h-[240px] w-auto object-contain"
              />
            </div>
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-border/60 bg-muted text-3xl font-semibold uppercase text-foreground">
              {authorInitials}
            </div>
          )}
          <div className="flex flex-col gap-3 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              {author.name}
            </h1>
            {author.bio ? (
              <div className="text-sm text-muted-foreground">
                <PortableTextRenderer value={author.bio} />
              </div>
            ) : null}
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Articles by {author.name}
          </h2>
          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug?.current}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage)
                          .width(800)
                          .height(500)
                          .url()}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(120deg,_rgba(15,23,42,0.04),_rgba(15,23,42,0.12))]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3 px-5 py-5">
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {post.categories?.map((category) => (
                        <span key={category._id}>{category.title}</span>
                      ))}
                    </div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No posts from this author yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
