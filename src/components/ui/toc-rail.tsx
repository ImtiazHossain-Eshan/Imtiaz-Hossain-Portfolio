"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocEntry = { title: string; url: string; items: TocEntry[] };

function flatten(entries: TocEntry[], depth = 0): Array<{ title: string; url: string; depth: number }> {
  return entries.flatMap((entry) => [
    { title: entry.title, url: entry.url, depth },
    ...flatten(entry.items ?? [], depth + 1),
  ]);
}

/**
 * Floating table of contents with scrollspy. Renders on xl screens only;
 * document order carries the small-screen experience.
 */
export function TocRail({ toc, label = "contents" }: { toc: TocEntry[]; label?: string }) {
  const entries = flatten(toc).filter((e) => e.depth < 2);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;
    const headings = entries
      .map((e) => document.getElementById(decodeURIComponent(e.url.replace("#", ""))))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((o) => o.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (entries.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="fixed right-[max(1.5rem,calc((100vw-80rem)/2-14rem))] top-32 hidden w-52 2xl:block"
    >
      <p className="label-mono mb-4">{label}</p>
      <ul className="space-y-2 border-l border-line pl-4">
        {entries.map((entry) => {
          const id = decodeURIComponent(entry.url.replace("#", ""));
          return (
            <li key={entry.url} style={{ paddingLeft: entry.depth * 12 }}>
              <a
                href={entry.url}
                className={cn(
                  "block text-[12.5px] leading-snug transition-colors duration-200",
                  activeId === id ? "text-accent" : "text-faint hover:text-dim",
                )}
              >
                {entry.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
