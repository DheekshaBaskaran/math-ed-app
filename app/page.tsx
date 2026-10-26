import Link from "next/link";
import HeroDemo from "./components/HeroDemo";

const FEATURES = [
  {
    icon: "🧭",
    title: "Pick your level",
    body: "Choose any grade from K to 8 and a topic that matches what you're learning in class.",
  },
  {
    icon: "🛒",
    title: "Real-world problems",
    body: "Every question is a story, like splitting a pizza or finding a sale price, so math feels useful.",
  },
  {
    icon: "💡",
    title: "Hints, not answers",
    body: "Stuck? Get a nudge in the right direction without the answer being given away.",
  },
  {
    icon: "🤖",
    title: "AI tutor, any time",
    body: "Ask any math question and get a short, step-by-step explanation in plain language.",
  },
];

const EXAMPLES = [
  "🍕 Splitting a pizza 8 ways",
  "🏷️ 25% off a $40 jacket",
  "⏰ How long until recess?",
  "🧱 Area of a garden bed",
  "🚲 Miles per hour on a bike ride",
  "🍪 Sharing 12 cookies with 3 friends",
  "💵 Saving allowance for a game",
  "📐 Angles in a skate ramp",
];

const STEPS = [
  { n: "01", title: "Choose a grade", body: "K through 8." },
  { n: "02", title: "Pick a topic", body: "Fractions, percent, shapes and more." },
  { n: "03", title: "Solve and learn", body: "Check your answer, get hints, try another." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-12 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="eyebrow reveal">
            <span className="pulse-dot" /> AI-powered math practice for grades K–8
          </span>
          <h1
            className="font-display reveal mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Math that shows up in <span className="gradient-text">real life.</span>
          </h1>
          <p
            className="reveal mt-6 max-w-xl text-lg text-[var(--muted)] sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Practice with real-world story problems, get hints when you're stuck, and ask an AI tutor that explains
            things step by step.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="/dashboard" className="btn text-base">
              Start practicing <span aria-hidden>→</span>
            </Link>
            <Link href="/tutor" className="btn btn-outline text-base">
              Ask the AI tutor
            </Link>
          </div>
          <dl className="reveal mt-10 flex flex-wrap gap-x-10 gap-y-4" style={{ animationDelay: "320ms" }}>
            {[
              ["9", "grade levels"],
              ["15", "topics"],
              ["∞", "fresh problems"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-bold">{v}</dt>
                <dd className="text-sm text-[var(--muted)]">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal" style={{ animationDelay: "200ms" }}>
          <HeroDemo />
        </div>
      </section>

      {/* Example marquee */}
      <section className="mt-20" aria-label="Example problems">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div className="marquee-track" key={k} aria-hidden={k === 1}>
              {EXAMPLES.map((e) => (
                <span key={e} className="eyebrow whitespace-nowrap text-[var(--foreground)]">
                  {e}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-24">
        <div className="max-w-2xl">
          <span className="badge">Why MathEd</span>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built to make math make sense.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <article key={f.title} className="card card-glow reveal" style={{ animationDelay: `${i * 90}ms` }}>
              <div className="icon-tile">{f.icon}</div>
              <h3 className="font-display mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <span className="badge">How it works</span>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to your next problem.
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            No sign-up needed. Pick where you are, and a new problem is ready in seconds.
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card card-glow">
              <span className="font-display gradient-text text-3xl font-bold">{s.n}</span>
              <h3 className="mt-3 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="card border-beam mt-24 overflow-hidden px-6 py-14 text-center sm:px-12">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
          Ready to find the math <span className="gradient-text">around you?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          Start with any grade and topic. Your first problem is one click away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="btn">
            Start practicing <span aria-hidden>→</span>
          </Link>
          <Link href="/tutor" className="btn btn-outline">
            Meet your tutor
          </Link>
        </div>
      </section>

      <footer className="mt-16 text-center text-sm text-[var(--muted)]">
        Built with Next.js, React, TypeScript and the OpenAI API.
      </footer>
    </main>
  );
}
