import React from "react";

type YoutubePreviewProps = {
  value?: {
    url?: string;
  };
  url?: string;
};

const extractYouTubeId = (url: string) => {
  const idMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return idMatch?.[1] || null;
};

export default function YouTubePreview({ value, url }: YoutubePreviewProps) {
  const videoUrl = value?.url || url;
  if (!videoUrl) {
    return <div>No YouTube URL</div>;
  }

  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      style={{ display: "block", textDecoration: "none" }}
    >
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <img
          src={thumbnail}
          alt="YouTube preview"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
            color: "white",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          Open on YouTube
        </div>
      </div>
    </a>
  );
}
