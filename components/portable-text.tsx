import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { dataset, projectId } from "@/sanity/env";
import YouTubeConsentEmbed from "@/components/youtube-consent-embed";

const buildComponents = (creditLabel?: string): PortableTextComponents => ({
  block: {
    h2: ({ children }) => (
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-2 border-l-2 pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mt-0 text-base leading-snug text-foreground/90 first:mt-0">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const rawHref = value?.href as string | undefined;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = rawHref ? emailPattern.test(rawHref) : false;
      const href =
        rawHref && isEmail && !rawHref.startsWith("mailto:")
          ? `mailto:${rawHref}`
          : rawHref;
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="underline decoration-amber-400/80 underline-offset-4"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-0 list-disc space-y-2 pl-5 leading-normal text-foreground/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-0 list-decimal space-y-2 pl-5 leading-normal text-foreground/90">
        {children}
      </ol>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const alt = value?.alt || "Post image";
      const src = urlFor(value).width(1400).url();
      const credit = value?.credit as string | undefined;
      const creditUrl = value?.creditUrl as string | undefined;

      return (
        <figure className="mt-2">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={src}
              alt={alt}
              width={1400}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
          {credit ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {creditLabel ? `${creditLabel}: ` : ""}
              {creditUrl ? (
                <a
                  href={creditUrl}
                  className="underline decoration-amber-400/80 underline-offset-4"
                  rel="noreferrer"
                  target="_blank"
                >
                  {credit}
                </a>
              ) : (
                <span>{credit}</span>
              )}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    videoFile: ({ value }) => {
      const fileRef = value?.asset?._ref as string | undefined;
      const url =
        value?.asset?.url ||
        (fileRef ? buildFileUrl(fileRef, projectId, dataset) : null);
      if (!url) {
        return null;
      }
      const credit = value?.credit as string | undefined;
      const creditUrl = value?.creditUrl as string | undefined;

      return (
        <figure className="mt-2">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-black">
            <video className="w-full" controls preload="metadata">
              <source src={url} />
            </video>
          </div>
          {credit ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {creditLabel ? `${creditLabel}: ` : ""}
              {creditUrl ? (
                <a
                  href={creditUrl}
                  className="underline decoration-amber-400/80 underline-offset-4"
                  rel="noreferrer"
                  target="_blank"
                >
                  {credit}
                </a>
              ) : (
                <span>{credit}</span>
              )}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    youtube: ({ value }) => {
      const url = value?.url as string | undefined;
      if (!url) {
        return null;
      }
      const credit = value?.credit as string | undefined;
      const creditUrl = value?.creditUrl as string | undefined;

      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return (
          <figure className="mt-2">
            <p className="text-sm">
              <a
                href={url}
                className="underline decoration-amber-400/80 underline-offset-4"
              >
                {url}
              </a>
            </p>
            {credit ? (
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {creditLabel ? `${creditLabel}: ` : ""}
                {creditUrl ? (
                  <a
                    href={creditUrl}
                    className="underline decoration-amber-400/80 underline-offset-4"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {credit}
                  </a>
                ) : (
                  <span>{credit}</span>
                )}
              </figcaption>
            ) : null}
          </figure>
        );
      }

      return (
        <figure className="mt-2">
          <YouTubeConsentEmbed videoId={videoId} url={url} />
          {credit ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {creditLabel ? `${creditLabel}: ` : ""}
              {creditUrl ? (
                <a
                  href={creditUrl}
                  className="underline decoration-amber-400/80 underline-offset-4"
                  rel="noreferrer"
                  target="_blank"
                >
                  {credit}
                </a>
              ) : (
                <span>{credit}</span>
              )}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
});

const buildFileUrl = (ref: string, projId: string, dataSet: string) => {
  const match = ref.match(/^file-([^-]+)-([a-z0-9]+)$/i);
  if (!match) {
    return null;
  }

  const [, assetId, extension] = match;
  return `https://cdn.sanity.io/files/${projId}/${dataSet}/${assetId}.${extension}`;
};

const extractYouTubeId = (url: string) => {
  const idMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return idMatch?.[1] || null;
};

export default function PortableTextRenderer({
  value,
  creditLabel,
}: {
  value: any;
  creditLabel?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <PortableText value={value} components={buildComponents(creditLabel)} />
  );
}
