import Image from "next/image";
import Link from "next/link";
import {
  fetchCategories,
  fetchHomeSettings,
  fetchPosts,
  fetchPostsByCategory,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type PageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function IndexPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const selectedCategory = params.category || "";
  const settings = await fetchHomeSettings();
  const categories = await fetchCategories();
  const posts = selectedCategory
    ? await fetchPostsByCategory(selectedCategory)
    : await fetchPosts();

  return (
    <main className="relative overflow-hidden">
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
              {settings?.homeIntroPrimaryCtaLabel &&
              settings?.homeIntroPrimaryCtaUrl ? (
                <Link
                  href={settings.homeIntroPrimaryCtaUrl}
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
                <div key={featured._id} className="relative flex justify-center">
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

      <section className="container relative pb-20">
        <div className="grid gap-10 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {settings?.categoriesTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/"
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
                  href={`/?category=${category.slug?.current}`}
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                {settings?.postsTitle}
              </h2>
            </div>
            {posts.length ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug?.current}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      {post.mainImage ? (
                        <Image
                          src={urlFor(post.mainImage).width(800).height(500).url()}
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
              <div className="mt-10 rounded-3xl border border-dashed border-border/80 px-6 py-12 text-center text-sm text-muted-foreground">
                {settings?.emptyPostsText}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
