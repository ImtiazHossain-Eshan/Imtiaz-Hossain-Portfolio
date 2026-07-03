# Imtiaz Hossain

**AI Engineer · Machine Learning · Computer Vision · NLP · Research**

Dhaka, Bangladesh · imtiaz.hossain.eshan@gmail.com
GitHub: github.com/ImtiazHossain-Eshan · LinkedIn: linkedin.com/in/imtiazhossaineshan
Google Scholar: scholar.google.com/citations?user=CIjeZSsAAAAJ · LeetCode: leetcode.com/u/Imtiaz_Hossain_Eshan

---

## Summary

AI Engineer and researcher specializing in computer vision, NLP, and deep learning, with a track record of production-grade full-stack systems and rigorous, reproducible ML studies. I train and evaluate models end to end (88.22% test Dice for brain-tumor segmentation, 97.40% accuracy for AI-text detection, 0.9376 macro-F1 across a 27-run NLP benchmark) and ship systems that run on zero-cost cloud infrastructure. My research advances biometric privacy under generative editing. I optimize for evidence over polish, reporting honest ceilings and failure modes alongside headline metrics.

## Technical Skills

- **Languages:** Python, TypeScript, C, JavaScript, SQL, PHP
- **AI / ML:** PyTorch, scikit-learn, HuggingFace Transformers, OpenCV, gensim, NumPy, pandas
- **Models & methods:** U-Net / Attention U-Net, DenseNet / EfficientNet / MobileNet, BERT / RNN / GRU / LSTM, Random Forest / SVM / k-means, diffusion & adversarial ML, RAG / LLM structured output
- **Web & backend:** Next.js, React, Node.js, Express, Hono, MongoDB, MySQL, Drizzle
- **Cloud & tooling:** Cloudflare Workers / D1 / R2, Vercel, Docker, Git, Linux, PWA
- **Research:** Experimental design, feature engineering, model evaluation, LaTeX, technical writing

## Engineering & Research Experience

### AI Researcher (Biometric Privacy) — Independent Research, BRAC University · 2026

- Designed Obscrowd, a privacy framework for multi-portrait biometric unlinkability under generative editing, protecting every detected face in a group image with a single imperceptible, mask-guided perturbation.
- Engineered a teacher-student-refinement pipeline: a diffusion-guided teacher, a lightweight student generator for efficient deployment, and an inference-time refinement stage within a bounded perceptual budget.
- Reduced face-recognition similarity from 0.957 to 0.138 after generative edits while keeping the protected image visually faithful, training against a face-recognition ensemble and differentiable editing attacks.

### Machine Learning Engineer (Medical Imaging) — Brain Tumor Segmentation & Classification · 2026

- Implemented and compared U-Net, Attention U-Net, and three CNN classifiers (DenseNet-121, EfficientNet-B0, MobileNetV2) on the BRISC 2025 MRI dataset in PyTorch.
- Achieved 88.22% test Dice, 79.74% mIoU, and 99.61% pixel accuracy for segmentation, and 97.50% four-class classification accuracy on 860 unseen samples.
- Ran a 20-configuration hyperparameter study and demonstrated that separate task-specific training outperforms joint multi-task learning by ~5 points, informing the deployment recommendation.

### NLP Engineer — News Classification & AI-Text Detection · 2025 – 2026

- Built a reproducible benchmark of 27 experiments (9 architectures x 3 preprocessing pipelines) on 102k news headlines, reaching 0.9376 macro-F1 with BERT-Base and 0.9214 with a Bi-GRU trained in 19 seconds.
- Engineered 28 stylometric features with mRMR and RFE selection for AI-generated text detection, reaching 97.40% accuracy on HC3 with Random Forest and quantifying a severe cross-generator generalization gap.
- Identified that BERT's WordPiece tokenizer inverts the preprocessing rules that hold for classical models, a model-specific insight for practitioners.

### Full-Stack Engineer — BRACU Vault · Polaris · E-GamerHub · 2025 – 2026

- Built BRACU Vault, a verified study-archive platform, on Cloudflare's free tier (Workers + Hono, D1, R2, Clerk) with a data-driven six-role RBAC model and university-email-gated uploads.
- Engineered Polaris, an AI academic strategist using Gemini structured-JSON output, RAG over a curated knowledge base, and a transparent logistic-regression probability model, with graceful no-API-key fallback.
- Developed E-GamerHub, a MERN social platform with Socket.IO real-time messaging, RBAC moderation, and Groq Llama 3 natural-language player search.

## Research

- **Obscrowd: Multi-Portrait Biometric Unlinkability under Generative Editing.** Working paper, 2026. Joint multi-face privacy protection via a teacher-student-refinement pipeline.

## Selected Additional Projects

- Custom UNIX shell in C (pipes, redirection, chaining, signal handling)
- VSFSck file-system consistency checker (superblock, bitmaps, inode cross-checks)
- OpenGL games from primitives (midpoint line algorithm, AABB collision)
- Software quality prediction ML study (honest 0.4418 F1 ceiling reported)

## Education

**B.Sc. in Computer Science and Engineering** — BRAC University, Dhaka, Bangladesh · CGPA 3.7+
Relevant coursework: Machine Learning, Artificial Intelligence, Computer Graphics, Operating Systems, Database Systems, Data Structures & Algorithms.

## Certifications

- Understanding Machine Learning — DataCamp
- Data Manipulation in Python — DataCamp
- Cleaning Data in Python — DataCamp
