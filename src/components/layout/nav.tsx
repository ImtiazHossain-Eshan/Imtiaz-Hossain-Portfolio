"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Fire the global event the assistant widget listens for. */
function openAssistant() {
  window.dispatchEvent(new CustomEvent("assistant:open"));
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="wrap-wide flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2.5" aria-label="Home">
          <span className="text-[15px] font-medium tracking-tight text-ink">
            Imtiaz Hossain
          </span>
          <span className="label-mono hidden text-accent/70 transition-colors group-hover:text-accent sm:inline">
            ai.lab
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-300",
                  active ? "text-ink" : "text-dim hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId={reduced ? undefined : "nav-pill"}
                    className="absolute inset-0 rounded-full bg-raised"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={openAssistant}
            data-cursor-label="ask about me"
            className="ml-3 rounded-full border border-accent/30 px-3.5 py-1.5 text-[13px] text-accent transition-colors duration-300 hover:border-accent/70 hover:bg-accent/10"
          >
            Ask AI
          </button>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300",
                open && "top-1/2 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300",
                open && "bottom-auto top-1/2 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 flex flex-col bg-bg/95 backdrop-blur-lg md:hidden"
          >
            <nav className="wrap flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduced ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="font-display block py-2 text-4xl text-ink/90 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAssistant();
                }}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * navLinks.length, duration: 0.45 }}
                className="mt-6 w-fit rounded-full border border-accent/40 px-5 py-2.5 text-accent"
              >
                Ask AI about my work
              </motion.button>
            </nav>
            <div className="wrap pb-10">
              <p className="label-mono">{site.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
