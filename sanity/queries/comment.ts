import { groq } from "next-sanity";

export const COMMENTS_BY_POST_QUERY = groq`*[_type == "comment" && post._ref == $postId && status == "approved"] | order(createdAt asc){
  _id,
  name,
  body,
  createdAt,
  "parentId": parent._ref
}`;
