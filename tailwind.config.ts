import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <-- ADD THIS LINE
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
