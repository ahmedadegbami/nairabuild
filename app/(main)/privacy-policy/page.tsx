import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/components/portable-text";
import {
  fetchPrivacyPolicy,
  fetchSiteSettings,
} from "@/sanity/lib/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const [policy, siteSettings] = await Promise.all([
    fetchPrivacyPolicy(),
    fetchSiteSettings(),
  ]);

  if (!policy) {
    return {};
  }

  const title = `${policy.title || "Privacy Policy"} | ${
    siteSettings?.siteName || "Blog"
  }`;

  return {
    title,
    description: "Privacy policy and data usage information.",
  };
}

export default async function PrivacyPolicyPage() {
  const policy = await fetchPrivacyPolicy();

  if (!policy) {
    notFound();
  }

  const lastUpdated = policy.lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(policy.lastUpdated))
    : null;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.16),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_70%)] blur-3xl" />
      </div>
      <section className="container relative pb-20 pt-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-border/60 bg-background/80 px-6 py-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:px-10">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {policy.title}
            </h1>
            {lastUpdated ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            ) : null}
          </div>
          <div className="prose prose-neutral max-w-none">
            <PortableTextRenderer value={policy.body} />
          </div>
        </div>
      </section>
    </main>
  );
}
