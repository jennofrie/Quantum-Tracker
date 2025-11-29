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
        abyss: "#020617",
        teal: {
          dim: "#0f3d47",
        },
        amber: {
          electric: "#F59E0B",
        },
        silver: {
          metallic: "#9CA3AF",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
};
export default config;

