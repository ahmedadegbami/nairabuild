import { defineField, defineType } from "sanity";
import { MessageSquare } from "lucide-react";

export default defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Comment",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent Comment",
      type: "reference",
      to: [{ type: "comment" }],
      options: {
        filter: ({ document }) => {
          const current = document as {
            _id?: string;
            post?: { _ref?: string };
          };
          const postId = current.post?._ref;
          const selfId = current._id;
          if (!postId) {
            return { filter: `_type == "comment"` };
          }
          return {
            filter: `_type == "comment" && post._ref == $postId && _id != $selfId`,
            params: { postId, selfId },
          };
        },
      },
    }),
    defineField({
      name: "isStaff",
      title: "Verified Author Reply",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "staffAuthor",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Approved", value: "approved" },
          { title: "Pending", value: "pending" },
          { title: "Spam", value: "spam" },
        ],
      },
      initialValue: "approved",
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "ipHash",
      title: "IP Hash",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "editedAt",
      title: "Edited At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "deletedAt",
      title: "Deleted At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      body: "body",
      postTitle: "post.title",
    },
    prepare({ title, body, postTitle }) {
      const snippet = body ? `${body}`.slice(0, 80) : "";
      return {
        title: title || "Comment",
        subtitle: [snippet, postTitle].filter(Boolean).join(" · "),
      };
    },
  },
});
