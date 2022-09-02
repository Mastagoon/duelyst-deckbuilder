// src/server/router/context.ts
import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { unstable_getServerSession } from "next-auth"
import { prisma } from "../db/client"
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]"

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req
  const res = opts?.res
  const session = await unstable_getServerSession(req!, res!, nextAuthOptions)

  return {
    req,
    res,
    session,
    prisma,
  }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
