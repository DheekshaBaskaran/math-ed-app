'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Tutor() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const askTutor = async () => {
    setLoading(true);
    setReply('');
    setErr('');
    try {
      const r = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input.trim() }), // 👈 only "question"
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(data?.error || `HTTP ${r.status}`);
        return;
      }
      setReply(data?.hint || 'No response.');
    } catch (e: any) {
      setErr(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="flex justify-between w-full max-w-4xl mb-6">
        <Link href="/" className="btn btn-outline text-lg px-5 py-2 rounded-xl">← Back to Home</Link>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold text-center">Ask the AI Tutor 🤖</h1>
        <p className="text-center opacity-80">
          Ask any math question. I’ll explain it step by step.
        </p>

        <div className="card p-4 space-y-3">
          <div className="flex gap-3">
            <input
              className="input flex-1"
              placeholder="I need help with decimals"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askTutor()}
            />
            <button className="btn" onClick={askTutor} disabled={!input.trim() || loading}>
              {loading ? 'Thinking…' : 'Ask Tutor'}
            </button>
          </div>

          {(reply || err) && (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30">
              <div className="font-semibold mb-1">{err ? 'Error:' : 'Tutor says:'}</div>
              <div className="whitespace-pre-wrap">{err || reply}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
