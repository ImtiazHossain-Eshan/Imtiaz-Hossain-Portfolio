import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "#velite";
import { MDXContent } from "@/components/mdx/mdx-content";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { TocRail } from "@/components/ui/toc-rail";
import { Reveal } from "@/components/motion/reveal";
import { fig } from "@/lib/utils";
import "katex/dist/katex.min.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

const categoryLabel: Record<string, string> = {
  ai: "ai / research",
  fullstack: "full-stack",
  systems: "systems",
  games: "games",
};

const linkLabels: Array<{ key: "github" | "live" | "paper" | "demo"; label: string }> = [
  { key: "live", label: "Live site" },
  { key: "github", label: "GitHub" },
  { key: "paper", label: "Report (PDF)" },
  { key: "demo", label: "Try the demo" },
];

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sorted = [...projects].sort(
    (a, b) => a.featured - b.featured || a.title.localeCompare(b.title),
  );
  const index = sorted.findIndex((p) => p.slug === slug);
  const project = sorted[index];
  if (!project) notFound();
  const next = sorted[(index + 1) % sorted.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": project.links.github ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.summary,
    ...(project.links.github ? { codeRepository: project.links.github } : {}),
    ...(project.links.live ? { url: project.links.live } : {}),
    author: { "@type": "Person", name: "Imtiaz Hossain" },
    keywords: project.stack.join(", "),
  };

  return (
    <article className="pb-24 pt-36 md:pt-44">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <header className="wrap">
        <p className="label-mono mb-5">
          <Link href="/projects" className="transition-colors hover:text-ink">
            work
          </Link>{" "}
          / {categoryLabel[project.category]} / {project.slug}
        </p>
        <h1 className="max-w-4xl text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">{project.tagline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div>
            <p className="label-mono mb-1">period</p>
            <p className="font-mono text-sm text-ink">{project.period}</p>
          </div>
          <div>
            <p className="label-mono mb-1">status</p>
            <p className="font-mono text-sm text-ink">
              {project.status === "live" ? <span className="text-good">● live</span> : project.status}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {linkLabels.map(({ key, label }) => {
              const href = project.links[key];
              if (!href) return null;
              const external = href.startsWith("http");
              return (
                <a
                  key={key}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="rounded-full border border-line-bright px-4 py-2 text-[13px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {label} {external ? "↗" : "→"}
                </a>
              );
            })}
          </div>
        </div>

        {project.metrics.length > 0 && (
          <Reveal className="mt-12">
            <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-surface px-6 py-5">
                  <dt className="label-mono mb-2">{metric.label}</dt>
                  <dd className="font-mono text-2xl text-ink">{metric.value}</dd>
                  {metric.detail && <dd className="mt-1 text-xs text-faint">{metric.detail}</dd>}
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </header>

      {/* Cover */}
      {project.cover && (
        <Reveal className="wrap-wide mt-14">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <Image
              src={project.cover}
              alt={`${project.title} interface`}
              width={1920}
              height={1080}
              sizes="(max-width: 1536px) 100vw, 1536px"
              className="h-auto w-full"
              priority
            />
          </div>
        </Reveal>
      )}

      {/* Architecture */}
      {project.architecture.length > 0 && (
        <section className="wrap mt-20" aria-label="System architecture">
          <p className="label-mono mb-2">system architecture / interactive</p>
          <ArchitectureDiagram
            nodes={project.architecture}
            title={`fig. 00 / ${project.slug} / hover nodes to trace the data flow`}
          />
        </section>
      )}

      {/* Body */}
      <div className="wrap mt-16">
        <TocRail toc={project.toc} label={`${project.slug} / contents`} />
        <div className="prose-lab mx-auto max-w-3xl">
          <MDXContent code={project.content} />
        </div>
      </div>

      {/* Stack */}
      <section className="wrap mt-20" aria-label="Technology stack">
        <div className="mx-auto max-w-3xl">
          <p className="label-mono mb-4">stack</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-dim"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {project.timeline.length > 0 && (
        <section className="wrap mt-20" aria-label="Timeline">
          <div className="mx-auto max-w-3xl">
            <p className="label-mono mb-6">how it unfolded</p>
            <ol className="relative space-y-8 border-l border-line pl-8">
              {project.timeline.map((step, i) => (
                <li key={step.label} className="relative">
                  <span
                    className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full border border-accent bg-bg"
                    aria-hidden
                  />
                  <p className="label-mono mb-1 text-accent/80">
                    {fig(i + 1)} / {step.label}
                  </p>
                  <p className="text-[15px] leading-relaxed text-dim">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="wrap mt-20" aria-label="Gallery">
          <p className="label-mono mb-6">the evidence</p>
          <ProjectGallery images={project.gallery} />
        </section>
      )}

      {/* Next */}
      <div className="wrap mt-28">
        <Link
          href={next.url}
          data-cursor-label="next"
          className="group block rounded-xl border border-line bg-surface/50 px-8 py-10 transition-colors duration-300 hover:border-line-bright md:px-12"
        >
          <p className="label-mono mb-3">next entry</p>
          <p className="text-3xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
            {next.title} <span aria-hidden>&rarr;</span>
          </p>
        </Link>
      </div>
    </article>
  );
}
