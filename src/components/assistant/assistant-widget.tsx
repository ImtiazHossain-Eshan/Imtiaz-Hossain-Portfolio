"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Citation = { n: number; title: string; url: string; source: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

const SUGGESTIONS = [
  "Tell me about BRACU Vault.",
  "Explain the brain tumor segmentation project.",
  "What AI research has Imtiaz published?",
  "Which project is he most proud of?",
  "What's his experience with NLP?",
];

const STORE_KEY = "assistant:history";

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore session history + check whether the assistant is configured.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    fetch("/api/assistant")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  // Persist history within the session.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {}
  }, [messages]);

  // Open via nav event or Cmd/Ctrl-K.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("assistant:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("assistant:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = useCallback(
    async (text: string) => {
      const query = text.trim();
      if (!query || streaming) return;
      setInput("");
      const nextMessages: Message[] = [...messages, { role: "user", content: query }];
      setMessages(nextMessages);
      setStreaming(true);

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content:
                data.message ??
                "The assistant is unavailable right now. Please try again later.",
            },
          ]);
          setStreaming(false);
          return;
        }

        let citations: Citation[] = [];
        try {
          const raw = res.headers.get("X-Citations");
          if (raw) citations = JSON.parse(decodeURIComponent(raw));
        } catch {}

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        setMessages((m) => [...m, { role: "assistant", content: "", citations }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: acc, citations };
              return copy;
            });
          }
        }

        // Never leave a bubble hanging on "…" if the stream produced nothing.
        if (!acc.trim()) {
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              role: "assistant",
              content: "I could not generate a response just now. Please try again.",
            };
            return copy;
          });
        }
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming],
  );

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask the AI assistant"
        data-cursor-label="ask me anything"
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-bg/80 text-accent shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-accent/10"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3a9 9 0 0 0-9 9c0 1.5.4 2.9 1 4.1L3 21l4.9-1c1.2.6 2.6 1 4.1 1a9 9 0 0 0 0-18Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="8.5" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="15.5" cy="12" r="1" fill="currentColor" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[71] bg-bg/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="AI assistant"
              className="fixed inset-x-3 bottom-3 top-3 z-[72] flex flex-col overflow-hidden rounded-3xl border border-line-bright bg-surface/95 shadow-2xl shadow-black/70 backdrop-blur-xl sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6 sm:h-[min(37rem,80vh)] sm:w-[27rem]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="relative flex items-center justify-between px-5 py-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
                />
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 3a9 9 0 0 0-9 9c0 1.5.4 2.9 1 4.1L3 21l4.9-1c1.2.6 2.6 1 4.1 1a9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="8.5" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="15.5" cy="12" r="1" fill="currentColor" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[15px] font-medium tracking-tight text-ink">Ask about Imtiaz</p>
                    <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      <span className="h-1 w-1 rounded-full bg-good" aria-hidden />
                      grounded / cites sources
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-faint transition-colors hover:border-line-bright hover:text-ink"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Body. data-lenis-prevent opts this container out of the global
                  smooth-scroll so the mouse wheel scrolls the chat natively. */}
              <div
                ref={scrollRef}
                data-lenis-prevent
                className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5"
              >
                {enabled === false && (
                  <div className="rounded-xl border border-warn/25 bg-warn/[0.06] p-3.5 text-[12.5px] leading-relaxed text-warn/90">
                    The live assistant is not configured on this deployment. The suggested questions
                    still point to everything in the projects, research, and blog sections.
                  </div>
                )}

                {messages.length === 0 && (
                  <div>
                    <p className="text-[13.5px] leading-relaxed text-dim">
                      Ask me anything about Imtiaz&apos;s work. I only answer from what he has
                      documented, and I cite my sources.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          disabled={enabled === false}
                          className="group flex items-center gap-2.5 rounded-xl border border-line bg-raised/40 px-3.5 py-2.5 text-left text-[13px] text-dim transition-colors hover:border-accent/40 hover:bg-raised hover:text-ink disabled:opacity-40"
                        >
                          <span className="text-accent/60 transition-colors group-hover:text-accent" aria-hidden>
                            &rsaquo;
                          </span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                    {m.role === "assistant" && (
                      <span className="mb-1.5 ml-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                        assistant
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[88%] text-[13.5px] leading-relaxed",
                        m.role === "user"
                          ? "rounded-2xl rounded-br-md bg-accent/15 px-3.5 py-2.5 text-ink"
                          : "w-full rounded-2xl rounded-tl-md border border-line/80 bg-gradient-to-b from-raised to-surface px-4 py-3 text-ink/90",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <div className="assistant-md">
                          <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                          {m.citations && m.citations.length > 0 && m.content && (
                            <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-line pt-3">
                              <span className="w-full pb-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                                sources
                              </span>
                              {m.citations.map((c) => (
                                <Link
                                  key={c.n}
                                  href={c.url}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-1 rounded-full border border-line-bright bg-bg/40 px-2.5 py-1 font-mono text-[10px] text-dim transition-colors hover:border-accent hover:text-accent"
                                >
                                  <span className="text-accent/70">{c.n}</span>
                                  {c.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}

                {streaming && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-line bg-raised px-3.5 py-3">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-line p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={enabled === false ? "Assistant offline" : "Ask anything about his work..."}
                    disabled={enabled === false || streaming}
                    className="flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={enabled === false || streaming || !input.trim()}
                    aria-label="Send"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-bg transition-colors hover:bg-accent disabled:opacity-40"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <p className="label-mono mt-2 text-center">
                  press <span className="text-dim">⌘K</span> anywhere to summon
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
