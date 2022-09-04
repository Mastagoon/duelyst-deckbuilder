// src/server/router/index.ts
import { createContext, createRouter } from "./context"
import superjson from "superjson"
import { exampleRouter } from "./example"
import { deckRouter } from "./deck"
import { userRouter } from "./user"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example", exampleRouter)
  .merge("deck", deckRouter)
  .merge("user", userRouter)

// export type definition of API
export type AppRouter = typeof appRouter

export const createSsrClient = async () =>
  appRouter.createCaller(await createContext())
