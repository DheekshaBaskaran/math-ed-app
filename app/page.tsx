import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-4 text-center">Welcome to MathEd!</h1>
      <p className="text-xl mb-8 text-center max-w-xl">
        Build math skills through real-world stories and get personalized help when you need it.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard" className="btn">Start Learning</Link>
        <Link href="/tutor" className="btn btn-outline">Meet Your Tutor</Link>
      </div>
    </main>
  );
}
