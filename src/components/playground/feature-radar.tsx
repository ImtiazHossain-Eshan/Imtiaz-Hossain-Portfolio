"use client";

import { motion } from "motion/react";

type Axis = { label: string; value: number };

/**
 * Radar chart over the top discriminative features. `value` is normalized
 * mutual-information (0 to 1). Animates its polygon on mount.
 */
export function FeatureRadar({ axes, size = 260 }: { axes: Axis[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 44;
  const n = axes.length;

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = axes.map((a, i) => point(i, r * Math.max(0.06, a.value)));
  const polygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full max-w-[300px]" role="img" aria-label="Feature importance radar">
      {/* rings */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={axes.map((_, i) => point(i, r * ring).join(",")).join(" ")}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}
      {/* spokes + labels */}
      {axes.map((a, i) => {
        const [x, y] = point(i, r);
        const [lx, ly] = point(i, r + 20);
        return (
          <g key={a.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-line)" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - cx) < 4 ? "middle" : lx > cx ? "start" : "end"}
              dominantBaseline="middle"
              fontSize={8.5}
              fill="var(--color-faint)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {a.label}
            </text>
          </g>
        );
      })}
      {/* data polygon */}
      <motion.polygon
        points={polygon}
        fill="rgba(124,223,255,0.14)"
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="var(--color-accent)" />
      ))}
    </svg>
  );
}
