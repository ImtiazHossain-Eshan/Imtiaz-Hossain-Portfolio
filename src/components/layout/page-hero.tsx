import type { ReactNode } from "react";
import { ShaderHero } from "@/components/three/shader-hero";
import { TextReveal } from "@/components/motion/text-reveal";
import { heroPresets } from "@/lib/hero-variants";
import { cn } from "@/lib/utils";

/** Shared page header with a shader backdrop. */
export function PageHero({
  preset,
  kicker,
  title,
  titleClassName,
  children,
}: {
  preset: keyof typeof heroPresets;
  kicker: string;
  title: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden" data-page={preset}>
      <div className="page-hero-visual pointer-events-none absolute inset-0 -z-10">
        <ShaderHero variant={heroPresets[preset].variant} fallback={heroPresets[preset].fallback} className="absolute inset-0" />
        <div className="hero-page-scrim absolute inset-0" />
      </div>
      <div className="wrap pb-14 pt-36 md:pb-20 md:pt-44">
        <p className="label-mono mb-5">{kicker}</p>
        <h1
          className={cn(
            "max-w-4xl text-5xl font-medium tracking-tight text-ink sm:text-6xl",
            titleClassName,
          )}
        >
          <TextReveal text={title} immediate />
        </h1>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
