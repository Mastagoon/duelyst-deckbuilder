import { createRouter } from "./context"
import { z } from "zod"

export const deckRouter = createRouter()
  .mutation("save", {
    input: z.object({
      code: z.string(),
      deckName: z.string().optional(),
      description: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.deck.create({ data: input })
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.deck.findMany()
    },
  })
