"use client";

import { useState } from "react";

/** BibTeX display with copy-to-clipboard and download. */
export function BibtexBlock({ bibtex, slug }: { bibtex: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function download() {
    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-code">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="label-mono">bibtex</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-line-bright px-3 py-1 text-[12px] text-dim transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? "copied" : "copy"}
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded-md border border-line-bright px-3 py-1 text-[12px] text-dim transition-colors hover:border-accent hover:text-accent"
          >
            .bib
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-dim">
        {bibtex.trim()}
      </pre>
    </div>
  );
}
