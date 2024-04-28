import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      flexGrow: {
        2: "2",
        3: "3",
        4: "4",
      },
    },
  },
  plugins: [],
} satisfies Config;
