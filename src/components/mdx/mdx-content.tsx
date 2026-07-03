import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Renders Velite-compiled MDX. The compiled `code` is a function body that
 * expects the JSX runtime and returns the MDX module.
 */
function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

function MDXLink(props: ComponentPropsWithoutRef<"a">) {
  const href = props.href ?? "";
  if (href.startsWith("/")) {
    return <Link {...props} href={href} />;
  }
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

function MDXImage(props: ComponentPropsWithoutRef<"img">) {
  const { src, alt, ...rest } = props;
  if (!src || typeof src !== "string") return null;
  return (
    <span className="my-8 block overflow-hidden rounded-xl border border-line bg-surface">
      <Image
        src={src}
        alt={alt ?? ""}
        width={1400}
        height={900}
        className="h-auto w-full"
        {...(rest as object)}
      />
      {alt ? <span className="label-mono block px-4 py-3">{alt}</span> : null}
    </span>
  );
}

const components = {
  a: MDXLink,
  img: MDXImage,
};

export function MDXContent({ code }: { code: string }) {
  // Velite compiles MDX to a code string; the component is necessarily
  // constructed from it here. This is the intended MDX rendering pattern.
  const Component = getMDXComponent(code);
  return <Component components={components} />;
}
