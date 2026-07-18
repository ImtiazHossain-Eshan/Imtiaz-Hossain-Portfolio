"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn, fig } from "@/lib/utils";

export type ProjectRow = {
  slug: string;
  url: string;
  title: string;
  tagline: string;
  category: "ai" | "fullstack" | "systems" | "games";
  period: string;
  status: string;
  cover?: string;
  featured: number;
};

const lenses = [
  { id: "all", label: "Everything" },
  { id: "ai", label: "AI & Research" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "systems", label: "Systems" },
  { id: "games", label: "Games" },
] as const;

const categoryLabel: Record<ProjectRow["category"], string> = {
  ai: "ai / research",
  fullstack: "full-stack",
  systems: "systems",
  games: "games",
};

/**
 * The lab logbook: a filterable index where hovering a row floats its cover
 * screenshot alongside the cursor (desktop, motion-permitting).
 */
export function ProjectIndex({ projects }: { projects: ProjectRow[] }) {
  const [lens, setLens] = useState<(typeof lenses)[number]["id"]>("all");
  const [hovered, setHovered] = useState<ProjectRow | null>(null);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const visible = useMemo(
    () => (lens === "all" ? projects : projects.filter((p) => p.category === lens)),
    [lens, projects],
  );

  function handleMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    x.set(e.clientX + 28);
    y.set(e.clientY - 120);
  }

  return (
    <div onPointerMove={reduced ? undefined : handleMove}>
      <div className="mb-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {lenses.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={lens === option.id}
            onClick={() => setLens(option.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-[13px] transition-colors duration-300",
              lens === option.id
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-line text-dim hover:border-line-bright hover:text-ink",
            )}
          >
            {option.label}
            <span className="ml-2 font-mono text-[10px] text-faint">
              {option.id === "all"
                ? projects.length
                : projects.filter((p) => p.category === option.id).length}
            </span>
          </button>
        ))}
      </div>

      <div ref={listRef} className="border-t border-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout={reduced ? false : true}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={project.url}
                data-cursor-label="open"
                onPointerEnter={() => setHovered(project)}
                onPointerLeave={() => setHovered(null)}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-line py-7 transition-colors duration-300 hover:bg-surface/60 sm:grid-cols-[3.5rem_1fr_auto_auto] sm:gap-x-8 md:py-9"
              >
                <span className="label-mono">{fig(i + 1)}</span>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl md:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-dim sm:mt-2">
                    {project.tagline}
                  </p>
                  {/* Inline thumb for touch layouts */}
                  {project.cover && (
                    <div className="mt-4 overflow-hidden rounded-lg border border-line md:hidden">
                      <Image
                        src={project.cover}
                        alt=""
                        width={800}
                        height={500}
                        sizes="100vw"
                        className="h-auto w-full"
                      />
                    </div>
                  )}
                </div>
                <span className="label-mono hidden sm:block">{categoryLabel[project.category]}</span>
                <span className="label-mono justify-self-end">
                  {project.period}
                  {project.status === "live" && <span className="ml-2 text-good">● live</span>}
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cursor-following preview */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] overflow-hidden rounded-xl border border-line-bright shadow-2xl shadow-shadow/40 md:block"
          style={{ x: sx, y: sy }}
          animate={{ opacity: hovered?.cover ? 1 : 0, scale: hovered?.cover ? 1 : 0.94 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {hovered?.cover && (
            <Image
              src={hovered.cover}
              alt=""
              width={704}
              height={440}
              sizes="22rem"
              className="h-auto w-full bg-surface"
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
