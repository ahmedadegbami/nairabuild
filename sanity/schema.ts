import { type SchemaTypeDefinition } from "sanity";
import siteSettings from "./schemas/documents/site-settings";
import homeSettings from "./schemas/documents/home-settings";
import blogSettings from "./schemas/documents/blog-settings";
import commentSettings from "./schemas/documents/comment-settings";
import authorGuide from "./schemas/documents/author-guide";
import author from "./schemas/documents/author";
import category from "./schemas/documents/category";
import post from "./schemas/documents/post";
import comment from "./schemas/documents/comment";
import blockContent from "./schemas/objects/block-content";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    homeSettings,
    blogSettings,
    commentSettings,
    authorGuide,
    author,
    category,
    post,
    comment,
    blockContent,
  ],
};
