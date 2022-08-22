import { createRouter } from "./context"
import { z } from "zod"

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      console.log("HI FROM SERVEr")
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany()
    },
  })
  .mutation("test", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.create({ data: {} })
    },
  })