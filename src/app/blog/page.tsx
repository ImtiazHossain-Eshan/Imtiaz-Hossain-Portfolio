import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "#velite";
import { TextReveal } from "@/components/motion/text-reveal";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Research notes and engineering write-ups on computer vision, NLP, systems, and building production platforms.",
};

/** Drafts are hidden in production, visible in development for review. */
function visiblePosts() {
  const isDev = process.env.NODE_ENV === "development";
  return [...posts]
    .filter((p) => isDev || !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export default function BlogPage() {
  const list = visiblePosts();

  return (
    <div className="wrap pb-28 pt-36 md:pt-44">
      <p className="label-mono mb-5">
        the notebook / {list.length} {list.length === 1 ? "entry" : "entries"}
      </p>
      <h1 className="max-w-3xl text-5xl font-medium tracking-tight text-ink sm:text-6xl">
        <TextReveal text="Notes from the lab." immediate />
      </h1>
      <p className="mt-8 max-w-xl text-lg text-dim">
        Write-ups on the projects and research: how the systems were built, what the experiments
        actually showed, and where they still fall short.
      </p>

      {list.length === 0 ? (
        <p className="mt-16 text-dim">Posts are in draft. Check back soon.</p>
      ) : (
        <RevealGroup className="mt-16 border-t border-line">
          {list.map((post) => (
            <RevealItem key={post.slug}>
              <Link
                href={post.url}
                data-cursor-label="read"
                className="group grid gap-2 border-b border-line py-8 md:grid-cols-[9rem_1fr] md:gap-8"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1">
                  <span className="label-mono">{formatDate(post.date)}</span>
                  {post.draft && (
                    <span className="rounded-full border border-warn/40 px-2 py-0.5 font-mono text-[10px] uppercase text-warn">
                      draft
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-dim">
                    {post.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="label-mono">{post.metadata.readingTime} min read</span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-faint"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
