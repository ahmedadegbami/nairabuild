import { defineField, defineType } from "sanity";
import { PenSquare } from "lucide-react";

export default defineType({
  name: "authorGuide",
  title: "Author Guide",
  type: "document",
  icon: PenSquare,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "emailLabel",
      title: "Email Label",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Contact",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Author Guide" };
    },
  },
});
