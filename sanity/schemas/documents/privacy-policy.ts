import { defineField, defineType } from "sanity";
import { Shield } from "lucide-react";

export default defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "document",
  icon: Shield,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Privacy Policy",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Privacy Policy" };
    },
  },
});
