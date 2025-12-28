import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const getWriteClient = () => {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!writeToken) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
  });
};
