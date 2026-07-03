import Link from "next/link";
import { playgroundEntries } from "@/lib/playground/registry";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";

/** Four lab-bench tiles inviting visitors to poke the models. */
export function PlaygroundTeaser() {
  return (
    <section className="border-y border-line bg-surface/40 py-28 md:py-36" aria-labelledby="playground-heading">
      <div className="wrap">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="label-mono mb-4">02 / the playground</p>
            <h2
              id="playground-heading"
              className="text-4xl font-medium tracking-tight text-ink sm:text-5xl"
            >
              Don&apos;t take my word for it.{" "}
              <em className="font-display italic text-accent">Inspect the models.</em>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-dim">
              Four experiments, real trained models, real evaluation artifacts. Every number
              on these pages comes from a result file, not a pitch deck.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {playgroundEntries.map((entry) => (
            <RevealItem key={entry.slug}>
              <Link
                href={`/playground/${entry.slug}`}
                data-cursor-label="open experiment"
                className="group flex h-full flex-col justify-between gap-10 bg-surface p-7 transition-colors duration-300 hover:bg-raised md:p-9"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="label-mono">{entry.labId}</span>
                    <span className="label-mono text-accent/70">{entry.domain}</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-dim">{entry.method}</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="label-mono mb-1">{entry.metric.label}</p>
                    <p className="font-mono text-3xl text-ink md:text-4xl">{entry.metric.value}</p>
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
    </section>
  );
}
