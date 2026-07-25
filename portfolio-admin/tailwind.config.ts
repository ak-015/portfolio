import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f19",
        panel: "#111726",
        panel2: "#161d2f",
        border: "#232b40",
        accent: "#6d28d9",
        accentBlue: "#3b82f6",
        muted: "#8b93a7",
        danger: "#ef4444",
      },
      borderRadius: { pill: "999px" },
    },
  },
  plugins: [],
};
export default config;
