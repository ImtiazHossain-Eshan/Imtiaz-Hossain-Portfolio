import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demoConfigs, getDemoConfig } from "@/lib/playground/demos";
import { PipelineStages } from "@/components/playground/pipeline-stages";
import { DemoSurface } from "@/components/playground/demo-surface";
import { LabPlate } from "@/components/playground/lab-plate";
import { Reveal } from "@/components/motion/reveal";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return demoConfigs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const config = getDemoConfig(slug);
  if (!config) return {};
  return {
    title: `${config.title} · Playground`,
    description: config.tagline,
  };
}

export default async function PlaygroundDemoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const config = getDemoConfig(slug);
  if (!config) notFound();

  const index = demoConfigs.findIndex((d) => d.slug === slug);
  const next = demoConfigs[(index + 1) % demoConfigs.length];

  return (
    <article className="pb-24 pt-36 md:pt-44">
      {/* Header */}
      <header className="wrap">
        <p className="label-mono mb-5">
          <Link href="/playground" className="transition-colors hover:text-ink">
            playground
          </Link>{" "}
          / {config.domain.toLowerCase()}
        </p>
        <h1 className="max-w-4xl text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-6xl">
          {config.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">{config.tagline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/projects/${config.projectSlug}`}
            className="rounded-full border border-line-bright px-4 py-2 text-[13px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Full case study &rarr;
          </Link>
          {config.reportHref && (
            <a
              href={config.reportHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line-bright px-4 py-2 text-[13px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Report (PDF) ↗
            </a>
          )}
        </div>
      </header>

      {/* Facts + headline metrics */}
      <section className="wrap mt-12" aria-label="Experiment facts">
        <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {config.headlineMetrics.map((m) => (
            <div key={m.label} className="bg-surface px-6 py-5">
              <dt className="label-mono mb-2">{m.label}</dt>
              <dd className="font-mono text-2xl text-ink">{m.value}</dd>
              {m.detail && <dd className="mt-1 text-xs text-faint">{m.detail}</dd>}
            </div>
          ))}
        </dl>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {config.facts.map((f) => (
            <div key={f.label} className="flex items-baseline gap-2">
              <dt className="label-mono">{f.label}</dt>
              <dd className="font-mono text-sm text-ink">{f.value}</dd>
              {f.detail && <dd className="text-xs text-faint">/ {f.detail}</dd>}
            </div>
          ))}
        </dl>
      </section>

      {/* Interactive surface: the main event, placed high */}
      <section className="wrap mt-16" aria-label="Interactive demo">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-good" />
          <p className="label-mono">interactive / live in your browser</p>
        </div>
        <div className="rounded-2xl border border-line-bright bg-surface/40 p-5 md:p-8">
          <DemoSurface config={config} />
        </div>
      </section>

      {/* Pipeline story */}
      <section className="wrap mt-24" aria-label="Pipeline">
        <Reveal>
          <p className="label-mono mb-3">the pipeline</p>
          <h2 className="mb-12 max-w-2xl text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            From raw data to a verifiable result
          </h2>
        </Reveal>
        <PipelineStages stages={config.pipeline} />
      </section>

      {/* Evaluation artifacts */}
      <section className="wrap mt-16" aria-label="Evaluation">
        <Reveal>
          <p className="label-mono mb-6">{config.evaluation.title.toLowerCase()}</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {config.evaluation.figures.map((figure) => (
            <LabPlate key={figure.src} figure={figure} />
          ))}
        </div>
      </section>

      {/* Next */}
      <div className="wrap mt-24">
        <Link
          href={`/playground/${next.slug}`}
          data-cursor-label="next"
          className="group block rounded-xl border border-line bg-surface/50 px-8 py-10 transition-colors duration-300 hover:border-line-bright md:px-12"
        >
          <p className="label-mono mb-3">next experiment</p>
          <p className="text-3xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
            {next.title} <span aria-hidden>&rarr;</span>
          </p>
        </Link>
      </div>
    </article>
  );
}
