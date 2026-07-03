import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date like "Jun 2026" for specimen labels and bylines. */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    ...opts,
  });
}

/** Zero-padded figure numbers for the specimen-label motif: fig(3) -> "03" */
export function fig(n: number) {
  return String(n).padStart(2, "0");
}
