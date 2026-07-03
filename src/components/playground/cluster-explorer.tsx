"use client";

import { motion } from "motion/react";
import { swqModels, swqFeatures } from "@/lib/playground/demos/software-quality";
import { cn } from "@/lib/utils";

const maxF1 = Math.max(...swqModels.map((m) => m.f1));

/**
 * The software-quality demo surface: a supervised scoreboard bar chart plus a
 * feature spread table, framing the honest "weak signal" result. The k-means
 * PCA projection lives in the evaluation figures below.
 */
export function ClusterExplorer() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Scoreboard */}
      <div className="panel p-6">
        <p className="label-mono mb-5">supervised scoreboard / weighted F1</p>
        <div className="space-y-4">
          {swqModels.map((m, i) => (
            <div key={m.model}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className={cn("text-sm", m.best ? "text-ink" : "text-dim")}>
                  {m.model}
                  {m.best && <span className="ml-2 text-[11px] text-accent">best</span>}
                </span>
                <span className="font-mono text-sm text-ink">{m.f1.toFixed(4)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-raised">
                <motion.div
                  className={cn("h-full rounded-full", m.best ? "bg-accent" : "bg-line-bright")}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(m.f1 / maxF1) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-faint">
          For a three-class problem, chance is ~0.33. Every model hovers just above it. The
          simple decision tree, not the random forest or neural network, leads.
        </p>
      </div>

      {/* Feature spread */}
      <div className="panel p-6">
        <p className="label-mono mb-5">the nine code metrics / spread</p>
        <div className="space-y-3">
          {swqFeatures.map((f) => {
            const range = f.max - f.min;
            const meanPos = ((f.mean - f.min) / range) * 100;
            const stdWidth = Math.min(100, (f.std / range) * 100);
            const stdLeft = Math.max(0, meanPos - stdWidth / 2);
            return (
              <div key={f.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-dim">{f.name}</span>
                  <span className="font-mono text-[10px] text-faint">
                    &micro;={f.mean} &sigma;={f.std}
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-raised">
                  {/* std band */}
                  <div
                    className="absolute inset-y-0 rounded-full bg-accent/20"
                    style={{ left: `${stdLeft}%`, width: `${stdWidth}%` }}
                  />
                  {/* mean marker */}
                  <div
                    className="absolute inset-y-[-2px] w-0.5 rounded-full bg-accent"
                    style={{ left: `${meanPos}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-faint">
          Wide, overlapping distributions across classes. The k-means projection below shows why
          the labels are hard to separate.
        </p>
      </div>
    </div>
  );
}
