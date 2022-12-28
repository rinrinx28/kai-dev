/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["rotate-45", "-rotate-45"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
        small: { min: "320px", max: "1023px" },
        "sm-s": { min: "400px", max: "767px" },
        // => @media (min-width: 640px and max-width: 767px) { ... }
        "mb-s": { min: "320px", max: "374px" },
        // => @media (min-width: 640px and max-width: 767px) { ... }
        "mb-m": { min: "375px", max: "424px" },
        // => @media (min-width: 640px and max-width: 767px) { ... }
        "mb-l": { min: "425px", max: "767px" },
        // => @media (min-width: 640px and max-width: 767px) { ... }

        "md-s": { min: "768px", max: "1023px" },
        // => @media (min-width: 768px and max-width: 1023px) { ... }

        "lg-s": { min: "1024px", max: "1279px" },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }

        "xl-s": { min: "1280px", max: "1535px" },
        // => @media (min-width: 1280px and max-width: 1535px) { ... }

        "2xl-s": { min: "1024px", max: "9999px" },
        // => @media (min-width: 1536px) { ... }
      },
      zIndex: {
        70: "70",
        60: "60",
      },
      maxWidth: {
        "11xl": "112rem",
      },
      fontFamily: {
        Anton: ["Anton", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
        Lobster: ["Lobster", "cursive"],
        "Abril-Fatface": ["Abril Fatface", "cursive"],
        Anton: ["Anton", "sans-serif"],
        Redsniper: ["Redsniper", "sans-serif"],
        Poppins: ["Poppins", "serif"],
      },
    },
  },
  plugins: [],
};
