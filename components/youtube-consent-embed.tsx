"use client";

import { useState } from "react";

type YouTubeConsentEmbedProps = {
  videoId: string;
  url: string;
};

export default function YouTubeConsentEmbed({
  videoId,
  url,
}: YouTubeConsentEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/60">
      {isLoaded ? (
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          type="button"
          className="group relative aspect-video w-full overflow-hidden bg-black"
          onClick={() => setIsLoaded(true)}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube preview"
            className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/50 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground shadow-lg">
              Play YouTube video
            </div>
          </div>
        </button>
      )}
      <div className="border-t border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        By clicking play, you allow YouTube to process your data.{" "}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline decoration-amber-400/80 underline-offset-4"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
