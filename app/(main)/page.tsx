import { fetchSanityBlogSettings } from "@/sanity/lib/fetch";

export default async function IndexPage() {
  const blogSettings = await fetchSanityBlogSettings();
  const isUnderConstruction = blogSettings?.underConstruction;
  const message =
    blogSettings?.message?.trim() || "The blog is under construction.";

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,194,102,0.35),_transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,179,237,0.25),_transparent_70%)] blur-3xl" />
      </div>
      <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-16 xl:py-20">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border border-border/60 bg-background/80 px-6 py-10 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:px-12 md:py-14">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Construction • Engineering • Technology
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Welcome to Nairabuild
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            Website under construction
          </div>
          <p className="text-base text-muted-foreground md:text-lg">
            {isUnderConstruction ? message : "The blog is live."}
          </p>
          <div className="h-px w-24 bg-border/70" />
          <p className="text-sm text-muted-foreground md:text-base">
            Interested in becoming an author and writing about topics of your
            choice? Email{" "}
            <a
              className="font-medium text-foreground underline decoration-amber-400/80 underline-offset-4"
              href="mailto:ahmed@nairabuild.com"
            >
              ahmed@nairabuild.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
