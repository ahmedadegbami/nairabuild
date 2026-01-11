import { defineField, defineType } from "sanity";
import { Home } from "lucide-react";

export default defineType({
  name: "homeSettings",
  title: "Home Settings",
  type: "document",
  icon: Home,
  fields: [
    defineField({
      name: "homeIntroEyebrow",
      title: "Intro Eyebrow",
      type: "string",
    }),
    defineField({
      name: "homeIntroTitle",
      title: "Intro Title",
      type: "string",
    }),
    defineField({
      name: "homeIntroSubtitle",
      title: "Intro Subtitle",
      type: "text",
    }),
    defineField({
      name: "homeIntroPrimaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
    }),
    defineField({
      name: "homeIntroPrimaryCtaUrl",
      title: "Primary CTA URL",
      type: "string",
      description: "Use / for internal links or https:// for external.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/")) return true;
          if (value.startsWith("http://") || value.startsWith("https://"))
            return true;
          return "Use / for internal or http(s):// for external.";
        }),
    }),
    defineField({
      name: "homeIntroSecondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
    }),
    defineField({
      name: "homeIntroSecondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      description: "Use /, https://, or mailto: links.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/")) return true;
          if (value.startsWith("mailto:")) return true;
          if (value.startsWith("http://") || value.startsWith("https://"))
            return true;
          return "Use /, http(s)://, or mailto:.";
        }),
    }),
    defineField({
      name: "homeFeaturedLabel",
      title: "Featured Label",
      type: "string",
    }),
    defineField({
      name: "homeFeaturedPosts",
      title: "Featured Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "categoriesTitle",
      title: "Categories Section Title",
      type: "string",
    }),
    defineField({
      name: "allCategoriesLabel",
      title: "All Categories Label",
      type: "string",
    }),
    defineField({
      name: "postsTitle",
      title: "Posts Section Title",
      type: "string",
    }),
    defineField({
      name: "emptyPostsText",
      title: "Empty Posts Text",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Settings" };
    },
  },
});
