import { type SchemaTypeDefinition } from "sanity";
import blogSettings from "./schemas/documents/blog-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blogSettings,
  ],
};
