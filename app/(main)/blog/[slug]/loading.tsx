export default function BlogPostLoading() {
  return (
    <div className="container flex flex-col gap-16 py-12">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="h-3 w-28 rounded-full bg-muted animate-pulse" />
        <div className="h-10 w-3/4 rounded-full bg-muted animate-pulse" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="aspect-[16/9] w-full rounded-3xl bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
        </div>
      </article>

      <section className="mx-auto w-full max-w-3xl">
        <div className="h-6 w-48 rounded-full bg-muted animate-pulse" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              key={`related-${item}`}
              className="overflow-hidden rounded-3xl border border-border/60 bg-background"
            >
              <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
              <div className="space-y-3 px-5 py-5">
                <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl">
        <div className="h-6 w-36 rounded-full bg-muted animate-pulse" />
        <div className="mt-4 space-y-4 rounded-2xl border border-border/60 bg-background p-6">
          <div className="h-4 w-40 rounded-full bg-muted animate-pulse" />
          <div className="h-10 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-10 w-32 rounded-full bg-muted animate-pulse" />
        </div>
      </section>
    </div>
  );
}
