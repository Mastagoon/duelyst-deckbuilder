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
      creatorId: z.string(),
      isPrivate: z.boolean().default(false),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.deck.create({ data: input })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.deck.findFirst({
        where: { id: input.id },
        include: { creator: true },
      })
    },
  })
  .query("infiniteDecks", {
    input: z
      .object({
        cursor: z.string().optional(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const TAKE_LIMIT = 20
      return input?.cursor
        ? await ctx.prisma.deck.findMany({
            take: TAKE_LIMIT,
            cursor: { id: input?.cursor },
            skip: input?.cursor ? 1 : 0,
            include: { creator: true },
          })
        : await ctx.prisma.deck.findMany({
            take: TAKE_LIMIT,
            include: { creator: true },
          })
    },
  })
