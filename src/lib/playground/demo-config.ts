import type { PrecomputedExample } from "./types";

/** A stage in the pipeline story, animated as the visitor scrolls. */
export type PipelineStage = {
  id: string;
  label: string;
  title: string;
  body: string;
  detail?: string[];
};

export type LabFigure = {
  src: string;
  caption: string;
  /** Research figures are matplotlib exports on white; frame them on a plate. */
  plate?: boolean;
};

export type MetricRow = { label: string; value: string; detail?: string };

/** Which interactive surface a demo renders. */
export type DemoInteractive =
  | { kind: "cv-compare" }
  | { kind: "nlp-text"; placeholder: string; presets: string[] }
  | { kind: "news-matrix" }
  | { kind: "cluster" };

export type DemoConfig = {
  slug: string;
  title: string;
  domain: string;
  tagline: string;
  /** Dataset / hardware / framework facts. */
  facts: MetricRow[];
  headlineMetrics: MetricRow[];
  pipeline: PipelineStage[];
  interactive: DemoInteractive;
  examples: PrecomputedExample[];
  provenance: string;
  evaluation: { title: string; figures: LabFigure[] };
  /** Related project case study slug. */
  projectSlug: string;
  reportHref?: string;
};
