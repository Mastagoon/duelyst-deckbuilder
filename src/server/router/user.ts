import { createRouter } from "./context"
import { z } from "zod"

export const userRouter = createRouter()
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const isCurrentUser = ctx.session?.user.id === input.id
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { id: input.id },
        include: {
          decks: {
            orderBy: { createdAt: "desc" },
            include: {
              votes: true,
            },
            where: {
              isPrivate: isCurrentUser ? undefined : false,
            },
          },
        },
      })
      return {
        ...user,
        decks: user.decks.map((deck) => {
          const totalVotes =
            deck?.votes.reduce((acc, v) => acc + v.vote, 0) || 0
          return { ...deck, totalVotes }
        }),
      }
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      const userId = ctx.session?.user.id
      if (!userId) return null
      return await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          decks: {
            orderBy: { createdAt: "desc" },
          },
        },
      })
    },
  })
