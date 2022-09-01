import { createRouter } from "./context"
import { z } from "zod"
import { Faction } from "../../data/cards"

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
      factionCardCount: z.number(),
      neutralCardCount: z.number(),
    }),
    async resolve({ input, ctx }) {
      console.log(input)
      try {
        return await ctx.prisma.deck.create({ data: input })
      } catch (err) {
        console.log(err)
      }
    },
  })
  .mutation("vote", {
    input: z.object({
      userId: z.string(),
      deckId: z.string(),
      vote: z.enum(["-1", "1"]),
    }),
    async resolve({ input: { userId, vote, deckId }, ctx }) {
      const v = await ctx.prisma.deckVote.findFirst({
        where: { deckId, userId },
      })
      console.log(v)
      if (v)
        return await ctx.prisma.deckVote.update({
          where: { id: v.id },
          data: { vote: Number(vote) },
        })
      return await ctx.prisma.deckVote.create({
        data: { userId, deckId, vote: Number(vote) },
      })
      // Prisma bug with multiple unique keys makes this throw an error.
      // const upvote = await ctx.prisma.deckVote.upsert({
      // where: { deckId, userId },
      // update: { vote: Number(vote) },
      // create: { userId, vote: Number(vote), deckId },
      // })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.deck.findFirst({
        where: { id: input.id },
        include: {
          creator: true,
          votes: true,
          _count: { select: { votes: true } },
        },
      })
    },
  })
  .query("infiniteDecks", {
    input: z
      .object({
        cursor: z.string().optional(),
        order: z.enum(["popular", "latest"]).default("popular"),
        faction: z
          .enum([
            "all",
            "lyonar",
            "songhai",
            "vetruvian",
            "abyssian",
            "magmar",
            "vanar",
          ])
          .optional(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const TAKE_LIMIT = 100
      const include = { creator: true, votes: true }
      const where =
        input!.faction === "all"
          ? { isPrivate: false }
          : { isPrivate: false, faction: Faction[input!.faction!] }
      return input?.cursor
        ? await ctx.prisma.deck.findMany({
            take: TAKE_LIMIT,
            cursor: { id: input?.cursor },
            skip: input?.cursor ? 1 : 0,
            include,
            where,
            orderBy:
              input?.order === "popular"
                ? { votes: { _count: "desc" } }
                : { createdAt: "desc" },
          })
        : await ctx.prisma.deck.findMany({
            take: TAKE_LIMIT,
            include,
            where,
            orderBy:
              input?.order === "popular"
                ? { votes: { _count: "desc" } }
                : { createdAt: "desc" },
          })
    },
  })
