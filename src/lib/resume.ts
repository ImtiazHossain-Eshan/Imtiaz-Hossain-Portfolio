import { site } from "@/lib/site";

/** Mirrors cv/cv.html (rebuilt 2026-11-13). Update the CV first, then copy wording here. */
export const resume = {
  name: site.name,
  title: "Full-Stack & Android Software Engineering | Data Analytics & Power BI | Applied Machine Learning",
  location: site.location,
  phone: "+880 1401-692968",
  email: site.email,
  links: {
    portfolio: site.url,
    github: site.links.github,
    linkedin: site.links.linkedin,
    scholar: site.links.scholar,
    leetcode: site.links.leetcode,
  },

  summary:
    "Final-semester Computer Science student at BRAC University and digital transformation intern at BRAC Bank, developing Power BI dashboards for branch KPI and loan reporting. Builds full-stack web platforms, including live, publicly deployed products, and native Android applications using TypeScript, Next.js, Kotlin, and SQL, and completed an undergraduate thesis in computer vision. Combines software engineering and data analysis with clear technical communication, developed as a university Student Tutor for Java.",

  skills: [
    {
      group: "Programming",
      lines: [
        "Python, Java, JavaScript, TypeScript, Kotlin, C, SQL, PHP, HTML5, CSS3; OOP, data structures and algorithms, problem-solving",
      ],
    },
    {
      group: "Web & Backend",
      lines: [
        "React, Next.js, Node.js, Express, Hono, REST APIs, Tailwind CSS, Socket.IO, JWT, Clerk, role-based access control (RBAC), Zod validation, responsive UI, reusable components, API documentation",
      ],
    },
    {
      group: "Data & Analytics",
      lines: [
        "Power BI, Power Query, Microsoft Excel, SQL, MySQL, MongoDB, Cloudflare D1, Firebase Firestore, Drizzle ORM, pandas, NumPy, data analysis, KPI dashboards, reporting, relational data modeling",
      ],
    },
    {
      group: "Machine Learning & AI",
      lines: [
        "PyTorch, scikit-learn, Hugging Face Transformers, OpenCV, NLP, computer vision, CNNs, U-Net, BERT, LLM integration",
      ],
    },
    {
      group: "Mobile",
      lines: [
        "Android, Kotlin, Jetpack Compose, Room, Retrofit, WorkManager, Firebase, Figma wireframing and UI/UX design",
      ],
    },
    {
      group: "Cloud, Tools & Testing",
      lines: [
        "Git, GitHub, Linux/POSIX, Docker, Cloudflare Workers, Cloudflare R2, Vercel, JUnit, Vitest, Three.js",
      ],
    },
    {
      group: "Languages",
      lines: ["Bangla (native), English (IELTS overall band 7)"],
    },
  ],

  experience: [
    {
      role: "Branch Digital Transformation COMPASS Intern",
      org: "BRAC Bank PLC | Distribution Network Division, Head Office | Dhaka, Bangladesh",
      period: "Oct 2026 - Present",
      bullets: [
        "Develop Power BI dashboards for branch KPI monitoring and loan-related reporting, supporting visibility into operational performance.",
        "Analyze operational and business data in Excel and Power Query to support the division's reporting and dashboard requirements.",
        "Contribute to banking automation and digital-branch transformation initiatives.",
      ],
    },
    {
      role: "Student Tutor (ST/TA), CSE110: Programming Language I (Java)",
      org: "BRAC University | Department of Computer Science and Engineering | Dhaka, Bangladesh",
      period: "Nov 2026 - Present",
      bullets: [
        "Guide CSE110 students through Java fundamentals, code tracing, debugging, and problem-solving in clear, accessible terms.",
        "Built and deployed a consultation platform in React, TypeScript, Vite, Tailwind CSS, and Framer Motion with an interactive timetable, instant session lookup, and a structured consultation-request composer.",
      ],
    },
  ],

  researchExperience: [
    {
      role: "Undergraduate Thesis Researcher - Multi-Portrait Biometric Unlinkability",
      org: "BRAC University, four-member thesis team",
      period: "2026 - Present",
      bullets: [
        "Completed a four-member thesis developing Obscrowd, a multi-portrait biometric unlinkability framework for protecting faces after generative editing; contributed to the model pipeline and evaluation, and the manuscript is being prepared for publication.",
      ],
    },
    {
      role: "Machine Learning Engineer - Medical Imaging",
      org: "Brain Tumor Segmentation and Classification",
      period: "2026",
      bullets: [
        "Implemented U-Net and Attention U-Net segmentation plus DenseNet-121, EfficientNet-B0, and MobileNetV2 classification pipelines for four-class MRI analysis on the BRISC 2025 dataset in PyTorch.",
        "Achieved 88.22% test Dice, 79.74% mIoU, and 99.61% pixel accuracy with U-Net, while DenseNet-121 reached 97.50% classification accuracy on held-out BRISC MRI samples from the four-category test set.",
        "Ran 20 optimizer and learning-rate configurations and compared shared-encoder multi-task training with separate models, finding task-specific training improved both tasks and avoided task interference.",
      ],
    },
    {
      role: "NLP and Machine Learning Engineer",
      org: "News Classification and AI-Generated Text Detection",
      period: "2025 - 2026",
      bullets: [
        "Built a reproducible 27-run benchmark of nine architectures and three preprocessing pipelines across 102,002 training headlines, spanning TF-IDF, recurrent networks, and BERT-Base under matched controls.",
        "Reached 0.9376 macro-F1 with BERT-Base and 0.9214 with Bi-GRU trained in 18.7 seconds, showing that aggressive preprocessing helps shallow models but degrades pretrained transformers for this corpus.",
        "Engineered 28 lexical, syntactic, readability, and distributional features for AI-text detection; Random Forest reached 97.40% in-domain accuracy but exposed severe cross-generator failure.",
      ],
    },
  ],

  engineeringProjects: [
    {
      role: "BRACU Vault",
      org: "Next.js, TypeScript, Cloudflare Workers, Hono, D1, R2, Drizzle ORM, Clerk",
      period: "2026",
      bullets: [
        "Built and deployed an academic-resource platform with a Next.js/TypeScript interface, role-based access, gated uploads, moderation, secure file workflows, and auditable verification on Cloudflare infrastructure.",
        "Integrated REST APIs and database-backed permissions using Cloudflare Workers, Hono, D1, R2, Drizzle, and Clerk.",
      ],
    },
    {
      role: "Polaris",
      org: "Next.js, TypeScript, MongoDB, Gemma 4, Zod",
      period: "2026",
      bullets: [
        "Built a Bengali-first academic strategy platform that turns a student's goals, evidence, constraints, and deadlines into an adaptive roadmap with weekly actions, using a Gemma 4 strategist for roadmap generation and decision support.",
        "Added IELTS practice, video discovery, knowledge notes, evidence graphs, and a multimodal Essay Studio, backed by official-source retrieval, schema validation, deterministic safeguards, MongoDB persistence, signed payment webhooks, and clearly labelled fallbacks.",
      ],
    },
    {
      role: "Vantage Arm Digital Twin",
      org: "React, TypeScript, Three.js, Zustand, Vitest",
      period: "2026",
      bullets: [
        "Engineered a Three.js robotic-arm digital twin with inverse kinematics, safety constraints, motion replay, forward-kinematics checks, collision handling, and AI-planned command validation.",
      ],
    },
    {
      role: "WattsUp Office Monitor",
      org: "Node.js, Express, Socket.IO, React, Three.js, Discord.js",
      period: "2026",
      bullets: [
        "Built a simulated IoT energy monitor whose Express backend manages 15-device state, virtual time, usage, and alerts, with Socket.IO synchronization and Discord.js command integration.",
      ],
    },
    {
      role: "Custom UNIX Shell and VSFSck",
      org: "C, POSIX, Linux",
      period: "2025",
      bullets: [
        "Built C systems tools: a POSIX shell with fork/exec, pipes, redirection, chaining, history, and scoped SIGINT handling, plus an fsck-style checker for superblocks, bitmaps, inodes, and block references.",
      ],
    },
    {
      role: "Portico - Real-Estate Portfolio Intelligence (Android)",
      org: "Kotlin, Jetpack Compose, Firebase/Firestore, Clerk",
      period: "2026",
      bullets: [
        "Designed the app screens and user flows in Figma for CSE489 Mobile Application Development, then built the native Android application using Kotlin and Jetpack Compose with responsive phone and tablet layouts for onboarding, authentication, portfolio dashboards, property details, reports, documents, and account workflows.",
        "Integrated Clerk authentication, owner-scoped Firestore data, a serverless API bridge, bilingual English/Bangla interfaces, financial visualizations (ROI, cap rate, yield, cashflow), and an on-device portfolio assistant; the repository documents 116 passing tests.",
      ],
    },
    {
      role: "Nishan - Smart Geo-Tagged Landmarks (Android)",
      org: "Kotlin, Jetpack Compose, Room, Retrofit, WorkManager",
      period: "2026",
      bullets: [
        "Built an offline-first Android client for CSE489 with OpenStreetMap, GPS-based visit recording, a sortable and filterable landmark register, map interactions, activity history, and landmark create, withdraw, and restore workflows.",
        "Integrated REST API calls with Retrofit and OkHttp, local Room persistence, and WorkManager background queue processing and visit-status synchronization.",
      ],
    },
    {
      role: "Additional Android Coursework",
      org: "Android SDK, Jetpack Navigation, ViewBinding, JUnit",
      period: "2026",
      bullets: [
        "Built Android applications covering Activities, Fragments, lifecycle state restoration, ViewBinding, Jetpack Navigation, responsive XML resources, and JUnit-tested business logic; implemented custom broadcasts, battery status handling, Glide image loading, matrix-based pinch zoom and panning, audio/video playback, and lifecycle-aware resource cleanup.",
      ],
    },
  ],

  additionalProjects: [
    {
      name: "E-GamerHub",
      description:
        "Co-developed a MERN-stack social gaming platform with Socket.IO messaging, RBAC moderation, per-game statistics, and Llama 3 intent extraction for natural-language player search.",
    },
    {
      name: "CampusSync",
      description:
        "Built a PHP and MySQL PWA with automated course ingestion, routine-based free-time matching, read-state notifications, and offline fallback support.",
    },
    {
      name: "UniBoard",
      description:
        "Built a PHP and MySQL campus noticeboard with verified club dashboards, event discovery filters, RSVP and calendar workflows, and engagement analytics.",
    },
    {
      name: "Cholo",
      description:
        "Designed the normalized MySQL schema and PHP backend for a university ride-sharing system with verified accounts, recurring trips, ratings, and trip management.",
    },
    {
      name: "OpenGL Games Trilogy",
      description:
        "Implemented three PyOpenGL and GLUT games using primitive rendering, midpoint line rasterization, AABB collision, and hand-written game loops.",
    },
    {
      name: "Software Quality Prediction",
      description:
        "Compared four classifiers and k-means/PCA on 1,600 code-metric samples, reporting the weak 0.4418 best weighted-F1 signal as the study's central finding.",
    },
    {
      name: "The Proposer's Dilemma",
      description:
        "Built a multi-round Python bargaining simulation that makes Nash equilibrium, backward induction, acceptance behavior, and changing incentives visible through score trajectories.",
    },
  ],

  research: [
    {
      title: "Multi-Portrait Biometric Unlinkability under Generative Editing",
      venue: "Completed undergraduate thesis; manuscript in preparation",
      year: "2026",
      note: "Obscrowd is the framework developed in this four-member BRAC University thesis.",
    },
  ],

  education: {
    school: site.university,
    degree: "B.Sc. in Computer Science",
    location: "Dhaka, Bangladesh",
    period: "2023 - Jan 2027 (expected)",
    coursework: [
      "Data Structures and Algorithms",
      "Database Systems",
      "Operating Systems",
      "Artificial Intelligence",
      "NLP",
      "Image Processing",
      "Data Science",
      "Mobile Application Development",
      "Computer Graphics",
    ],
    earlier: [
      {
        degree: "Higher Secondary Certificate (HSC), Science",
        period: "2019 - 2021",
        school: "Dhaka College, Dhaka Board",
        score: "GPA 5.00/5.00",
        note: "General Scholarship: Dhaka Board rank 462, NCTB/Ministry of Education (2019 - 2022)",
      },
      {
        degree: "Secondary School Certificate (SSC), Science",
        period: "2019",
        school: "Ideal School & College, Dhaka Board",
        score: "GPA 5.00/5.00",
        note: "Talent Pool Scholarship: Dhaka Board 21st place, NCTB/Ministry of Education (2019)",
      },
    ],
  },

  teachingAndLeadership: [
    {
      role: "Private Tutor",
      org: "Dhaka, Bangladesh",
      period: "2024 - Present",
      description:
        "Tutor programming in C, Java, and Python alongside data structures, algorithms, and mathematics; support students with problem-solving and university coursework.",
    },
    {
      role: "Assistant Director",
      org: "BRACU E-Sports Club, BRAC University",
      period: "2025",
      description: "Supported club operations and esports event management at BRAC University.",
    },
  ],

  honors: [
    "Six-time scholarship recipient (merit and prior academic results)",
    "Top 10 finalist, TECHATHON NATIONALS 2026 (presented by IUT Robotics Society)",
    "Finalist, The Infinity AI BuildFest 2026 hackathon",
    "Special Recognition for Polaris, Build with Gemma 4 Hackathon (Gemma-powered academic strategy and student planning platform)",
    "Final-round participant, Bit Battles Programming Contest",
    "Solved 233+ algorithmic problems on LeetCode",
    "IELTS overall band 7 (English proficiency), 29 October 2022",
  ],

  certifications: [
    { title: "Understanding Machine Learning", issuer: "DataCamp" },
    { title: "Data Manipulation in Python", issuer: "DataCamp" },
    { title: "Cleaning Data in Python", issuer: "DataCamp" },
  ],

  provenance: [
    "The thesis manuscript is in preparation and is not presented as published or peer reviewed.",
    "Research metrics are project evaluation results, not employer or production claims.",
    "Android skills are supported by the two inspected CSE489 assignment codebases.",
    "CGPA is deliberately not shown on the website; it appears only in the CV PDF.",
  ],
} as const;
