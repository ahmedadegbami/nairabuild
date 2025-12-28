import { Settings } from "lucide-react";

export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Blog Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("blogSettings")
            .schemaType("blogSettings")
            .documentId("blogSettings")
        ),
    ]);
