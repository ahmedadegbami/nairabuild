import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "blogSettings",
  title: "Blog Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "underConstruction",
      title: "Under Construction",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      initialValue: "The blog is under construction.",
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Blog Settings" };
    },
  },
});
