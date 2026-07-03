"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { domains } from "@/lib/about";
import { cn, fig } from "@/lib/utils";

/**
 * Accordion of the eight domains. One open at a time; the open panel reveals
 * a headline, prose, tool chips, and evidence links into the rest of the site.
 */
export function DomainExplorer() {
  const [openId, setOpenId] = useState<string>(domains[0].id);

  return (
    <div className="border-t border-line">
      {domains.map((domain, i) => {
        const open = openId === domain.id;
        return (
          <div key={domain.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpenId(open ? "" : domain.id)}
              aria-expanded={open}
              className="group flex w-full items-center gap-5 py-6 text-left md:gap-8"
            >
              <span className="label-mono w-8 shrink-0">{fig(i + 1)}</span>
              <span
                className={cn(
                  "flex-1 text-2xl font-medium tracking-tight transition-colors duration-300 sm:text-3xl md:text-4xl",
                  open ? "text-accent" : "text-ink group-hover:text-dim",
                )}
              >
                {domain.label}
              </span>
              <span
                className={cn(
                  "shrink-0 text-2xl text-faint transition-transform duration-300",
                  open && "rotate-45 text-accent",
                )}
                aria-hidden
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 pb-10 md:grid-cols-[8rem_1fr] md:gap-8">
                    <div className="hidden md:block" />
                    <div className="max-w-2xl">
                      <p className="font-display text-2xl italic text-ink">{domain.headline}</p>
                      <p className="mt-4 text-[15px] leading-relaxed text-dim">{domain.body}</p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {domain.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-faint"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        {domain.evidence.map((ev) => {
                          const external = ev.href.startsWith("http");
                          return external ? (
                            <a
                              key={ev.href}
                              href={ev.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                            >
                              {ev.label} ↗
                            </a>
                          ) : (
                            <Link
                              key={ev.href}
                              href={ev.href}
                              className="text-sm text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                            >
                              {ev.label} &rarr;
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
