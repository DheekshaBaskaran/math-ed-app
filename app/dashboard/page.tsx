'use client';

import { useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const grades = ['K','1','2','3','4','5','6','7','8'];

export default function Dashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [hint, setHint] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchQuestion = async (gradeParam?: string) => {
    const gradeToUse = gradeParam ?? selectedGrade;
    if (!gradeToUse) return;

    setLoading(true);
    setFeedback('');
    setHint('');
    setStudentAnswer('');
    setQuestion('');

    try {
      const res = await axios.post('/api/generate-question', { grade: gradeToUse });
      setQuestion(res.data.question);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const requestHint = async () => {
    if (!question) return;
    setHintLoading(true);
    try {
      const res = await axios.post('/api/hint', { question });
      setHint(res.data.hint);
    } finally {
      setHintLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!question || !studentAnswer.trim()) return;
    const res = await axios.post('/api/evaluate-answer', { question, studentAnswer });
    setFeedback(res.data.feedback);
  };

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Top App Bar */}
      <header className="border-b border-[var(--border-color)] bg-[var(--card-bg)]/70 backdrop-blur supports-[backdrop-filter]:bg-[var(--card-bg)]/60 sticky top-0 z-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white font-bold">M</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">MathEd</h1>
              <p className="text-sm opacity-70 -mt-0.5">K–8 Real-World Practice</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {/* Use Link itself as the button */}
            <Link href="/" className="btn">Home</Link>
            <Link href="/tutor" className="btn">Tutor</Link>
          </nav>
        </div>

        {/* Grade chips */}
        <div className="mx-auto w-full max-w-6xl px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {grades.map((g) => {
              const isSelected = selectedGrade === g;
              return (
                <button
                  key={g}
                  onClick={() => { setSelectedGrade(g); fetchQuestion(g); }}
                  disabled={loading}
                  aria-pressed={isSelected}
                  className={[
                    'chip',
                    isSelected ? 'chip--active' : ''
                  ].join(' ')}
                >
                  Grade {g}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          {/* Empty state */}
          {!question && !loading && (
            <div className="card text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Pick a grade to begin</h2>
              <p className="opacity-80">We’ll generate a real-world word problem tailored to that level.</p>
            </div>
          )}

          {/* Loader */}
          {loading && (
            <div className="card py-10 text-center">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent mb-3" />
              <p className="opacity-80">Generating question…</p>
            </div>
          )}

          {/* Question Card */}
          {question && !loading && (
            <div className="card max-w-3xl">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-wide font-semibold text-[var(--accent)] mb-1">Problem</p>
                <p className="text-lg">{question}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your answer…"
                  className="input flex-1"
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  aria-label="Your answer"
                />
                <button
                  onClick={checkAnswer}
                  className="btn"
                  disabled={!studentAnswer.trim()}
                >
                  Submit Answer
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={requestHint}
                  className="btn btn-outline"
                  disabled={hintLoading}
                >
                  {hintLoading ? 'Getting Hint…' : 'Hint'}
                </button>

                <button
                  onClick={() => fetchQuestion()}
                  className="btn btn-outline"
                  disabled={loading || !selectedGrade}
                >
                  Next Question
                </button>
              </div>

              {hint && (
                <div className="theme-card border border-[var(--border-color)] p-3 rounded mb-3">
                  <strong className="text-[var(--accent)]">Hint:</strong> {hint}
                </div>
              )}

              {feedback && (
                <div className="theme-card border border-[var(--border-color)] p-3 rounded">
                  <strong className="text-[var(--accent)]">Feedback:</strong> {feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2">
          <p className="opacity-70">© {new Date().getFullYear()} MathEd</p>
          <div className="opacity-70">
            <span className="mr-2">Theme:</span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-[var(--accent-light)]">System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
