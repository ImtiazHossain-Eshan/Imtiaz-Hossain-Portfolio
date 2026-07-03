import type { DemoConfig } from "../demo-config";

/**
 * AI-generated text detection demo. Feature rankings and classifier metrics
 * are the exact values from the project's result CSVs.
 */
export const textDetectionDemo: DemoConfig = {
  slug: "text-detection",
  title: "AI-Generated Text Detection",
  domain: "NLP / Stylometry",
  tagline:
    "Twenty-eight statistical features decide human vs machine. Paste text or pick a sample and watch the classifier reason.",
  projectSlug: "ai-text-detection",
  reportHref: "/assets/papers/ai-text-detection-report.pdf",
  facts: [
    { label: "train corpus", value: "HC3", detail: "84,391 texts, 5 domains" },
    { label: "features", value: "28", detail: "lexical / syntactic / readability / distributional" },
    { label: "selection", value: "mRMR + RFE", detail: "each picks 15" },
    { label: "compute", value: "CPU-only", detail: "no GPU inference" },
  ],
  headlineMetrics: [
    { label: "HC3 accuracy", value: "97.40%", detail: "Random Forest" },
    { label: "macro F1", value: "0.9700", detail: "Random Forest" },
    { label: "cross-gen", value: "20-30%", detail: "on Bloomz, below chance" },
    { label: "top feature", value: "whitespace", detail: "MI 0.255" },
  ],
  pipeline: [
    {
      id: "dataset",
      label: "01 / dataset",
      title: "HC3 human vs ChatGPT",
      body: "The Human ChatGPT Comparison Corpus pairs human-expert and ChatGPT answers across open QA, finance, medicine, wiki/CS-AI, and Reddit ELI5. After filtering, 84,391 texts: 57,552 human, 26,839 AI.",
    },
    {
      id: "features",
      label: "02 / features",
      title: "28 stylometric features",
      body: "Every text is reduced to 28 model-agnostic surface features across four categories, capturing vocabulary richness, punctuation habits, readability, and distributional structure.",
      detail: ["8 lexical", "7 syntactic", "5 readability", "8 distributional"],
    },
    {
      id: "selection",
      label: "03 / selection",
      title: "mRMR and RFE agree",
      body: "Two independent methods, a filter (mRMR) and a wrapper (RFE), each select 15 features. Their agreement on whitespace ratio, vocabulary richness, and Zipf's coefficient is strong evidence those features genuinely matter.",
    },
    {
      id: "training",
      label: "04 / training",
      title: "Four classifiers, grid search",
      body: "SVM, AdaBoost, Decision Tree, and Random Forest, each tuned via 5-fold stratified GridSearchCV over a StandardScaler pipeline.",
    },
    {
      id: "inference",
      label: "05 / inference",
      title: "Score a passage",
      body: "Below: paste text or choose a sample. The demo surfaces the nearest curated example, its verdict, and the feature signals that drove it.",
    },
    {
      id: "evaluation",
      label: "06 / evaluation",
      title: "The generalization cliff",
      body: "In-domain the model is excellent. Move to a different generator (Bloomz) and it drops below chance. The feature fingerprints are generator-specific, not universal.",
    },
  ],
  interactive: {
    kind: "nlp-text",
    placeholder: "Paste a paragraph to analyze its statistical fingerprint...",
    presets: [
      "The mitochondria is the powerhouse of the cell. It is important to understand that cellular respiration occurs in several distinct stages, each of which plays a crucial role in energy production. Furthermore, it is worth noting that this process is highly efficient and well regulated.",
      "honestly i just threw it together the night before lol. wasn't even sure it'd compile but somehow it worked?? still don't fully get why the pointer bug went away after i moved that one line but hey, not complaining.",
    ],
  },
  provenance:
    "Classifier metrics are the exact HC3 results. Free text is matched to the closest curated example by feature overlap and clearly labeled; a hosted model would score arbitrary text live.",
  examples: [
    {
      id: "ai-sample",
      label: "Likely AI",
      thumb: "",
      text: "The mitochondria is the powerhouse of the cell. It is important to understand that cellular respiration occurs in several distinct stages, each of which plays a crucial role in energy production. Furthermore, it is worth noting that this process is highly efficient and well regulated.",
      prediction: {
        label: "AI-generated",
        confidence: 0.94,
        distribution: [
          { label: "AI-generated", value: 0.94 },
          { label: "Human", value: 0.06 },
        ],
        metrics: [
          { label: "vocabulary richness", value: "low" },
          { label: "sentence std", value: "tight" },
          { label: "whitespace", value: "uniform" },
        ],
      },
    },
    {
      id: "human-sample",
      label: "Likely human",
      thumb: "",
      text: "honestly i just threw it together the night before lol. wasn't even sure it'd compile but somehow it worked?? still don't fully get why the pointer bug went away after i moved that one line but hey, not complaining.",
      prediction: {
        label: "Human",
        confidence: 0.91,
        distribution: [
          { label: "Human", value: 0.91 },
          { label: "AI-generated", value: 0.09 },
        ],
        metrics: [
          { label: "vocabulary richness", value: "high" },
          { label: "sentence std", value: "varied" },
          { label: "punctuation", value: "irregular" },
        ],
      },
    },
  ],
  evaluation: {
    title: "Evaluation artifacts",
    figures: [
      { src: "/assets/lab/text-detection/feature-selection.webp", caption: "Feature ranking: mRMR MI (left) vs RFE importance (right)", plate: true },
      { src: "/assets/lab/text-detection/cm-hc3.webp", caption: "Confusion matrices for all four classifiers on HC3", plate: true },
      { src: "/assets/lab/text-detection/roc-hc3.webp", caption: "ROC curves with AUC on HC3", plate: true },
      { src: "/assets/lab/text-detection/tsne-2d.webp", caption: "t-SNE: AI text clusters more tightly than human", plate: true },
    ],
  },
};

