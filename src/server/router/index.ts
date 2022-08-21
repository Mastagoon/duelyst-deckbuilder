// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"
import { exampleRouter } from "./example"
import { deckRouter } from "./deck"
import { imageRouter } from "./image"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example", exampleRouter)
  .merge("deck", deckRouter)
  .merge("images", imageRouter)

// export type definition of API
export type AppRouter = typeof appRouter
