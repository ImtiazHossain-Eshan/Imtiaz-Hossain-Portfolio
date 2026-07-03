"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  to: string[];
};

const NODE_W = 168;
const NODE_H = 56;
const COL_GAP = 64;
const ROW_GAP = 40;

function nodeX(col: number) {
  return col * (NODE_W + COL_GAP);
}
function nodeY(row: number) {
  return row * (NODE_H + ROW_GAP);
}

/**
 * Interactive system diagram rendered from typed frontmatter. Nodes sit on a
 * column/row grid; edges are cubic curves that light up when either endpoint
 * is hovered or focused. Edges draw themselves in when scrolled into view.
 */
export function ArchitectureDiagram({ nodes, title }: { nodes: ArchNode[]; title?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const { edges, width, height } = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges: Array<{ from: ArchNode; to: ArchNode; id: string }> = [];
    for (const node of nodes) {
      for (const targetId of node.to) {
        const target = byId.get(targetId);
        if (target) edges.push({ from: node, to: target, id: `${node.id}->${targetId}` });
      }
    }
    const maxCol = Math.max(...nodes.map((n) => n.col));
    const maxRow = Math.max(...nodes.map((n) => n.row));
    return {
      edges,
      byId,
      width: nodeX(maxCol) + NODE_W,
      height: nodeY(maxRow) + NODE_H,
    };
  }, [nodes]);

  function edgePath(from: ArchNode, to: ArchNode) {
    const x1 = nodeX(from.col) + (to.col > from.col ? NODE_W : to.col < from.col ? 0 : NODE_W / 2);
    const y1 = nodeY(from.row) + (to.col === from.col ? (to.row > from.row ? NODE_H : 0) : NODE_H / 2);
    const x2 = nodeX(to.col) + (to.col > from.col ? 0 : to.col < from.col ? NODE_W : NODE_W / 2);
    const y2 = nodeY(to.row) + (to.col === from.col ? (to.row > from.row ? 0 : NODE_H) : NODE_H / 2);
    if (to.col === from.col) {
      const my = (y1 + y2) / 2;
      return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
    }
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  function isEdgeActive(edge: { from: ArchNode; to: ArchNode }) {
    return active !== null && (edge.from.id === active || edge.to.id === active);
  }

  const activeNeighbors = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active]);
    for (const edge of edges) {
      if (edge.from.id === active) set.add(edge.to.id);
      if (edge.to.id === active) set.add(edge.from.id);
    }
    return set;
  }, [active, edges]);

  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 p-6 md:p-8">
        <svg
          viewBox={`-8 -8 ${width + 16} ${height + 16}`}
          className="mx-auto h-auto w-full"
          style={{ maxWidth: width * 1.15, minWidth: Math.min(width * 0.75, 560) }}
          role="img"
          aria-label={title ?? "System architecture diagram"}
        >
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0.5 L 7.5 4 L 0 7.5 z" fill="currentColor" className="text-faint" />
            </marker>
          </defs>

          {edges.map((edge, i) => {
            const lit = isEdgeActive(edge);
            return (
              <motion.path
                key={edge.id}
                d={edgePath(edge.from, edge.to)}
                fill="none"
                strokeWidth={lit ? 1.8 : 1.1}
                markerEnd="url(#arch-arrow)"
                className="transition-[stroke,opacity] duration-300"
                stroke={lit ? "var(--color-accent)" : "var(--color-line-bright)"}
                opacity={active && !lit ? 0.3 : 1}
                initial={reduced ? undefined : { pathLength: 0 }}
                whileInView={reduced ? undefined : { pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: "easeOut" }}
              />
            );
          })}

          {nodes.map((node) => {
            const highlighted = active === null || activeNeighbors.has(node.id);
            return (
              <g
                key={node.id}
                transform={`translate(${nodeX(node.col)}, ${nodeY(node.row)})`}
                onPointerEnter={() => setActive(node.id)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="group"
                aria-label={node.sub ? `${node.label}: ${node.sub}` : node.label}
                className="cursor-default outline-none transition-opacity duration-300"
                opacity={highlighted ? 1 : 0.35}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  className="transition-[stroke,fill] duration-300"
                  fill={active === node.id ? "rgba(124,223,255,0.08)" : "var(--color-raised)"}
                  stroke={active === node.id ? "var(--color-accent)" : "var(--color-line-bright)"}
                  strokeWidth={1.2}
                />
                <text
                  x={NODE_W / 2}
                  y={node.sub ? 24 : NODE_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={NODE_W / 2}
                    y={40}
                    textAnchor="middle"
                    fontSize={8.5}
                    letterSpacing={0.8}
                    fill={active === node.id ? "var(--color-accent)" : "var(--color-faint)"}
                    style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                  >
                    {node.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {title && <figcaption className="label-mono mt-3">{title}</figcaption>}
    </figure>
  );
}
