import { fetchSiteSettings } from "@/sanity/lib/fetch";

export default async function Footer() {
  const settings = await fetchSiteSettings();
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-2 py-8 text-center text-xs text-foreground/60">
        <span>
          &copy; {new Date().getFullYear()} {settings?.siteName}
        </span>
        {settings?.footerText ? <span>{settings.footerText}</span> : null}
      </div>
    </footer>
  );
}
