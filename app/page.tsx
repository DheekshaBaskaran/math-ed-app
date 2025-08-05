import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 p-6 text-white">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to MathEd!
      </h1>
      <p className="text-xl mb-6 text-center max-w-xl">
        Build math skills through real-world stories and get personalized help when you need it.
      </p>
      <Link href="/dashboard">
        <button className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-100 transition-all">
          Start Learning
        </button>
      </Link>
    </main>
  );
}
