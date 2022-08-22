/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        decks: "repeat(auto-fit, minmax(260px, 1fr))",
      },
      animation: {
        slideInFromTop: "slideInFromTop 0.5s ease-out",
        slideInFromBottom: "slideInFromBottom 0.5s ease-out",
      },
      keyframes: {
        slideInFromBottom: {
          "0%": {
            opacity: 0.3,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        slideInFromTop: {
          "0%": {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      colors: {
        "gradient-primary-from": "rgba(19, 14, 77, 1)",
        "gradient-primray-to": "rgba(141, 7, 104, 0)",
        "primary-dark-blue": "rgba(9, 5, 52, 1)",
        "secondary-dark-blue": "rgba(41, 16, 72, 1)",
        "primary-light-blue": "rgba(61, 174, 217, 1)",
        "primary-light-purple": "rgba(89, 81, 188, 1)",
        "secondary-light-purple": "rgba(89, 81, 188, 0.35)",
        "primary-dark-text": "rgba(112, 110, 137, 1)",
        "attack-icon": "rgba(184, 170, 70, 1)",
        "health-icon": "rgba(168, 31, 31, 1)",
        "primary-cyan": "rgba(140, 174, 188, 1)",
        "secondary-cyan": "rgba(160, 175, 182, 1)",
        "secondary-cyan-bold": "rgba(179, 196, 203, 1)",
        "fading-white": "rgba(255, 255, 255, 0.7)",
        "primary-dark": "rgba(30, 30, 30, 1)",
        lyonar: "#e5c56d",
        songhai: "#db4460",
        vetruvian: "#db8e2b",
        abyssian: "#bf20e1",
        magmar: "#3db586",
        vanar: "#2ba3db",
        neutral: "#ffffff",
      },
    },
  },
  plugins: [],
}
