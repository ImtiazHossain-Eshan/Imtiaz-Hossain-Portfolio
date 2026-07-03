"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, hint: "best for anything substantive" },
  { label: "GitHub", value: "ImtiazHossain-Eshan", href: site.links.github, hint: "the code, unfiltered" },
  { label: "LinkedIn", value: "imtiazhossaineshan", href: site.links.linkedin, hint: "roles and collaborations" },
  { label: "Google Scholar", value: "publications", href: site.links.scholar, hint: "the research record" },
  { label: "LeetCode", value: "Imtiaz_Hossain_Eshan", href: site.links.leetcode, hint: "the problem-solving reps" },
];

/**
 * The contact page as an experience: an oversized invitation, an ambient
 * cursor-reactive glow, and a set of labeled channels rather than a form.
 */
export function ContactExperience() {
  const reduced = useReducedMotion();
  const [glow, setGlow] = useState({ x: 50, y: 40 });

  return (
    <section
      className="relative flex min-h-svh flex-col justify-center overflow-hidden py-32"
      onPointerMove={
        reduced
          ? undefined
          : (e) => {
              setGlow({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
              });
            }
      }
    >
      {/* ambient glow follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-300"
        style={{
          background: `radial-gradient(ellipse 50% 50% at ${glow.x}% ${glow.y}%, rgba(124,223,255,0.1), transparent 60%)`,
        }}
      />

      <div className="wrap relative">
        <p className="label-mono mb-8">contact / say hello</p>
        <h1 className="max-w-5xl text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[1.03] tracking-[-0.03em] text-ink">
          Let&apos;s build something{" "}
          <em className="font-display italic text-accent">meaningful</em>.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-dim">
          Research collaboration, an AI or ML engineering role, a graduate opportunity, or just a
          good technical conversation. Pick whichever channel fits.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              data-cursor-label="open"
              className="group bg-surface px-6 py-7 transition-colors duration-300 hover:bg-raised"
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="label-mono">{channel.label}</span>
                <span
                  aria-hidden
                  className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                >
                  ↗
                </span>
              </div>
              <p className="mt-3 truncate font-mono text-sm text-ink transition-colors group-hover:text-accent">
                {channel.value}
              </p>
              <p className="mt-1 text-xs text-faint">{channel.hint}</p>
            </motion.a>
          ))}
        </div>

        <p className="label-mono mt-10">
          {site.location} / usually replies within a day
        </p>
      </div>
    </section>
  );
}
