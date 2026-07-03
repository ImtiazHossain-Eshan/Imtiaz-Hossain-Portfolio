import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

export function ContactCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 110%, rgba(124,223,255,0.09), transparent 70%)",
        }}
      />
      <div className="wrap relative text-center">
        <Reveal>
          <p className="label-mono mb-6">04 / next experiment</p>
          <h2 className="mx-auto max-w-3xl text-4xl font-medium leading-tight tracking-tight text-ink sm:text-6xl">
            Have a hard problem that needs an{" "}
            <em className="font-display italic text-accent">intelligent system</em>?
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-col items-center gap-5">
            <Magnetic>
              <Link
                href="/contact"
                data-cursor-label="say hello"
                className="inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-medium text-bg transition-colors duration-300 hover:bg-accent"
              >
                Let&apos;s build something meaningful
                <span aria-hidden>&rarr;</span>
              </Link>
            </Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-sm text-faint transition-colors duration-300 hover:text-dim"
            >
              {site.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
