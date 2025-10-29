'use client';

import { useMemo, useState } from 'react';

type GenResponse = {
  question?: string;
  hint?: string;
  solution?: string;
  topic?: string;
  feedback?: string;
  [k: string]: any;
};

export default function Dashboard() {
  const GRADES = ['K','1','2','3','4','5','6','7','8'] as const;
  type Grade = typeof GRADES[number];

  // Grade bands → topics (display only; you can change freely)
  const TOPICS_BY_BAND: Record<'K2'|'3_5'|'6_8', string[]> = {
    K2: ['Counting', 'Addition', 'Subtraction', 'Shapes', 'Time'],
    '3_5': ['Multiplication', 'Division', 'Fractions', 'Decimals', 'Area & Perimeter'],
    '6_8': ['Ratios & Proportions', 'Percent', 'Integers', 'Linear Equations', 'Geometry'],
  };

  const bandFor = (g: Grade): keyof typeof TOPICS_BY_BAND =>
    g === 'K' || g === '1' || g === '2' ? 'K2'
    : g === '3' || g === '4' || g === '5' ? '3_5'
    : '6_8';

  // If your API expects numbers (K=0), convert here:
  const gradeToNumber = (g: Grade): number => (g === 'K' ? 0 : Number(g));

  const [grade, setGrade] = useState<Grade | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const [question, setQuestion] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [solution, setSolution] = useState<string>(''); // optional, if returned
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);

  const topics = useMemo(
    () => (grade ? TOPICS_BY_BAND[bandFor(grade)] : []),
    [grade]
  );

  const resetWork = () => {
    setQuestion('');
    setHint('');
    setSolution('');
    setStudentAnswer('');
    setFeedback('');
  };

  // Create a problem via your existing endpoint
  const generateProblem = async (g: Grade, t: string) => {
    setLoading(true);
    resetWork();
    try {
      const r = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeToNumber(g), // send number if your API expects it
          topic: t,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: GenResponse = await r.json();

      // Accept either {question} or {data.question}
      const q = data.question ?? (data as any)?.data?.question;
      setQuestion(q || 'Problem unavailable.');
      setHint(data.hint || '');
      setSolution(data.solution || '');
    } catch (err) {
      console.error(err);
      setQuestion('Sorry — I couldn’t generate a problem. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Ask for a hint
  const getHint = async () => {
    if (!grade || !topic || !question) return;
    setHintLoading(true);
    try {
      const r = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeToNumber(grade),
          topic,
          question,
          ask: 'hint',
        }),
      });
      const data: GenResponse = r.ok ? await r.json() : {};
      setHint(
        data.hint ||
          'Try identifying what is given and what is unknown, then choose the operation.'
      );
    } catch {
      setHint('Think about what the question is asking in plain words first.');
    } finally {
      setHintLoading(false);
    }
  };

  // Check the student answer
  const checkAnswer = async () => {
    setFeedback('');
    // If server gave a direct solution, do a local soft check first
    if (solution) {
      const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
      if (normalize(studentAnswer) === normalize(solution)) {
        setFeedback('✅ Correct! Nice work.');
      } else {
        setFeedback(
          `🧐 Not quite. ${hint ? 'Check the hint, then try again.' : 'Try a different approach.'}`
        );
      }
      return;
    }

    // Otherwise ask your API to evaluate
    try {
      const r = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeToNumber(grade as Grade),
          topic,
          question,
          studentAnswer,
          ask: 'check',
        }),
      });
      if (!r.ok) throw new Error('check failed');
      const data: GenResponse = await r.json();
      setFeedback(data.feedback || 'Answer submitted.');
    } catch {
      setFeedback('Could not check right now — try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <section className="card">
          <header className="mb-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Pick Your Grade</h1>
            <p className="text-lg opacity-80">
              Then choose a topic — your problem appears instantly.
            </p>
          </header>

          {/* Step 1: Grade */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGrade(g);
                    setTopic(null);
                    resetWork();
                  }}
                  className={`chip chip-lg ${grade === g ? 'chip--active' : ''} text-xl`}
                  aria-pressed={grade === g}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            {/* Step 2: Topics (after a grade is chosen) */}
            {grade && (
              <>
                <div className="h-px w-full my-6 bg-[var(--border)]" />
                <h2 className="text-2xl font-semibold mb-3 text-center">
                  Choose a topic for Grade {grade}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mb-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        generateProblem(grade, t); // generate immediately
                      }}
                      className={`chip chip-lg ${topic === t ? 'chip--active' : ''}`}
                      aria-pressed={topic === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Problem workspace */}
            {(loading || question) && (
              <div className="w-full max-w-2xl mt-6 space-y-4">
                {loading ? (
                  <div className="text-center text-lg opacity-80">
                    Generating your problem…
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40">
                      <div className="text-sm font-semibold opacity-70 mb-2">
                        Topic: {topic} · Grade {grade}
                      </div>
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {question}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        className="input flex-1"
                        placeholder="Type your answer…"
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                      />
                      <button className="btn" onClick={checkAnswer} disabled={!studentAnswer}>
                        Check
                      </button>
                      <button className="btn btn-outline" onClick={getHint} disabled={hintLoading}>
                        {hintLoading ? 'Getting hint…' : 'Hint'}
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => grade && topic && generateProblem(grade, topic)}
                        title="New problem"
                      >
                        New
                      </button>
                    </div>

                    {hint && (
                      <div className="text-sm p-3 rounded-xl bg-[var(--muted)]/30 border border-[var(--border)]">
                        <span className="font-semibold">Hint: </span>
                        {hint}
                      </div>
                    )}

                    {feedback && (
                      <div className="text-sm p-3 rounded-xl bg-[var(--muted)]/20 border border-[var(--border)]">
                        {feedback}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
