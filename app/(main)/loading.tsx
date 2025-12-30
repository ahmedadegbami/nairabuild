export default function MainLoading() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.12),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.08),_transparent_70%)] blur-3xl" />
      </div>

      <section className="container relative pb-12 pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
            <div className="h-10 w-3/4 rounded-full bg-muted animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-11 w-32 rounded-full bg-muted animate-pulse" />
              <div className="h-11 w-36 rounded-full bg-muted animate-pulse" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[0, 1].map((item) => (
              <div
                key={`featured-${item}`}
                className="overflow-hidden rounded-3xl border border-border/60 bg-background"
              >
                <div className="aspect-[4/3] w-full bg-muted animate-pulse" />
                <div className="space-y-3 px-6 py-6">
                  <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
                  <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container relative pb-20">
        <div className="grid gap-10 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
            <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
            <div className="mt-4 flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={`cat-${item}`}
                  className="h-8 w-20 rounded-full bg-muted animate-pulse"
                />
              ))}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="h-6 w-40 rounded-full bg-muted animate-pulse" />
              <div className="h-10 w-full max-w-xl rounded-full bg-muted animate-pulse" />
            </div>
            <div className="mt-6 grid min-h-[620px] gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`post-skel-${index}`}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-background"
                >
                  <div className="aspect-[4/3] w-full bg-muted animate-pulse" />
                  <div className="space-y-3 px-5 py-5">
                    <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-3/4 rounded-full bg-muted animate-pulse" />
                    <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex min-h-[52px] items-center justify-center gap-2">
              <div className="h-9 w-16 rounded-full bg-muted animate-pulse" />
              <div className="h-9 w-10 rounded-full bg-muted animate-pulse" />
              <div className="h-9 w-10 rounded-full bg-muted animate-pulse" />
              <div className="h-9 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
