import { defineType } from "sanity";
import YouTubePreview from "@/sanity/schemas/previews/youtube-preview";
import VideoPreview from "@/sanity/schemas/previews/video-preview";

export default defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "string",
                title: "URL",
                validation: (Rule) =>
                  Rule.custom((value) => {
                    if (!value) return true;
                    const href = typeof value === "string" ? value : "";
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (href.startsWith("/")) return true;
                    if (href.startsWith("mailto:")) return true;
                    if (
                      href.startsWith("http://") ||
                      href.startsWith("https://")
                    ) {
                      return true;
                    }
                    if (emailPattern.test(href)) return true;
                    return "Use /, http(s)://, mailto:, or an email address.";
                  }),
              },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      type: "file",
      name: "videoFile",
      title: "Video File",
      options: {
        accept: "video/*",
      },
      preview: {
        select: {
          asset: "asset",
        },
      },
      components: {
        preview: VideoPreview,
      },
    },
    {
      type: "object",
      name: "youtube",
      title: "YouTube",
      fields: [
        {
          name: "url",
          type: "url",
          title: "YouTube URL",
        },
      ],
      preview: {
        select: {
          url: "url",
        },
      },
      components: {
        preview: YouTubePreview,
      },
    },
  ],
});
