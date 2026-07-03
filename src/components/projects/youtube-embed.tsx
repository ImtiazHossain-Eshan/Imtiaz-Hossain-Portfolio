"use client";

import { useState } from "react";

/**
 * Facade YouTube embed for smooth page loads: shows the poster thumbnail with
 * a play button and only injects the real (heavy) player iframe on click.
 * Uses youtube-nocookie for privacy. maxres poster falls back to hq on error.
 */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          data-cursor-label="play"
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            loading="lazy"
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
          />
          {/* scrim */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/20"
          />
          {/* play button */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-bg/70 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/15">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="ml-1 text-accent">
                <path d="M5 3.5v15l14-7.5-14-7.5Z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="label-mono absolute bottom-4 left-4 text-ink/90">{title}</span>
        </button>
      )}
    </div>
  );
}
