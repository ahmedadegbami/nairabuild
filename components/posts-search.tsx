"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type PostsSearchProps = {
  initialQuery?: string;
  category?: string;
};

export default function PostsSearch({ initialQuery = "", category }: PostsSearchProps) {
  const [value, setValue] = useState(initialQuery);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      const trimmed = value.trim();
      if (category) params.set("category", category);
      if (trimmed) params.set("q", trimmed);
      const query = params.toString();
      const url = `${pathname}${query ? `?${query}` : ""}#latest-posts`;
      router.replace(url, { scroll: false });
    }, 350);

    return () => clearTimeout(handler);
  }, [value, category, pathname, router]);

  return (
    <div className="w-full max-w-sm md:max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search posts..."
          className="w-full bg-transparent text-sm outline-none"
          aria-label="Search posts"
        />
      </div>
    </div>
  );
}
