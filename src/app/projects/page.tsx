import type { Metadata } from "next";
import { projects } from "#velite";
import { ProjectIndex } from "@/components/projects/project-index";
import { TextReveal } from "@/components/motion/text-reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across AI research, computer vision, NLP, full-stack platforms, systems programming, and games.",
};

export default function ProjectsPage() {
  const rows = [...projects]
    .sort((a, b) => a.featured - b.featured || a.title.localeCompare(b.title))
    .map((p) => ({
      slug: p.slug,
      url: p.url,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      period: p.period,
      status: p.status,
      cover: p.cover,
      featured: p.featured,
    }));

  return (
    <div className="wrap pb-28 pt-36 md:pt-44">
      <p className="label-mono mb-5">the logbook / {rows.length} entries</p>
      <h1 className="mb-16 max-w-3xl text-5xl font-medium tracking-tight text-ink sm:text-6xl">
        <TextReveal text="Every system tells a story." immediate />
      </h1>
      <ProjectIndex projects={rows} />
    </div>
  );
}
