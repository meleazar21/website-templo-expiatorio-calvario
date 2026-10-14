/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Wine red: the color of the temple's crest (the ring around the church).
        wine: {
          DEFAULT: "#7a1f35",
          dark: "#5e1628",
          deep: "#3e0d1a",
          light: "#9e3049",
          soft: "#f7eaee",
        },
        // Gold, as in the crest's lettering and stars. Accent only (rules, details, buttons).
        gold: {
          DEFAULT: "#c8a04a",
          light: "#e2c68a",
          soft: "#f7f0de",
        },
        // Very subtle green, reserved for positive states.
        sage: {
          DEFAULT: "#4f7d63",
          soft: "#eaf2ed",
        },
        // White with a hint of warmth, so the wine and gold don't look harsh on it.
        ivory: {
          DEFAULT: "#fdfcfa",
          deep: "#f6f1ec",
        },
        ink: {
          DEFAULT: "#2a1d21",
          soft: "#64575b",
          faint: "#958a8d",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      maxWidth: { content: "1180px" },
      boxShadow: {
        card: "0 1px 2px rgba(122,31,53,0.04), 0 8px 24px rgba(122,31,53,0.06)",
        lift: "0 10px 34px rgba(122,31,53,0.12)",
      },
      keyframes: {
        reveal: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        // For layers that open on top (viewer, priest profile): opacity only.
        // `reveal` has a translateY, and a `transform` on a `position: fixed` element
        // shifts it and, while it lasts, becomes the containing block for whatever
        // is inside it.
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        // Slow zoom on the hero carousel's active slide.
        kenburns: { from: { transform: "scale(1)" }, to: { transform: "scale(1.08)" } },
      },
      animation: {
        reveal: "reveal 0.6s cubic-bezier(0.22,1,0.36,1) both",
        fade: "fade 0.25s ease-out both",
        kenburns: "kenburns 9s ease-out both",
      },
    },
  },
  plugins: [],
};
