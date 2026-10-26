const SYMBOLS = ['π', '∑', '½', '×', '÷', '√', '%', '∞', '=', '+', '△', 'x²', '¾', '≈'];

// Deterministic layout so server and client render the same markup
const FLOATERS = SYMBOLS.map((s, i) => ({
  s,
  left: (i * 37 + 7) % 100,
  size: 18 + ((i * 13) % 26),
  duration: 22 + ((i * 7) % 18),
  delay: -((i * 5) % 30),
}));

export default function Background() {
  return (
    <div className="bg-scene" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="bg-grid" />
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="math-float"
          style={{
            left: `${f.left}%`,
            bottom: '-10vh',
            fontSize: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          {f.s}
        </span>
      ))}
    </div>
  );
}
