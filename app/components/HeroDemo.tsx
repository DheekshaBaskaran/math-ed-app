'use client';

import { useEffect, useState } from 'react';

const DEMOS = [
  {
    topic: 'Percent · Grade 6',
    question: 'A $40 jacket is 25% off. What is the sale price?',
    steps: ['25% of 40 = 0.25 × 40 = 10', '40 − 10 = 30'],
    answer: '$30',
  },
  {
    topic: 'Fractions · Grade 4',
    question: 'You eat 3 of 8 pizza slices. What fraction is left?',
    steps: ['8 − 3 = 5 slices left', '5 out of 8 = 5/8'],
    answer: '5/8',
  },
  {
    topic: 'Division · Grade 3',
    question: 'Share 12 cookies equally with 3 friends. How many each?',
    steps: ['12 ÷ 3 = 4'],
    answer: '4 cookies',
  },
];

// Cycles through sample problems, typing the question then revealing steps
export default function HeroDemo() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const demo = DEMOS[idx];
  const done = typed >= demo.question.length;

  useEffect(() => {
    if (!done) {
      const t = setTimeout(() => setTyped((n) => n + 1), 28);
      return () => clearTimeout(t);
    }
    if (stepCount <= demo.steps.length) {
      const t = setTimeout(() => setStepCount((n) => n + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % DEMOS.length);
      setTyped(0);
      setStepCount(0);
    }, 2600);
    return () => clearTimeout(t);
  }, [typed, done, stepCount, demo.steps.length]);

  return (
    <div className="card border-beam p-0 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-semibold text-[var(--muted)]">mathed · live problem</span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <span className="badge">{demo.topic}</span>
        <p className="equation-card min-h-[3.5rem] text-lg leading-relaxed">
          {demo.question.slice(0, typed)}
          {!done && <span className="cursor" />}
        </p>

        <div className="space-y-2">
          {demo.steps.slice(0, stepCount).map((s, i) => (
            <div key={`${idx}-${i}`} className="callout callout-hint pop equation-card flex items-center gap-3 py-2.5 text-sm">
              <span className="shrink-0 whitespace-nowrap text-[var(--accent-2)]">step {i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
          {done && stepCount > demo.steps.length && (
            <div key={`ans-${idx}`} className="callout callout-feedback pop flex items-center justify-between py-3">
              <span className="font-semibold">Answer</span>
              <span className="font-display gradient-text text-2xl font-bold">{demo.answer}</span>
            </div>
          )}
          {done && stepCount === 0 && (
            <div className="typing py-2" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
