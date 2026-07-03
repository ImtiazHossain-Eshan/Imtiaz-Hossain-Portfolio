"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ComparisonLayer } from "@/lib/playground/types";

/**
 * Before/after wipe between two image layers. Draggable handle plus keyboard
 * support (arrow keys on the slider role). Works for pointer and touch.
 */
export function CompareSlider({ before, after }: { before: ComparisonLayer; after: ComparisonLayer }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragging.current) setFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full select-none overflow-hidden rounded-xl border border-line bg-black"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      {/* after layer (full) */}
      <Image
        src={after.src}
        alt={after.label}
        fill
        sizes="(max-width: 768px) 100vw, 560px"
        className="object-contain"
        priority
      />
      {/* before layer (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={before.src}
          alt={before.label}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-contain"
        />
      </div>

      {/* labels */}
      <span className="label-mono pointer-events-none absolute left-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 backdrop-blur-sm">
        {before.label}
      </span>
      <span className="label-mono pointer-events-none absolute right-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 text-accent backdrop-blur-sm">
        {after.label}
      </span>

      {/* handle */}
      <div
        role="slider"
        aria-label="Compare input and prediction"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
        className="absolute inset-y-0 z-10 flex w-1 cursor-ew-resize items-center justify-center bg-accent/80 outline-none focus-visible:bg-accent"
        style={{ left: `calc(${pos}% - 2px)` }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-bg text-accent shadow-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 4L2 8l4 4M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
