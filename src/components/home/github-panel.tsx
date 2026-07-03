import { getGithubData, getContributions } from "@/lib/github";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";

const LEVEL_BG = [
  "bg-raised",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

/** Language color hints for the repo cards. */
const LANG_COLOR: Record<string, string> = {
  TypeScript: "#7cdfff",
  JavaScript: "#ffd48a",
  Python: "#7ce8b8",
  C: "#c8b7ff",
  PHP: "#b7c4ff",
  HTML: "#ff9d9d",
};

/**
 * Server component: custom GitHub activity panel. Renders a contribution
 * calendar only when real data is available (token present); otherwise shows
 * pinned/top repositories and a language strip. Never fabricates activity.
 */
export async function GithubPanel() {
  const [data, contributions] = await Promise.all([getGithubData(), getContributions()]);

  const langs = Array.from(
    data.repos.reduce((map, r) => {
      if (r.language) map.set(r.language, (map.get(r.language) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="border-t border-line bg-surface/40 py-28 md:py-36" aria-labelledby="github-heading">
      <div className="wrap">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-mono mb-4">04 / open source</p>
              <h2 id="github-heading" className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Built in the <em className="font-display italic text-accent">open</em>
              </h2>
            </div>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono border-b border-line pb-1 transition-colors hover:border-accent hover:text-ink"
            >
              @{site.githubUsername} &rarr;
            </a>
          </div>
        </Reveal>

        {/* Contribution calendar (only when real data exists) */}
        {contributions && (
          <Reveal className="mb-10">
            <div className="overflow-x-auto rounded-xl border border-line bg-surface p-5">
              <div className="flex gap-[3px]">
                {contributions.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <span
                        key={day.date}
                        title={`${day.count} on ${day.date}`}
                        className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_BG[day.level]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <p className="label-mono mt-4">contributions over the last year</p>
            </div>
          </Reveal>
        )}

        {/* Repositories */}
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {data.repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="view repo"
                className="group bg-surface p-6 transition-colors duration-300 hover:bg-raised"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[15px] text-ink transition-colors group-hover:text-accent">
                    {repo.name}
                  </span>
                  {repo.stars > 0 && (
                    <span className="label-mono shrink-0">★ {repo.stars}</span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dim">
                  {repo.description}
                </p>
                {repo.language && (
                  <span className="mt-4 flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: LANG_COLOR[repo.language] ?? "#5f6672" }}
                    />
                    <span className="label-mono">{repo.language}</span>
                  </span>
                )}
              </a>
            ))}
          </div>
        </Reveal>

        {/* Language strip */}
        {langs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="label-mono">languages</span>
            {langs.map(([lang, count]) => (
              <span key={lang} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: LANG_COLOR[lang] ?? "#5f6672" }}
                />
                <span className="font-mono text-xs text-dim">
                  {lang} <span className="text-faint">×{count}</span>
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
