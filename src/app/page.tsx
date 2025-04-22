// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-5xl font-extrabold">RoboAdvisor</h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Personalized portfolios powered by mean‑variance optimization.
      </p>
      <Link href="/questionnaire" passHref>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Start Survey
        </button>
      </Link>
    </div>
  );
}