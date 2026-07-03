/**
 * Inference abstraction for the AI Playground.
 *
 * The UI consumes `InferenceProvider` only. Today `PrecomputedProvider`
 * serves authentic saved outputs from the trained models. To go live later,
 * implement `HttpInferenceProvider` against a hosted endpoint (HF Space, GPU
 * service) and swap the provider, with zero component changes.
 */

export type ClassProbability = { label: string; value: number };

/** One layer in an image comparison viewer. */
export type ComparisonLayer = {
  id: string;
  label: string;
  src: string;
  kind: "input" | "prediction" | "overlay" | "mask" | "gradcam" | "ground-truth";
};

/** A single curated example a visitor can select or "run". */
export type PrecomputedExample = {
  id: string;
  label: string;
  /** Thumbnail for the example picker. */
  thumb: string;
  /** Short caption describing the example. */
  note?: string;
  /** For CV demos: layers wired into the comparison viewer. */
  layers?: ComparisonLayer[];
  /** For NLP demos: the input text. */
  text?: string;
  /** Model output for this example. */
  prediction: {
    label: string;
    confidence: number;
    correct?: boolean;
    /** Per-class distribution, for probability bars. */
    distribution?: ClassProbability[];
    /** Extra scalar metrics, e.g. Seg IoU. */
    metrics?: Array<{ label: string; value: string }>;
  };
};

export type InferenceRequest =
  | { kind: "example"; exampleId: string }
  | { kind: "text"; text: string };

export type InferenceResult = {
  example: PrecomputedExample;
  /** True when the result is the nearest curated match rather than an exact one. */
  approximate: boolean;
  /** Honest note about how the result was produced. */
  provenance: string;
};

export interface InferenceProvider {
  readonly mode: "precomputed" | "http";
  listExamples(): PrecomputedExample[];
  run(request: InferenceRequest): Promise<InferenceResult>;
}
