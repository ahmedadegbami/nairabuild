import { createBrowserClient } from "@supabase/ssr";

export const createSupabaseBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return null;
  }
  return createBrowserClient(url, anonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    cookies: {
      get(name) {
        if (typeof document === "undefined") return null;
        const entries = document.cookie.split("; ");
        for (const entry of entries) {
          const [key, ...rest] = entry.split("=");
          if (key === name) {
            return decodeURIComponent(rest.join("="));
          }
        }
        return null;
      },
      set(name, value, options) {
        if (typeof document === "undefined") return;
        let cookie = `${name}=${encodeURIComponent(value)}`;
        cookie += `; path=${options?.path ?? "/"}`;
        if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
        if (options?.secure) cookie += "; secure";
        document.cookie = cookie;
      },
      remove(name, options) {
        if (typeof document === "undefined") return;
        document.cookie = `${name}=; max-age=0; path=${options?.path ?? "/"}`;
      },
    },
  });
};
