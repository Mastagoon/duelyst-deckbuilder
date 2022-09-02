import { createRouter } from "./context"
import * as trpc from "@trpc/server"
import { z } from "zod"
import { Faction } from "../../data/cards"
import { Deck } from "@prisma/client"

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
      try {
        return await ctx.prisma.deck.create({ data: input })
      } catch (err) {
        console.log(err)
      }
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
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
      return await ctx.prisma.deck.update({
        where: { id: input.id },
        data: input,
      })
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
  .mutation("import", {
    input: z.object({
      deckId: z.string(),
    }),
    async resolve({ input: { deckId }, ctx }) {
      const userId = ctx.session?.user.id
      if (!userId) throw new trpc.TRPCError({ code: "UNAUTHORIZED" })
      const deck: Deck | null = await ctx.prisma.deck.findFirst({
        where: { id: deckId },
      })
      if (!deck) throw new trpc.TRPCError({ code: "NOT_FOUND" })
      if (deck.creatorId === userId)
        throw new trpc.TRPCError({ code: "BAD_REQUEST" })
      // create a new deck for the user
      const {
        deckName,
        description,
        deckType,
        minionCount,
        spellCount,
        artifactCount,
        faction,
        neutralCardCount,
        factionCardCount,
        code,
        generalId,
      } = deck
      return await ctx.prisma.deck.create({
        data: {
          generalId,
          deckName,
          description,
          deckType,
          minionCount,
          spellCount,
          artifactCount,
          factionCardCount,
          faction,
          neutralCardCount,
          code,
          creatorId: userId,
          isPrivate: true,
        },
      })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const deck = await ctx.prisma.deck.findFirst({
        where: { id: input.id },
        include: {
          creator: true,
          votes: true,
        },
      })
      // return await ctx.prisma.deck.findFirst({
      // where: { id: input.id },
      // include: {
      // creator: true,
      // votes: true,
      // _count: { select: { votes: true } },
      // },
    },
  })
  .query("getFeaturedDecks", {
    async resolve({ ctx }) {
      return await ctx.prisma.deck.findMany({
        // where: { isFeatured: true },
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
