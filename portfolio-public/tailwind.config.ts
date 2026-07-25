import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e1a",
        panel: "#0f1424",
        panel2: "#131a2e",
        border: "#1e2740",
        accentPurple: "#7c3aed",
        accentBlue: "#3b82f6",
        muted: "#8b93a7",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
