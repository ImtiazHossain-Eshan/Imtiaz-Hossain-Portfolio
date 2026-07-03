"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DemoConfig } from "@/lib/playground/demo-config";
import { textFeatureRankings } from "@/lib/playground/demos/text-detection";
import { getProvider } from "@/lib/playground/demos";
import type { InferenceResult } from "@/lib/playground/types";
import { FeatureRadar } from "./feature-radar";
import { cn } from "@/lib/utils";

const maxMi = Math.max(...textFeatureRankings.map((f) => f.mi));
const radarAxes = textFeatureRankings.slice(0, 7).map((f) => ({
  label: f.feature.replace(/_/g, " ").split(" ")[0],
  value: f.mi / maxMi,
}));

/**
 * The NLP demo surface: paste text (or pick a preset), get the nearest curated
 * verdict with an honest "approximate match" note, plus the class distribution
 * and the feature-importance radar that drives detection.
 */
export function NlpText({ config }: { config: DemoConfig }) {
  const interactive = config.interactive;
  const [text, setText] = useState("");
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [busy, setBusy] = useState(false);

  if (interactive.kind !== "nlp-text") return null;
  const provider = getProvider(config);

  async function analyze(input: string) {
    if (input.trim().length < 12) return;
    setBusy(true);
    const res = await provider.run({ kind: "text", text: input });
    // brief delay so the "analyzing" state reads as work happening
    await new Promise((r) => setTimeout(r, 320));
    setResult(res);
    setBusy(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div>
        <label htmlFor="nlp-input" className="label-mono mb-3 block">
          input text
        </label>
        <textarea
          id="nlp-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={interactive.placeholder}
          rows={7}
          className="w-full resize-none rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => analyze(text)}
            disabled={text.trim().length < 12 || busy}
            data-cursor-label="analyze"
            className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Analyzing..." : "Analyze fingerprint"}
          </button>
          <span className="label-mono">or try</span>
          {interactive.presets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setText(preset);
                analyze(preset);
              }}
              className="rounded-full border border-line px-3 py-1.5 text-[12px] text-dim transition-colors hover:border-accent hover:text-accent"
            >
              sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[16rem]">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.example.id + String(result.approximate)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="panel p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="label-mono mb-1">verdict</p>
                  <p className="text-2xl font-medium text-ink">{result.example.prediction.label}</p>
                </div>
                <span className="font-mono text-lg text-accent">
                  {(result.example.prediction.confidence * 100).toFixed(0)}%
                </span>
              </div>

              {result.example.prediction.distribution && (
                <div className="mt-5 space-y-2.5">
                  {result.example.prediction.distribution.map((d) => (
                    <div key={d.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-dim">{d.label}</span>
                        <span className="font-mono text-faint">{(d.value * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            d.label.includes("AI") ? "bg-warn" : "bg-good",
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.value * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.example.prediction.metrics && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                  {result.example.prediction.metrics.map((m) => (
                    <span
                      key={m.label}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-dim"
                    >
                      {m.label}: <span className="text-ink">{m.value}</span>
                    </span>
                  ))}
                </div>
              )}

              {result.approximate && (
                <p className="label-mono mt-5 flex items-start gap-2 leading-relaxed">
                  <span className="text-accent">i</span>
                  {result.provenance}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="radar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="panel flex flex-col items-center justify-center p-6"
            >
              <p className="label-mono mb-2 self-start">top discriminative features / mRMR</p>
              <FeatureRadar axes={radarAxes} />
              <p className="mt-2 text-center text-xs text-faint">
                Whitespace ratio, readability, and vocabulary richness carry the most signal.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
