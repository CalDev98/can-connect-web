import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moroccan: {
          red: "#D22D27",
          orange: "#FFA500",
          green: "#006225",
          blue: "#0066CC",
          gold: "#D4AF37",
          white: "#FFFFFF",
          light: "#F8F9FA",
          yellow: "#FFF9E6",
        },
      },
      backgroundImage: {
        'pattern': "radial-gradient(circle, rgba(255, 249, 230, 0.3) 1px, transparent 1px)",
        'pattern-size': '20px 20px',
      },
    },
  },
  plugins: [],
};
export default config;
