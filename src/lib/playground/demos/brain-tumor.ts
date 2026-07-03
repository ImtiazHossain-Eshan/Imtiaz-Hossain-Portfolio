import type { DemoConfig } from "../demo-config";

const P = "/assets/lab/brain-tumor/panels";

/**
 * Brain tumor segmentation + classification demo.
 * Every prediction, confidence, and IoU here is read off the actual model
 * output panels saved during the project's demo runs.
 */
export const brainTumorDemo: DemoConfig = {
  slug: "brain-tumor",
  title: "Brain Tumor Segmentation & Classification",
  domain: "Computer Vision / Medical Imaging",
  tagline:
    "U-Net segments the tumor, DenseNet-121 names it. Page through real inference on unseen MRI slices.",
  projectSlug: "brain-tumor-segmentation",
  reportHref: "/assets/papers/brain-tumor-segmentation-report.pdf",
  facts: [
    { label: "dataset", value: "BRISC 2025", detail: "6,000 T1 MRI slices, 4 classes" },
    { label: "test set", value: "860", detail: "unseen samples" },
    { label: "hardware", value: "RTX 3070", detail: "8GB, PyTorch 2.0 + CUDA 11.8" },
    { label: "inference", value: "~45 ms", detail: "per slice" },
  ],
  headlineMetrics: [
    { label: "test dice", value: "88.22%", detail: "U-Net segmentation" },
    { label: "mIoU", value: "79.74%", detail: "U-Net" },
    { label: "pixel acc", value: "99.61%", detail: "U-Net" },
    { label: "classification", value: "97.50%", detail: "DenseNet-121" },
  ],
  pipeline: [
    {
      id: "dataset",
      label: "01 / dataset",
      title: "BRISC 2025 MRI",
      body: "T1-weighted brain MRI at 256x256, spanning glioma, meningioma, pituitary, and no-tumor. 3,933 valid image-mask pairs drive the segmentation task.",
      detail: ["5,000 train / 1,000 test", "256x256 grayscale", "4 tumor categories"],
    },
    {
      id: "preprocess",
      label: "02 / augmentation",
      title: "Aggressive augmentation",
      body: "Horizontal and vertical flips, rotation up to 15 degrees, affine transforms, brightness/contrast jitter, and Gaussian noise expand the modest dataset without distorting anatomy.",
    },
    {
      id: "architecture",
      label: "03 / architecture",
      title: "U-Net + DenseNet-121",
      body: "A five-level U-Net with skip connections handles segmentation under a combined Dice-BCE loss. A separate DenseNet-121 classifies the slice. Separate models beat a shared encoder here.",
      detail: ["U-Net: dice-bce loss", "DenseNet: cross-entropy", "trained separately"],
    },
    {
      id: "training",
      label: "04 / training",
      title: "100 epochs, early stopping",
      body: "Adam at 1e-4, batch size 16, up to 100 epochs with patience 15. A 20-run grid confirmed Adam at 5e-5 as optimal across optimizers.",
    },
    {
      id: "evaluation",
      label: "05 / evaluation",
      title: "860 unseen samples",
      body: "U-Net won all four segmentation metrics against Attention U-Net. Test performance exceeded validation by ~5 points, evidence of robust training rather than overfitting.",
    },
    {
      id: "inference",
      label: "06 / inference",
      title: "Original to prediction",
      body: "Below: real inference panels. Drag the slider to wipe between the input MRI and the model's predicted tumor overlay, and read the classifier's call and confidence.",
    },
  ],
  interactive: { kind: "cv-compare" },
  provenance:
    "These are authentic saved outputs from the trained U-Net and DenseNet-121. Segmentation IoU is shown for test-set slices that carry ground-truth masks.",
  examples: [
    {
      id: "test-glioma-coronal",
      label: "Glioma (coronal)",
      thumb: `${P}/test-glioma-coronal-input.webp`,
      note: "Test slice with ground truth; strong overlap.",
      layers: [
        { id: "in", label: "Input MRI", kind: "input", src: `${P}/test-glioma-coronal-input.webp` },
        { id: "ov", label: "Prediction overlay", kind: "overlay", src: `${P}/test-glioma-coronal-overlay.webp` },
      ],
      prediction: {
        label: "Glioma",
        confidence: 0.999,
        correct: true,
        metrics: [
          { label: "seg IoU", value: "81.37%" },
          { label: "ground truth", value: "Glioma" },
        ],
      },
    },
    {
      id: "test-glioma-axial",
      label: "Glioma (axial)",
      thumb: `${P}/test-glioma-axial-input.webp`,
      note: "A harder axial slice; correct class, lower IoU.",
      layers: [
        { id: "in", label: "Input MRI", kind: "input", src: `${P}/test-glioma-axial-input.webp` },
        { id: "ov", label: "Prediction overlay", kind: "overlay", src: `${P}/test-glioma-axial-overlay.webp` },
      ],
      prediction: {
        label: "Glioma",
        confidence: 0.979,
        correct: true,
        metrics: [
          { label: "seg IoU", value: "34.63%" },
          { label: "ground truth", value: "Glioma" },
        ],
      },
    },
    {
      id: "meningioma",
      label: "Meningioma",
      thumb: `${P}/meningioma-input.webp`,
      note: "Large frontal meningioma, cleanly delineated.",
      layers: [
        { id: "in", label: "Input MRI", kind: "input", src: `${P}/meningioma-input.webp` },
        { id: "ov", label: "Prediction overlay", kind: "overlay", src: `${P}/meningioma-overlay.webp` },
      ],
      prediction: { label: "Meningioma", confidence: 1.0, correct: true },
    },
    {
      id: "pituitary",
      label: "Pituitary",
      thumb: `${P}/pituitary-input.webp`,
      note: "Small central pituitary tumor.",
      layers: [
        { id: "in", label: "Input MRI", kind: "input", src: `${P}/pituitary-input.webp` },
        { id: "ov", label: "Prediction overlay", kind: "overlay", src: `${P}/pituitary-overlay.webp` },
      ],
      prediction: { label: "Pituitary", confidence: 1.0, correct: true },
    },
    {
      id: "no-tumor",
      label: "No tumor",
      thumb: `${P}/no-tumor-input.webp`,
      note: "Healthy scan; the model still emits a small spurious region.",
      layers: [
        { id: "in", label: "Input MRI", kind: "input", src: `${P}/no-tumor-input.webp` },
        { id: "ov", label: "Prediction overlay", kind: "overlay", src: `${P}/no-tumor-overlay.webp` },
      ],
      prediction: { label: "No Tumor", confidence: 0.999, correct: true },
    },
  ],
  evaluation: {
    title: "Evaluation artifacts",
    figures: [
      { src: "/assets/lab/brain-tumor/cm-densenet.webp", caption: "DenseNet-121 confusion matrix, four tumor classes", plate: true },
      { src: "/assets/lab/brain-tumor/segmentation-comparison.webp", caption: "All segmentation models compared", plate: true },
      { src: "/assets/lab/brain-tumor/hyperparam-heatmap.webp", caption: "Hyperparameter heatmap: optimizer x learning rate", plate: true },
      { src: "/assets/lab/brain-tumor/curves-densenet.webp", caption: "DenseNet-121 training curves", plate: true },
    ],
  },
};
