import { fetchSanityBlogSettings } from "@/sanity/lib/fetch";

export default async function IndexPage() {
  const blogSettings = await fetchSanityBlogSettings();
  const isUnderConstruction = blogSettings?.underConstruction;
  const message =
    blogSettings?.message?.trim() || "The blog is under construction.";

  return (
    <section className="container py-16 xl:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center align-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to Nairabuild
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {isUnderConstruction ? message : "The blog is live."}
        </p>
      </div>
    </section>
  );
}
