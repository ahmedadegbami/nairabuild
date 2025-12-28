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
  ],
  preview: {
    prepare() {
      return { title: "Blog Settings" };
    },
  },
});
