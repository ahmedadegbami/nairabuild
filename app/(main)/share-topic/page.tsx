import { notFound } from "next/navigation";
import PortableTextRenderer from "@/components/portable-text";
import { fetchAuthorGuide } from "@/sanity/lib/fetch";

export default async function ShareTopicPage() {
  const guide = await fetchAuthorGuide();

  if (!guide) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.16),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_70%)] blur-3xl" />
      </div>
      <section className="container relative pb-20 pt-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-border/60 bg-background/80 px-6 py-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:px-10">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {guide.title}
            </h1>
            {guide.subtitle ? (
              <p className="text-base text-muted-foreground md:text-lg">
                {guide.subtitle}
              </p>
            ) : null}
          </div>
          <div className="prose prose-neutral max-w-none">
            <PortableTextRenderer value={guide.body} />
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/40 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {guide.emailLabel}
            </p>
            <a
              className="mt-2 inline-flex text-sm font-semibold text-foreground underline decoration-emerald-400/80 underline-offset-4"
              href={`mailto:${guide.email}`}
            >
              {guide.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
