import twcolors from "tailwindcss/colors"

const constants = {
  appUrl: "https://duelyst-deckbuilder.vercel.app",
  imageUrl: "https://alpha.duelyst2.com",
  deckShareUrl: "https://decklyst.vercel.app/api/snapshot",
  colors: {
    lyonar: "#e5c56d",
    songhai: "#db4460",
    vetruvian: "#db8e2b",
    abyssian: "#bf20e1",
    magmar: "#3db586",
    vanar: "#2ba3db",
    neutral: "#ffffff",
    mana: "#2ba9d8",
    common: twcolors.slate["100"],
    basic: twcolors.slate["100"],
    rare: "#396cfd",
    epic: "#bf20e1",
    legendary: "#e39f28",
  },
  MANA_CURVE_HEIGHT: 90,
  MAX_COPIES_IN_DECK: 3,
}

export default constants
