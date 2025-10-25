'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Tutor() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/ask-tutor', { question: input });
      setResponse(res.data.reply);
    } catch (error) {
      setResponse("Sorry, I couldn’t process that question right now. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">Ask the AI Tutor 🤖</h1>

      <p className="text-lg text-center mb-8 max-w-2xl">
        Ask me any math question! I’ll explain it step by step in a way that’s
        clear, kind, and matches your grade level.
      </p>

      <div className="card w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you need help with?"
            className="input flex-1"
          />
          <button
            onClick={askTutor}
            disabled={loading}
            className="btn btn--info w-full sm:w-auto"
          >
            {loading ? 'Thinking...' : 'Ask Tutor'}
          </button>
        </div>

        {response && (
          <div className="theme-card border border-[var(--border-color)] p-4 rounded-lg shadow-sm">
            <p className="font-semibold mb-2 text-[var(--accent)]">Tutor says:</p>
            <p>{response}</p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/">
          <button className="btn btn--warning text-lg px-6 py-2">
            ← Back to Home
          </button>
        </Link>
      </div>
    </main>
  );
}
