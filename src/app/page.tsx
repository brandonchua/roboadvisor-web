// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
        RoboAdvisor
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl text-center mb-8">
        Welcome to RoboAdvisor—a mean‑variance portfolio builder powered by
        academic rigor and real‑world data. Answer a few simple questions to
        discover an investment mix tailored to your unique risk profile.
      </p>

      {/* Project Objectives */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Project Objectives
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            **Educate**: Demystify Modern Portfolio Theory for everyday
            investors.
          </li>
          <li>
            **Customize**: Translate your personal goals and comfort with risk
            into a data‑driven asset allocation.
          </li>
          <li>
            **Visualize**: See your Optimal Portfolio and Efficient Frontier
            plotted graphically.
          </li>
        </ul>
      </div>

      {/* Credits */}
      <div className="text-center text-gray-600 mb-10 max-w-2xl">
        <p>
          Developed under the guidance of{" "}
          <strong>Prof. Lee Hong Sing</strong> (BMD5302 Financial Modeling).  
          Huge thanks for his teachings and insights into portfolio theory!
        </p>
      </div>

      {/* Team */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          "Brandon Chua",
          "Claudia Anna Maria Nori",
          "Jong Zhi Kai",
          "Kitahara Yutaro",
          "Wang Xinyao",
        ].map((name) => (
          <div
            key={name}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-center"
          >
            <span className="text-gray-800 font-medium">{name}</span>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <Link href="/questionnaire">
        <a className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition">
          Start the Survey →
        </a>
      </Link>
    </div>
  );
}