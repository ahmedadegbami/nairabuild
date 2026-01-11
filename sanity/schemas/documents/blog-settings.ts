import { defineField, defineType } from "sanity";
import { BookOpen } from "lucide-react";

export default defineType({
  name: "blogSettings",
  title: "Blog Settings",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "backToPostsLabel",
      title: "Back to Posts Label",
      type: "string",
    }),
    defineField({
      name: "relatedPostsTitle",
      title: "Related Posts Title",
      type: "string",
    }),
    defineField({
      name: "imageCreditLabel",
      title: "Image Credit Label",
      type: "string",
      description: "Label shown above or beside the main image credit.",
      initialValue: "Image credit",
    }),
    defineField({
      name: "mediaCreditLabel",
      title: "Media Credit Label",
      type: "string",
      description: "Label shown beside image/video credits inside post bodies.",
      initialValue: "Credit",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Blog Settings" };
    },
  },
});
