import type { DemoConfig } from "../demo-config";

/** The complete 27-run macro-F1 matrix, from results_summary.csv. */
export type NewsRun = {
  model: string;
  variant: "none" | "extreme" | "optimum";
  macroF1: number;
  trainTime: number;
  repr: string;
};

export const newsRuns: NewsRun[] = [
  { model: "LogReg", variant: "none", macroF1: 0.9098, trainTime: 2.2, repr: "TF-IDF" },
  { model: "LogReg", variant: "extreme", macroF1: 0.9209, trainTime: 1.5, repr: "TF-IDF" },
  { model: "LogReg", variant: "optimum", macroF1: 0.9192, trainTime: 1.6, repr: "TF-IDF" },
  { model: "DNN", variant: "none", macroF1: 0.8804, trainTime: 52.5, repr: "TF-IDF" },
  { model: "DNN", variant: "extreme", macroF1: 0.9139, trainTime: 54.5, repr: "TF-IDF" },
  { model: "DNN", variant: "optimum", macroF1: 0.9144, trainTime: 41.1, repr: "TF-IDF" },
  { model: "RNN", variant: "none", macroF1: 0.8883, trainTime: 6.1, repr: "Skip-gram" },
  { model: "RNN", variant: "extreme", macroF1: 0.9009, trainTime: 5.9, repr: "Skip-gram" },
  { model: "RNN", variant: "optimum", macroF1: 0.9021, trainTime: 5.9, repr: "Skip-gram" },
  { model: "GRU", variant: "none", macroF1: 0.9151, trainTime: 12.3, repr: "Skip-gram" },
  { model: "GRU", variant: "extreme", macroF1: 0.9163, trainTime: 15.9, repr: "Skip-gram" },
  { model: "GRU", variant: "optimum", macroF1: 0.9168, trainTime: 15.9, repr: "Skip-gram" },
  { model: "LSTM", variant: "none", macroF1: 0.9168, trainTime: 16.5, repr: "Skip-gram" },
  { model: "LSTM", variant: "extreme", macroF1: 0.9183, trainTime: 14.0, repr: "Skip-gram" },
  { model: "LSTM", variant: "optimum", macroF1: 0.9159, trainTime: 7.6, repr: "Skip-gram" },
  { model: "Bi-RNN", variant: "none", macroF1: 0.899, trainTime: 6.4, repr: "Skip-gram" },
  { model: "Bi-RNN", variant: "extreme", macroF1: 0.9009, trainTime: 5.1, repr: "Skip-gram" },
  { model: "Bi-RNN", variant: "optimum", macroF1: 0.9031, trainTime: 6.4, repr: "Skip-gram" },
  { model: "Bi-GRU", variant: "none", macroF1: 0.9148, trainTime: 21.6, repr: "Skip-gram" },
  { model: "Bi-GRU", variant: "extreme", macroF1: 0.9155, trainTime: 5.7, repr: "Skip-gram" },
  { model: "Bi-GRU", variant: "optimum", macroF1: 0.9214, trainTime: 18.7, repr: "Skip-gram" },
  { model: "Bi-LSTM", variant: "none", macroF1: 0.9108, trainTime: 7.7, repr: "Skip-gram" },
  { model: "Bi-LSTM", variant: "extreme", macroF1: 0.9186, trainTime: 12.3, repr: "Skip-gram" },
  { model: "Bi-LSTM", variant: "optimum", macroF1: 0.9164, trainTime: 6.2, repr: "Skip-gram" },
  { model: "BERT-Base", variant: "none", macroF1: 0.9376, trainTime: 2109.2, repr: "WordPiece" },
  { model: "BERT-Base", variant: "extreme", macroF1: 0.9288, trainTime: 2115.2, repr: "WordPiece" },
  { model: "BERT-Base", variant: "optimum", macroF1: 0.9313, trainTime: 2115.5, repr: "WordPiece" },
];

