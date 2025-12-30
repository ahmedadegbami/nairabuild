export default function AuthorLoading() {
  return (
    <div className="container flex flex-col gap-12 py-12">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-border/60 bg-background p-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted animate-pulse" />
        <div className="mx-auto h-6 w-40 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl">
        <div className="h-6 w-48 rounded-full bg-muted animate-pulse" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`author-post-${index}`}
              className="overflow-hidden rounded-2xl border border-border/60 bg-background"
            >
              <div className="aspect-[4/3] w-full bg-muted animate-pulse" />
              <div className="space-y-3 px-5 py-5">
                <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
