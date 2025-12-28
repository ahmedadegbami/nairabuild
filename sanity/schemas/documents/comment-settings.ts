import { defineField, defineType } from "sanity";
import { MessageSquare } from "lucide-react";

export default defineType({
  name: "commentSettings",
  title: "Comment Settings",
  type: "document",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "commentsTitle",
      title: "Comments Section Title",
      type: "string",
    }),
    defineField({
      name: "commentFormTitle",
      title: "Comment Form Title",
      type: "string",
    }),
    defineField({
      name: "commentsEmptyText",
      title: "Comments Empty Text",
      type: "string",
    }),
    defineField({
      name: "commentNameLabel",
      title: "Comment Name Label",
      type: "string",
    }),
    defineField({
      name: "commentNamePlaceholder",
      title: "Comment Name Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentEmailLabel",
      title: "Comment Email Label",
      type: "string",
    }),
    defineField({
      name: "commentEmailPlaceholder",
      title: "Comment Email Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentBodyLabel",
      title: "Comment Body Label",
      type: "string",
    }),
    defineField({
      name: "commentBodyPlaceholder",
      title: "Comment Body Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentSubmitLabel",
      title: "Comment Submit Label",
      type: "string",
    }),
    defineField({
      name: "commentSuccessMessage",
      title: "Comment Success Message",
      type: "string",
    }),
    defineField({
      name: "commentErrorMessage",
      title: "Comment Error Message",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Comment Settings" };
    },
  },
});
