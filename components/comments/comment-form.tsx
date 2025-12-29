"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type CommentFormLabels = {
  title?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  bodyLabel?: string;
  bodyPlaceholder?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  rateLimitMessage?: string;
};

type CommentFormProps = {
  postId: string;
  labels: CommentFormLabels;
  parentId?: string;
  showTitle?: boolean;
  onSuccess?: (comment: {
    _id: string;
    name: string;
    body: string;
    createdAt?: string;
    parentId?: string | null;
    isStaff?: boolean;
    userId?: string | null;
    editedAt?: string | null;
    deletedAt?: string | null;
    staffAuthor?: {
      _id?: string;
      name?: string;
      slug?: { current: string };
    };
  }) => void;
};

export default function CommentForm({
  postId,
  labels,
  parentId,
  showTitle = true,
  onSuccess,
}: CommentFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    body: "",
    website: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      setStatus("error");
      return;
    }

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        postId,
        parentId,
        name: form.name.trim(),
        email: form.email.trim(),
        body: form.body.trim(),
        website: form.website.trim(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setForm({ name: "", email: "", body: "", website: "" });
      setStatus("success");
      setErrorMessage(null);
      if (data?.comment?._id) {
        onSuccess?.(data.comment);
      }
      router.refresh();
      return;
    }

    if (response.status === 429) {
      setErrorMessage(labels.rateLimitMessage || labels.errorMessage || "");
      setStatus("error");
      return;
    }

    setErrorMessage(labels.errorMessage || "");
    setStatus("error");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      {showTitle && labels.title ? (
        <h3 className="text-lg font-semibold">{labels.title}</h3>
      ) : null}
      <div className="grid gap-2 text-left">
        <label className="text-sm font-medium">{labels.nameLabel}</label>
        <input
          className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={labels.namePlaceholder}
          required
        />
      </div>
      <div className="grid gap-2 text-left">
        <label className="text-sm font-medium">{labels.bodyLabel}</label>
        <textarea
          className="min-h-[140px] rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder={labels.bodyPlaceholder}
          required
        />
      </div>
      <div className="hidden">
        <label className="text-sm font-medium">Website</label>
        <input
          className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Your website"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60 md:w-48"
        disabled={status === "loading"}
      >
        {labels.submitLabel}
      </button>
      {status === "success" ? (
        <p className="text-sm text-emerald-600">{labels.successMessage}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500">
          {errorMessage || labels.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
