import React from "react";
import { dataset, projectId } from "@/sanity/env";

type VideoPreviewValue = {
  asset?: {
    _ref?: string;
    url?: string;
  };
  url?: string;
};

type VideoPreviewProps = {
  value?: VideoPreviewValue;
  asset?: VideoPreviewValue["asset"];
};

export default function VideoPreview(props: VideoPreviewProps) {
  const value: VideoPreviewValue | undefined = props.value;
  const asset = value?.asset ?? props.asset;
  const fileRef = asset?._ref as string | undefined;
  const url =
    asset?.url ||
    value?.url ||
    (fileRef ? buildFileUrl(fileRef, projectId, dataset) : null);
  if (!url) {
    return <div>No video</div>;
  }

  return (
    <video style={{ width: "100%" }} controls preload="metadata">
      <source src={url} />
    </video>
  );
}

const buildFileUrl = (ref: string, projId: string, dataSet: string) => {
  const match = ref.match(/^file-([^-]+)-([a-z0-9]+)$/i);
  if (!match) {
    return null;
  }

  const [, assetId, extension] = match;
  return `https://cdn.sanity.io/files/${projId}/${dataSet}/${assetId}.${extension}`;
};
