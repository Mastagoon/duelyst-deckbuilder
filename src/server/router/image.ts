import { createRouter } from "./context"
import { get, getSync } from "@andreekeberg/imagedata"
import { z } from "zod"

export const imageRouter = createRouter().mutation("getCardStaticImage", {
  input: z.object({
    url: z.string(),
  }),
  async resolve({ input }) {
    const { url } = input
    const result2 = await fetch(url)
    console.log(result2.body)
    return {
      hello: "world",
    }
  },
})
