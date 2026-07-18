"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";
const THEME_EVENT = "portfolio:theme-change";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}

  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", theme === "light" ? "#f6f7f8" : "#07080a"));

  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);

    const syncThemeControls = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail);
    };

    window.addEventListener(THEME_EVENT, syncThemeControls);
    return () => {
      window.removeEventListener(THEME_EVENT, syncThemeControls);
    };
  }, []);

  const switchTheme = () => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme: Theme = current === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  };

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={label}
      title={label}
      aria-pressed={theme === "light"}
      data-cursor-label={theme === "light" ? "dark mode" : "light mode"}
      className={cn(
        "theme-toggle relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-bg/55 text-dim backdrop-blur-sm transition-colors duration-300 hover:border-accent/60 hover:text-accent",
        className,
      )}
    >
      <svg
        className="theme-icon theme-icon-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="theme-icon theme-icon-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
