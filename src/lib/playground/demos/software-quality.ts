import type { DemoConfig } from "../demo-config";

/** Real per-model weighted metrics from the study. */
export const swqModels = [
  { model: "Decision Tree", accuracy: 0.44, f1: 0.4418, best: true },
  { model: "Random Forest", accuracy: 0.36, f1: 0.35, best: false },
  { model: "Neural Network", accuracy: 0.35, f1: 0.35, best: false },
  { model: "KNN", accuracy: 0.31, f1: 0.3, best: false },
];

/** The nine code metrics with descriptive statistics from Table I. */
export const swqFeatures = [
  { name: "Lines of Code", mean: 4939.27, std: 2867.25, min: 106, max: 9998 },
  { name: "Cyclomatic Complexity", mean: 25.08, std: 13.88, min: 1, max: 49 },
  { name: "Num Functions", mean: 103.18, std: 55.5, min: 5, max: 199 },
  { name: "Code Churn", mean: 102.57, std: 50.55, min: -64.28, max: 295.14 },
  { name: "Comment Density", mean: 0.55, std: 0.26, min: 0.1, max: 1.0 },
  { name: "Num Bugs", mean: 2.93, std: 1.72, min: 0, max: 10 },
  { name: "Code Owner Experience", mean: 5.05, std: 2.56, min: 1, max: 9 },
];

export const softwareQualityDemo: DemoConfig = {
  slug: "software-quality",
  title: "Software Quality Prediction",
  domain: "Machine Learning / Software Engineering",
  tagline:
    "An honest study of a hard problem. The best model reaches 0.4418 F1, and the unsupervised view explains exactly why the signal is weak.",
  projectSlug: "software-quality-prediction",
  reportHref: "/assets/papers/software-quality-prediction-report.pdf",
  facts: [
    { label: "samples", value: "1,600", detail: "9 code metrics each" },
    { label: "classes", value: "3", detail: "High / Medium / Low, balanced" },
    { label: "split", value: "90/10", detail: "stratified" },
    { label: "clustering", value: "k=3", detail: "confirmed by elbow method" },
  ],
  headlineMetrics: [
    { label: "best weighted F1", value: "0.4418", detail: "decision tree" },
    { label: "micro-avg AUC", value: "~0.60", detail: "all models" },
    { label: "cluster overlap", value: "high", detail: "PCA projection" },
    { label: "verdict", value: "weak signal", detail: "reported honestly" },
  ],
  pipeline: [
    {
      id: "dataset",
      label: "01 / dataset",
      title: "Nine code metrics",
      body: "1,600 modules described by lines of code, cyclomatic complexity, function count, churn, comment density, bug count, unit-test coverage, and owner experience. Balanced across three quality tiers.",
    },
    {
      id: "preprocess",
      label: "02 / preprocessing",
      title: "Careful cleaning",
      body: "Mode imputation for missing values, Winsorizing at the 1st/99th percentiles for outliers, absolute-value transform on churn, and StandardScaler normalization.",
    },
    {
      id: "models",
      label: "03 / models",
      title: "Four supervised, one unsupervised",
      body: "Neural network, KNN, decision tree, and random forest for classification, plus k-means to probe the natural structure of the data.",
    },
    {
      id: "results",
      label: "04 / results",
      title: "The ceiling is low",
      body: "Below: the supervised scoreboard and the k-means / PCA projection. The decision tree leads, but every model hovers near chance for a three-class problem.",
    },
    {
      id: "why",
      label: "05 / why",
      title: "The features are the limit",
      body: "The elbow method cleanly finds k=3, matching the quality tiers, but PCA shows the clusters overlap heavily. The code metrics and the quality labels are only weakly related. Better features, not fancier models, is the fix.",
    },
  ],
  interactive: { kind: "cluster" },
  provenance:
    "All metrics and descriptive statistics are the exact values reported in the study.",
  examples: [],
  evaluation: {
    title: "Evaluation artifacts",
    figures: [
      { src: "/assets/lab/software-quality/kmeans-pca.webp", caption: "k-means clusters in PCA space: heavy overlap", plate: true },
      { src: "/assets/lab/software-quality/elbow-method.webp", caption: "Elbow method confirms k=3", plate: true },
      { src: "/assets/lab/software-quality/performance-comparison.webp", caption: "Model performance comparison", plate: true },
      { src: "/assets/lab/software-quality/correlation-heatmap.webp", caption: "Correlation matrix of the nine metrics", plate: true },
    ],
  },
};
