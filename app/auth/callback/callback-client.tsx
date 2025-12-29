"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      return;
    }

    const code = searchParams.get("code");
    const nextPath = searchParams.get("next") ?? "/";

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) {
          router.replace(nextPath);
          return;
        }

        if (!code) {
          setStatus("error");
          setErrorMessage("Missing code in callback URL.");
          return;
        }

        supabase.auth
          .exchangeCodeForSession(code)
          .then(({ error }) => {
            if (error) {
              setErrorMessage(error.message);
              setStatus("error");
              return;
            }
            router.replace(nextPath);
          })
          .catch((err) => {
            setErrorMessage(err?.message || "Unknown error");
            setStatus("error");
          });
      })
      .catch((err) => {
        setErrorMessage(err?.message || "Unknown error");
        setStatus("error");
      });
  }, [router, searchParams]);

  if (status !== "error") {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Sign-in failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please request a new magic link and try again.
        </p>
        {errorMessage ? (
          <p className="mt-2 text-xs text-muted-foreground">{errorMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
