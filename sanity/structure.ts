import {
  Settings,
  FileText,
  Tags,
  User,
  MessageSquare,
  Home,
  BookOpen,
  PenSquare,
  Shield,
} from "lucide-react";

export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Posts")
        .icon(FileText)
        .child(
          S.documentTypeList("post")
            .title("Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Categories")
        .icon(Tags)
        .child(S.documentTypeList("category").title("Categories")),
      S.listItem()
        .title("Authors")
        .icon(User)
        .child(S.documentTypeList("author").title("Authors")),
      S.listItem()
        .title("Comments")
        .icon(MessageSquare)
        .child(
          S.documentTypeList("comment")
            .title("Comments")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }])
        ),
      S.divider(),
      S.listItem()
        .title("Home Settings")
        .icon(Home)
        .child(
          S.editor()
            .id("homeSettings")
            .schemaType("homeSettings")
            .documentId("homeSettings")
        ),
      S.listItem()
        .title("Blog Settings")
        .icon(BookOpen)
        .child(
          S.editor()
            .id("blogSettings")
            .schemaType("blogSettings")
            .documentId("blogSettings")
        ),
      S.listItem()
        .title("Comment Settings")
        .icon(MessageSquare)
        .child(
          S.editor()
            .id("commentSettings")
            .schemaType("commentSettings")
            .documentId("commentSettings")
        ),
      S.listItem()
        .title("Author Guide")
        .icon(PenSquare)
        .child(
          S.editor()
            .id("authorGuide")
            .schemaType("authorGuide")
            .documentId("authorGuide")
        ),
      S.listItem()
        .title("Privacy Policy")
        .icon(Shield)
        .child(
          S.editor()
            .id("privacyPolicy")
            .schemaType("privacyPolicy")
            .documentId("privacyPolicy")
        ),
      S.listItem()
        .title("Site Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
    ]);
