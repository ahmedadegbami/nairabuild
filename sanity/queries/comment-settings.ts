import { groq } from "next-sanity";

export const COMMENT_SETTINGS_QUERY = groq`*[_type == "commentSettings"][0]{
  commentsTitle,
  commentFormTitle,
  commentsEmptyText,
  commentNameLabel,
  commentNamePlaceholder,
  commentEmailLabel,
  commentEmailPlaceholder,
  commentBodyLabel,
  commentBodyPlaceholder,
  commentSubmitLabel,
  commentSuccessMessage,
  commentErrorMessage
}`;
