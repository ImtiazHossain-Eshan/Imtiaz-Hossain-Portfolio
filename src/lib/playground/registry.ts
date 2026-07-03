/**
 * The AI Playground registry: one entry per interactive lab demo.
 * All metrics quoted here come from the project reports and result files;
 * nothing is invented.
 */
export type PlaygroundEntry = {
  slug: string;
  title: string;
  domain: "Computer Vision" | "NLP" | "Machine Learning";
  method: string;
  /** Headline metric shown on tiles. */
  metric: { label: string; value: string };
  summary: string;
  /** Related project case study. */
  projectSlug: string;
  /** Specimen-label id, e.g. "exp-01". */
  labId: string;
};

export const playgroundEntries: PlaygroundEntry[] = [
  {
    slug: "brain-tumor",
    title: "Brain Tumor Segmentation & Classification",
    domain: "Computer Vision",
    method: "U-Net + DenseNet-121 on BRISC 2025",
    metric: { label: "test dice", value: "88.22%" },
    summary:
      "Segment tumors in T1-weighted MRI slices and classify them across four categories. Compare U-Net against Attention U-Net and inspect real inference panels from 860 unseen test samples.",
    projectSlug: "brain-tumor-segmentation",
    labId: "exp-01",
  },
  {
    slug: "text-detection",
    title: "AI-Generated Text Detection",
    domain: "NLP",
    method: "28 statistical features + Random Forest",
    metric: { label: "hc3 accuracy", value: "97.40%" },
    summary:
      "Detect ChatGPT-written text from 28 handcrafted stylometric features. Explore feature importance, the HC3 benchmark, and why detection collapses across generators.",
    projectSlug: "ai-text-detection",
    labId: "exp-02",
  },
  {
    slug: "news-classification",
    title: "News Topic Classification",
    domain: "NLP",
    method: "27 controlled experiments, TF-IDF to BERT",
    metric: { label: "best macro-f1", value: "0.9376" },
    summary:
      "Nine architectures times three preprocessing pipelines on 102k headlines. See where BERT wins, where a 19-second Bi-GRU nearly matches it, and why stemming hurts WordPiece.",
    projectSlug: "news-topic-classification",
    labId: "exp-03",
  },
  {
    slug: "software-quality",
    title: "Software Quality Prediction",
    domain: "Machine Learning",
    method: "Code metrics + supervised & k-means analysis",
    metric: { label: "weighted f1", value: "0.4418" },
    summary:
      "An honest study of a hard problem: predicting quality labels from nine code metrics. Explore the cluster structure and why the signal is weak, reported without varnish.",
    projectSlug: "software-quality-prediction",
    labId: "exp-04",
  },
];

export function getPlaygroundEntry(slug: string) {
  return playgroundEntries.find((entry) => entry.slug === slug);
}
