/** @type {import('next').NextConfig} */
const nextConfig = {
  // … your existing config …

  // 1️⃣ tell Next.js to skip ESLint failures when building for production:
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (Optional) likewise skip TS errors if you just want the prototype up:
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;