export const newsModelsOrder = [
  "LogReg", "DNN", "RNN", "GRU", "LSTM", "Bi-RNN", "Bi-GRU", "Bi-LSTM", "BERT-Base",
];
export const newsVariantsOrder: Array<"none" | "extreme" | "optimum"> = ["none", "extreme", "optimum"];

export const newsClassificationDemo: DemoConfig = {
  slug: "news-classification",
  title: "News Topic Classification",
  domain: "NLP / Text Classification",
  tagline:
    "Twenty-seven experiments in one grid. Hover any cell to compare accuracy against training cost, from a 1.5s logistic regression to a 35-minute BERT.",
  projectSlug: "news-topic-classification",
  reportHref: "/assets/papers/news-topic-classification-report.pdf",
  facts: [
    { label: "corpus", value: "102k", detail: "training headlines, 4 classes" },
    { label: "test set", value: "12,000", detail: "balanced across classes" },
    { label: "experiments", value: "27", detail: "9 models x 3 pipelines" },
    { label: "imbalance", value: "3.4x", detail: "handled by class weighting" },
  ],
  headlineMetrics: [
    { label: "best macro-F1", value: "0.9376", detail: "BERT-Base, none" },
    { label: "best non-transformer", value: "0.9214", detail: "Bi-GRU, 18.7s" },
    { label: "BERT train time", value: "~35 min", detail: "vs 19s for Bi-GRU" },
    { label: "F1 gap", value: "0.016", detail: "BERT over Bi-GRU" },
  ],
  pipeline: [
    {
      id: "dataset",
      label: "01 / dataset",
      title: "Four topics, imbalanced",
      body: "102,002 training and 12,000 test headlines across Science & Technology, Business, Sports, and World News. Training is imbalanced 3.4x; the test set is balanced.",
    },
    {
      id: "preprocess",
      label: "02 / preprocessing",
      title: "Three pipelines",
      body: "None (raw, HTML included), Extreme (stemming and full stopword removal), and Optimum (lemmatization, negation-preserving). Each is applied identically to every model.",
      detail: ["none: worst-case baseline", "extreme: porter stemming", "optimum: from EDA"],
    },
    {
      id: "representations",
      label: "03 / representations",
      title: "TF-IDF to WordPiece",
      body: "TF-IDF for the classical models, from-scratch Skip-gram embeddings for six recurrent variants, and WordPiece for BERT-Base.",
    },
    {
      id: "training",
      label: "04 / training",
      title: "Nine architectures",
      body: "From logistic regression to bidirectional gated networks to a fine-tuned transformer, all under inverse-frequency class weighting on an 8GB RTX 3070.",
    },
    {
      id: "matrix",
      label: "05 / results",
      title: "The 27-run matrix",
      body: "Below: every model times every pipeline. The story is in the contrasts, so hover cells to compare macro-F1 against training cost.",
    },
    {
      id: "insight",
      label: "06 / insight",
      title: "BERT breaks the rule",
      body: "Preprocessing that helps shallow models hurts BERT: its WordPiece tokenizer handles raw HTML gracefully and is degraded by stemming. Preprocessing is model-specific, not universal.",
    },
  ],
  interactive: { kind: "news-matrix" },
  provenance:
    "Every cell is the exact test-set macro-F1 and training time from the project's results_summary.csv.",
  examples: [],
  evaluation: {
    title: "Evaluation artifacts",
    figures: [
      { src: "/assets/lab/news-classification/macro-f1-grid.webp", caption: "Macro-F1 across model x preprocessing", plate: true },
      { src: "/assets/lab/news-classification/class-distribution.webp", caption: "Train imbalance vs balanced test set", plate: true },
      { src: "/assets/lab/news-classification/cm/bertbase-none.webp", caption: "BERT-Base confusion matrix (none, best run)", plate: true },
      { src: "/assets/lab/news-classification/cm/bigru-optimum.webp", caption: "Bi-GRU confusion matrix (optimum, best non-transformer)", plate: true },
    ],
  },
};
