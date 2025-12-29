import { defineField, defineType } from "sanity";
import { MessageSquare } from "lucide-react";

export default defineType({
  name: "commentSettings",
  title: "Comment Settings",
  type: "document",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "commentsTitle",
      title: "Comments Section Title",
      type: "string",
    }),
    defineField({
      name: "commentFormTitle",
      title: "Comment Form Title",
      type: "string",
    }),
    defineField({
      name: "commentsEmptyText",
      title: "Comments Empty Text",
      type: "string",
    }),
    defineField({
      name: "commentNameLabel",
      title: "Comment Name Label",
      type: "string",
    }),
    defineField({
      name: "commentNamePlaceholder",
      title: "Comment Name Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentEmailLabel",
      title: "Comment Email Label",
      type: "string",
    }),
    defineField({
      name: "commentEmailPlaceholder",
      title: "Comment Email Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentBodyLabel",
      title: "Comment Body Label",
      type: "string",
    }),
    defineField({
      name: "commentBodyPlaceholder",
      title: "Comment Body Placeholder",
      type: "string",
    }),
    defineField({
      name: "commentSubmitLabel",
      title: "Comment Submit Label",
      type: "string",
    }),
    defineField({
      name: "commentSignInTitle",
      title: "Sign-In Title",
      type: "string",
    }),
    defineField({
      name: "commentSignInHelper",
      title: "Sign-In Helper Text",
      type: "string",
    }),
    defineField({
      name: "commentSignInButtonLabel",
      title: "Sign-In Button Label",
      type: "string",
    }),
    defineField({
      name: "commentSignInSentMessage",
      title: "Sign-In Sent Message",
      type: "string",
    }),
    defineField({
      name: "commentSignInErrorMessage",
      title: "Sign-In Error Message",
      type: "string",
    }),
    defineField({
      name: "commentSignOutLabel",
      title: "Sign Out Label",
      type: "string",
    }),
    defineField({
      name: "commentLeaveLabel",
      title: "Leave Comment Label",
      type: "string",
    }),
    defineField({
      name: "commentReplyLabel",
      title: "Reply Label",
      type: "string",
    }),
    defineField({
      name: "commentEditLabel",
      title: "Edit Label",
      type: "string",
    }),
    defineField({
      name: "commentDeleteLabel",
      title: "Delete Label",
      type: "string",
    }),
    defineField({
      name: "commentEditedLabel",
      title: "Edited Label",
      type: "string",
    }),
    defineField({
      name: "commentDeletedLabel",
      title: "Deleted Text",
      type: "string",
    }),
    defineField({
      name: "commentShowRepliesLabel",
      title: "Show Replies Label",
      type: "string",
    }),
    defineField({
      name: "commentHideRepliesLabel",
      title: "Hide Replies Label",
      type: "string",
    }),
    defineField({
      name: "commentAuthorBadgeLabel",
      title: "Author Badge Label",
      type: "string",
    }),
    defineField({
      name: "commentSuccessMessage",
      title: "Comment Success Message",
      type: "string",
    }),
    defineField({
      name: "commentErrorMessage",
      title: "Comment Error Message",
      type: "string",
    }),
    defineField({
      name: "commentRateLimitMessage",
      title: "Comment Rate Limit Message",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Comment Settings" };
    },
  },
});
