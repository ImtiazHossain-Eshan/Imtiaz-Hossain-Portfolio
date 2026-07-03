"use client";

import { motion } from "motion/react";
import type { PipelineStage } from "@/lib/playground/demo-config";

/**
 * The staged pipeline story: Dataset to Inference. Each stage animates in on
 * scroll with a connecting spine, framing the demo as a lab walkthrough.
 */
export function PipelineStages({ stages }: { stages: PipelineStage[] }) {
  return (
    <ol className="relative">
      {stages.map((stage, i) => (
        <li key={stage.id} className="relative grid gap-6 pb-14 md:grid-cols-[8rem_1fr] md:gap-10">
          {/* spine */}
          {i < stages.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[3px] top-6 hidden h-full w-px bg-line md:left-[calc(8rem+0.5rem)] md:block"
            />
          )}
          <motion.div
            className="flex items-center gap-3 md:flex-col md:items-start md:gap-2"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="relative z-10 hidden h-2.5 w-2.5 shrink-0 rounded-full border border-accent bg-bg md:block md:self-end md:translate-x-[calc(0.5rem-1px)]" />
            <span className="label-mono text-accent/80">{stage.label}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-xl font-medium tracking-tight text-ink md:text-2xl">{stage.title}</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-dim">{stage.body}</p>
            {stage.detail && (
              <div className="mt-4 flex flex-wrap gap-2">
                {stage.detail.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-faint"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </li>
      ))}
    </ol>
  );
}
