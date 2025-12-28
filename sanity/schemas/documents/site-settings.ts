import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Nairabuild",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      initialValue: "All rights reserved.",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
    },
    prepare({ title }) {
      return {
        title: title || "Site Settings",
      };
    },
  },
});