/** The 28 features with their real mRMR mutual-information scores and selection flags. */
export const textFeatureRankings = [
  { feature: "whitespace_ratio", mi: 0.2554, category: "distributional", mrmr: true, rfe: true },
  { feature: "automated_readability", mi: 0.2271, category: "readability", mrmr: true, rfe: true },
  { feature: "vocabulary_richness", mi: 0.2268, category: "lexical", mrmr: true, rfe: true },
  { feature: "zipf_coefficient", mi: 0.2117, category: "distributional", mrmr: false, rfe: true },
  { feature: "hapax_legomena_ratio", mi: 0.212, category: "lexical", mrmr: false, rfe: true },
  { feature: "simpsons_diversity", mi: 0.2017, category: "lexical", mrmr: true, rfe: true },
  { feature: "yules_k", mi: 0.1844, category: "lexical", mrmr: true, rfe: true },
  { feature: "avg_sentence_length", mi: 0.1433, category: "lexical", mrmr: false, rfe: true },
  { feature: "flesch_kincaid_grade", mi: 0.1402, category: "readability", mrmr: false, rfe: true },
  { feature: "gunning_fog_index", mi: 0.1396, category: "readability", mrmr: false, rfe: true },
  { feature: "comma_ratio", mi: 0.1382, category: "syntactic", mrmr: true, rfe: true },
  { feature: "flesch_reading_ease", mi: 0.1251, category: "readability", mrmr: false, rfe: true },
  { feature: "coleman_liau_index", mi: 0.1153, category: "readability", mrmr: false, rfe: true },
  { feature: "avg_paragraph_length", mi: 0.1115, category: "distributional", mrmr: true, rfe: false },
  { feature: "uppercase_ratio", mi: 0.11, category: "distributional", mrmr: true, rfe: false },
  { feature: "conjunction_ratio", mi: 0.1058, category: "syntactic", mrmr: true, rfe: false },
  { feature: "pronoun_ratio", mi: 0.1031, category: "syntactic", mrmr: true, rfe: false },
  { feature: "sentence_length_std", mi: 0.0993, category: "distributional", mrmr: true, rfe: false },
  { feature: "hapax_dislegomena_ratio", mi: 0.0919, category: "lexical", mrmr: true, rfe: false },
  { feature: "function_word_ratio", mi: 0.0858, category: "lexical", mrmr: false, rfe: false },
  { feature: "avg_word_length", mi: 0.0841, category: "lexical", mrmr: false, rfe: false },
  { feature: "stopword_ratio", mi: 0.0833, category: "distributional", mrmr: false, rfe: false },
  { feature: "avg_punctuation_per_sent", mi: 0.066, category: "syntactic", mrmr: true, rfe: true },
  { feature: "word_length_std", mi: 0.0549, category: "distributional", mrmr: true, rfe: false },
  { feature: "digit_ratio", mi: 0.0188, category: "distributional", mrmr: false, rfe: false },
  { feature: "semicolon_ratio", mi: 0.0181, category: "syntactic", mrmr: true, rfe: true },
  { feature: "exclamation_ratio", mi: 0.0145, category: "syntactic", mrmr: true, rfe: false },
  { feature: "question_mark_ratio", mi: 0.0101, category: "syntactic", mrmr: false, rfe: false },
] as const;
