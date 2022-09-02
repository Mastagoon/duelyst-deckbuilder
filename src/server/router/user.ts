import { createRouter } from "./context"
import { z } from "zod"

export const userRouter = createRouter()
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const isCurrentUser = ctx.session?.user.id === input.id
      return await ctx.prisma.user.findFirst({
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
