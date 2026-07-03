import type { Metadata } from "next";
import { resume, resumeScorecard } from "@/lib/resume";
import { PrintButton } from "@/components/resume/print-button";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "The resume and CV of Imtiaz Hossain, AI Engineer and researcher: experience, skills, research, and an honest self-assessment.",
};

const downloads = [
  { label: "Markdown", href: "/resume/imtiaz-hossain-resume.md" },
  { label: "JSON Resume", href: "/resume/imtiaz-hossain-resume.json" },
  { label: "LaTeX", href: "/resume/imtiaz-hossain-cv.tex" },
  { label: "Cover letter", href: "/resume/cover-letter-template.md" },
];

export default function ResumePage() {
  return (
    <div className="pb-24 pt-36 md:pt-44">
      {/* Toolbar */}
      <div className="wrap no-print mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-4">resume / cv</p>
          <h1 className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            The formal record
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          {downloads.map((d) => (
            <a
              key={d.label}
              href={d.href}
              download
              className="rounded-full border border-line-bright px-4 py-2.5 text-[13px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {d.label}
            </a>
          ))}
        </div>
      </div>

      {/* Sheet */}
      <div className="wrap">
        <article className="print-sheet mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-8 md:p-12">
          {/* Header */}
          <header className="border-b border-line pb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-ink">{resume.name}</h2>
            <p className="print-accent mt-1 text-sm text-accent">{resume.title}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-dim">
              <span>{resume.location}</span>
              <a href={`mailto:${resume.email}`}>{resume.email}</a>
              <a href={resume.links.github}>github.com/{site_handle(resume.links.github)}</a>
              <a href={resume.links.scholar}>Google Scholar</a>
              <a href={resume.links.portfolio}>{clean(resume.links.portfolio)}</a>
            </div>
          </header>

          {/* Summary */}
          <Section title="Summary">
            <p className="text-[13.5px] leading-relaxed text-dim">{resume.summary}</p>
          </Section>

          {/* Skills */}
          <Section title="Technical Skills">
            <dl className="space-y-1.5">
              {Object.entries(resume.skills).map(([group, items]) => (
                <div key={group} className="grid grid-cols-[9rem_1fr] gap-2 text-[12.5px]">
                  <dt className="print-accent font-medium text-accent">{group}</dt>
                  <dd className="text-dim">{items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Experience */}
          <Section title="Engineering & Research Experience">
            <div className="space-y-5">
              {resume.experience.map((exp) => (
                <div key={exp.role}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-[14px] font-semibold text-ink">{exp.role}</h4>
                    <span className="shrink-0 font-mono text-[11px] text-faint">{exp.period}</span>
                  </div>
                  <p className="print-accent text-[12.5px] text-accent">{exp.org}</p>
                  <ul className="mt-2 space-y-1.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-dim">
                        <span className="print-accent mt-[0.35em] text-accent">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Research */}
          <Section title="Research">
            {resume.research.map((r) => (
              <div key={r.title} className="text-[12.5px]">
                <p className="font-medium text-ink">{r.title}</p>
                <p className="text-faint">
                  {r.venue}, {r.year}. {r.note}
                </p>
              </div>
            ))}
          </Section>

          {/* Selected projects */}
          <Section title="Selected Additional Projects">
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {resume.projectsHighlight.map((p) => (
                <li key={p} className="flex gap-2 text-[12.5px] text-dim">
                  <span className="print-accent text-accent">▸</span>
                  {p}
                </li>
              ))}
            </ul>
          </Section>

          {/* Education + certs */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Section title="Education" flush>
              <p className="text-[13px] font-semibold text-ink">{resume.education.degree}</p>
              <p className="print-accent text-[12.5px] text-accent">{resume.education.school}</p>
              <p className="text-[12px] text-faint">
                {resume.education.location} · {resume.education.detail}
              </p>
            </Section>
            <Section title="Certifications" flush>
              <ul className="space-y-1">
                {resume.certifications.map((c) => (
                  <li key={c.title} className="text-[12.5px] text-dim">
                    {c.title} <span className="text-faint">· {c.issuer}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </article>

        {/* Self-assessment (screen only) */}
        <section className="no-print mx-auto mt-16 max-w-3xl" aria-label="Self-assessment">
          <p className="label-mono mb-6">honest self-assessment / scored as a recruiter would</p>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {resumeScorecard.scores.map((s) => (
              <div key={s.label} className="bg-surface px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] text-dim">{s.label}</span>
                  <span className="font-mono text-sm text-ink">{s.score}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-raised">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="label-mono mb-4">where I would strengthen this next</p>
            <ul className="space-y-2.5">
              {resumeScorecard.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-dim">
                  <span className="label-mono mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  flush,
}: {
  title: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className={flush ? "" : "mt-6"}>
      <h3 className="label-mono mb-2.5 border-b border-line pb-1">{title}</h3>
      {children}
    </section>
  );
}

function clean(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
function site_handle(url: string) {
  return url.split("/").pop() ?? url;
}
