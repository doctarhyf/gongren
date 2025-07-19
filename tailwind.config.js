/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "red" }, // change color as needed
        },
        blink2: {
          "0%, 100%": { color: "transparent" },
          "50%": { color: "red" },
        },
      },
      animation: {
        blink: "blink 1s linear infinite",
      },
    },
  },

  plugins: [require("daisyui")],
};
