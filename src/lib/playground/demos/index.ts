import type { DemoConfig } from "../demo-config";
import { PrecomputedProvider } from "../precomputed-provider";
import type { InferenceProvider } from "../types";
import { brainTumorDemo } from "./brain-tumor";
import { textDetectionDemo } from "./text-detection";
import { newsClassificationDemo } from "./news-classification";
import { softwareQualityDemo } from "./software-quality";

export const demoConfigs: DemoConfig[] = [
  brainTumorDemo,
  textDetectionDemo,
  newsClassificationDemo,
  softwareQualityDemo,
];

export function getDemoConfig(slug: string): DemoConfig | undefined {
  return demoConfigs.find((d) => d.slug === slug);
}

/**
 * Provider factory. Precomputed today; a hosted endpoint can be substituted
 * here later without touching any component.
 */
export function getProvider(config: DemoConfig): InferenceProvider {
  return new PrecomputedProvider(config.examples, config.provenance);
}
