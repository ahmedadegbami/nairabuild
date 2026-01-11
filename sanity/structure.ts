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

export const structure = (S: any, context: any) =>
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
        .child(() => {
          const email = context?.currentUser?.email as string | undefined;
          return S.list()
            .title("Comments")
            .items([
              S.listItem()
                .title("All Comments")
                .child(
                  S.documentTypeList("comment")
                    .title("All Comments")
                    .defaultOrdering([
                      { field: "createdAt", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("My Post Comments")
                .child(
                  email
                    ? S.documentTypeList("comment")
                        .title("My Post Comments")
                        .filter(
                          `_type == "comment" && post->author->authorEmail == $email`
                        )
                        .params({ email })
                        .defaultOrdering([
                          { field: "createdAt", direction: "desc" },
                        ])
                    : S.documentList()
                        .title("My Post Comments")
                        .filter(`_id == "no-user"`)
                ),
            ]);
        }),
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
