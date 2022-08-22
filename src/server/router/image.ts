import { createRouter } from "./context"
import { z } from "zod"

export const imageRouter = createRouter().mutation("getCardStaticImage", {
  input: z.object({
    url: z.string(),
  }),
  async resolve({ input }) {
    const { url } = input
    const img = await getOrCreateFirstFrameOfGif(url)
    return {
      img,
    }
  },
})
