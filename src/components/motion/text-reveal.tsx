"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Hoisted so the motion components are created once, not per render.
const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

type TextRevealProps = {
  text: string;
  className?: string;
  /** Seconds before the first word appears. */
  delay?: number;
  /** Stagger between words in seconds. */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Animate on mount (true) or when scrolled into view (false). */
  immediate?: boolean;
};

/**
 * Word-by-word masked rise. Each word animates inside an overflow-hidden
 * clip so letters emerge from an invisible baseline, newsprint-style.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = "span",
  immediate = false,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAGS[Tag];

  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            aria-hidden
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "115%", rotate: 2.5 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
