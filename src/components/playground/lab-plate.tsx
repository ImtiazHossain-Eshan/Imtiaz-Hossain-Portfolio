"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { LabFigure } from "@/lib/playground/demo-config";
import { cn } from "@/lib/utils";

/**
 * Research figures are matplotlib exports on white. Rather than fight that,
 * we present them as printed plates: a light card set into the dark lab, with
 * a mono caption bar, click to enlarge. Non-plate images render edge to edge.
 */
export function LabPlate({ figure, className }: { figure: LabFigure; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor-label="enlarge"
        className={cn(
          "group block overflow-hidden rounded-xl border border-line text-left transition-colors duration-300 hover:border-line-bright",
          className,
        )}
      >
        <span className={cn("block overflow-hidden", figure.plate ? "bg-white p-3" : "bg-surface")}>
          <Image
            src={figure.src}
            alt={figure.caption}
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 45vw"
            className={cn(
              "h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]",
              figure.plate && "rounded-sm",
            )}
          />
        </span>
        <span className="label-mono block bg-surface px-4 py-3">{figure.caption}</span>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-bg/90 backdrop-blur-md" />
          <Dialog.Content
            className="fixed inset-4 z-[81] flex flex-col items-center justify-center outline-none md:inset-12"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">{figure.caption}</Dialog.Title>
            <div
              className={cn(
                "max-h-full w-full max-w-5xl overflow-hidden rounded-xl border border-line-bright",
                figure.plate ? "bg-white p-4" : "bg-surface",
              )}
            >
              <Image
                src={figure.src}
                alt={figure.caption}
                width={2000}
                height={1500}
                sizes="90vw"
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <p className="label-mono mt-4">{figure.caption}</p>
            <Dialog.Close
              className="absolute right-0 top-0 rounded-full border border-line-bright bg-surface px-4 py-2 text-sm text-dim transition-colors hover:border-accent hover:text-ink"
              aria-label="Close figure"
            >
              esc
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
