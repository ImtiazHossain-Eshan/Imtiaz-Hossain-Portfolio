"use client";

import { Canvas } from "@react-three/fiber";
import { NeuralFieldScene, type FieldQuality } from "./neural-field-scene";

/**
 * The R3F Canvas, isolated so it (and the whole three.js bundle) can be
 * `next/dynamic`-imported off the homepage's critical path.
 */
export default function NeuralFieldCanvas({
  quality,
  dprMax,
  inView,
  onContextLost,
}: {
  quality: FieldQuality;
  dprMax: number;
  inView: boolean;
  onContextLost: () => void;
}) {
  return (
    <Canvas
      className="theme-visual-canvas transition-opacity duration-1000"
      camera={{ position: [0, 0, 10.5], fov: 55 }}
      dpr={[1, dprMax]}
      frameloop={inView ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        }, { once: true });
      }}
    >
      <NeuralFieldScene quality={quality} />
    </Canvas>
  );
}
