'use client';

import { useMemo, useState } from 'react';

type GenResponse = {
  question?: string;
  hint?: string;
  topic?: string;
  feedback?: string;
  correct?: boolean;
};

const TOPIC_ICONS: Record<string, string> = {
  Counting: '🔢',
  Addition: '➕',
  Subtraction: '➖',
  Shapes: '🔺',
  Time: '⏰',
  Multiplication: '✖️',
  Division: '➗',
  Fractions: '🍕',
  Decimals: '💲',
  'Area & Perimeter': '📐',
  'Ratios & Proportions': '⚖️',
  Percent: '🏷️',
  Integers: '🌡️',
  'Linear Equations': '📈',
  Geometry: '📏',
};

export default function Dashboard() {
  const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8'] as const;
  type Grade = typeof GRADES[number];

  const TOPICS_BY_BAND: Record<'K2' | '3_5' | '6_8', string[]> = {
    K2: ['Counting', 'Addition', 'Subtraction', 'Shapes', 'Time'],
    '3_5': ['Multiplication', 'Division', 'Fractions', 'Decimals', 'Area & Perimeter'],
    '6_8': ['Ratios & Proportions', 'Percent', 'Integers', 'Linear Equations', 'Geometry'],
  };

  const bandFor = (g: Grade): keyof typeof TOPICS_BY_BAND =>
    g === 'K' || g === '1' || g === '2' ? 'K2'
    : g === '3' || g === '4' || g === '5' ? '3_5'
    : '6_8';

  const gradeToNumber = (g: Grade) => (g === 'K' ? 0 : Number(g));

  const [grade, setGrade] = useState<Grade | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const topics = useMemo(() => (grade ? TOPICS_BY_BAND[bandFor(grade)] : []), [grade]);
  const stage = !grade ? 1 : !topic ? 2 : 3;

  const resetWork = () => {
    setQuestion('');
    setHint('');
    setStudentAnswer('');
    setFeedback('');
  };

  // Create a problem
  const generateProblem = async (g: Grade, t: string) => {
    setLoading(true);
    resetWork();
    try {
      const r = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: gradeToNumber(g), topic: t }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: GenResponse = await r.json();
      setQuestion(data.question || 'Problem unavailable.');
    } catch (err) {
      console.error(err);
      setQuestion('Sorry — I couldn’t generate a problem. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Ask AI for a hint
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

  // Ask AI to check the answer (and write feedback)
  const checkAnswer = async () => {
    if (!grade || !topic || !question || !studentAnswer) return;
    setChecking(true);
    setFeedback('');
    try {
      const r = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeToNumber(grade),
          topic,
          question,
          studentAnswer,
        }),
      });
      if (!r.ok) throw new Error('check failed');
      const data: GenResponse = await r.json();
      setFeedback(data.feedback || 'Answer submitted.');
    } catch {
      setFeedback('Could not check right now — try again.');
    } finally {
      setChecking(false);
    }
  };

  const STEPS = ['Grade', 'Topic', 'Solve'];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-12 sm:px-6">
      <header className="reveal text-center">
        <span className="badge">Practice mode</span>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {stage === 1 ? 'Pick your grade' : stage === 2 ? `Grade ${grade}: choose a topic` : 'Solve your problem'}
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {stage === 1
            ? 'Then choose a topic. Your problem appears instantly.'
            : stage === 2
              ? 'Pick what you want to practice.'
              : 'Type your answer, ask for a hint, or try a new one.'}
        </p>
      </header>

      {/* Stepper */}
      <ol className="reveal mx-auto mt-8 flex max-w-md items-center gap-3" style={{ animationDelay: '80ms' }}>
        {STEPS.map((s, i) => {
          const n = i + 1;
          const cls = n < stage ? 'step--done' : n === stage ? 'step--active' : '';
          return (
            <li key={s} className={`flex items-center gap-3 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
              <span className={`step ${cls}`}>
                <span className="step-num">{n < stage ? '✓' : n}</span>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`step-line ${n < stage ? 'step-line--filled' : ''}`}>
                  <span />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <section className="card reveal mt-8 p-5 sm:p-8" style={{ animationDelay: '140ms' }}>
        {/* Step 1: Grade */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Grade</h2>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-9">
          {GRADES.map((g, i) => (
            <button
              key={g}
              type="button"
              onClick={() => { setGrade(g); setTopic(null); resetWork(); }}
              className={`tile pop ${grade === g ? 'tile--active' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}
              aria-pressed={grade === g}
            >
              <span className="font-display text-2xl">{g}</span>
              <span className="tile-sub">{g === 'K' ? 'Kinder' : 'Grade'}</span>
            </button>
          ))}
        </div>

        {/* Step 2: Topics */}
        {grade && (
          <div key={grade} className="pop">
            <div className="my-7 h-px w-full bg-[var(--border)]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Topics for Grade {grade}
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {topics.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTopic(t); generateProblem(grade, t); }}
                  className={`tile pop text-sm ${topic === t ? 'tile--active' : ''}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                  aria-pressed={topic === t}
                >
                  <span className="text-2xl">{TOPIC_ICONS[t] ?? '✏️'}</span>
                  <span className="text-center leading-tight">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Problem workspace */}
        {(loading || question) && (
          <div className="mt-8">
            {loading ? (
              <div className="card border-beam space-y-3" aria-label="Generating your problem">
                <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                  Generating your problem…
                </div>
                <div className="skeleton h-4 w-11/12" />
                <div className="skeleton h-4 w-9/12" />
                <div className="skeleton h-4 w-6/12" />
              </div>
            ) : (
              <div className="pop space-y-4">
                <div className="card border-beam">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{TOPIC_ICONS[topic ?? ''] ?? '✏️'} {topic}</span>
                    <span className="badge">Grade {grade}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed sm:text-xl">{question}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="input flex-1"
                    placeholder="Type your answer…"
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <div className="flex gap-2">
                    <button className="btn flex-1 sm:flex-none" onClick={checkAnswer} disabled={!studentAnswer || checking}>
                      {checking ? 'Checking…' : 'Check'}
                    </button>
                    <button className="btn btn-outline flex-1 sm:flex-none" onClick={getHint} disabled={hintLoading}>
                      {hintLoading ? 'Thinking…' : '💡 Hint'}
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => grade && topic && generateProblem(grade, topic)}
                      title="New problem"
                    >
                      ↻ New
                    </button>
                  </div>
                </div>

                {hint && (
                  <div className="callout callout-hint pop text-sm">
                    <span className="font-semibold">💡 Hint: </span>{hint}
                  </div>
                )}

                {feedback && (
                  <div className="callout callout-feedback pop text-sm">
                    <span className="font-semibold">Tutor: </span>{feedback}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
