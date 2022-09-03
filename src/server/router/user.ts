import { createRouter } from "./context"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const userRouter = createRouter()
  .mutation("update", {
    input: z.object({
      name: z.string().optional(),
      base64Avatar: z.string().optional(),
    }),
    async resolve({ ctx, input: { base64Avatar, name } }) {
      const userId = ctx.session?.user.id
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" })
      if (!base64Avatar && !name) throw new TRPCError({ code: "BAD_REQUEST" })
      return await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          ...(base64Avatar && { avatar: base64Avatar }),
          ...(name && { name }),
        },
      })
    },
  })
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
              _count: {
                select: { views: true },
              },
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
