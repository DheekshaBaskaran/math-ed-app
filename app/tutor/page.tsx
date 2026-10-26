'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'tutor' | 'error'; text: string };

const SUGGESTIONS = [
  'How do I add fractions with different denominators?',
  'What is 15% of 80?',
  'Explain area vs. perimeter',
  'How do I solve 4x + 2 = 12?',
];

export default function Tutor() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const askTutor = async (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const r = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }), // only "question"
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMessages((m) => [...m, { role: 'error', text: data?.error || `HTTP ${r.status}` }]);
        return;
      }
      setMessages((m) => [...m, { role: 'tutor', text: data?.hint || 'No response.' }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'error', text: e?.message || 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-12 sm:px-6">
      <div className="reveal text-center">
        <span className="eyebrow">
          <span className="pulse-dot" /> Tutor online
        </span>
        <h1 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Ask the <span className="gradient-text">AI Tutor</span>
        </h1>
        <p className="mt-3 text-[var(--muted)]">Ask any math question. I'll explain it step by step.</p>
      </div>

      <section className="card border-beam reveal mt-10 p-0" style={{ animationDelay: '120ms' }}>
        <div className="flex max-h-[55vh] min-h-[320px] flex-col gap-3 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="m-auto max-w-md text-center">
              <div className="icon-tile mx-auto">🤖</div>
              <p className="mt-4 font-semibold">Not sure where to start?</p>
              <p className="text-sm text-[var(--muted)]">Try one of these:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="eyebrow cursor-pointer hover:text-[var(--foreground)]" onClick={() => askTutor(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="chat-bubble chat-user pop">{m.text}</div>
            ) : (
              <div key={i} className="flex items-start gap-3 pop">
                <span className="logo-mark font-display shrink-0 text-sm">∑</span>
                <div className={`chat-bubble whitespace-pre-wrap ${m.role === 'error' ? 'callout callout-error' : 'chat-tutor'}`}>
                  {m.role === 'error' && <span className="font-semibold">Something went wrong: </span>}
                  {m.text}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="flex items-center gap-3 pop">
              <span className="logo-mark font-display shrink-0 text-sm">∑</span>
              <div className="chat-bubble chat-tutor">
                <div className="typing" aria-label="Tutor is thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex gap-3 border-t border-[var(--border)] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            askTutor();
          }}
        >
          <input
            className="input flex-1"
            placeholder="I need help with decimals…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn" type="submit" disabled={!input.trim() || loading}>
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </form>
      </section>
    </main>
  );
}
