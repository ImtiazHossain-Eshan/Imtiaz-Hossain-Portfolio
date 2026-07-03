# Imtiaz Hossain

AI Engineer and researcher working across computer vision, NLP, deep learning, and the
production systems around them. BRAC University, Dhaka.

### Live at [imtiazhossain.dev](https://imtiazhossain.dev)

This is the source for my portfolio. It is less a résumé and more a working laboratory you can
walk through. Every number on the site is pulled from a real result file, and where a model has
an honest ceiling, I say so rather than dressing it up.

## What you can do there

- **Poke the models.** An interactive playground where you can segment a brain tumor on real
  MRI, probe an AI-generated-text detector, and trace 27 NLP experiments in a single grid, all
  running on authentic outputs from models I trained.
- **Read the work.** Case studies on medical-imaging deep learning, a privacy framework for
  faces under generative editing, production platforms that run on a zero-cost cloud budget, and
  lower-level systems work like a UNIX shell and a file-system checker written in C.
- **Ask about me.** A retrieval-augmented assistant, grounded only in what is on the site. Ask
  it about any project (press the chat button or Cmd-K) and it answers with citations, and
  clearly admits when it does not know.

## A bit about me

I care about evidence over polish. I would rather report a model's real ceiling and failure
modes than manufacture a clean number, and most of my projects are built to be reproducible and
inspected. My research advances biometric privacy under generative editing; my applied work
spans computer vision, NLP, full-stack engineering, systems programming, and even OpenGL games
built from primitives.

Open to research collaborations, AI and ML engineering roles, and graduate opportunities.

- Email: imtiaz.hossain.eshan@gmail.com
- GitHub: [ImtiazHossain-Eshan](https://github.com/ImtiazHossain-Eshan)
- LinkedIn: [imtiazhossaineshan](https://www.linkedin.com/in/imtiazhossaineshan/)
- Google Scholar: [profile](https://scholar.google.com/citations?user=CIjeZSsAAAAJ&hl=en)

## Built with

Next.js and React, TypeScript, Tailwind CSS, Three.js for the neural-field hero, Framer Motion,
MDX for the writing, and the Vercel AI SDK for the assistant (provider-switchable across Gemini,
Groq, and OpenRouter). Deployed on Vercel.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

It runs fully with no API keys. Optional keys (a free Gemini or Groq key for the assistant, a
GitHub token for live repo data) unlock extras and degrade gracefully when absent. See
`.env.example` for the full list, and `DEPLOY.md` for the deployment checklist.
