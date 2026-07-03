import Link from "next/link";
import { navLinks, site } from "@/lib/site";

const connect = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Google Scholar", href: site.links.scholar },
  { label: "LeetCode", href: site.links.leetcode },
  { label: "Email", href: `mailto:${site.email}` },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface/50">
      <div className="wrap-wide grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr] md:py-20">
        <div>
          <p className="label-mono mb-4">next experiment</p>
          <Link
            href="/contact"
            data-cursor-label="get in touch"
            className="font-display text-3xl leading-tight text-ink transition-colors duration-300 hover:text-accent sm:text-4xl"
          >
            Let&apos;s build something{" "}
            <em className="text-accent">meaningful</em>.
          </Link>
        </div>

        <nav aria-label="Footer">
          <p className="label-mono mb-4">index</p>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-dim transition-colors duration-300 hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label-mono mb-4">connect</p>
          <ul className="space-y-2.5">
            {connect.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-sm text-dim transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap-wide flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono">
            {site.name} / {site.location}
          </p>
          <p className="label-mono">
            designed &amp; engineered from first principles / {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
