import type { Metadata } from "next";
import Link from "next/link";
import { demoConfigs } from "@/lib/playground/demos";
import { playgroundEntries } from "@/lib/playground/registry";
import { TextReveal } from "@/components/motion/text-reveal";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "AI Playground",
  description:
    "Interactive demonstrations of trained AI models: brain tumor segmentation, AI-text detection, news classification, and software quality prediction. Real outputs, real metrics.",
};

export default function PlaygroundPage() {
  return (
    <div className="wrap pb-28 pt-36 md:pt-44">
      <p className="label-mono mb-5">the playground / {demoConfigs.length} experiments</p>
      <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-ink sm:text-6xl">
        <TextReveal text="A working AI laboratory." immediate />
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-dim">
        Every experiment here runs on authentic outputs from models I trained, with the exact
        metrics from the result files. Segment a tumor, probe a text detector, or trace 27
        experiments in a single grid. Nothing is fabricated, and the architecture is built so a
        live inference endpoint can be swapped in later without changing a single screen.
      </p>

      <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2">
        {playgroundEntries.map((entry) => (
          <RevealItem key={entry.slug}>
            <Link
              href={`/playground/${entry.slug}`}
              data-cursor-label="open experiment"
              className="group flex h-full flex-col justify-between gap-12 rounded-xl border border-line bg-surface p-8 transition-colors duration-300 hover:border-line-bright hover:bg-raised"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="label-mono">{entry.labId}</span>
                  <span className="label-mono text-accent/70">{entry.domain}</span>
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                  {entry.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-dim">{entry.summary}</p>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-5">
                <div>
                  <p className="label-mono mb-1">{entry.metric.label}</p>
                  <p className="font-mono text-3xl text-ink">{entry.metric.value}</p>
                </div>
                <span
                  aria-hidden
                  className="text-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                >
                  &rarr;
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
