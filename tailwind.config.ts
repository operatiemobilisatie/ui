import type { Config } from "tailwindcss"
const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        border: "hsl(210, 1%, 93%)",
        input: "hsl(210, 1%, 93%)",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // card: {
        //   DEFAULT: "hsl(var(--card))",
        //   foreground: "hsl(var(--card-foreground))",
        // },
        // Satus Colors
        destructive: {
          DEFAULT: "hsl(357, 69%, 86%)",
          foreground: "hsl(357, 69%, 49%)",
        },
        warning: {
          DEFAULT: "hsl(37, 100%, 89%)",
          foreground: "hsl(37, 100%, 47%)",
        },
        info: {
          DEFAULT: "hsl(200, 77%, 88%)",
          foreground: "hsl(200, 77%, 46%)",
        },
        succes: {
          DEFAULT: "hsl(98, 49%, 87%)",
          foreground: "hsl(98, 49%, 51%)",
        },

        // OM Colors
        primary: {
          DEFAULT: "hsl(357, 69%, 49%)",
          foregroud: "hsl(357, 69%, 86%)",
          800: "hsl(357, 69%, 49%)",
          700: "hsl(357, 69%, 55%)",
          600: "hsl(357, 69%, 61%)",
          500: "hsl(357, 69%, 67%)",
          400: "hsl(357, 69%, 73%)",
          300: "hsl(357, 69%, 80%)",
          200: "hsl(357, 69%, 86%)",
          100: "hsl(357, 69%, 93%)"
        },
        gray: {
          DEFAULT: "hsl(210, 1%, 44%)",
          foreground: "rgb(240, 241, 241)",
          800: "hsl(210, 1%, 44%)",
          700: "rgb(141, 141, 143)",
          600: "rgb(169, 170, 171)",
          500: "rgb(198, 198, 199)",
          400: "rgb(212, 212, 213)",
          300: "rgb(226, 227, 227)",
          200: "rgb(240, 241, 241)",
          100: "rgb(248, 248, 248)",
        },
        blue: {
          DEFAULT: "hsl(200, 77%, 46%)",
          foreground: "hsl(200, 77%, 88%)",
          800: "hsl(200, 77%, 46%)",
          700: "hsl(200, 77%, 53%)",
          600: "hsl(200, 77%, 60%)",
          500: "hsl(200, 77%, 67%)",
          400: "hsl(200, 77%, 74%)",
          300: "hsl(200, 77%, 81%)",
          200: "hsl(200, 77%, 88%)",
          100: "hsl(200, 77%, 95%)"
        },
        aqua: {
          DEFAULT: "hsl(178, 44%, 65%)",
          foreground: "hsl(178, 44%, 91%)",
          800: "hsl(178, 44%, 65%)",
          700: "hsl(178, 44%, 69%)",
          600: "hsl(178, 44%, 73%)",
          500: "hsl(178, 44%, 78%)",
          400: "hsl(178, 44%, 82%)",
          300: "hsl(178, 44%, 87%)",
          200: "hsl(178, 44%, 91%)",
          100: "hsl(178, 44%, 96%)"
        },
        green: {
          DEFAULT: "hsl(98, 49%, 51%)",
          foreground: "hsl(98, 49%, 87%)",
          800: "hsl(98, 49%, 51%)",
          700: "hsl(98, 49%, 57%)",
          600: "hsl(98, 49%, 63%)",
          500: "hsl(98, 49%, 69%)",
          400: "hsl(98, 49%, 75%)",
          300: "hsl(98, 49%, 81%)",
          200: "hsl(98, 49%, 87%)",
          100: "hsl(98, 49%, 93%)"
        },
        orange: {
          DEFAULT: "hsl(37, 100%, 47%)",
          foreground: "hsl(37, 100%, 89%)",
          800: "hsl(37, 100%, 47%)",
          700: "hsl(37, 100%, 54%)",
          600: "hsl(37, 100%, 61%)",
          500: "hsl(37, 100%, 68%)",
          400: "hsl(37, 100%, 75%)",
          300: "hsl(37, 100%, 82%)",
          200: "hsl(37, 100%, 89%)",
          100: "hsl(37, 100%, 95%)"
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          "0%": { height: "0", clipPath: "inset(0)" },
          "99%": {clipPath: "inset(0)"},
          "100%": { height: "var(--radix-accordion-content-height)", clipPath: "inset(-100vh -100vw)"},
        },
        "accordion-up": {
          "0%": { height: "var(--radix-accordion-content-height)", clipPath: "inset(-100vh -100vw)" },
          "99%": {clipPath: "inset(0)"},
          "100%": { height: "0", clipPath: "inset(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        'sans': ['var(--font-lato)', ...defaultTheme.fontFamily.sans],
        lato: ['var(--font-lato)'],
        roboto: ['var(--font-roboto-slab)'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config & {corePlugins: {color: boolean}}

export default config