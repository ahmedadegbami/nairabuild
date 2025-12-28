"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
};

type CommentFormProps = {
  postId: string;
  labels: CommentFormLabels;
};

export default function CommentForm({ postId, labels }: CommentFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

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

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        name: form.name.trim(),
        email: form.email.trim(),
        body: form.body.trim(),
        website: form.website.trim(),
      }),
    });

    if (response.ok) {
      setForm({ name: "", email: "", body: "", website: "" });
      setStatus("success");
      router.refresh();
      return;
    }

    setStatus("error");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      {labels.title ? (
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
        <label className="text-sm font-medium">{labels.emailLabel}</label>
        <input
          className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={labels.emailPlaceholder}
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
        className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
        disabled={status === "loading"}
      >
        {labels.submitLabel}
      </button>
      {status === "success" ? (
        <p className="text-sm text-emerald-600">{labels.successMessage}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500">{labels.errorMessage}</p>
      ) : null}
    </form>
  );
}
