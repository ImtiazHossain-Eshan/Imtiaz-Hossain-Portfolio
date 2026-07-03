import { streamText, type ModelMessage } from "ai";
import { getModel, embedQuery, assistantEnabled, resolveProvider } from "@/lib/ai/provider";
import { retrieve } from "@/lib/ai/retrieval";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Best-effort per-IP sliding-window limiter (per warm function instance). */
const WINDOW_MS = 60_000;
const MAX_REQ = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return arr.length > MAX_REQ;
}

const SYSTEM = `You are the portfolio assistant for Imtiaz Hossain, an AI Engineer and researcher.

Rules:
- Answer ONLY using the provided CONTEXT passages about Imtiaz's work. Do not use outside knowledge about him.
- If the context does not contain the answer, reply exactly: "I don't have verified information about that yet."
- Be concise, technical, and conversational. Prefer specifics (metrics, tech, decisions) over generalities.
- When you use a passage, cite it inline with its bracketed number, like [1] or [2].
- After answering, if relevant, suggest one related project or topic the visitor could ask about next.
- Never invent metrics, employers, publications, or links. Never claim Imtiaz did something not in the context.
- Speak about Imtiaz in the third person.`;

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!assistantEnabled()) {
    return Response.json(
      {
        error: "offline",
        message:
          "The AI assistant is not configured. Set AI_PROVIDER and the matching API key to enable it.",
      },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "rate_limited", message: "Too many questions in a short time. Please slow down." },
      { status: 429 },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-8);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser || lastUser.content.trim().length < 2) {
    return Response.json({ error: "empty_query" }, { status: 400 });
  }
  const query = lastUser.content.slice(0, 1000);

  // Retrieve grounding context (hybrid when embeddings + key available).
  const queryEmbedding = await embedQuery(query);
  const chunks = retrieve(query, queryEmbedding, 6);

  if (chunks.length === 0) {
    return new Response(
      "I don't have verified information about that yet.",
      { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Citations": "[]" } },
    );
  }

  const context = chunks
    .map((c, i) => `[${i + 1}] (${c.source}: ${c.title})\n${c.text}`)
    .join("\n\n");

  const citations = chunks.map((c, i) => ({
    n: i + 1,
    title: c.title,
    url: c.url,
    source: c.source,
  }));

  const model = getModel()!;
  const modelMessages: ModelMessage[] = [
    { role: "system", content: SYSTEM },
    ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
    {
      role: "user",
      content: `CONTEXT:\n${context}\n\nQUESTION: ${query}\n\nAnswer using only the context above, citing sources inline like [1].`,
    },
  ];

  try {
    const result = streamText({
      model,
      messages: modelMessages,
      temperature: 0.3,
      maxOutputTokens: 700,
    });
    const response = result.toTextStreamResponse();
    // Attach citations for the client to render as chips.
    response.headers.set("X-Citations", encodeURIComponent(JSON.stringify(citations)));
    response.headers.set("X-Provider", resolveProvider());
    return response;
  } catch {
    return Response.json(
      { error: "provider_error", message: "The assistant hit an error. Please try again." },
      { status: 502 },
    );
  }
}

export async function GET() {
  return Response.json({ enabled: assistantEnabled(), provider: resolveProvider() });
}
