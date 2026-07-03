"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { fig } from "@/lib/utils";

type GalleryImage = { src: string; caption: string };

/** Caption-first gallery with a keyboard-friendly lightbox. */
export function ProjectGallery({ images, startAt = 1 }: { images: GalleryImage[]; startAt?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;
  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {images.map((image, i) => (
        <button
          key={image.src}
          type="button"
          onClick={() => setOpenIndex(i)}
          data-cursor-label="enlarge"
          className={
            "group overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors duration-300 hover:border-line-bright" +
            (images.length % 2 === 1 && i === 0 ? " sm:col-span-2" : "")
          }
        >
          <span className="block overflow-hidden">
            <Image
              src={image.src}
              alt={image.caption}
              width={1400}
              height={900}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </span>
          <span className="label-mono flex items-center gap-2 px-4 py-3">
            <span className="text-accent/70">fig. {fig(startAt + i)}</span>
            {image.caption}
          </span>
        </button>
      ))}

      <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-bg/90 backdrop-blur-md" />
          <Dialog.Content
            className="fixed inset-4 z-[81] flex flex-col items-center justify-center outline-none md:inset-10"
            aria-describedby={undefined}
          >
            {current && (
              <>
                <Dialog.Title className="sr-only">{current.caption}</Dialog.Title>
                <div className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-xl border border-line-bright">
                  <Image
                    src={current.src}
                    alt={current.caption}
                    width={2000}
                    height={1300}
                    sizes="95vw"
                    className="max-h-[80vh] w-full object-contain"
                  />
                </div>
                <p className="label-mono mt-4">{current.caption}</p>
                <Dialog.Close
                  className="absolute right-0 top-0 rounded-full border border-line-bright bg-surface px-4 py-2 text-sm text-dim transition-colors hover:border-accent hover:text-ink"
                  aria-label="Close image"
                >
                  esc
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
