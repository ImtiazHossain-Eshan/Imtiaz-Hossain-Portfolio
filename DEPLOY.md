# Deploy checklist

The site is free to run end to end: Vercel Hobby for hosting, a free Gemini (or Groq) key for
the assistant, and the free `.dev` domain from the GitHub Student Pack.

## 1. Deploy to Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new). It auto-detects Next.js; keep
   the default build command (`npm run build`).
2. Add these environment variables (Production):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://imtiazhossain.dev` |
   | `AI_PROVIDER` | `gemini` (or `groq` / `openrouter`) |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | your Gemini key |
   | `GITHUB_TOKEN` | a classic PAT with `read:user` scope |

3. Deploy. With the Gemini key present at build time, the RAG index is embedded automatically,
   so production gets vector plus lexical retrieval.

All keys are optional. Without them the site still builds and runs, with the assistant showing
a graceful offline state and GitHub data falling back to a public REST fetch.

## 2. Connect the domain (imtiazhossain.dev)

In Vercel: **Settings → Domains → add `imtiazhossain.dev`** (and `www`). Vercel shows the DNS
records. In Name.com → **Manage DNS Records**, add them:

- `A` record, host `@` → `76.76.21.21`
- `CNAME`, host `www` → `cname.vercel-dns.com`

HTTPS for `.dev` is issued automatically by Vercel. Propagation is usually a few minutes.

Optional: to manage DNS through Cloudflare instead, add the site in Cloudflare, switch Name.com's
nameservers to Cloudflare's two, and add the same records there as **DNS only (grey cloud)**.

## 3. Bring the assistant live

Set `AI_PROVIDER` and the matching key (Gemini and Groq both have free tiers that comfortably
cover portfolio traffic). Redeploy, and the floating chat flips from offline to live streaming
with citations.

## 4. Publish blog posts when ready

Every post in `content/blog` starts as `draft: true` and stays hidden in production. Flip a
post's frontmatter to `draft: false` when you want it live, then redeploy.
