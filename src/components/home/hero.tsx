import Link from "next/link";
import { NeuralField } from "@/components/three/neural-field";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

const roles = ["Computer Vision", "NLP", "Deep Learning", "Research", "Production Systems"];

/** Server-rendered hero: headline paints and animates with zero JS. */
export function Hero() {
  const words = [
    { text: "I", serif: false },
    { text: "build", serif: false },
    { text: "intelligent", serif: true },
    { text: "systems.", serif: false },
  ];

  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <NeuralField className="absolute inset-0" />

      {/* Readability scrim over the field */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,8,10,0.55) 0%, rgba(7,8,10,0.1) 35%, rgba(7,8,10,0.15) 70%, rgba(7,8,10,0.9) 100%)",
        }}
      />

      <div className="wrap relative z-10 pb-24 pt-32">
        <p className="hero-fade label-mono mb-8" style={{ animationDelay: "0.15s" }}>
          {site.name.toLowerCase()} / {site.location.toLowerCase()} / ai research laboratory
        </p>

        <h1
          aria-label={site.tagline}
          className="max-w-5xl text-[clamp(2.9rem,8.5vw,7rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink"
        >
          {words.map((word, i) => (
            <span key={word.text} aria-hidden className="hero-mask mr-[0.24em] last:mr-0">
              <span
                className={
                  "hero-word" + (word.serif ? " font-display italic font-normal text-accent" : "")
                }
                style={{ animationDelay: `${0.25 + i * 0.09}s` }}
              >
                {word.text}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="hero-fade mt-10 flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2"
          style={{ animationDelay: "0.85s" }}
        >
          {roles.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              <span className="font-mono text-[13px] tracking-wide text-dim">{role}</span>
              {i < roles.length - 1 && <span className="h-1 w-1 rounded-full bg-accent/50" />}
            </span>
          ))}
        </div>

        <div className="hero-fade mt-12 flex flex-wrap items-center gap-5" style={{ animationDelay: "1.05s" }}>
          <Magnetic>
            <Link
              href="/projects"
              data-cursor-label="enter"
              className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-colors duration-300 hover:bg-accent"
            >
              Explore the lab
              <span aria-hidden>&rarr;</span>
            </Link>
          </Magnetic>
          <Link
            href="/research"
            className="text-[15px] text-dim underline decoration-line underline-offset-8 transition-colors duration-300 hover:text-ink hover:decoration-accent"
          >
            Read the research
          </Link>
        </div>
      </div>

      <div
        className="hero-fade absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="label-mono">scroll</span>
        <span className="block h-10 w-px overflow-hidden bg-line-bright">
          <span className="scroll-cue block h-full w-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
