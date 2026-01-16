import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  fetchCategories,
  fetchHomeSettings,
  fetchPostsPaged,
  fetchSiteSettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import PostsSearch from "@/components/posts-search";
import ScrollToHash from "@/components/scroll-to-hash";

const POSTS_PER_PAGE = 9;

type PageProps = {
  searchParams?: Promise<{ category?: string; page?: string; q?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [settings, siteSettings] = await Promise.all([
    fetchHomeSettings(),
    fetchSiteSettings(),
  ]);

  const title = settings?.homeIntroTitle || siteSettings?.siteName || "Home";
  const description =
    settings?.homeIntroSubtitle ||
    "Stories across construction, engineering, and technology.";

  return {
    title,
    description,
  };
}

export default async function IndexPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const selectedCategory = params.category || "";
  const searchQuery = (params.q || "").trim();
  const currentPage = Math.max(1, Number(params.page ?? "1") || 1);
  const settings = await fetchHomeSettings();
  const categories = await fetchCategories();
  const { posts, total } = await fetchPostsPaged({
    categorySlug: selectedCategory,
    search: searchQuery,
    page: currentPage,
    perPage: POSTS_PER_PAGE,
  });
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const primaryCtaHref = settings?.homeIntroPrimaryCtaUrl?.trim();
  const resolvedPrimaryCtaHref =
    primaryCtaHref === "/" || primaryCtaHref === "#latest-posts"
      ? "/#latest-posts"
      : primaryCtaHref;
  const paginationPages = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages = new Set<number>([1, totalPages]);
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }
    return Array.from(pages).sort((a, b) => a - b);
  })();
  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();
    if (selectedCategory) query.set("category", selectedCategory);
    if (searchQuery) query.set("q", searchQuery);
    if (page > 1) query.set("page", String(page));
    const queryString = query.toString();
    return `/${queryString ? `?${queryString}` : ""}#latest-posts`;
  };
  const categoryHref = (slug?: string) => {
    const query = new URLSearchParams();
    if (slug) query.set("category", slug);
    if (searchQuery) query.set("q", searchQuery);
    const queryString = query.toString();
    return `/${queryString ? `?${queryString}` : ""}#latest-posts`;
  };

  return (
    <main className="relative overflow-hidden">
      <ScrollToHash />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.18),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_70%)] blur-3xl" />
      </div>

      <section className="container relative pb-12 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            {settings?.homeIntroEyebrow ? (
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                {settings.homeIntroEyebrow}
              </div>
            ) : null}
            {settings?.homeIntroTitle ? (
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                {settings.homeIntroTitle}
              </h1>
            ) : null}
            {settings?.homeIntroSubtitle ? (
              <p className="text-base text-muted-foreground md:text-lg">
                {settings.homeIntroSubtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              {settings?.homeIntroPrimaryCtaLabel && resolvedPrimaryCtaHref ? (
                <Link
                  href={resolvedPrimaryCtaHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition hover:opacity-90"
                >
                  {settings.homeIntroPrimaryCtaLabel}
                </Link>
              ) : null}
              {settings?.homeIntroSecondaryCtaLabel &&
              settings?.homeIntroSecondaryCtaUrl ? (
                <Link
                  href={settings.homeIntroSecondaryCtaUrl}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {settings.homeIntroSecondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>

          {settings?.homeFeaturedPosts?.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {settings.homeFeaturedPosts.map((featured, index) => (
                <div
                  key={featured._id}
                  className="relative flex justify-center"
                >
                  {index === 0 ? (
                    <div className="absolute right-6 top-6 hidden h-24 w-24 rounded-full border border-emerald-200/60 bg-emerald-50/60 lg:block" />
                  ) : null}
                  <Link
                    href={`/blog/${featured.slug?.current}`}
                    className="group relative w-full overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[0_24px_60px_-50px_rgba(15,23,42,0.4)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      {featured.mainImage ? (
                        <Image
                          src={urlFor(featured.mainImage)
                            .width(900)
                            .height(600)
                            .url()}
                          alt={featured.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(120deg,_rgba(15,23,42,0.08),_rgba(15,23,42,0.16))]" />
                      )}
                      {settings.homeFeaturedLabel ? (
                        <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground">
                          {settings.homeFeaturedLabel}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 px-6 py-6">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {featured.title}
                      </h3>
                      {featured.excerpt ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {featured.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="latest-posts" className="container relative pb-20">
        <div className="grid gap-10 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {settings?.categoriesTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={categoryHref()}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest ${
                  !selectedCategory
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground/70"
                }`}
              >
                {settings?.allCategoriesLabel}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={categoryHref(category.slug?.current)}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest ${
                    selectedCategory === category.slug?.current
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/70"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                {settings?.postsTitle}
              </h2>
              <PostsSearch
                initialQuery={searchQuery}
                category={selectedCategory}
              />
            </div>
            <div className="mt-6 min-h-[420px]">
              {posts.length ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug?.current}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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
                <div className="rounded-3xl border border-dashed border-border/80 px-6 py-12 text-center text-sm text-muted-foreground">
                  {settings?.emptyPostsText}
                </div>
              )}
            </div>
            <div className="mt-4 flex min-h-[52px] flex-wrap items-center justify-center gap-2">
              {totalPages > 1 ? (
                <>
                  <Link
                    href={buildPageHref(Math.max(1, currentPage - 1))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                      currentPage === 1
                        ? "pointer-events-none border-border text-foreground/40"
                        : "border-border text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    Prev
                  </Link>
                  {paginationPages.map((page, index) => {
                    const prev = paginationPages[index - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (
                      <span
                        key={`page-${page}`}
                        className="flex items-center gap-2"
                      >
                        {showEllipsis ? (
                          <span className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            ...
                          </span>
                        ) : null}
                        <Link
                          href={buildPageHref(page)}
                          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                            currentPage === page
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-foreground/70 hover:bg-muted"
                          }`}
                        >
                          {page}
                        </Link>
                      </span>
                    );
                  })}
                  <Link
                    href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                      currentPage === totalPages
                        ? "pointer-events-none border-border text-foreground/40"
                        : "border-border text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    Next
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
