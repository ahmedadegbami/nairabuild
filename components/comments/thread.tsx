"use client";

import { useEffect, useState } from "react";
import CommentForm from "@/components/comments/comment-form";

type CommentNode = {
  _id: string;
  name: string;
  body: string;
  createdAt?: string;
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
  successMessage?: string;
  errorMessage?: string;
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
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<CommentNode[]>(comments);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const insertComment = (
    items: CommentNode[],
    comment: Omit<CommentNode, "replies"> & { parentId?: string | null }
  ): CommentNode[] => {
    if (!comment.parentId) {
      return [...items, { ...comment, replies: [] }];
    }

    const updated = items.map((item) => {
      if (item._id === comment.parentId) {
        return { ...item, replies: [...item.replies, { ...comment, replies: [] }] };
      }

      if (item.replies.length) {
        return { ...item, replies: insertComment(item.replies, comment) };
      }

      return item;
    });

    return updated;
  };

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
      "bg-white border-zinc-200 shadow-sm",
      "bg-zinc-50 border-zinc-300",
      "bg-zinc-100 border-zinc-300",
      "bg-zinc-200 border-zinc-300",
    ];
    const depthClass = depthStyles[Math.min(depth, depthStyles.length - 1)];

    const timestamp = comment.createdAt
      ? new Date(comment.createdAt).toLocaleString()
      : null;

    return (
      <div
        key={comment._id}
        className={`rounded-2xl border p-5 ${depthClass} ${
          depth > 0 ? "mt-4" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span>{comment.name}</span>
          {timestamp ? (
            <span className="text-xs font-medium text-muted-foreground">
              {timestamp}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{comment.body}</p>
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
            onClick={() =>
              setReplyTo((current) =>
                current === comment._id ? null : comment._id
              )
            }
          >
            Reply
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
                ? "Hide replies"
                : `Show replies (${comment.replies.length})`}
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
          <div className="mt-4 border-l-2 border-zinc-300 pl-4">
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
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-full border border-border/70 px-4 text-xs font-semibold uppercase tracking-widest transition hover:bg-muted"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? "Hide form" : "Leave a comment"}
        </button>
      </div>
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
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : null}
      {localComments.map((comment) => renderComment(comment))}
    </div>
  );
}
