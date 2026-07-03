// Generated at build time by scripts/build-rag-index.ts. Imported (not read
// from disk) so it is bundled into the function on any host.
import ragIndexData from "./rag-index.generated.json";

/**
 * Hybrid retrieval over the static RAG index.
 *  - Lexical BM25 always runs (zero keys required).
 *  - Vector cosine runs when the index carries embeddings and a query
 *    embedding is provided.
 *  - Results fused with reciprocal rank fusion.
 */

export type Chunk = {
  id: string;
  title: string;
  url: string;
  source: string;
  text: string;
  embedding?: number[];
};

type Index = { version: number; hasEmbeddings: boolean; chunks: Chunk[] };

const index = ragIndexData as Index;

function loadIndex(): Index {
  return index;
}

const STOP = new Set([
  "the", "a", "an", "of", "to", "and", "in", "is", "it", "for", "on", "with",
  "as", "at", "by", "or", "be", "this", "that", "are", "was", "what", "how",
  "do", "does", "your", "you", "i", "me", "my", "tell", "about", "can",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => !STOP.has(t) && t.length > 1);
}

/** BM25 scoring over the chunk corpus. */
function bm25(query: string, chunks: Chunk[], k = 12): Array<{ i: number; score: number }> {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return [];
  const N = chunks.length;
  const docTokens = chunks.map((c) => tokenize(`${c.title} ${c.title} ${c.text}`));
  const avgLen = docTokens.reduce((s, d) => s + d.length, 0) / Math.max(1, N);

  const df = new Map<string, number>();
  for (const term of new Set(qTerms)) {
    let count = 0;
    for (const d of docTokens) if (d.includes(term)) count += 1;
    df.set(term, count);
  }

  const k1 = 1.5;
  const b = 0.75;
  const scores = docTokens.map((tokens, i) => {
    const len = tokens.length || 1;
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    let score = 0;
    for (const term of qTerms) {
      const f = tf.get(term);
      if (!f) continue;
      const n = df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * len) / avgLen)));
    }
    return { i, score };
  });

  return scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function vectorSearch(
  queryEmbedding: number[],
  chunks: Chunk[],
  k = 12,
): Array<{ i: number; score: number }> {
  return chunks
    .map((c, i) => ({ i, score: c.embedding ? cosine(queryEmbedding, c.embedding) : -1 }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Reciprocal rank fusion of two ranked lists. */
function rrf(
  lists: Array<Array<{ i: number }>>,
  k = 60,
): number[] {
  const scores = new Map<number, number>();
  for (const list of lists) {
    list.forEach((item, rank) => {
      scores.set(item.i, (scores.get(item.i) ?? 0) + 1 / (k + rank + 1));
    });
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([i]) => i);
}

export type RetrievedChunk = Chunk & { rank: number };

export function retrieve(query: string, queryEmbedding?: number[], topK = 6): RetrievedChunk[] {
  const index = loadIndex();
  if (index.chunks.length === 0) return [];

  const lexical = bm25(query, index.chunks);
  const lists: Array<Array<{ i: number }>> = [lexical];

  if (queryEmbedding && index.hasEmbeddings) {
    lists.push(vectorSearch(queryEmbedding, index.chunks));
  }

  const fused = rrf(lists).slice(0, topK);
  return fused.map((i, rank) => ({ ...index.chunks[i], rank }));
}

export function hasEmbeddings(): boolean {
  return loadIndex().hasEmbeddings;
}
