import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, projects } from "#velite";
import { MDXContent } from "@/components/mdx/mdx-content";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TocRail } from "@/components/ui/toc-rail";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import "katex/dist/katex.min.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const isDev = process.env.NODE_ENV === "development";
  return posts.filter((p) => isDev || !p.draft).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  if (post.draft && process.env.NODE_ENV !== "development") notFound();

  const related = projects.filter((p) => post.related.includes(p.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    keywords: post.tags.join(", "),
  };

  return (
    <article className="pb-24 pt-32 md:pt-40">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="wrap">
        <p className="label-mono mb-5">
          <Link href="/blog" className="transition-colors hover:text-ink">
            blog
          </Link>{" "}
          / {formatDate(post.date)} / {post.metadata.readingTime} min read
        </p>
        {post.draft && (
          <p className="mb-4 inline-block rounded-full border border-warn/40 px-3 py-1 font-mono text-[11px] uppercase text-warn">
            draft preview
          </p>
        )}
        <h1 className="max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">{post.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-faint"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="wrap mt-14">
        <TocRail toc={post.toc} label="contents" />
        <div className="prose-lab mx-auto max-w-3xl">
          <MDXContent code={post.content} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20" aria-label="Related projects">
          <div className="mx-auto max-w-3xl">
            <p className="label-mono mb-5">related work</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((project) => (
                <Link
                  key={project.slug}
                  href={project.url}
                  data-cursor-label="open"
                  className="group rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-bright"
                >
                  <p className="label-mono mb-2">{project.category}</p>
                  <p className="text-lg font-medium text-ink transition-colors group-hover:text-accent">
                    {project.title}
                  </p>
                  <p className="mt-1.5 text-sm text-dim">{project.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="wrap mt-20">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="label-mono transition-colors hover:text-accent">
            &larr; all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
