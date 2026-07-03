"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  newsRuns,
  newsModelsOrder,
  newsVariantsOrder,
  type NewsRun,
} from "@/lib/playground/demos/news-classification";
import { cn } from "@/lib/utils";

const f1s = newsRuns.map((r) => r.macroF1);
const minF1 = Math.min(...f1s);
const maxF1 = Math.max(...f1s);

/** Map macro-F1 to an accent-tinted cell background. */
function heat(f1: number) {
  const t = (f1 - minF1) / (maxF1 - minF1);
  return `rgba(124, 223, 255, ${0.06 + t * 0.5})`;
}

function runAt(model: string, variant: string): NewsRun | undefined {
  return newsRuns.find((r) => r.model === model && r.variant === variant);
}

/**
 * Interactive 27-run matrix. Hover any cell to inspect its exact macro-F1,
 * training time, and representation, and to see the accuracy/cost trade-off
 * against the best transformer and best non-transformer runs.
 */
export function NewsMatrix() {
  const [hover, setHover] = useState<NewsRun | null>(null);

  const best = useMemo(() => newsRuns.reduce((a, b) => (b.macroF1 > a.macroF1 ? b : a)), []);
  const active = hover ?? best;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="label-mono p-2 text-left font-normal">model</th>
              {newsVariantsOrder.map((v) => (
                <th key={v} className="label-mono p-2 text-center font-normal">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {newsModelsOrder.map((model) => (
              <tr key={model}>
                <th className="whitespace-nowrap p-2 text-left font-mono text-xs font-normal text-dim">
                  {model}
                </th>
                {newsVariantsOrder.map((variant) => {
                  const run = runAt(model, variant);
                  if (!run) return <td key={variant} />;
                  const isActive = active.model === model && active.variant === variant;
                  const isBest = best.model === model && best.variant === variant;
                  return (
                    <td key={variant}>
                      <button
                        type="button"
                        onMouseEnter={() => setHover(run)}
                        onFocus={() => setHover(run)}
                        onMouseLeave={() => setHover(null)}
                        className={cn(
                          "flex h-12 w-full min-w-[4.5rem] items-center justify-center rounded-md border font-mono text-xs transition-all duration-200",
                          isActive ? "border-accent text-ink" : "border-transparent text-dim",
                        )}
                        style={{ background: heat(run.macroF1) }}
                      >
                        {run.macroF1.toFixed(4).slice(1)}
                        {isBest && <span className="ml-1 text-accent">★</span>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="label-mono mt-3">
          9 models x 3 preprocessing pipelines / ★ marks the best run / hover any cell
        </p>
      </div>

      {/* Inspector */}
      <motion.div layout className="panel h-fit p-6">
        <p className="label-mono mb-3">
          {hover ? "inspecting" : "best run"}
        </p>
        <p className="text-xl font-medium text-ink">{active.model}</p>
        <p className="label-mono mt-0.5 text-accent/80">{active.variant} / {active.repr}</p>

        <dl className="mt-5 space-y-3">
          <div>
            <dt className="label-mono mb-1">macro-F1</dt>
            <dd className="font-mono text-2xl text-ink">{active.macroF1.toFixed(4)}</dd>
          </div>
          <div>
            <dt className="label-mono mb-1">training time</dt>
            <dd className="font-mono text-lg text-ink">
              {active.trainTime < 60
                ? `${active.trainTime.toFixed(1)}s`
                : `${(active.trainTime / 60).toFixed(1)} min`}
            </dd>
          </div>
        </dl>

        {/* accuracy vs cost bars */}
        <div className="mt-5 space-y-3 border-t border-line pt-4">
          <p className="label-mono">macro-F1 vs field</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-raised">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${((active.macroF1 - minF1) / (maxF1 - minF1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="label-mono">training cost (log)</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-raised">
            <motion.div
              className="h-full rounded-full bg-warn"
              animate={{
                width: `${(Math.log10(active.trainTime + 1) / Math.log10(2200)) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            BERT buys 0.016 macro-F1 over Bi-GRU for roughly 100x the training time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
