import type {
  InferenceProvider,
  InferenceRequest,
  InferenceResult,
  PrecomputedExample,
} from "./types";

/** Cheap word-overlap score for matching free text to a curated example. */
function similarity(a: string, b: string) {
  const norm = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const sa = norm(a);
  const sb = norm(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let overlap = 0;
  for (const t of sa) if (sb.has(t)) overlap += 1;
  return overlap / Math.sqrt(sa.size * sb.size);
}

/**
 * Serves authentic saved model outputs. For text demos, free input is matched
 * to the nearest curated example and clearly labeled as such, so nothing is
 * ever passed off as a live prediction.
 */
export class PrecomputedProvider implements InferenceProvider {
  readonly mode = "precomputed" as const;

  constructor(
    private readonly examples: PrecomputedExample[],
    private readonly provenanceNote: string,
  ) {}

  listExamples() {
    return this.examples;
  }

  async run(request: InferenceRequest): Promise<InferenceResult> {
    if (request.kind === "example") {
      const example = this.examples.find((e) => e.id === request.exampleId) ?? this.examples[0];
      return { example, approximate: false, provenance: this.provenanceNote };
    }

    // Free text: pick the closest curated example, honestly labeled.
    let best = this.examples[0];
    let bestScore = -1;
    for (const example of this.examples) {
      if (!example.text) continue;
      const score = similarity(request.text, example.text);
      if (score > bestScore) {
        bestScore = score;
        best = example;
      }
    }
    return {
      example: best,
      approximate: true,
      provenance:
        "Closest curated example, matched by feature overlap. Wire a hosted model endpoint to score arbitrary text live.",
    };
  }
}
