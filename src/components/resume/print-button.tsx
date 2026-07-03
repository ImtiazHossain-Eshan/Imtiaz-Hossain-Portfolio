"use client";

/** Triggers the browser print dialog for save-as-PDF. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-cursor-label="print"
      className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-bg transition-colors duration-300 hover:bg-accent"
    >
      Print / Save as PDF
    </button>
  );
}
