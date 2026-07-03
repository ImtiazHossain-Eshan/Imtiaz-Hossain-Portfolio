"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DemoConfig } from "@/lib/playground/demo-config";
import type { PrecomputedExample } from "@/lib/playground/types";
import { CompareSlider } from "./compare-slider";
import { cn } from "@/lib/utils";

/**
 * The computer-vision demo surface: an example picker feeding a before/after
 * comparison slider and a live prediction card. Mirrors the shape a hosted
 * inference call would return, so upgrading is a provider swap.
 */
export function CvCompare({ config }: { config: DemoConfig }) {
  const [selected, setSelected] = useState<PrecomputedExample>(config.examples[0]);
  const before = selected.layers?.find((l) => l.kind === "input");
  const after = selected.layers?.find((l) => l.kind === "overlay" || l.kind === "prediction");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        {before && after ? (
          <CompareSlider key={selected.id} before={before} after={after} />
        ) : null}
        <p className="label-mono mt-3 flex items-start gap-2">
          <span className="text-accent">i</span>
          {config.provenance}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Prediction card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="panel p-5"
          >
            <p className="label-mono mb-3">classifier output</p>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-2xl font-medium text-ink">{selected.prediction.label}</span>
              <span
                className={cn(
                  "font-mono text-sm",
                  selected.prediction.correct ? "text-good" : "text-warn",
                )}
              >
                {(selected.prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            {/* confidence bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${selected.prediction.confidence * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            {selected.prediction.metrics && (
              <dl className="mt-5 space-y-2 border-t border-line pt-4">
                {selected.prediction.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <dt className="label-mono">{m.label}</dt>
                    <dd className="font-mono text-sm text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {selected.note && <p className="mt-4 text-xs leading-relaxed text-faint">{selected.note}</p>}
          </motion.div>
        </AnimatePresence>

        {/* Example picker */}
        <div>
          <p className="label-mono mb-3">curated examples</p>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
            {config.examples.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelected(ex)}
                data-cursor-label="run"
                className={cn(
                  "group overflow-hidden rounded-lg border transition-colors duration-300",
                  selected.id === ex.id ? "border-accent" : "border-line hover:border-line-bright",
                )}
              >
                <span className="block aspect-square overflow-hidden bg-black">
                  <Image
                    src={ex.thumb}
                    alt={ex.label}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span
                  className={cn(
                    "label-mono block truncate px-2 py-1.5 text-[9px]",
                    selected.id === ex.id ? "text-accent" : "",
                  )}
                >
                  {ex.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
