/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gradient-primary-from": "rgba(19, 14, 77, 1)",
        "gradient-primray-to": "rgba(141, 7, 104, 0)",
        "primary-dark-blue": "rgba(9, 5, 52, 1)",
        "secondary-dark-blue": "rgba(41, 16, 72, 1)",
        "primary-light-blue": "rgba(61, 174, 217, 1)",
        "primary-light-purple": "rgba(89, 81, 188, 1)",
        "secondary-light-purple": "rgba(89, 81, 188, 0.35)",
      },
    },
  },
  plugins: [],
}
