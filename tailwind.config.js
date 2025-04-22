// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),      // ← add daisyUI
  ],
  daisyui: {
    themes: ["light"],      // pick your theme(s)
  },
};