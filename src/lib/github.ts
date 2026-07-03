import { site } from "./site";

/**
 * GitHub data with graceful degradation:
 *  - With GITHUB_TOKEN: pinned repos + languages via GraphQL.
 *  - Without: top public repos by stars via REST.
 *  - On any failure: a curated static fallback so the panel always renders.
 * Fetches are ISR-cached (revalidate ~6h).
 */

export type Repo = {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
};

export type GithubData = {
  repos: Repo[];
  totalStars: number;
  source: "graphql" | "rest" | "fallback";
};

const REVALIDATE = 60 * 60 * 6;

const FALLBACK: GithubData = {
  source: "fallback",
  totalStars: 0,
  repos: [
    {
      name: "Polaris",
      description: "AI academic strategist with structured-JSON LLM output and transparent probability modeling.",
      url: "https://github.com/ImtiazHossain-Eshan/Polaris",
      stars: 0,
      language: "TypeScript",
      topics: ["ai", "nextjs", "rag"],
    },
    {
      name: "Custom_Shell",
      description: "A UNIX shell in C with pipes, redirection, chaining, history, and signal handling.",
      url: "https://github.com/ImtiazHossain-Eshan/Custom_Shell",
      stars: 0,
      language: "C",
      topics: ["systems", "posix"],
    },
    {
      name: "UniBoard",
      description: "A centralized digital noticeboard for campus clubs and events.",
      url: "https://github.com/ImtiazHossain-Eshan/UniBoard",
      stars: 0,
      language: "PHP",
      topics: ["full-stack"],
    },
    {
      name: "Cholo_Ride-Sharing-App",
      description: "A database-driven ride-sharing management system for university students.",
      url: "https://github.com/ImtiazHossain-Eshan/Cholo_Ride-Sharing-App",
      stars: 0,
      language: "PHP",
      topics: ["database", "full-stack"],
    },
  ],
};

async function fetchGraphQL(token: string): Promise<GithubData | null> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name description url stargazerCount
              primaryLanguage { name }
              repositoryTopics(first: 4) { nodes { topic { name } } }
            }
          }
        }
      }
    }`;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: site.githubUsername } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const nodes = json?.data?.user?.pinnedItems?.nodes;
    if (!Array.isArray(nodes) || nodes.length === 0) return null;
    const repos: Repo[] = nodes.map((n: Record<string, unknown>) => ({
      name: n.name as string,
      description: (n.description as string) ?? "",
      url: n.url as string,
      stars: (n.stargazerCount as number) ?? 0,
      language: (n.primaryLanguage as { name: string } | null)?.name ?? null,
      topics:
        ((n.repositoryTopics as { nodes: { topic: { name: string } }[] })?.nodes ?? []).map(
          (t) => t.topic.name,
        ),
    }));
    return { repos, totalStars: repos.reduce((s, r) => s + r.stars, 0), source: "graphql" };
  } catch {
    return null;
  }
}

async function fetchREST(): Promise<GithubData | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE },
      },
    );
    if (!res.ok) return null;
    const all = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(all) || all.length === 0) return null;
    const repos: Repo[] = all
      .filter((r) => !r.fork)
      .sort(
        (a, b) =>
          ((b.stargazers_count as number) ?? 0) - ((a.stargazers_count as number) ?? 0) ||
          Date.parse(b.updated_at as string) - Date.parse(a.updated_at as string),
      )
      .slice(0, 6)
      .map((r) => ({
        name: r.name as string,
        description: (r.description as string) ?? "",
        url: r.html_url as string,
        stars: (r.stargazers_count as number) ?? 0,
        language: (r.language as string) ?? null,
        topics: ((r.topics as string[]) ?? []).slice(0, 4),
      }));
    return {
      repos,
      totalStars: all.reduce((s, r) => s + ((r.stargazers_count as number) ?? 0), 0),
      source: "rest",
    };
  } catch {
    return null;
  }
}

export async function getGithubData(): Promise<GithubData> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const gql = await fetchGraphQL(token);
    if (gql) return gql;
  }
  const rest = await fetchREST();
  if (rest) return rest;
  return FALLBACK;
}

/** A day cell in the contribution calendar. */
export type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

/**
 * Real contribution calendar via GraphQL. Requires GITHUB_TOKEN; returns null
 * without one, so the panel can hide the calendar rather than fabricate it.
 */
export async function getContributions(): Promise<ContribDay[][] | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: site.githubUsername } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!Array.isArray(weeks)) return null;
    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };
    return weeks.map((w: { contributionDays: Record<string, unknown>[] }) =>
      w.contributionDays.map((d) => ({
        date: d.date as string,
        count: d.contributionCount as number,
        level: levelMap[d.contributionLevel as string] ?? 0,
      })),
    );
  } catch {
    return null;
  }
}
