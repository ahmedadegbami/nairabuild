"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CommentForm from "@/components/comments/comment-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MoreHorizontal } from "lucide-react";

type CommentNode = {
  _id: string;
  name: string;
  email?: string;
  body: string;
  createdAt?: string;
  isStaff?: boolean;
  staffAuthor?: {
    _id?: string;
    name?: string;
    slug?: { current: string };
  };
  userId?: string | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  replies: CommentNode[];
};

type CommentFormLabels = {
  title?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  bodyLabel?: string;
  bodyPlaceholder?: string;
  submitLabel?: string;
  signInTitle?: string;
  signInHelper?: string;
  signInButtonLabel?: string;
  signInSentMessage?: string;
  signInErrorMessage?: string;
  signOutLabel?: string;
  leaveLabel?: string;
  replyLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  editedLabel?: string;
  deletedLabel?: string;
  showRepliesLabel?: string;
  hideRepliesLabel?: string;
  authorBadgeLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  rateLimitMessage?: string;
};

type CommentThreadProps = {
  postId: string;
  comments: CommentNode[];
  labels: CommentFormLabels;
  emptyText?: string;
};

export default function CommentThread({
  postId,
  comments,
  labels,
  emptyText,
}: CommentThreadProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<CommentNode[]>(comments);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [editStatus, setEditStatus] = useState<"idle" | "saving" | "error">(
    "idle"
  );
  const [deleteTarget, setDeleteTarget] = useState<CommentNode | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "error"
  >("idle");

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }

    let mounted = true;
    const currentUrl = new URL(window.location.href);
    const code = currentUrl.searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ error }) => {
        if (!mounted) return;
        if (error) {
          setAuthChecked(true);
          return;
        }
        const { data } = await supabase.auth.getSession();
        setAuthUserEmail(data.session?.user?.email ?? null);
        setAuthUserId(data.session?.user?.id ?? null);
        setAuthChecked(true);
        setAuthStatus("idle");
        currentUrl.searchParams.delete("code");
        currentUrl.searchParams.delete("next");
        window.history.replaceState({}, "", currentUrl.toString());
      });
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthUserEmail(data.session?.user?.email ?? null);
      setAuthUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserEmail(session?.user?.email ?? null);
      setAuthUserId(session?.user?.id ?? null);
      setAuthChecked(true);
      if (session?.user?.email) {
        setAuthStatus("idle");
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const insertComment = (
    items: CommentNode[],
    comment: Omit<CommentNode, "replies"> & { parentId?: string | null }
  ): CommentNode[] => {
    if (!comment.parentId) {
      return [...items, { ...comment, replies: [] }];
    }

    const updated = items.map((item) => {
      if (item._id === comment.parentId) {
        return {
          ...item,
          replies: [...item.replies, { ...comment, replies: [] }],
        };
      }

      if (item.replies.length) {
        return { ...item, replies: insertComment(item.replies, comment) };
      }

      return item;
    });

    return updated;
  };

  const updateComment = (
    items: CommentNode[],
    commentId: string,
    updater: (comment: CommentNode) => CommentNode
  ): CommentNode[] =>
    items.map((item) => {
      if (item._id === commentId) {
        return updater(item);
      }
      if (item.replies.length) {
        return {
          ...item,
          replies: updateComment(item.replies, commentId, updater),
        };
      }
      return item;
    });

  const renderComment = (comment: CommentNode, depth = 0) => {
    const isExpanded = expanded[comment._id] ?? false;
    const hasReplies = comment.replies.length > 0;
    const shouldCollapse = depth >= 1;
    const visibleReplies = hasReplies
      ? shouldCollapse
        ? isExpanded
          ? comment.replies
          : []
        : comment.replies
      : [];

    const depthStyles = [
      "bg-transparent border-transparent shadow-none ring-0",
      "bg-muted/40 border-border/60",
      "bg-muted/60 border-border/60",
      "bg-muted/80 border-border/60",
    ];
    const depthClass = depthStyles[Math.min(depth, depthStyles.length - 1)];

    const timestamp = comment.createdAt
      ? new Date(comment.createdAt).toLocaleString()
      : null;
    const editedLabel =
      comment.editedAt && labels.editedLabel ? ` (${labels.editedLabel})` : "";
    const isOwnerById = !!authUserId && comment.userId === authUserId;
    const isOwnerByEmail =
      !comment.userId &&
      !!authUserEmail &&
      !!comment.email &&
      comment.email.toLowerCase() === authUserEmail.toLowerCase();
    const isOwner = isOwnerById || isOwnerByEmail;
    const isDeleted = !!comment.deletedAt || !comment.body;

    const displayName = comment.staffAuthor?.name || comment.name;

    return (
      <div
        key={comment._id}
        className={`relative ${depth === 0 ? "px-5 py-5" : "rounded-2xl border p-5"} ${depthClass} ${
          depth > 0 ? "mt-4" : ""
        }`}
      >
        {depth === 0 ? (
          <span className="absolute left-0 top-6 h-10 w-1 rounded-full bg-emerald-500/70" />
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
          <div className="flex flex-wrap items-center gap-2">
            <span>{displayName}</span>
            {comment.isStaff ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white">
                  ✓
                </span>
                {labels.authorBadgeLabel}
              </span>
            ) : null}
            {timestamp ? (
              <span className="text-xs font-medium text-muted-foreground">
                {timestamp}
                {editedLabel}
              </span>
            ) : null}
          </div>
          {isOwner && !isDeleted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 text-foreground/60 transition hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Comment actions</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setEditingId(comment._id);
                    setEditingBody(comment.body);
                  }}
                >
                  {labels.editLabel}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => {
                    setDeleteTarget(comment);
                    setDeleteStatus("idle");
                  }}
                >
                  {labels.deleteLabel}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        {editingId === comment._id ? (
          <div className="mt-3 space-y-3">
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              value={editingBody}
              onChange={(event) => setEditingBody(event.target.value)}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-foreground px-4 text-xs font-semibold uppercase tracking-widest text-background transition hover:opacity-90 disabled:opacity-60"
                disabled={editStatus === "saving"}
                onClick={async () => {
                  const scrollTop = window.scrollY;
                  if (!editingBody.trim()) {
                    setEditStatus("error");
                    return;
                  }
                  setEditStatus("saving");
                  const supabase = createSupabaseBrowserClient();
                  if (!supabase) {
                    setEditStatus("error");
                    return;
                  }
                  const { data: sessionData } = await supabase.auth.getSession();
                  const accessToken = sessionData?.session?.access_token;
                  if (!accessToken) {
                    setEditStatus("error");
                    return;
                  }
                  const response = await fetch(`/api/comments/${comment._id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ body: editingBody.trim() }),
                  });
                  if (!response.ok) {
                    setEditStatus("error");
                    return;
                  }
                  setLocalComments((prev) =>
                    updateComment(prev, comment._id, (item) => ({
                      ...item,
                      body: editingBody.trim(),
                      editedAt: new Date().toISOString(),
                    }))
                  );
                  setEditingId(null);
                  setEditingBody("");
                  setEditStatus("idle");
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: scrollTop });
                  });
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
                onClick={() => {
                  setEditingId(null);
                  setEditingBody("");
                  setEditStatus("idle");
                }}
              >
                Cancel
              </button>
              {editStatus === "error" ? (
                <span className="text-xs text-red-500">
                  Could not save changes.
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <p
            className={`mt-3 text-sm ${
              isDeleted ? "text-red-500" : "text-foreground/80"
            }`}
          >
            {isDeleted ? labels.deletedLabel : comment.body}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
            onClick={() => {
              if (!authUserEmail) {
                setShowAuthPrompt((value) => !value);
                return;
              }
              setReplyTo((current) =>
                current === comment._id ? null : comment._id
              );
            }}
          >
            {labels.replyLabel}
          </button>
          {hasReplies && shouldCollapse ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-foreground/70"
              onClick={() => {
                setReplyTo(null);
                setExpanded((prev) => ({
                  ...prev,
                  [comment._id]: !isExpanded,
                }));
              }}
            >
              {isExpanded ? "-" : "+"}
              {isExpanded
                ? labels.hideRepliesLabel
                : `${labels.showRepliesLabel} (${comment.replies.length})`}
            </button>
          ) : null}
        </div>
        {replyTo === comment._id ? (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment._id}
              labels={labels}
              showTitle={false}
              onSuccess={(created) => {
                setLocalComments((prev) => insertComment(prev, created));
                setReplyTo(null);
                setExpanded((prev) => ({ ...prev, [comment._id]: true }));
              }}
            />
          </div>
        ) : null}
        {visibleReplies.length ? (
          <div className="mt-4 border-l-2 border-border/60 pl-4">
            {visibleReplies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{labels.title}</h3>
        <div className="flex items-center gap-3">
          {authUserEmail ? (
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
              onClick={async () => {
                const supabase = createSupabaseBrowserClient();
                if (!supabase) {
                  return;
                }
                await supabase.auth.signOut();
              }}
            >
              {labels.signOutLabel}
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border/70 px-4 text-xs font-semibold uppercase tracking-widest transition hover:bg-muted"
            onClick={() => {
              if (authUserEmail) {
                setShowForm((value) => !value);
              } else {
                setShowAuthPrompt((value) => !value);
              }
            }}
          >
            {showForm ? "Hide form" : labels.leaveLabel}
          </button>
        </div>
      </div>
      {authChecked && !authUserEmail && showAuthPrompt ? (
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm">
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {labels.signInTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {labels.signInHelper}
              </p>
            </div>
            <form
              className="flex flex-col gap-3 md:flex-row md:items-center"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!authEmail) {
                  return;
                }
                setAuthStatus("loading");
                try {
                  const supabase = createSupabaseBrowserClient();
                  if (!supabase) {
                    setAuthStatus("error");
                    return;
                  }
                  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}#comments`;
                  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                    nextPath
                  )}`;
                  const { error } = await supabase.auth.signInWithOtp({
                    email: authEmail,
                    options: { emailRedirectTo: redirectTo },
                  });
                  setAuthStatus(error ? "error" : "sent");
                } catch {
                  setAuthStatus("error");
                }
              }}
            >
              <input
                className="h-10 flex-1 rounded-xl border border-border/70 bg-background px-3 text-sm"
                name="commentEmail"
                type="email"
                placeholder={labels.emailPlaceholder}
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                required
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-xs font-semibold uppercase tracking-widest text-background transition hover:opacity-90 disabled:opacity-60"
                disabled={authStatus === "loading"}
              >
                {labels.signInButtonLabel}
              </button>
            </form>
            {authStatus === "sent" && labels.signInSentMessage ? (
              <span className="text-xs text-emerald-600">
                {labels.signInSentMessage}
              </span>
            ) : null}
            {authStatus === "error" && labels.signInErrorMessage ? (
              <span className="text-xs text-red-500">
                {labels.signInErrorMessage}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      {showForm ? (
        <CommentForm
          postId={postId}
          labels={labels}
          showTitle={false}
          onSuccess={(created) => {
            setLocalComments((prev) => insertComment(prev, created));
            setShowForm(false);
          }}
        />
      ) : null}
      {!localComments.length && emptyText ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              <path d="M8 10h8M8 14h5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground">{emptyText}</p>
        </div>
      ) : null}
      {localComments.length ? (
        <div className="rounded-2xl border border-border/60 bg-background">
          {localComments.map((comment, index) => (
            <div
              key={comment._id}
              className={index ? "border-t border-border/60" : ""}
            >
              {renderComment(comment, 0)}
            </div>
          ))}
        </div>
      ) : null}
      <ConfirmDialog
        open={!!deleteTarget}
        title={
          labels.deleteLabel ? `${labels.deleteLabel} comment?` : "Delete comment?"
        }
        description="This cannot be undone."
        confirmLabel={labels.deleteLabel || "Delete"}
        cancelLabel="Cancel"
        confirmDisabled={deleteStatus === "deleting"}
        errorMessage={deleteStatus === "error" ? "Delete failed." : undefined}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteStatus("idle");
        }}
        onConfirm={async () => {
          if (!deleteTarget) return;
          const scrollTop = window.scrollY;
          setDeleteStatus("deleting");
          const supabase = createSupabaseBrowserClient();
          if (!supabase) {
            setDeleteStatus("error");
            return;
          }
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData?.session?.access_token;
          if (!accessToken) {
            setDeleteStatus("error");
            return;
          }
          const response = await fetch(`/api/comments/${deleteTarget._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            setDeleteStatus("error");
            return;
          }
          setLocalComments((prev) =>
            updateComment(prev, deleteTarget._id, (item) => ({
              ...item,
              body: "",
              deletedAt: new Date().toISOString(),
            }))
          );
          setDeleteTarget(null);
          setDeleteStatus("idle");
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollTop });
          });
        }}
      />
    </div>
  );
}
