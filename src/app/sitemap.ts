import type { MetadataRoute } from "next";
import { projects, posts } from "#velite";
import { demoConfigs } from "@/lib/playground/demos";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/projects", "/playground", "/research", "/blog", "/about", "/contact", "/resume"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const projectRoutes = projects.map((p) => ({
    url: `${base}${p.url}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const playgroundRoutes = demoConfigs.map((d) => ({
    url: `${base}/playground/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Published posts only (drafts excluded from the sitemap).
  const postRoutes = posts
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${base}${p.url}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes, ...playgroundRoutes, ...postRoutes];
}
