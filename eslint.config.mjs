import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "content/**",
    "scripts/**",
  ]),
  {
    // The bundled React Compiler rules assume Compiler semantics this project
    // does not opt into. They over-flag two valid patterns we rely on:
    //   1. Mount-time feature detection / media-query sync via setState in an
    //      effect (custom cursor, smooth scroll, adaptive 3D quality).
    //   2. Imperative per-frame mutation of typed-array buffers inside a React
    //      Three Fiber useFrame loop, which is the correct, performant idiom.
    // Both are intentional; we relax the specific rules rather than rewrite
    // correct code to satisfy a compiler we are not using.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/use-memo": "off",
    },
  },
  {
    // Velite compiles MDX to a code string, so the component must be built from
    // that string at render. static-components stays on everywhere else.
    files: ["src/components/mdx/mdx-content.tsx"],
    rules: { "react-hooks/static-components": "off" },
  },
]);

export default eslintConfig;
