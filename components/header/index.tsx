import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          aria-label="Home page"
          className="flex items-center pt-4"
        >
          <Image
            src="/naira_build_logo.svg"
            alt="Naira Build"
            width={100}
            height={80}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
