import { createRouter } from "./context"
import { z } from "zod"

export const deckRouter = createRouter()
  .mutation("save", {
    input: z.object({
      code: z.string(),
      generalId: z.number(),
      deckName: z.string().optional(),
      description: z.string().nullish(),
      minionCount: z.number().default(0),
      spellCount: z.number().default(0),
      artifactCount: z.number().default(0),
      faction: z.number(),
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
